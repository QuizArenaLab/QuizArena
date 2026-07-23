"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { ROUTES } from "@/constants/routes";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const email = searchParams.get("email");

  const [status, setStatus] = useState<"loading" | "success" | "error">(
    !token || !email ? "error" : "loading"
  );
  const [message, setMessage] = useState(
    !token || !email
      ? "Missing verification token or email. Please check your email link."
      : "Verifying your email address..."
  );

  useEffect(() => {
    if (!token || !email) return;

    const verifyEmail = async () => {
      try {
        const response = await fetch("/api/auth/verify-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token, email }),
        });

        const data = await response.json();

        if (response.ok) {
          setStatus("success");
          setMessage(data.message || "Email verified successfully!");
        } else {
          setStatus("error");
          setMessage(data.error || "Failed to verify email. The link may have expired.");
        }
      } catch (error) {
        setStatus("error");
        setMessage("An unexpected error occurred. Please try again later.");
      }
    };

    verifyEmail();
  }, [token, email]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50">
      <div className="w-full max-w-md space-y-8 bg-white p-10 rounded-xl shadow-sm border border-slate-100">
        <div className="text-center">
          <h1 className="text-3xl font-black tracking-tight mb-2">
            <span className="text-slate-900">Quiz</span>
            <span className="text-orange-600">Arena</span>
          </h1>
          <h2 className="mt-6 text-2xl font-bold tracking-tight text-slate-900">
            Email Verification
          </h2>
        </div>

        <div className="mt-8 flex flex-col items-center justify-center space-y-4">
          {status === "loading" && (
            <>
              <Loader2 className="h-12 w-12 text-blue-600 animate-spin" />
              <p className="text-slate-600 text-center">{message}</p>
            </>
          )}

          {status === "success" && (
            <>
              <CheckCircle2 className="h-16 w-16 text-green-500" />
              <p className="text-slate-700 text-center font-medium">{message}</p>
              <div className="mt-6 w-full">
                <Link
                  href={ROUTES.AUTH.SIGN_IN}
                  className="flex w-full justify-center rounded-md bg-slate-900 px-3 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
                >
                  Continue to Login
                </Link>
              </div>
            </>
          )}

          {status === "error" && (
            <>
              <XCircle className="h-16 w-16 text-red-500" />
              <p className="text-center font-medium text-red-600">{message}</p>
              <div className="mt-6 w-full space-y-3">
                <Link
                  href={ROUTES.AUTH.SIGN_IN}
                  className="flex w-full justify-center rounded-md bg-slate-900 px-3 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-slate-800"
                >
                  Return to Login
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-slate-50">
          <Loader2 className="h-12 w-12 text-blue-600 animate-spin" />
        </div>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  );
}
