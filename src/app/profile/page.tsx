/**
 * QuizArena — Profile Page
 *
 * Authenticated profile view with user information display.
 */
import { auth } from "@/auth/auth";
import { redirect } from "next/navigation";
import { ROUTES } from "@/lib/routes";
import Image from "next/image";
import { User, Mail, Shield, LogIn } from "lucide-react";

export default async function ProfilePage() {
  const session = await auth();

  if (!session?.user) {
    redirect(ROUTES.AUTH.SIGN_IN);
  }

  const user = session.user;

  // Determine login provider (simplified logic for now)
  const isGoogle = !!user.image && !user.image.includes("gravatar") && !user.image.startsWith("/");

  const initials = user.name
    ? user.name
        .trim()
        .split(/\s+/)
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "?";

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 sm:py-12">
      <h1 className="text-2xl font-bold text-navy mb-8">Profile Settings</h1>

      {/* Profile Card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {/* Profile Header */}
        <div className="bg-linear-to-r from-primary/10 via-blue-50/50 to-transparent px-6 py-10 sm:px-10">
          <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
            {user.image ? (
              <Image
                src={user.image}
                alt={user.name || "User"}
                width={100}
                height={100}
                className="h-24 w-24 rounded-full object-cover border-4 border-white shadow-xl"
              />
            ) : (
              <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-4xl border-4 border-white shadow-xl">
                {initials}
              </div>
            )}
            <div>
              <h2 className="text-2xl font-bold text-navy mb-1">{user.name || "Anonymous User"}</h2>
              <p className="text-gray-500 mb-4">{user.email || "No email associated"}</p>
              <div className="flex flex-wrap justify-center sm:justify-start gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-800 uppercase tracking-wider">
                  <Shield className="w-3 h-3" />
                  {user.role === "ADMIN" ? "Administrator" : "User"}
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 uppercase tracking-wider">
                  <LogIn className="w-3 h-3" />
                  {isGoogle ? "Google Account" : "Credentials"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Details */}
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
                <Shield className="w-4 h-4" /> User Role
              </dt>
              <dd className="text-sm font-bold text-navy">{user.role}</dd>
            </div>
          </dl>

          <div className="mt-12 p-6 bg-gray-50 rounded-xl border border-gray-100">
            <h4 className="text-sm font-bold text-navy mb-2">Need to update your info?</h4>
            <p className="text-xs text-gray-500 leading-relaxed">
              Profile editing and password changes will be available in the next update. Currently,
              your profile is managed via your authentication provider.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
