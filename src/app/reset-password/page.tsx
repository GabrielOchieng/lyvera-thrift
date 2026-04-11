import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";
import { Suspense } from "react";

export default function ResetPasswordPage() {
  return (
    <div className="flex justify-center items-center min-h-screen">
      {/* The Suspense boundary fixes the build error */}
      <Suspense fallback={<div>Loading...</div>}>
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}
