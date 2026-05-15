"use client";

import { useState } from "react";
import Link from "next/link";
import {
  AuthInput,
  AuthCard,
  AuthButton,
  ValidationMessage,
  BrandSection,
} from "@/components/auth";
import { ROUTES } from "@/lib/routes";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!email) {
      setError("Please enter your email address");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "Failed to send reset email");
      }

      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
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
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
              <svg
                className="h-6 w-6 text-primary"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-navy">Reset your password</h2>
            <p className="mt-2 text-sm text-navy/60">
              Enter your email and we&apos;ll send you a reset link
            </p>
          </div>

          {error && (
            <div className="mb-6">
              <ValidationMessage type="error" message={error} />
            </div>
          )}

          {success ? (
            <div className="space-y-6">
              <ValidationMessage
                type="success"
                message="Check your email for a reset link. It may take a few minutes."
              />
              <Link
                href={ROUTES.AUTH.SIGN_IN}
                className="block w-full text-center text-sm font-medium text-primary hover:text-primary/80 transition-colors"
              >
                Back to sign in
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <AuthInput
                label="Email address"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError(null);
                }}
                error={error || undefined}
                required
                disabled={loading}
              />

              <AuthButton type="submit" loading={loading} size="lg">
                Send reset link
              </AuthButton>

              <p className="text-center text-sm text-navy/60">
                Remember your password?{" "}
                <Link
                  href={ROUTES.AUTH.SIGN_IN}
                  className="font-medium text-primary hover:text-primary/80 hover:underline underline-offset-2 transition-colors"
                >
                  Sign in
                </Link>
              </p>
            </form>
          )}
        </AuthCard>
      </div>

      <div className="fixed bottom-0 left-0 right-0 lg:hidden bg-white border-t border-accent/20 p-4 safe-area-bottom">
        <p className="text-center text-xs text-navy/50">QuizArena — Secure exam preparation</p>
      </div>
    </div>
  );
}
