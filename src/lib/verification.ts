import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { sendVerificationEmail } from "@/lib/email";

const TOKEN_TTL_MS = 24 * 60 * 60 * 1000;

export async function createAndSendVerificationEmail(user: {
  id: string;
  name: string;
  email: string;
}) {
  const token = crypto.randomBytes(32).toString("hex");

  await prisma.verificationToken.deleteMany({ where: { userId: user.id } });
  await prisma.verificationToken.create({
    data: { token, userId: user.id, expiresAt: new Date(Date.now() + TOKEN_TTL_MS) },
  });

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const verifyUrl = `${appUrl}/verify-email?token=${token}`;

  try {
    await sendVerificationEmail(user.email, user.name, verifyUrl);
  } catch (err) {
    console.error("Kon verificatiemail niet versturen:", err);
  }
}
