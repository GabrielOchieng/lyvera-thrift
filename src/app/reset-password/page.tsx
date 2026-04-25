import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";
import { Suspense } from "react";
import AuthLayout from "@/components/auth/AuthLayout";

export default function ResetPasswordPage() {
  return (
    <AuthLayout>
      {/* The Suspense boundary fixes the build error */}
      <Suspense fallback={<div>Loading...</div>}>
        <ResetPasswordForm />
      </Suspense>
    </AuthLayout>
  );
}
