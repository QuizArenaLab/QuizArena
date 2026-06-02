import { requireMinimumRole } from "@/features/rbac/services/guards";
import { ROLES } from "@/features/rbac/services/roles";
import Link from "next/link";
import { ROUTES } from '@/constants/routes';

export default async function ModeratorDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireMinimumRole(ROLES.MODERATOR, "/dashboard");

  return (
    <div className="min-h-screen bg-[#F8F9FC]">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-8">
              <Link href="/dashboard/moderator" className="text-xl font-bold text-gray-900">
                QuizArena
              </Link>
              <nav className="hidden md:flex items-center gap-6">
                <Link
                  href={ROUTES.MODERATOR.CHALLENGES}
                  className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Challenges
                </Link>
                <Link
                  href="/dashboard/moderator/questions"
                  className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Questions
                </Link>
              </nav>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href={ROUTES.MODERATOR.CHALLENGE_CREATE}
                className="inline-flex items-center px-4 py-2 bg-[#6366F1] text-white text-sm font-medium rounded-lg hover:bg-[#4F46E5] transition-colors"
              >
                Create Challenge
              </Link>
            </div>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">{children}</main>
    </div>
  );
}
