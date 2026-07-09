import { AuthLayout } from "@/components/auth/AuthLayout";
import { SignupForm } from "@/components/auth/SignupForm";

export default function SignupPage() {
  return (
    <AuthLayout
      title="Start jullie gezin op Planly"
      subtitle="Maak een gratis account aan en begin met plannen."
    >
      <SignupForm />
    </AuthLayout>
  );
}
