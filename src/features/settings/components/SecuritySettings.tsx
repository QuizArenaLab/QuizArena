"use client";

import { useState, useTransition } from "react";
import { Shield, KeyRound, CheckCircle2, Lock, X, MonitorSmartphone, Clock, LogOut } from "lucide-react";
import type { User as PrismaUser } from "@/generated/prisma";
import toast from "react-hot-toast";
import { updatePasswordAction, signOutOtherDevicesAction } from "@/features/user/services/account";

interface SecuritySettingsProps {
  user: PrismaUser & {
    accounts?: { provider: string }[];
  };
  activeSessionsCount?: number;
}

export function SecuritySettings({ user, activeSessionsCount = 1 }: SecuritySettingsProps) {
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isSignOutModalOpen, setIsSignOutModalOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const isGoogleAuth = user.accounts?.some((acc) => acc.provider === "google");
  const hasPasswordMethod = !!user.password && !isGoogleAuth;

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    startTransition(async () => {
      try {
        const result = await updatePasswordAction(password);
        if (result.success) {
          toast.success("Password updated successfully");
          setIsPasswordModalOpen(false);
          setPassword("");
          setConfirmPassword("");
        }
      } catch (err) {
        toast.error("Failed to update password");
      }
    });
  };

  const handleSignOutOtherDevices = () => {
    startTransition(async () => {
      try {
        const result = await signOutOtherDevicesAction();
        if (result.success) {
          toast.success("Other devices signed out successfully.");
          setIsSignOutModalOpen(false);
        } else {
          toast.error("Failed to sign out other devices.");
        }
      } catch (err) {
        toast.error("Failed to sign out other devices.");
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
              <Shield className="w-6 h-6 text-navy" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-navy tracking-tight">Security & Sessions</h3>
              <p className="text-sm text-gray-500 mt-0.5">
                Manage access and active devices.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl h-full border border-gray-100">
              <div>
                <p className="text-sm font-bold text-gray-700">Login Method</p>
                <div className="flex items-center gap-2 mt-1">
                  <p className="text-xs font-medium text-gray-500">
                    {isGoogleAuth ? "Google OAuth" : "Email & Password"}
                  </p>
                  <span className="text-[10px] uppercase tracking-wider font-bold text-green-700 bg-green-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    Verified
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100 h-full">
              <div className="mt-1 p-2 bg-white rounded-lg shadow-sm">
                <MonitorSmartphone className="w-4 h-4 text-gray-400" />
              </div>
              <div>
                <p className="text-sm font-bold text-navy flex items-center gap-2">
                  Current Device
                  <span className="text-[10px] uppercase tracking-wider font-bold text-green-700 bg-green-100 px-2 py-0.5 rounded-full">
                    Active
                  </span>
                </p>
                <p className="text-xs text-gray-500 mt-1">Web Browser - Windows</p>
                <p className="text-xs text-gray-400 flex items-center gap-1 mt-2">
                  <Clock className="w-3 h-3" />
                  Last login: Current Session
                </p>
                <p className="text-xs text-navy font-semibold mt-2">
                  {activeSessionsCount === 1 ? "Current Session Only" : `${activeSessionsCount} Active Sessions`}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-6 mt-6 border-t border-gray-100 flex flex-wrap gap-4 items-center">
          <button
            type="button"
            onClick={() => setIsSignOutModalOpen(true)}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-white border-2 border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 hover:text-navy hover:border-gray-300 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-sm"
          >
            <LogOut className="w-4 h-4" />
            Sign Out Other Devices
          </button>

          {hasPasswordMethod ? (
            <button
              type="button"
              onClick={() => setIsPasswordModalOpen(true)}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-white border-2 border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 hover:text-navy hover:border-gray-300 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-sm"
            >
              <KeyRound className="w-4 h-4" />
              Change Password
            </button>
          ) : (
            <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-100 flex items-center gap-3 w-fit">
              <Lock className="w-5 h-5 text-blue-400" />
              <p className="text-sm font-medium text-blue-700">Password managed by Google</p>
            </div>
          )}
        </div>
      </div>

      {/* Password Modal */}
      {isPasswordModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy/40 backdrop-blur-sm transition-opacity">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h3 className="text-lg font-bold text-navy">Change Password</h3>
              <button
                onClick={() => setIsPasswordModalOpen(false)}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <form onSubmit={handleUpdatePassword} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    New Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                    placeholder="Enter new password"
                    required
                    minLength={6}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                    placeholder="Confirm new password"
                    required
                    minLength={6}
                  />
                </div>
                <button
                  disabled={isPending || !password}
                  className="w-full mt-4 py-3 bg-navy text-white font-bold rounded-xl hover:bg-gray-800 disabled:opacity-50 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  {isPending ? "Updating..." : "Update Password"}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Sign Out Other Devices Modal */}
      {isSignOutModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy/40 backdrop-blur-sm transition-opacity">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h3 className="text-lg font-bold text-navy">Sign Out Other Devices</h3>
              <button
                onClick={() => setIsSignOutModalOpen(false)}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <p className="text-gray-600 mb-6 text-sm">
                Are you sure you want to sign out of all other active sessions? You will remain signed in on this device.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setIsSignOutModalOpen(false)}
                  className="flex-1 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-all"
                >
                  Cancel
                </button>
                <button
                  disabled={isPending}
                  onClick={handleSignOutOtherDevices}
                  className="flex-1 py-3 bg-navy text-white font-bold rounded-xl hover:bg-gray-800 disabled:opacity-50 transition-all"
                >
                  {isPending ? "Signing out..." : "Sign Out All"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
