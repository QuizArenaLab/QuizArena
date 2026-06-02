/**
 * QuizArena — Profile Page
 *
 * Displays personal competitive identity, achievements, and progress.
 */
import { auth } from "@/auth/auth";
import { redirect } from "next/navigation";
import { ROUTES } from '@/constants/routes';
import { prisma } from "@/lib/prisma";

import { ProfileHero } from "@/features/profile/components/ProfileHero";
import { PreparationPreferences } from "@/features/profile/components/PreparationPreferences";

import { CompetitiveRecord } from "@/features/profile/components/CompetitiveRecord";
import { BadgeCollection } from "@/features/profile/components/BadgeCollection";
import { RecentActivity } from "@/features/profile/components/RecentActivity";

export default async function ProfilePage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect(ROUTES.AUTH.SIGN_IN);
  }

  // Fetch full user details from the database
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  if (!user) {
    redirect(ROUTES.AUTH.SIGN_IN);
  }

  const isGoogle = !!user.image && user.image.includes("googleusercontent.com");

  const heroUser = {
    name: user.name || null,
    username: user.username || null,
    image: user.image || null,
    role: user.role || "USER",
    examCategory: user.examCategory || null,
    createdAt: (user as any).createdAt ? new Date((user as any).createdAt) : new Date(),
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* 1. Profile Hero */}
      <ProfileHero user={heroUser} isGoogleUser={isGoogle} />

      {/* 2. Preparation Preferences */}
      <PreparationPreferences user={user} />

      {/* Competitive Record */}
      <CompetitiveRecord
        competitionsPlayed={0}
        bestNationalRank={null}
        currentNationalRank={null}
        bestPercentile={null}
        leaderboardAppearances={0}
        highestStreak={0}
        badgesEarned={0}
      />

      {/* Badge Collection */}
      <BadgeCollection />

      {/* Recent Activity */}
      <RecentActivity />
    </div>
  );
}
