import Link from "next/link";
import { CheckCircle2, XCircle } from "lucide-react";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { ResendVerificationForm } from "@/components/auth/ResendVerificationForm";
import { prisma } from "@/lib/prisma";

export default async function VerifyEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;

  if (!token) {
    return (
      <AuthLayout title="Ongeldige link" subtitle="Deze bevestigingslink is niet geldig.">
        <InvalidContent />
      </AuthLayout>
    );
  }

  const record = await prisma.verificationToken.findUnique({
    where: { token },
    include: { user: true },
  });

  if (!record) {
    return (
      <AuthLayout title="Ongeldige link" subtitle="Deze bevestigingslink is niet geldig of al gebruikt.">
        <InvalidContent />
      </AuthLayout>
    );
  }

  if (record.expiresAt < new Date()) {
    await prisma.verificationToken.delete({ where: { id: record.id } });
    return (
      <AuthLayout title="Link verlopen" subtitle="Deze bevestigingslink is verlopen.">
        <div className="mb-6 flex justify-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-peach-100 text-[#c17a52]">
            <XCircle className="h-7 w-7" />
          </div>
        </div>
        <p className="mb-6 text-center text-sm text-ink-500">Vraag hieronder een nieuwe link aan.</p>
        <ResendVerificationForm email={record.user.email} />
      </AuthLayout>
    );
  }

  await prisma.user.update({
    where: { id: record.userId },
    data: { emailVerified: new Date() },
  });
  await prisma.verificationToken.deleteMany({ where: { userId: record.userId } });

  return (
    <AuthLayout title="E-mailadres bevestigd" subtitle="Je account is geactiveerd.">
      <div className="mb-6 flex justify-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-sage-100 text-sage-600">
          <CheckCircle2 className="h-7 w-7" />
        </div>
      </div>
      <Link
        href="/login"
        className="block w-full rounded-xl bg-sage-600 py-3 text-center text-sm font-semibold text-white shadow-sm transition hover:bg-sage-700"
      >
        Naar inloggen
      </Link>
    </AuthLayout>
  );
}

function InvalidContent() {
  return (
    <>
      <div className="mb-6 flex justify-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-peach-100 text-[#c17a52]">
          <XCircle className="h-7 w-7" />
        </div>
      </div>
      <ResendVerificationForm />
    </>
  );
}
