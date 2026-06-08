import { auth } from "@/auth/auth";
import { redirect } from "next/navigation";
import { ROUTES } from "@/constants/routes";
import { Suspense } from "react";
import {
  PrimaryMarketplace,
  SecondaryMarketplace,
  TertiaryMarketplace,
} from "./MarketplaceSections";

export default async function ChallengesPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect(ROUTES.AUTH.SIGN_IN);
  }

  return (
    <div className="min-h-screen bg-gray-50 -m-6 sm:-m-8 p-6 sm:p-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Main Content (Left Column) */}
        <div className="lg:col-span-9 space-y-12">
          <Suspense fallback={<div className="h-96 bg-gray-200 rounded-xl animate-pulse"></div>}>
            <PrimaryMarketplace userId={session.user.id} />
          </Suspense>

          <Suspense
            fallback={<div className="h-48 bg-gray-200 rounded-xl animate-pulse mt-12"></div>}
          >
            <TertiaryMarketplace />
          </Suspense>
        </div>

        {/* Right Column: Sidebar */}
        <div className="lg:col-span-3 space-y-10">
          <Suspense
            fallback={<div className="h-screen bg-gray-200 rounded-xl animate-pulse"></div>}
          >
            <SecondaryMarketplace userId={session.user.id} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
