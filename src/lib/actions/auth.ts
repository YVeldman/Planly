"use server";

import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { AuthError } from "next-auth";
import { prisma } from "@/lib/prisma";
import { signIn } from "@/auth";
import { createAndSendVerificationEmail } from "@/lib/verification";

const signupSchema = z.object({
  familyName: z.string().trim().min(2, "Geef je gezin een naam (minimaal 2 tekens)."),
  name: z.string().trim().min(2, "Vul je naam in."),
  email: z.string().trim().toLowerCase().email("Vul een geldig e-mailadres in."),
  password: z.string().min(8, "Wachtwoord moet minimaal 8 tekens zijn."),
});

export type ActionState =
  | { error?: string; needsVerification?: boolean; email?: string; success?: boolean }
  | undefined;

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

  const family = await prisma.family.create({
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
    include: { members: true },
  });

  await createAndSendVerificationEmail(family.members[0]);

  redirect(`/check-email?email=${encodeURIComponent(email)}`);
}

export async function loginAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const email = formData.get("email");
  const password = formData.get("password");
  const callbackUrl = formData.get("callbackUrl");

  if (typeof email === "string" && typeof password === "string") {
    const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
    if (user && !user.emailVerified) {
      const isValid = await bcrypt.compare(password, user.passwordHash);
      if (isValid) {
        return {
          error: "Bevestig eerst je e-mailadres voordat je kunt inloggen.",
          needsVerification: true,
          email: user.email,
        };
      }
    }
  }

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

const resendSchema = z.object({
  email: z.string().trim().toLowerCase().email("Vul een geldig e-mailadres in."),
});

export async function resendVerificationAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const parsed = resendSchema.safeParse({ email: formData.get("email") });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Ongeldige invoer." };
  }

  const user = await prisma.user.findUnique({ where: { email: parsed.data.email } });
  if (!user) {
    return { error: "Geen account gevonden met dit e-mailadres." };
  }
  if (user.emailVerified) {
    return { error: "Dit e-mailadres is al bevestigd. Je kunt gewoon inloggen." };
  }

  await createAndSendVerificationEmail(user);

  return { success: true, email: user.email };
}
