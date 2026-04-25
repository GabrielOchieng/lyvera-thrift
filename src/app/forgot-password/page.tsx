import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";
import { Suspense } from "react";
import AuthLayout from "@/components/auth/AuthLayout";

export default function ResetPasswordPage() {
  return (
    <AuthLayout>
      <ForgotPasswordForm />
    </AuthLayout>
  );
}
