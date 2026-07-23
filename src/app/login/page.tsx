"use client";

import { useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Lock, Check } from "lucide-react";
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
} from "@/features/auth/components";
import { ROUTES } from "@/constants/routes";

function LoginForm() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams?.get("callbackUrl") || ROUTES.PROTECTED.DASHBOARD;
  const registered = searchParams?.get("registered") === "true";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({});
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Read NextAuth error from URL
  const authError = searchParams?.get("error");
  useEffect(() => {
    if (authError) {
      if (authError === "OAuthAccountNotLinked") {
        setErrors({
          general:
            "This email is already registered via a different method. Please sign in with your original method, or try again.",
        });
      } else if (authError === "CredentialsSignin") {
        setErrors({ general: "Invalid email or password. Please try again." });
      } else {
        setErrors({ general: "An authentication error occurred. Please try again." });
      }
    }
  }, [authError]);

  const isEmailValid = email.length > 0 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

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

      setSuccess(true);
      setTimeout(() => {
        window.location.href = callbackUrl;
      }, 600);
    } catch {
      setErrors({ general: "An unexpected error occurred. Please try again." });
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    const { createClient } = await import("@/lib/supabase/client");
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(callbackUrl)}`,
      },
    });
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

      <div className="flex-1 flex flex-col lg:flex-row pt-16 sm:pt-22 md:pt-0">
        <div className="hidden lg:flex lg:w-[35%] xl:w-[32%] bg-linear-to-br from-navy via-navy/95 to-navy/90 relative overflow-hidden mt-16 sm:mt-22 md:mt-28 lg:mt-0 pt-28 lg:pt-28">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_70%,rgba(230,112,30,0.15)_0%,transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(37,113,231,0.1)_0%,transparent_40%)]" />
          <BrandSection />
        </div>

        <div className="w-full lg:w-[65%] xl:w-[68%] flex flex-col items-center justify-center p-6 sm:p-8 lg:p-12 bg-white min-h-[calc(100vh-64px)] lg:min-h-screen pt-4 lg:pt-28">
          <AuthCard className="w-full max-w-135">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold tracking-tight text-navy">
                Continue your preparation
              </h2>
              <p className="mt-2 text-sm text-navy/60">Sign in to access your dashboard</p>
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
                isSuccess={isEmailValid}
                required
                disabled={loading || success}
              />

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label htmlFor="password" className="block text-sm font-medium text-navy/80">
                    Password
                  </label>
                  <a
                    href="/forgot-password"
                    className="text-[13px] font-semibold text-primary hover:text-primary/80 hover:underline underline-offset-2 transition-colors p-2 -mr-2"
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
                  disabled={loading || success}
                />
              </div>

              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary/20 transition-colors"
                  disabled={loading || success}
                />
                <label htmlFor="remember-me" className="ml-2 block text-[13px] text-slate-600">
                  Remember me for 30 days
                </label>
              </div>

              <div className="pt-2">
                <AuthButton type="submit" loading={loading} size="lg" className="w-full">
                  <span
                    className={`transition-opacity duration-300 ${success ? "opacity-0" : "opacity-100"}`}
                  >
                    Sign In
                  </span>
                  {success && (
                    <span className="absolute inset-0 flex items-center justify-center text-white animate-in zoom-in duration-300">
                      <Check className="w-5 h-5 mr-2" />
                      Success!
                    </span>
                  )}
                </AuthButton>
              </div>
            </form>

            <div className="mt-6">
              <AuthDivider />
            </div>

            <div className="mt-6">
              <OAuthButton
                onClick={handleGoogleLogin}
                loading={googleLoading}
                disabled={loading || success}
                mode="login"
              />
            </div>

            <div className="mt-4">
              <AuthFooterLink
                text="Don't have an account?"
                linkText="Create one"
                href={ROUTES.AUTH.SIGN_UP}
              />
            </div>
          </AuthCard>

          <div className="mt-4 flex items-center justify-center gap-4 text-[13px] font-medium text-slate-400">
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
