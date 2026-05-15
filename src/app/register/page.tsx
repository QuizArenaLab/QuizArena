"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import clsx from "clsx";
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
import { SecureClientAuthProvider } from "@/components/auth/SecureClientAuthProvider";
import { ROUTES } from "@/lib/routes";

function RegisterForm() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    username?: string;
    password?: string;
    confirmPassword?: string;
    general?: string;
  }>({});
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [checkingUsername, setCheckingUsername] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);

  const validateForm = () => {
    const newErrors: typeof errors = {};

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const checkUsernameAvailability = async (username: string) => {
    if (username.length < 3) {
      setUsernameAvailable(null);
      return;
    }

    if (!/^[a-z0-9_]+$/.test(username)) {
      setErrors((prev) => ({
        ...prev,
        username: "Only lowercase letters, numbers, and underscores allowed",
      }));
      setUsernameAvailable(false);
      return;
    }

    setCheckingUsername(true);
    try {
      const res = await fetch(`/api/user/check-username?username=${encodeURIComponent(username)}`);
      const data = await res.json();
      setUsernameAvailable(data.available);
      if (!data.available) {
        setErrors((prev) => ({ ...prev, username: "Username is already taken" }));
      } else {
        setErrors((prev) => {
          const { username, ...rest } = prev;
          return rest;
        });
      }
    } catch {
      setUsernameAvailable(null);
    } finally {
      setCheckingUsername(false);
    }
  };

  const handleInputChange =
    (field: keyof typeof formData) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setFormData((prev) => ({ ...prev, [field]: value }));

      if (errors[field]) {
        setErrors((prev) => ({ ...prev, [field]: undefined }));
      }

      if (field === "username") {
        setUsernameAvailable(null);
      }
    };

  const handleUsernameBlur = () => {
    if (formData.username) {
      checkUsernameAvailability(formData.username);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    if (formData.username) {
      await checkUsernameAvailability(formData.username);
      if (!usernameAvailable) return;
    }

    if (!validateForm()) return;

    setLoading(true);

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          name: formData.name || undefined,
          username: formData.username || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "Registration failed");
      }

      const result = await signIn("credentials", {
        redirect: false,
        email: formData.email,
        password: formData.password,
      });

      if (result?.error || !result?.ok) {
        router.push(
          `${ROUTES.AUTH.SIGN_IN}?registered=true&email=${encodeURIComponent(formData.email)}`
        );
        return;
      }

      window.location.href = ROUTES.PROTECTED.DASHBOARD;
    } catch (err) {
      setErrors({
        general: err instanceof Error ? err.message : "Registration failed. Please try again.",
      });
      setLoading(false);
    }
  };

  const handleGoogleRegister = async () => {
    setGoogleLoading(true);
    await signIn("google", { callbackUrl: ROUTES.PROTECTED.DASHBOARD });
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-[#FAFAFB]">
      {/* Branding Panel - Now 45% on large screens */}
      <div className="relative w-full lg:w-[45%] xl:w-[40%] bg-[#0B0F19] overflow-hidden order-2 lg:order-1 hidden lg:flex">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(37,113,231,0.08)_0%,transparent_70%)]" />
        <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-white/10 to-transparent" />
        <BrandSection />
      </div>

      {/* Authentication Panel - Now 55% on large screens */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-10 lg:p-16 xl:p-24 order-1 lg:order-2">
        {/* Mobile Header */}
        <div className="lg:hidden w-full max-w-[440px] mb-10 flex items-center gap-3">
          <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-primary/10">
            <svg
              className="h-6 w-6 text-primary"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
          </div>
          <span className="text-xl font-bold tracking-tight text-navy">QuizArena</span>
        </div>

        <AuthCard className="w-full max-w-[440px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-200/60 p-8 sm:p-10">
          <div className="mb-10">
            <h2 className="text-3xl font-bold tracking-tight text-navy">Create your account</h2>
            <p className="mt-2.5 text-slate-500 leading-relaxed">
              Start your structured exam preparation journey with India's most analytical platform.
            </p>
          </div>

          {errors.general && (
            <div className="mb-8">
              <ValidationMessage type="error" message={errors.general} />
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-[18px]">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-[18px]">
              <AuthInput
                label="Full name"
                name="name"
                type="text"
                autoComplete="name"
                placeholder="Rahul Sharma"
                value={formData.name}
                onChange={handleInputChange("name")}
                error={errors.name}
                disabled={loading}
              />
              <AuthInput
                label="Username"
                name="username"
                type="text"
                autoComplete="username"
                placeholder="rahul_sharma"
                value={formData.username}
                onChange={handleInputChange("username")}
                onBlur={handleUsernameBlur}
                disabled={loading}
                error={errors.username}
                className={clsx(
                  usernameAvailable === true && "border-green-500/50 focus:border-green-500 focus:ring-green-500/10"
                )}
              />
            </div>

            <AuthInput
              label="Email address"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="rahul@example.com"
              value={formData.email}
              onChange={handleInputChange("email")}
              error={errors.email}
              required
              disabled={loading}
            />

            <PasswordField
              label="Password"
              name="password"
              autoComplete="new-password"
              placeholder="Min. 8 characters"
              value={formData.password}
              onChange={handleInputChange("password")}
              error={errors.password}
              showRequirements
              required
              disabled={loading}
            />

            <PasswordField
              label="Confirm password"
              name="confirmPassword"
              autoComplete="new-password"
              placeholder="Re-enter password"
              value={formData.confirmPassword}
              onChange={handleInputChange("confirmPassword")}
              error={errors.confirmPassword}
              required
              disabled={loading}
            />

            <div className="pt-4">
              <AuthButton type="submit" loading={loading} size="lg">
                Create account
              </AuthButton>
            </div>
          </form>

          <div className="mt-10">
            <AuthDivider text="or continue with" />
          </div>

          <div className="mt-8">
            <OAuthButton
              onClick={handleGoogleRegister}
              loading={googleLoading}
              disabled={loading}
              mode="register"
            />
          </div>

          <div className="mt-10 pt-10 border-t border-slate-100">
            <AuthFooterLink
              text="Already have an account?"
              linkText="Sign in"
              href={ROUTES.AUTH.SIGN_IN}
            />
          </div>
        </AuthCard>

        {/* Trust microcopy */}
        <div className="mt-10 flex items-center gap-6 opacity-40 grayscale transition-all hover:grayscale-0 hover:opacity-100">
          <p className="text-[11px] font-medium text-slate-400 uppercase tracking-widest">Secure Infrastructure</p>
          <div className="h-1 w-1 rounded-full bg-slate-300" />
          <p className="text-[11px] font-medium text-slate-400 uppercase tracking-widest">Privacy Protected</p>
          <div className="h-1 w-1 rounded-full bg-slate-300" />
          <p className="text-[11px] font-medium text-slate-400 uppercase tracking-widest">256-bit Encryption</p>
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <SecureClientAuthProvider>
      <RegisterForm />
    </SecureClientAuthProvider>
  );
}
