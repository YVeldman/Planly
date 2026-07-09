"use server";

import bcrypt from "bcryptjs";
import { z } from "zod";
import { AuthError } from "next-auth";
import { prisma } from "@/lib/prisma";
import { signIn } from "@/auth";

const signupSchema = z.object({
  familyName: z.string().trim().min(2, "Geef je gezin een naam (minimaal 2 tekens)."),
  name: z.string().trim().min(2, "Vul je naam in."),
  email: z.string().trim().toLowerCase().email("Vul een geldig e-mailadres in."),
  password: z.string().min(8, "Wachtwoord moet minimaal 8 tekens zijn."),
});

export type ActionState = { error?: string } | undefined;

export async function signupAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const parsed = signupSchema.safeParse({
    familyName: formData.get("familyName"),
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Ongeldige invoer." };
  }

  const { familyName, name, email, password } = parsed.data;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return { error: "Er bestaat al een account met dit e-mailadres." };
  }

  const passwordHash = await bcrypt.hash(password, 10);

  await prisma.family.create({
    data: {
      name: familyName,
      members: {
        create: {
          name,
          email,
          passwordHash,
          role: "owner",
          color: "#6b8a5c",
        },
      },
    },
  });

  await signIn("credentials", {
    email,
    password,
    redirectTo: "/dashboard",
  });
}

export async function loginAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const email = formData.get("email");
  const password = formData.get("password");
  const callbackUrl = formData.get("callbackUrl");

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: typeof callbackUrl === "string" && callbackUrl ? callbackUrl : "/dashboard",
    });
  } catch (err) {
    if (err instanceof AuthError) {
      return { error: "Ongeldig e-mailadres of wachtwoord." };
    }
    throw err;
  }
}
