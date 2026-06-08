"use client";

import { useState, useTransition, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, Trash2, Download, LogOut, X } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import { notify } from "@/shared/components/feedback/notify";
import { deleteAccountAction, logOutAction } from "@/features/user/services/account";

export function DangerZone() {
  const { data: session } = useSession();
  const router = useRouter();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [isPending, startTransition] = useTransition();
  const [pendingToast, setPendingToast] = useState<{
    id: string;
    title: string;
    desc?: string;
    reload?: boolean;
  } | null>(null);

  useEffect(() => {
    if (!isPending && pendingToast) {
      notify.success(pendingToast.title, {
        id: pendingToast.id,
        description: pendingToast.desc,
      });
      if (pendingToast.reload) {
        window.location.href = "/";
      }
      setTimeout(() => setPendingToast(null), 0);
    }
  }, [isPending, pendingToast]);

  const expectedConfirmText = "DELETE";

  const handleDelete = (e: React.FormEvent) => {
    e.preventDefault();
    if (confirmText !== expectedConfirmText) {
      notify.error(`Please type ${expectedConfirmText} to confirm`);
      return;
    }

    const actionPayload = session?.user?.username ? `${session.user.username}/delete` : "DELETE";

    const toastId = notify.loading("Deleting Account...");
    startTransition(async () => {
      try {
        const result = await deleteAccountAction(actionPayload);
        if (result.success) {
          setPendingToast({
            id: toastId,
            title: "Account Deleted",
            desc: "Your account and all associated data have been permanently removed.",
            reload: true,
          });
        } else {
          notify.error("Deletion Failed", {
            id: toastId,
            description: result.error || "We couldn't delete your account. Please try again.",
          });
        }
      } catch (err) {
        notify.error("Deletion Failed", {
          id: toastId,
          description: "An unexpected error occurred. Please try again.",
        });
      }
    });
  };

  const handleLogOut = () => {
    const toastId = notify.loading("Logging out...");
    startTransition(async () => {
      try {
        await logOutAction();
        setPendingToast({
          id: toastId,
          title: "Logged out successfully",
          reload: true,
        });
      } catch (err) {
        notify.error("Sign out encountered an issue", { id: toastId });
      } finally {
        signOut({ callbackUrl: "/login" });
      }
    });
  };

  return (
    <>
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sm:p-8 transition-all duration-300 hover:shadow-md">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 pb-6 border-b border-gray-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-navy" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-navy tracking-tight">Account Controls</h3>
              <p className="text-sm text-gray-500 mt-0.5">Manage account ownership and data.</p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-5 bg-gray-50 rounded-2xl border border-gray-100 gap-4">
            <div>
              <p className="text-sm font-bold text-navy">Export My Data</p>
              <p className="text-xs text-gray-500 mt-1">
                Download a copy of your preparation data and analytics.
              </p>
            </div>
            <button
              disabled
              className="shrink-0 px-4 py-2 bg-gray-200 text-gray-500 text-sm font-bold rounded-xl cursor-not-allowed flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Coming Soon
            </button>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-5 bg-gray-50 rounded-2xl border border-gray-100 gap-4">
            <div>
              <p className="text-sm font-bold text-navy">Logout</p>
              <p className="text-xs text-gray-500 mt-1">
                Securely log out of your current session on this device.
              </p>
            </div>
            <button
              onClick={handleLogOut}
              disabled={isPending}
              className="shrink-0 px-4 py-2 border-2 border-gray-200 text-gray-700 hover:bg-gray-100 text-sm font-bold rounded-xl transition-all flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              {isPending ? "Logging out..." : "Logout"}
            </button>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-5 bg-red-50 rounded-2xl border border-red-100 gap-4">
            <div>
              <p className="text-sm font-bold text-red-900">Delete Account</p>
              <p className="text-xs text-red-700 mt-1">
                Permanently delete your account, preferences, and all associated data.
              </p>
            </div>
            <button
              onClick={() => setIsDeleteModalOpen(true)}
              className="shrink-0 px-4 py-2 bg-red-600 text-white hover:bg-red-700 text-sm font-bold rounded-xl transition-all flex items-center gap-2 shadow-sm"
            >
              <Trash2 className="w-4 h-4" />
              Delete Account
            </button>
          </div>
        </div>
      </div>

      {/* Delete Account Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy/40 backdrop-blur-sm transition-opacity">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in-95 duration-200 border-2 border-red-100">
            <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-red-50/50">
              <h3 className="text-lg font-bold text-red-600 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                Are you sure?
              </h3>
              <button
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setConfirmText("");
                }}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <p className="text-sm text-gray-600 mb-6 leading-relaxed">
                This action is <span className="font-bold text-red-600">irreversible</span>. It will
                delete your account, session, and all preferences.
              </p>

              <form onSubmit={handleDelete} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Please type{" "}
                    <strong className="text-red-600 bg-red-50 px-1 py-0.5 rounded select-all font-mono">
                      {expectedConfirmText}
                    </strong>{" "}
                    to confirm.
                  </label>
                  <input
                    type="text"
                    value={confirmText}
                    onChange={(e) => setConfirmText(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none transition-all font-mono"
                    placeholder={expectedConfirmText}
                    required
                  />
                </div>
                <button
                  disabled={isPending || confirmText !== expectedConfirmText}
                  className="w-full mt-4 flex items-center justify-center gap-2 py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 disabled:opacity-50 disabled:hover:bg-red-600 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  {isPending ? (
                    "Deleting..."
                  ) : (
                    <>
                      <Trash2 className="w-4 h-4" />
                      Delete Account
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
