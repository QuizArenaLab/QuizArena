"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { LockKeyhole, ArrowLeft, Check, Send } from "lucide-react";
import {
  AuthInput,
  AuthCard,
  AuthButton,
  ValidationMessage,
  BrandSection,
} from "@/features/auth/components";
import { ROUTES } from '@/constants/routes';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [resendTimer, setResendTimer] = useState(0);

  const startResendTimer = () => {
    setResendTimer(60);
    const interval = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleForgotPassword = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!email) {
      setError("Email is required");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Enter a valid email address");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        throw new Error("Failed to send reset link");
      }

      setSuccess(true);
      startResendTimer();
    } catch (err: any) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAFB]">
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

      <div className="flex-1 flex flex-col lg:flex-row pt-[64px] sm:pt-[88px] md:pt-0">
        <div className="hidden lg:flex lg:w-[35%] xl:w-[32%] bg-linear-to-br from-navy via-navy/95 to-navy/90 relative overflow-hidden mt-[64px] sm:mt-[88px] md:mt-[112px] lg:mt-0 pt-[112px] lg:pt-[112px]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_70%,rgba(230,112,30,0.15)_0%,transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(37,113,231,0.1)_0%,transparent_40%)]" />
          <BrandSection />
        </div>

        <div className="w-full lg:w-[65%] xl:w-[68%] flex flex-col items-center justify-center p-6 sm:p-8 lg:p-12 bg-white min-h-[calc(100vh-64px)] lg:min-h-screen pt-4 lg:pt-[112px]">
          <AuthCard className="w-full max-w-[540px]">
            {success ? (
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Check className="w-8 h-8 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold tracking-tight text-navy mb-4">
                  Check your inbox
                </h2>
                <p className="text-navy/70 mb-8 leading-relaxed">
                  If an account exists for <span className="font-semibold">{email}</span>,
                  we&apos;ve sent instructions for resetting your password.
                </p>

                <div className="bg-slate-50 border border-slate-100 rounded-lg p-4 mb-8">
                  <p className="text-sm text-slate-600">
                    Didn&apos;t receive an email? Check your spam folder or{" "}
                    {resendTimer > 0 ? (
                      <span className="text-slate-400 cursor-not-allowed">
                        resend in {resendTimer}s
                      </span>
                    ) : (
                      <button
                        onClick={() => handleForgotPassword()}
                        disabled={loading}
                        className="text-primary hover:underline font-medium"
                      >
                        try again
                      </button>
                    )}
                  </p>
                </div>

                <Link
                  href={ROUTES.AUTH.SIGN_IN}
                  className="inline-flex items-center justify-center text-sm font-medium text-slate-600 hover:text-navy transition-colors"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to login
                </Link>
              </div>
            ) : (
              <>
                <div className="text-center mb-8">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-5 text-primary">
                    <LockKeyhole className="w-6 h-6" />
                  </div>
                  <h2 className="text-2xl font-bold tracking-tight text-navy">
                    Reset your password
                  </h2>
                  <p className="mt-2 text-sm text-navy/60">
                    Enter your email address and we&apos;ll send you a link to reset your password.
                  </p>
                </div>

                {error && (
                  <div className="mb-6">
                    <ValidationMessage type="error" message={error} />
                  </div>
                )}

                <form onSubmit={handleForgotPassword} className="space-y-6">
                  <AuthInput
                    label="Email address"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (error) setError("");
                    }}
                    required
                    disabled={loading}
                  />

                  <AuthButton type="submit" loading={loading} size="lg" className="w-full">
                    <span className="flex items-center justify-center">
                      Send reset link
                      <Send className="w-4 h-4 ml-2" />
                    </span>
                  </AuthButton>

                  <div className="text-center mt-6">
                    <Link
                      href={ROUTES.AUTH.SIGN_IN}
                      className="inline-flex items-center justify-center text-sm font-medium text-slate-600 hover:text-navy transition-colors"
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Back to login
                    </Link>
                  </div>
                </form>
              </>
            )}
          </AuthCard>

          <div className="mt-8 flex items-center justify-center gap-2 text-sm text-slate-500">
            <LockKeyhole className="w-4 h-4 text-green-600" />
            <span className="text-green-700 font-medium text-[13px]">
              Secure SSL Encrypted Connection
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
