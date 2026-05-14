/**
 * Subscription — Placeholder Page
 *
 * Protected route — requires authentication.
 * Full implementation in Phase 6.
 */
import { auth } from "@/auth/auth";
import { redirect } from "next/navigation";
import { ROUTES } from "@/lib/routes";

export default async function SubscriptionPage() {
  const session = await auth();

  if (!session?.user) {
    redirect(ROUTES.AUTH.SIGN_IN);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <h1 className="text-2xl font-bold text-navy mb-8">Subscription</h1>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-8 text-center">
        <div className="text-4xl mb-4">💎</div>
        <h2 className="text-lg font-semibold text-gray-700 mb-2">Subscription Coming Soon</h2>
        <p className="text-gray-500 text-sm">
          Upgrade your plan for premium features and unlimited access.
        </p>
      </div>
    </div>
  );
}
