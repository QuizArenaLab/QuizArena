"use client";

import { useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
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
    <div className="min-h-screen flex flex-col bg-[#FAFAFB]">
      {/* Minimalist White Auth Navbar */}
      <header className="fixed top-0 inset-x-0 w-full bg-white/80 backdrop-blur-xl border-b border-gray-200/60 shadow-sm z-50 shrink-0 py-0 transition-all duration-500">
        <div className="container-base flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center group z-50 cursor-pointer hover:opacity-90 hover:-translate-y-px transition-all duration-300"
          >
            <Image
              src="/logo-header.png"
              alt="QuizArena"
              width={180}
              height={100}
              className="h-16 sm:h-22 md:h-28 w-auto object-contain drop-shadow-sm transition-all duration-500"
            />
          </Link>
        </div>
      </header>

      <div className="flex-1 flex flex-col lg:flex-row pt-[64px] sm:pt-[88px] md:pt-[112px]">
        <div className="hidden lg:flex lg:w-1/2 xl:w-3/5 bg-linear-to-br from-navy via-navy/95 to-navy/90 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_70%,rgba(230,112,30,0.15)_0%,transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(37,113,231,0.1)_0%,transparent_40%)]" />
          <BrandSection />
        </div>

        <div className="w-full lg:w-1/2 xl:w-2/5 flex flex-col items-center justify-center p-6 sm:p-8 lg:p-12 bg-white">
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

        <div className="mt-6 flex items-center justify-center gap-4 text-[13px] font-medium text-slate-400">
          <a href="/privacy" className="hover:text-slate-600 transition-colors">
            Privacy Policy
          </a>
          <a href="/terms" className="hover:text-slate-600 transition-colors">
            Terms of Service
          </a>
          <span>© 2026 QuizArena</span>
        </div>
      </div>
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
