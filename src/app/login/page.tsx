import { AuthLayout } from "@/components/auth/AuthLayout";
import { LoginForm } from "@/components/auth/LoginForm";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  const { callbackUrl } = await searchParams;

  return (
    <AuthLayout
      title="Welkom terug"
      subtitle="Log in om jullie gezinsplanning te bekijken."
    >
      <LoginForm callbackUrl={callbackUrl} />
    </AuthLayout>
  );
}
