import { SignUpForm } from "@/components/auth/signup-form";

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6 bg-slate-50">
      <div className="w-full max-w-sm">
        <SignUpForm />
        <p className="mt-4 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <a
            href="/login"
            className="underline underline-offset-4 hover:text-primary"
          >
            Login
          </a>
        </p>
      </div>
    </div>
  );
}
