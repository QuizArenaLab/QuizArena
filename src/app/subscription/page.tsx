import { auth } from "@/auth/auth";
import { redirect } from "next/navigation";
import { ROUTES } from '@/constants/routes';
import { prisma } from "@/lib/prisma";
import { SubscriptionClient } from "./SubscriptionClient";

export default async function SubscriptionPage() {
  const session = await auth();

  if (!session?.user) {
    redirect(ROUTES.AUTH.SIGN_IN);
  }

  // Ensure default plans exist (Seeding for demonstration)
  let plans = await prisma.subscriptionPlan.findMany({
    orderBy: { price: "asc" },
  });

  if (plans.length === 0) {
    await prisma.subscriptionPlan.createMany({
      data: [
        {
          name: "Free Tier",
          slug: "free",
          description: "Basic access to core rankings and free challenges.",
          price: 0,
          duration: 30,
          features: ["Core Rankings", "Free Challenges", "Basic Analytics"],
        },
        {
          name: "QuizArena Premium",
          slug: "premium",
          description: "Unlock all premium challenges, deep analytics, and tournaments.",
          price: 9.99,
          duration: 30,
          features: [
            "Premium Challenges",
            "Advanced Analytics",
            "Seasonal Tournaments",
            "Priority Support",
          ],
        },
        {
          name: "Hardcore Access",
          slug: "hardcore",
          description: "Ultimate access including elite-level hardcore challenges.",
          price: 19.99,
          duration: 30,
          features: [
            "Everything in Premium",
            "Hardcore Challenge Access",
            "Pro Mentoring Sessions",
          ],
        },
      ],
    });
    plans = await prisma.subscriptionPlan.findMany({ orderBy: { price: "asc" } });
  }

  const activeSubscription = await prisma.userSubscription.findFirst({
    where: {
      userId: session.user.id,
      status: "ACTIVE",
    },
    include: { plan: true },
    orderBy: { startsAt: "desc" },
  });

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h1 className="text-3xl md:text-4xl font-bold text-navy mb-4 font-display">
            Elevate Your Competitive Edge
          </h1>
          <p className="text-gray-600">
            Choose the right plan to unlock premium challenges, advanced analytics, and exclusive
            seasonal tournaments.
          </p>
        </div>

        <SubscriptionClient plans={plans} activeSubscription={activeSubscription} />
      </div>
    </div>
  );
}
