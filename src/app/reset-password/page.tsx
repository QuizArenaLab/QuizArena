"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { LockKeyhole, ShieldCheck, AlertCircle, ArrowLeft, Check } from "lucide-react";
import {
  AuthCard,
  AuthButton,
  ValidationMessage,
  BrandSection,
  PasswordField,
} from "@/features/auth/components";
import { ROUTES } from '@/constants/routes';

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams?.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  // States: default, invalid-token, expired-token, success
  const [tokenState, setTokenState] = useState<"valid" | "invalid" | "expired" | "checking">(
    token ? "valid" : "invalid"
  );

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!password) {
      setError("Please enter a new password");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.error?.toLowerCase().includes("expired")) {
          setTokenState("expired");
        } else if (data.error?.toLowerCase().includes("invalid")) {
          setTokenState("invalid");
        } else {
          throw new Error(data.error || "Failed to reset password");
        }
        return;
      }

      setSuccess(true);
      // Auto-redirect to login after 3 seconds
      setTimeout(() => {
        router.push(ROUTES.AUTH.SIGN_IN);
      }, 3000);
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (tokenState === "checking") {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin mb-4" />
        <p className="text-sm text-navy/60">Verifying link...</p>
      </div>
    );
  }

  if (tokenState === "invalid" || tokenState === "expired") {
    return (
      <div className="text-center">
        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertCircle className="w-8 h-8 text-red-500" />
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-navy mb-4">
          {tokenState === "expired" ? "Link Expired" : "Invalid Link"}
        </h2>
        <p className="text-navy/70 mb-8 leading-relaxed">
          {tokenState === "expired"
            ? "Your password reset link has expired. For security reasons, links are only valid for 5 minutes."
            : "This password reset link is invalid or has already been used."}
        </p>

        <Link href="/forgot-password" passHref>
          <AuthButton type="button" size="lg" className="w-full">
            Request new reset link
          </AuthButton>
        </Link>

        <div className="mt-6">
          <Link
            href={ROUTES.AUTH.SIGN_IN}
            className="inline-flex items-center justify-center text-sm font-medium text-slate-600 hover:text-navy transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to login
          </Link>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <ShieldCheck className="w-8 h-8 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-navy mb-4">
          Password Reset Successful
        </h2>
        <p className="text-navy/70 mb-8 leading-relaxed">
          Your password has been securely updated. You have been logged out of all active sessions.
        </p>

        <Link href={ROUTES.AUTH.SIGN_IN} passHref>
          <AuthButton type="button" size="lg" className="w-full">
            <span className="flex items-center justify-center">
              Continue to Login
              <Check className="w-4 h-4 ml-2" />
            </span>
          </AuthButton>
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="text-center mb-8">
        <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-5 text-primary">
          <LockKeyhole className="w-6 h-6" />
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-navy">Create new password</h2>
        <p className="mt-2 text-sm text-navy/60">
          Your new password must be different from previous used passwords.
        </p>
      </div>

      {error && (
        <div className="mb-6">
          <ValidationMessage type="error" message={error} />
        </div>
      )}

      <form onSubmit={handleResetPassword} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-navy/80 mb-1.5">New Password</label>
          <PasswordField
            name="password"
            placeholder="At least 8 characters"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (error) setError("");
            }}
            required
            disabled={loading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-navy/80 mb-1.5">Confirm Password</label>
          <PasswordField
            name="confirmPassword"
            placeholder="Re-enter your new password"
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              if (error) setError("");
            }}
            required
            disabled={loading}
          />
        </div>

        <div className="pt-2">
          <AuthButton type="submit" loading={loading} size="lg" className="w-full">
            Reset Password
          </AuthButton>
        </div>
      </form>
    </>
  );
}

export default function ResetPasswordPage() {
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
            <Suspense
              fallback={
                <div className="flex flex-col items-center justify-center p-8">
                  <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin mb-4" />
                  <p className="text-sm text-navy/60">Loading...</p>
                </div>
              }
            >
              <ResetPasswordForm />
            </Suspense>
          </AuthCard>

          <div className="mt-8 flex items-center justify-center gap-2 text-sm text-slate-500">
            <ShieldCheck className="w-4 h-4 text-green-600" />
            <span className="text-green-700 font-medium text-[13px]">
              Secure Session Required Post-Reset
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
