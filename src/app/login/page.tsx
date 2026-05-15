"use client";

import { useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import {
  AuthInput,
  PasswordField,
  AuthCard,
  OAuthButton,
  AuthDivider,
  AuthButton,
  ValidationMessage,
  AuthFooterLink,
  BrandSection,
} from "@/components/auth";
import { ROUTES } from "@/lib/routes";

function LoginForm() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams?.get("callbackUrl") || ROUTES.PROTECTED.DASHBOARD;
  const registered = searchParams?.get("registered") === "true";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({});
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const validateForm = () => {
    const newErrors: typeof errors = {};

    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Enter a valid email address";
    }

    if (!password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCredentialsLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    if (!validateForm()) return;

    setLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        callbackUrl,
        redirect: false,
      });

      if (result?.error || !result?.ok) {
        setErrors({ general: "Invalid email or password. Please try again." });
        setLoading(false);
        return;
      }

      window.location.href = callbackUrl;
    } catch {
      setErrors({ general: "An unexpected error occurred. Please try again." });
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    await signIn("google", { callbackUrl });
  };

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 xl:w-3/5 bg-gradient-to-br from-navy via-navy/95 to-navy/90 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_70%,rgba(230,112,30,0.15)_0%,transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(37,113,231,0.1)_0%,transparent_40%)]" />
        <BrandSection />
      </div>

      <div className="w-full lg:w-1/2 xl:w-2/5 flex items-center justify-center p-6 sm:p-8 lg:p-12 bg-white">
        <AuthCard className="w-full max-w-[420px]">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold tracking-tight text-navy">Welcome back</h2>
            <p className="mt-2 text-sm text-navy/60">Sign in to continue your preparation</p>
          </div>

          {registered && (
            <div className="mb-6 rounded-lg bg-green-50/80 border border-green-200/50 p-4">
              <p className="text-sm text-green-700/90">
                <span className="font-medium">Account created!</span> Please sign in to continue.
              </p>
            </div>
          )}

          {errors.general && (
            <div className="mb-6">
              <ValidationMessage type="error" message={errors.general} />
            </div>
          )}

          <form onSubmit={handleCredentialsLogin} className="space-y-5">
            <AuthInput
              label="Email address"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) setErrors((p) => ({ ...p, email: undefined }));
              }}
              error={errors.email}
              required
              disabled={loading}
            />

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="password" className="block text-sm font-medium text-navy/80">
                  Password
                </label>
                <a
                  href="/forgot-password"
                  className="text-xs font-medium text-primary hover:text-primary/80 hover:underline underline-offset-2 transition-colors"
                >
                  Forgot password?
                </a>
              </div>
              <PasswordField
                name="password"
                autoComplete="current-password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password) setErrors((p) => ({ ...p, password: undefined }));
                }}
                error={errors.password}
                required
                disabled={loading}
              />
            </div>

            <AuthButton type="submit" loading={loading} size="lg">
              Sign in
            </AuthButton>
          </form>

          <div className="mt-6">
            <AuthDivider />
          </div>

          <div className="mt-6">
            <OAuthButton
              onClick={handleGoogleLogin}
              loading={googleLoading}
              disabled={loading}
              mode="login"
            />
          </div>

          <div className="mt-6">
            <AuthFooterLink
              text="Don't have an account?"
              linkText="Create one"
              href={ROUTES.AUTH.SIGN_UP}
            />
          </div>
        </AuthCard>
      </div>

      <div className="fixed bottom-0 left-0 right-0 lg:hidden bg-white border-t border-accent/20 p-4 safe-area-bottom">
        <p className="text-center text-xs text-navy/50">Trusted by thousands of exam aspirants</p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-white">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
            <p className="text-sm text-navy/60">Loading...</p>
          </div>
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
