"use client";

import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion, Variants } from "framer-motion";
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
} from "@/features/auth/components";
import { SecureClientAuthProvider } from "@/shared/providers/SecureClientAuthProvider";
import { ROUTES } from "@/constants/routes";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

function RegisterForm() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    general?: string;
  }>({});
  const [success, setSuccess] = useState<{
    name?: boolean;
    email?: boolean;
    password?: boolean;
    confirmPassword?: boolean;
  }>({});

  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const validateName = (name: string) => {
    if (name && name.length < 2) return "Name must be at least 2 characters";
    return null;
  };

  const validateEmail = (email: string) => {
    if (!email) return "Email is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Enter a valid email address";
    return null;
  };

  const validatePassword = (password: string) => {
    if (!password) return "Password is required";
    if (password.length < 8) return "Password must be at least 8 characters";
    if (!/[A-Z]/.test(password)) return "Password must contain an uppercase letter";
    if (!/[0-9]/.test(password)) return "Password must contain a number";
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password))
      return "Password must contain a special character";
    return null;
  };

  const validateConfirmPassword = (password: string, confirmPassword: string) => {
    if (!confirmPassword) return "Please confirm your password";
    if (password !== confirmPassword) return "Passwords do not match";
    return null;
  };

  const handleInputChange =
    (field: keyof typeof formData) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setFormData((prev) => {
        const newData = { ...prev, [field]: value };

        let error = null;
        if (field === "name") error = validateName(value);
        if (field === "email") error = validateEmail(value);
        if (field === "password") {
          error = validatePassword(value);
          if (newData.confirmPassword) {
            const confirmError = validateConfirmPassword(value, newData.confirmPassword);
            setErrors((errs) => ({ ...errs, confirmPassword: confirmError || undefined }));
            setSuccess((succs) => ({ ...succs, confirmPassword: !confirmError }));
          }
        }
        if (field === "confirmPassword") error = validateConfirmPassword(newData.password, value);

        setErrors((prevErrs) => ({ ...prevErrs, [field]: error || undefined }));
        setSuccess((prevSuccs) => ({ ...prevSuccs, [field]: !error && value.length > 0 }));

        return newData;
      });
    };

  const validateForm = () => {
    const newErrors: typeof errors = {};

    const emailErr = validateEmail(formData.email);
    if (emailErr) newErrors.email = emailErr;

    const passErr = validatePassword(formData.password);
    if (passErr) newErrors.password = passErr;

    const confirmErr = validateConfirmPassword(formData.password, formData.confirmPassword);
    if (confirmErr) newErrors.confirmPassword = confirmErr;

    if (formData.name) {
      const nameErr = validateName(formData.name);
      if (nameErr) newErrors.name = nameErr;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors((prev) => ({ ...prev, general: undefined }));

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
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data?.error?.toLowerCase().includes("email")) {
          setErrors((prev) => ({ ...prev, email: data.error }));
          setSuccess((prev) => ({ ...prev, email: false }));
        } else {
          throw new Error(data?.error || "Registration failed");
        }
        setLoading(false);
        return;
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
        general: err instanceof Error ? err.message : "Network error. Please try again.",
      });
      setLoading(false);
    }
  };

  const handleGoogleRegister = async () => {
    setGoogleLoading(true);
    setErrors((prev) => ({ ...prev, general: undefined }));
    try {
      const { createClient } = await import("@/lib/supabase/client");
      const supabase = createClient();
      await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback?next=${encodeURIComponent(ROUTES.PROTECTED.DASHBOARD)}`,
        },
      });
    } catch {
      setErrors({ general: "Google Authentication failed. Please try again." });
      setGoogleLoading(false);
    }
  };

  const isAnyLoading = loading || googleLoading;

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

      <motion.div
        className="flex-1 flex flex-col lg:flex-row pt-16 sm:pt-22 md:pt-28"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        <motion.div
          variants={itemVariants}
          className="relative w-full lg:w-[40%] bg-[#0B0F19] overflow-hidden order-2 lg:order-1 hidden lg:flex"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(37,113,231,0.08)_0%,transparent_70%)]" />
          <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-white/10 to-transparent" />
          <BrandSection />
        </motion.div>

        <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-10 lg:p-16 xl:p-24 order-1 lg:order-2">
          <motion.div variants={itemVariants} className="w-full max-w-145">
            <AuthCard className="w-full shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-200/60 p-6 sm:p-8">
              <div className="mb-6">
                <h2 className="text-3xl font-bold tracking-tight text-navy">Create your account</h2>
                <p className="mt-2.5 text-slate-500 leading-relaxed text-sm">
                  Start your structured exam preparation journey with India&apos;s most analytical
                  platform.
                </p>
              </div>

              {errors.general && (
                <div className="mb-6">
                  <ValidationMessage type="error" message={errors.general} />
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <AuthInput
                  label="Full name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  placeholder="Rahul Sharma"
                  value={formData.name}
                  onChange={handleInputChange("name")}
                  error={errors.name}
                  isSuccess={success.name}
                  disabled={isAnyLoading}
                />

                <AuthInput
                  label="Email address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="rahul@example.com"
                  value={formData.email}
                  onChange={handleInputChange("email")}
                  error={errors.email}
                  isSuccess={success.email}
                  required
                  disabled={isAnyLoading}
                />

                <PasswordField
                  label="Password"
                  name="password"
                  autoComplete="new-password"
                  placeholder="Min. 8 characters"
                  value={formData.password}
                  onChange={handleInputChange("password")}
                  error={errors.password}
                  isSuccess={success.password}
                  showRequirements
                  required
                  disabled={isAnyLoading}
                />

                <PasswordField
                  label="Confirm password"
                  name="confirmPassword"
                  autoComplete="new-password"
                  placeholder="Re-enter password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange("confirmPassword")}
                  error={errors.confirmPassword}
                  isSuccess={success.confirmPassword}
                  required
                  disabled={isAnyLoading}
                />

                <div className="pt-4">
                  <AuthButton type="submit" loading={loading} disabled={isAnyLoading} size="lg">
                    Register Now
                  </AuthButton>
                </div>
              </form>

              <div className="mt-6">
                <AuthDivider text="OR CONTINUE WITH" />
              </div>

              <div className="mt-6">
                <OAuthButton
                  onClick={handleGoogleRegister}
                  loading={googleLoading}
                  disabled={isAnyLoading}
                  mode="register"
                />
              </div>

              <div className="mt-8 pt-8 border-t border-slate-100">
                <AuthFooterLink
                  text="Already have an account?"
                  linkText="Sign In"
                  href={ROUTES.AUTH.SIGN_IN}
                />
              </div>
            </AuthCard>
          </motion.div>

          {/* Minimal Auth Footer */}
          <motion.div
            variants={itemVariants}
            className="mt-6 flex items-center justify-center gap-4 text-[13px] font-medium text-slate-400"
          >
            <a href="/privacy" className="hover:text-slate-600 transition-colors">
              Privacy Policy
            </a>
            <a href="/terms" className="hover:text-slate-600 transition-colors">
              Terms of Service
            </a>
            <span>© 2026 QuizArena</span>
          </motion.div>
        </div>
      </motion.div>
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
