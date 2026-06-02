import { auth } from "@/auth/auth";
import { redirect } from "next/navigation";
import { ROUTES } from '@/constants/routes';
import { prisma } from "@/lib/prisma";

import { NotificationsReminders } from "@/features/settings/components/NotificationsReminders";
import { SecuritySettings } from "@/features/settings/components/SecuritySettings";
import { SubscriptionSettings } from "@/features/settings/components/SubscriptionSettings";
import { DangerZone as AccountControls } from "@/features/settings/components/DangerZone";

export const metadata = {
  title: "Settings | QuizArena",
  description: "Manage your preparation preferences, security, subscription, and account controls.",
};

export default async function SettingsPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect(ROUTES.AUTH.SIGN_IN);
  }

  // Fetch full user details from the database
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { accounts: true, sessions: true }
  });

  if (!user) {
    redirect(ROUTES.AUTH.SIGN_IN);
  }

  // In a real implementation, you'd fetch the actual subscription plan for the user
  const currentPlan = "Free Plan";
  const activeSessionsCount = user.sessions?.length || 1;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-500">
      <div className="mb-8 text-center sm:text-left">
        <h1 className="text-3xl font-bold text-navy mb-2">Settings</h1>
        <p className="text-gray-500">
          Manage your preparation preferences, security, subscription, and account controls.
        </p>
      </div>

      <div className="space-y-8">
        <section>
          <NotificationsReminders user={user} />
        </section>

        <section>
          <SecuritySettings user={user} activeSessionsCount={activeSessionsCount} />
        </section>

        <section>
          <SubscriptionSettings currentPlan={currentPlan} />
        </section>

        <section>
          <AccountControls />
        </section>
      </div>
    </div>
  );
}
