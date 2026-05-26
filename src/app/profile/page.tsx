/**
 * QuizArena — Profile Page
 *
 * Displays user profile with account info, auth method, and onboarding details.
 */
import { auth } from "@/auth/auth";
import { redirect } from "next/navigation";
import { ROUTES } from "@/lib/routes";
import Image from "next/image";
import { User, Mail, Shield, LogIn, Target, GraduationCap, CheckCircle, Clock } from "lucide-react";
import { EXAM_CATEGORY_LABELS, PREPARATION_LEVEL_LABELS } from "@/lib/onboarding";

export default async function ProfilePage() {
  const session = await auth();

  if (!session?.user) {
    redirect(ROUTES.AUTH.SIGN_IN);
  }

  const user = session.user;

  const isGoogle = !!user.image && !user.image.includes("gravatar") && !user.image.startsWith("/");

  const getInitials = (name: string | null | undefined) => {
    if (!name) return "?";
    return name
      .trim()
      .split(/\s+/)
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const category = user.category as keyof typeof EXAM_CATEGORY_LABELS | undefined;
  const prepLevel = user.preparationLevel as keyof typeof PREPARATION_LEVEL_LABELS | undefined;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-navy">Your Profile</h1>

      {/* Profile Card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {/* Profile Header */}
        <div className="bg-gradient-to-r from-primary/10 via-blue-50/50 to-transparent px-6 py-8 sm:px-10">
          <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
            {user.image ? (
              <Image
                src={user.image}
                alt={user.name || "User"}
                width={96}
                height={96}
                className="h-24 w-24 rounded-full object-cover border-4 border-white shadow-xl"
              />
            ) : (
              <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-3xl border-4 border-white shadow-xl">
                {getInitials(user.name)}
              </div>
            )}
            <div>
              <h2 className="text-2xl font-bold text-navy mb-1">
                {user.name || "Anonymous Aspirant"}
              </h2>
              <p className="text-gray-500 mb-4">@{user.username || "aspirant"}</p>
              <div className="flex flex-wrap justify-center sm:justify-start gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-800 uppercase tracking-wider">
                  <Shield className="w-3 h-3" />
                  {user.role === "ADMIN" ? "Administrator" : "Aspirant"}
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 uppercase tracking-wider">
                  <LogIn className="w-3 h-3" />
                  {isGoogle ? "Google" : "Credentials"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Account Info */}
        <div className="px-6 py-8 sm:px-10">
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6">
            Account Information
          </h3>
          <dl className="grid grid-cols-1 gap-y-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center pb-6 border-b border-gray-50">
              <dt className="text-sm font-medium text-gray-500 flex items-center gap-2 mb-1 sm:mb-0">
                <Mail className="w-4 h-4" /> Email Address
              </dt>
              <dd className="text-sm font-bold text-navy">{user.email || "—"}</dd>
            </div>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center pb-6 border-b border-gray-50">
              <dt className="text-sm font-medium text-gray-500 flex items-center gap-2 mb-1 sm:mb-0">
                <User className="w-4 h-4" /> Full Name
              </dt>
              <dd className="text-sm font-bold text-navy">{user.name || "Not provided"}</dd>
            </div>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
              <dt className="text-sm font-medium text-gray-500 flex items-center gap-2 mb-1 sm:mb-0">
                <Shield className="w-4 h-4" /> Account Type
              </dt>
              <dd className="text-sm font-bold text-navy">{user.role || "USER"}</dd>
            </div>
          </dl>
        </div>
      </div>

      {/* Onboarding Details */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-8 sm:px-10">
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6">
            Preparation Profile
          </h3>

          <div className="space-y-6">
            {/* Onboarding Status */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-3">
                {user.onboardingCompleted ? (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                ) : (
                  <Clock className="w-5 h-5 text-orange-500" />
                )}
                <span className="text-sm font-medium text-navy">Onboarding Status</span>
              </div>
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${
                  user.onboardingCompleted
                    ? "bg-green-100 text-green-800"
                    : "bg-orange-100 text-orange-800"
                }`}
              >
                {user.onboardingCompleted ? "Completed" : "Incomplete"}
              </span>
            </div>

            {/* Exam Category */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-3">
                <Target className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium text-navy">Target Exam</span>
              </div>
              <span className="text-sm font-bold text-navy">
                {category ? EXAM_CATEGORY_LABELS[category] : "Not set"}
              </span>
            </div>

            {/* Preparation Level */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-3">
                <GraduationCap className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium text-navy">Preparation Level</span>
              </div>
              <span className="text-sm font-bold text-navy">
                {prepLevel ? PREPARATION_LEVEL_LABELS[prepLevel] : "Not set"}
              </span>
            </div>
          </div>

          {!user.onboardingCompleted && (
            <div className="mt-6 p-4 bg-orange-50 rounded-xl border border-orange-100">
              <p className="text-sm text-orange-800">
                <span className="font-semibold">Note:</span> Your onboarding is incomplete. Update
                your profile to get personalized quiz recommendations.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Info Card */}
      <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
        <h4 className="text-sm font-bold text-navy mb-2">Profile Management</h4>
        <p className="text-xs text-gray-500 leading-relaxed">
          Profile editing and password changes will be available in a future update. Your profile
          information is managed through your authentication provider.
        </p>
      </div>
    </div>
  );
}
