import { auth } from "@/auth/auth";
import { redirect } from "next/navigation";
import { ROUTES } from '@/constants/routes';
import { validateInvite } from '@/features/user/services/engagement';
import Link from "next/link";
import { ShieldAlert, CheckCircle, ChevronRight } from "lucide-react";

interface InvitePageProps {
  params: Promise<{ inviteCode: string }>;
}

export default async function InviteLandingPage({ params }: InvitePageProps) {
  const session = await auth();

  // Must be logged in to accept an invite
  if (!session?.user?.id) {
    redirect(ROUTES.AUTH.SIGN_IN);
  }

  const { inviteCode } = await params;

  // Validate the invite
  const result = await validateInvite(inviteCode, session.user.id);

  if (!result.success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center max-w-md p-8 bg-white rounded-2xl border border-gray-100 shadow-sm">
          <ShieldAlert className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-navy mb-2">Invalid or Expired Invite</h2>
          <p className="text-gray-500 mb-6 text-sm">
            {result.error || "This invite link is no longer valid or has already been used."}
          </p>
          <Link
            href="/dashboard/home"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white font-semibold rounded-xl hover:bg-primary/90 transition-colors text-sm"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="text-center max-w-md p-8 bg-white rounded-2xl border border-gray-100 shadow-sm">
        <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-navy mb-2">Invite Accepted!</h2>
        <p className="text-gray-500 mb-6 text-sm">
          You have successfully joined the challenge. Good luck on the leaderboard!
        </p>
        <Link
          href={`/dashboard/challenges/${result.challengeSlug}`}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white font-semibold rounded-xl hover:bg-primary/90 transition-colors text-sm"
        >
          Proceed to Challenge <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
