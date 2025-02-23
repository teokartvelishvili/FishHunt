import { ResetPasswordForm } from "@/modules/auth/components/reset-password";
import { AuthLayout } from "@/modules/auth/layouts/auth-layout";

export default function LoginPage() {
  return (
    <AuthLayout
      title="Update your password"
      subtitle=" Please enter your details."
    >
      <ResetPasswordForm />
    </AuthLayout>
  );
}
