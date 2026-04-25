// app/login/page.tsx
import AuthLayout from "@/components/auth/AuthLayout";
import { LoginForm } from "@/components/auth/login-form";

import Link from "next/link";

export default function LoginPage() {
  return (
    <AuthLayout>
      <LoginForm />
    </AuthLayout>
  );
}
