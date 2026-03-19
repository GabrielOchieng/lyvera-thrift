import { LoginForm } from "@/components/auth/login-form";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6 bg-slate-50">
      <div className="w-full max-w-sm">
        <LoginForm />
        <p className="mt-4 text-center text-sm text-muted-foreground">
          Don't have an account?{" "}
          <a
            href="/signup"
            className="underline underline-offset-4 hover:text-primary"
          >
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}
