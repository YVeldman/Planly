import { MailCheck } from "lucide-react";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { ResendVerificationForm } from "@/components/auth/ResendVerificationForm";

export default async function CheckEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string }>;
}) {
  const { email } = await searchParams;

  return (
    <AuthLayout
      title="Bevestig je e-mailadres"
      subtitle={
        email
          ? `We hebben een bevestigingslink gestuurd naar ${email}.`
          : "We hebben een bevestigingslink naar je e-mailadres gestuurd."
      }
    >
      <div className="mb-6 flex justify-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-sage-100 text-sage-600">
          <MailCheck className="h-7 w-7" />
        </div>
      </div>
      <p className="mb-6 text-center text-sm text-ink-500">
        Klik op de link in de e-mail om jullie gezin te activeren. Geen mail ontvangen? Controleer
        je spamfolder, of vraag hieronder een nieuwe link aan.
      </p>
      <ResendVerificationForm email={email} />
    </AuthLayout>
  );
}
