"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  User as UserIcon,
  BookOpen,
  Target,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { notify } from '@/shared/feedback/notify';
import {
  EXAM_CATEGORIES,
  PREPARATION_LEVELS,
  normalizeUsername,
  generateUsernameSuggestion,
  validateUsername,
  type ExamCategoryValue,
  type PreparationLevelValue,
} from "@/lib/onboarding";

const STEPS = [
  { id: 1, name: "Identity", key: "username", icon: UserIcon },
  { id: 2, name: "Goal", key: "exam", icon: Target },
  { id: 3, name: "Level", key: "level", icon: BookOpen },
];

interface FormData {
  username: string;
  category: ExamCategoryValue | "";
  preparationLevel: PreparationLevelValue | "";
}

interface FormErrors {
  username?: string;
  category?: string;
  preparationLevel?: string;
}

export default function OnboardingPage() {
  const { data: session, update: updateSession, status } = useSession();
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    username: "",
    category: "",
    preparationLevel: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [checkingUsername, setCheckingUsername] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);
  const [isFinalizing, setIsFinalizing] = useState(false);

  const checkUsernameAvailability = useCallback(async (username: string) => {
    if (!username || username.length < 3) return null;

    setCheckingUsername(true);
    try {
      const response = await fetch(
        `/api/user/check-username?username=${encodeURIComponent(username)}`
      );
      if (!response.ok) throw new Error();
      const data = await response.json();
      return data.available;
    } catch {
      return null;
    } finally {
      setCheckingUsername(false);
    }
  }, []);

  // Debounced username check
  useEffect(() => {
    const timer = setTimeout(async () => {
      const normalized = normalizeUsername(formData.username);
      const validation = validateUsername(normalized);

      if (validation.valid && normalized.length >= 3) {
        const available = await checkUsernameAvailability(normalized);
        setUsernameAvailable(available);
      } else {
        setUsernameAvailable(null);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [formData.username, checkUsernameAvailability]);

  // Initialize from sessionStorage - required to sync with persisted form state
  useEffect(() => {
    const saved = sessionStorage.getItem("onboarding_data");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setFormData((prev) => ({ ...prev, ...parsed }));
      } catch (e) {
        console.error("Failed to parse saved onboarding data", e);
      }
    }
  }, []);

  // Initialize username suggestion from session - required to sync with auth state
  useEffect(() => {
    if (session?.user?.name && !formData.username) {
      const saved = sessionStorage.getItem("onboarding_data");
      if (!saved) {
        const suggestion = generateUsernameSuggestion(session.user.name);
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setFormData((prev) => ({ ...prev, username: suggestion }));
      }
    }
  }, [session?.user?.name, formData.username]);

  // Persist to sessionStorage
  useEffect(() => {
    if (formData.username || formData.category || formData.preparationLevel) {
      sessionStorage.setItem("onboarding_data", JSON.stringify(formData));
    }
  }, [formData]);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated" && session?.user?.onboardingCompleted) {
      router.push("/dashboard");
    }
  }, [status, session, router]);

  const handleUsernameSubmit = async () => {
    const normalized = normalizeUsername(formData.username);
    const validation = validateUsername(normalized);

    if (!validation.valid) {
      setErrors({ username: validation.error });
      return;
    }

    setLoading(true);
    const available = await checkUsernameAvailability(normalized);
    setLoading(false);

    if (available === false) {
      setErrors({ username: "Username is already taken" });
      return;
    }

    setFormData((prev) => ({ ...prev, username: normalized }));
    setStep(2);
    setErrors({});
  };

  const handleExamCategorySubmit = () => {
    if (!formData.category) {
      setErrors({ category: "Please select an exam category" });
      return;
    }
    setErrors({});
    setStep(3);
  };

  const handleComplete = async () => {
    if (!formData.preparationLevel) {
      setErrors({ preparationLevel: "Please select your preparation level" });
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      const response = await fetch("/api/user/onboarding/complete", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: formData.username,
          category: formData.category,
          preparationLevel: formData.preparationLevel,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to complete onboarding");
      }

      setIsFinalizing(true);

      // Update session with new data
      await updateSession({
        user: {
          ...formData,
          onboardingCompleted: true,
        },
      });

      sessionStorage.removeItem("onboarding_data");
      notify.success("Welcome to QuizArena!");

      // Use window.location.href for a hard redirect to ensure middleware sees fresh session
      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 1500);
    } catch (err) {
      notify.error(err instanceof Error ? err.message : "Something went wrong");
      setErrors({
        preparationLevel: err instanceof Error ? err.message : "Failed to complete onboarding",
      });
    } finally {
      setLoading(false);
    }
  };

  const currentStepInfo = useMemo(() => STEPS[step - 1], [step]);

  if (status === "loading" || isFinalizing) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white gap-4">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-accent rounded-full border-t-primary animate-spin" />
          {isFinalizing && (
            <div className="absolute inset-0 flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8 text-primary" />
            </div>
          )}
        </div>
        <p className="text-navy font-medium animate-pulse">
          {isFinalizing ? "Preparing your arena..." : "Syncing access..."}
        </p>
      </div>
    );
  }

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 100 : -100,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 100 : -100,
      opacity: 0,
    }),
  };

  return (
    <div className="h-dvh overflow-hidden bg-[#F8FAFC] flex flex-col font-sans">
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200">
        <div className="max-w-2xl mx-auto px-4 py-3 sm:py-4 flex items-center justify-between">
          <div className="flex items-center">
            <Image
              src="/logo-header.png"
              alt="QuizArena"
              width={180}
              height={100}
              className="h-12 sm:h-16 md:h-20 w-auto object-contain origin-left drop-shadow-sm"
              priority
              unoptimized
            />
          </div>

          <div className="flex items-center gap-1.5">
            {STEPS.map((s) => (
              <div
                key={s.id}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  step === s.id
                    ? "w-8 bg-primary"
                    : step > s.id
                      ? "w-4 bg-primary/40"
                      : "w-4 bg-slate-200"
                }`}
              />
            ))}
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center py-4 px-4 sm:px-6 overflow-y-auto">
        <div className="w-full max-w-lg">
          <AnimatePresence mode="wait" custom={step}>
            <motion.div
              key={step}
              custom={step}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 },
              }}
              className="w-full"
            >
              <div className="mb-4 text-center flex flex-col items-center">
                <div className="flex items-center justify-center w-12 h-12 rounded-[14px] bg-white shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-slate-100 text-navy mb-3">
                  <currentStepInfo.icon size={22} strokeWidth={2.25} />
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-navy tracking-tight mb-1.5">
                  {step === 1 && "What's your handle?"}
                  {step === 2 && "Target Exam"}
                  {step === 3 && "How's your prep?"}
                </h1>
                <p className="text-slate-500 text-base">
                  {step === 1 && "Choose a unique username to start your journey."}
                  {step === 2 && "Pick the exam category you're focusing on."}
                  {step === 3 && "Tell us your level so we can tailor the tests."}
                </p>
              </div>

              {step === 1 && (
                <div className="space-y-6">
                  <div className="group relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">
                      <UserIcon size={20} />
                    </div>
                    <input
                      id="username"
                      type="text"
                      value={formData.username}
                      onChange={(e) => {
                        setFormData((prev) => ({ ...prev, username: e.target.value }));
                        if (errors.username) setErrors({});
                      }}
                      onKeyDown={(e) => e.key === "Enter" && handleUsernameSubmit()}
                      placeholder="Username"
                      className={`w-full pl-11 pr-4 py-3 bg-white border-2 rounded-2xl outline-none transition-all text-base ${
                        errors.username
                          ? "border-red-200 focus:border-red-500 bg-red-50/30"
                          : "border-slate-100 focus:border-primary bg-white shadow-sm"
                      }`}
                      autoFocus
                      autoCapitalize="off"
                      spellCheck={false}
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                      {checkingUsername && (
                        <Loader2 size={18} className="animate-spin text-primary" />
                      )}
                      {!checkingUsername && usernameAvailable === true && (
                        <CheckCircle2 size={18} className="text-green-500" />
                      )}
                      {!checkingUsername && usernameAvailable === false && (
                        <AlertCircle size={18} className="text-red-500" />
                      )}
                    </div>
                  </div>
                  {errors.username && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-1.5 text-red-500 text-sm mt-2 font-medium"
                    >
                      <AlertCircle size={14} />
                      {errors.username}
                    </motion.div>
                  )}
                  {!errors.username && usernameAvailable === false && (
                    <p className="text-red-500 text-xs mt-2 font-medium ml-1">
                      Username is already taken
                    </p>
                  )}

                  <p className="text-sm text-slate-400 px-1">
                    Lowercase letters, numbers, and underscores (3-20 chars).
                  </p>

                  <button
                    onClick={handleUsernameSubmit}
                    disabled={!formData.username || loading || checkingUsername}
                    className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3 rounded-2xl shadow-lg shadow-primary/20 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2 text-base"
                  >
                    {loading ? <Loader2 className="animate-spin" /> : "Continue"}
                    <ChevronRight size={20} />
                  </button>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-4">
                  <div className="grid gap-2">
                    {EXAM_CATEGORIES.map((cat) => (
                      <button
                        key={cat.value}
                        onClick={() => {
                          setFormData((prev) => ({
                            ...prev,
                            category: cat.value as ExamCategoryValue,
                          }));
                          setErrors({});
                        }}
                        className={`group relative w-full p-3.5 rounded-2xl border-2 text-left transition-all duration-200 ${
                          formData.category === cat.value
                            ? "border-primary bg-primary/5 ring-4 ring-primary/5"
                            : "border-white bg-white hover:border-slate-200 shadow-sm"
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <div className="font-bold text-navy text-base">{cat.label}</div>
                            <div className="text-xs text-slate-500">{cat.description}</div>
                          </div>
                          <div
                            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                              formData.category === cat.value
                                ? "bg-primary border-primary"
                                : "border-slate-200"
                            }`}
                          >
                            {formData.category === cat.value && (
                              <CheckCircle2 size={16} className="text-white" />
                            )}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>

                  <div className="flex gap-4 mt-4">
                    <button
                      onClick={() => setStep(1)}
                      className="flex-1 bg-white border-2 border-slate-100 hover:border-slate-200 text-navy font-bold py-3 rounded-2xl transition-all flex items-center justify-center gap-2 text-base"
                    >
                      <ChevronLeft size={18} />
                      Back
                    </button>
                    <button
                      onClick={handleExamCategorySubmit}
                      disabled={!formData.category}
                      className="flex-2 bg-primary hover:bg-primary-dark text-white font-bold py-3 rounded-2xl shadow-lg shadow-primary/20 transition-all disabled:opacity-50 flex items-center justify-center gap-2 text-base"
                    >
                      Continue
                      <ChevronRight size={18} />
                    </button>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-4">
                  <div className="grid gap-2">
                    {PREPARATION_LEVELS.map((level) => (
                      <button
                        key={level.value}
                        onClick={() => {
                          setFormData((prev) => ({
                            ...prev,
                            preparationLevel: level.value as PreparationLevelValue,
                          }));
                          setErrors({});
                        }}
                        className={`group relative w-full p-3.5 rounded-2xl border-2 text-left transition-all duration-200 ${
                          formData.preparationLevel === level.value
                            ? "border-primary bg-primary/5 ring-4 ring-primary/5"
                            : "border-white bg-white hover:border-slate-200 shadow-sm"
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <div className="font-bold text-navy text-base">{level.label}</div>
                            <div className="text-xs text-slate-500">{level.description}</div>
                          </div>
                          <div
                            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                              formData.preparationLevel === level.value
                                ? "bg-primary border-primary"
                                : "border-slate-200"
                            }`}
                          >
                            {formData.preparationLevel === level.value && (
                              <CheckCircle2 size={16} className="text-white" />
                            )}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>

                  <div className="flex gap-4 mt-4">
                    <button
                      onClick={() => setStep(2)}
                      disabled={loading}
                      className="flex-1 bg-white border-2 border-slate-100 hover:border-slate-200 text-navy font-bold py-3 rounded-2xl transition-all flex items-center justify-center gap-2 text-base"
                    >
                      <ChevronLeft size={18} />
                      Back
                    </button>
                    <button
                      onClick={handleComplete}
                      disabled={!formData.preparationLevel || loading}
                      className="flex-2 bg-primary hover:bg-primary-dark text-white font-bold py-3 rounded-2xl shadow-lg shadow-primary/20 transition-all disabled:opacity-50 flex items-center justify-center gap-2 text-base"
                    >
                      {loading ? <Loader2 className="animate-spin" /> : "Complete Setup"}
                      {!loading && <CheckCircle2 size={18} />}
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
