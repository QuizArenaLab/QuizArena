"use client";

import React, { useEffect, useState, useTransition, use, Suspense } from "react";
import {
  X,
  ShieldAlert,
  Activity,
  CreditCard,
  Clock,
  User,
  Shield,
  Target,
  AlertTriangle,
} from "lucide-react";
import {
  fetchUserCoreDetails,
  fetchUserActivityTimeline,
  fetchUserAuditLogs,
  performAdminAction,
  AdminActionPayload,
} from "@/features/admin/users/services/user-details";
import { AvatarIdentity } from "@/shared/components/AvatarIdentity";
import { useRouter } from "next/navigation";

interface InspectDrawerProps {
  userId: string | null;
  onClose: () => void;
}

export function InspectDrawer({ userId, onClose }: InspectDrawerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [promises, setPromises] = useState<{
    core: Promise<any>;
    timeline: Promise<any>;
    audit: Promise<any>;
  } | null>(null);

  const [actionModal, setActionModal] = useState<{
    isOpen: boolean;
    action: "restrict" | "suspend" | "restore" | null;
  }>({
    isOpen: false,
    action: null,
  });

  const [refreshKey, setRefreshKey] = useState(0); // to force refetch

  useEffect(() => {
    if (userId) {
      setTimeout(() => setIsOpen(true), 0);
      setTimeout(() => {
        setPromises({
          core: fetchUserCoreDetails(userId),
          timeline: fetchUserActivityTimeline(userId),
          audit: fetchUserAuditLogs(userId),
        });
      }, 0);
    } else {
      setTimeout(() => setIsOpen(false), 0);
      setTimeout(() => setPromises(null), 300);
    }
  }, [userId, refreshKey]);

  if (!isOpen && !promises) return null;

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/20 z-40 transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        onClick={onClose}
      />

      <div
        className={`fixed inset-y-0 right-0 w-full max-w-[620px] bg-white z-50 shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-[#0A1C40]">User Profile</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {promises && (
            <div className="p-6 space-y-8">
              <Suspense fallback={<CoreDetailsSkeleton />}>
                <CoreDetailsView
                  promise={promises.core}
                  onAction={(action) => setActionModal({ isOpen: true, action })}
                />
              </Suspense>

              <div className="grid grid-cols-2 gap-8">
                <Suspense fallback={<TimelineSkeleton />}>
                  <TimelineView promise={promises.timeline} />
                </Suspense>

                <Suspense fallback={<TimelineSkeleton />}>
                  <AuditHistoryView promise={promises.audit} />
                </Suspense>
              </div>
            </div>
          )}
        </div>
      </div>

      {actionModal.isOpen && actionModal.action && userId && (
        <ActionModal
          action={actionModal.action}
          userId={userId}
          onClose={() => setActionModal({ isOpen: false, action: null })}
          onSuccess={() => {
            setActionModal({ isOpen: false, action: null });
            setRefreshKey((k) => k + 1);
          }}
        />
      )}
    </>
  );
}

function CoreDetailsSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="flex space-x-4">
        <div className="rounded-full bg-gray-200 h-16 w-16"></div>
        <div className="flex-1 space-y-4 py-1">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
      <div className="h-24 bg-gray-100 rounded-xl"></div>
      <div className="h-32 bg-gray-100 rounded-xl"></div>
    </div>
  );
}

function TimelineSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex gap-3">
          <div className="w-2 h-2 mt-2 rounded-full bg-gray-200 shrink-0"></div>
          <div className="space-y-2 flex-1">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-3 bg-gray-200 rounded w-1/4"></div>
          </div>
        </div>
      ))}
    </div>
  );
}

function CoreDetailsView({
  promise,
  onAction,
}: {
  promise: Promise<any>;
  onAction: (action: "restrict" | "suspend" | "restore") => void;
}) {
  const data = use(promise);

  if (!data) return <div className="text-gray-500 italic">User details not found.</div>;

  const formatDate = (date: Date | null) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getRiskSignalColor = () => {
    if (data.riskSignals.isSuspended || data.riskSignals.isRestricted) return "red";
    if (data.riskSignals.reportsReceived > 0) return "amber";
    return "green";
  };

  const riskColor = getRiskSignalColor();

  return (
    <div className="space-y-8">
      {/* Identity & Status */}
      <div className="flex items-start gap-4">
        <AvatarIdentity
          name={data.identity.name || data.identity.username}
          image={null}
          size={64}
        />
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h3 className="text-xl font-bold text-[#0A1C40]">
              {data.identity.name || "No name provided"}
            </h3>
            <span
              className={`px-2 py-0.5 text-xs font-semibold rounded border ${
                data.riskSignals.isSuspended
                  ? "bg-red-50 text-red-700 border-red-200"
                  : data.riskSignals.isRestricted
                    ? "bg-orange-50 text-orange-700 border-orange-200"
                    : "bg-green-50 text-green-700 border-green-200"
              }`}
            >
              {data.riskSignals.isSuspended
                ? "Suspended"
                : data.riskSignals.isRestricted
                  ? "Restricted"
                  : "Active"}
            </span>
          </div>
          <p className="text-sm text-gray-500 mb-2">
            @{data.identity.username} • {data.identity.email}
          </p>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 text-xs font-medium rounded bg-gray-100 text-gray-600 border border-gray-200">
              {data.identity.role}
            </span>
            <span className="text-xs text-gray-400">ID: {data.identity.id}</span>
          </div>
        </div>
      </div>

      {/* Compact User Snapshot Bar */}
      <div className="flex items-center gap-6 p-4 rounded-xl border border-gray-100 bg-gray-50 text-sm">
        <div>
          <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
            <Activity className="w-3 h-3" /> Competitions
          </p>
          <p className="font-semibold text-gray-900">{data.competitionRecord.competitionsPlayed}</p>
        </div>
        <div className="w-px h-8 bg-gray-200"></div>
        <div>
          <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
            <Target className="w-3 h-3" /> Current Rank
          </p>
          <p className="font-semibold text-gray-900">
            {data.competitionRecord.currentRank || "N/A"}
          </p>
        </div>
        <div className="w-px h-8 bg-gray-200"></div>
        <div>
          <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
            <CreditCard className="w-3 h-3" /> Subscription
          </p>
          <p className="font-semibold text-[#E6701E]">{data.subscription.currentPlan}</p>
        </div>
        <div className="w-px h-8 bg-gray-200"></div>
        <div>
          <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
            <Clock className="w-3 h-3" /> Last Active
          </p>
          <p className="font-semibold text-gray-900">{formatDate(data.lastActiveAt)}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Risk Signals */}
        <div
          className={`p-4 rounded-xl border ${
            riskColor === "red"
              ? "bg-red-50/50 border-red-200"
              : riskColor === "amber"
                ? "bg-amber-50/50 border-amber-200"
                : "bg-emerald-50/50 border-emerald-200"
          }`}
        >
          <h4
            className={`text-xs font-bold uppercase flex items-center gap-1.5 mb-3 ${
              riskColor === "red"
                ? "text-red-800"
                : riskColor === "amber"
                  ? "text-amber-800"
                  : "text-emerald-800"
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            {riskColor === "red"
              ? "Action Required"
              : riskColor === "amber"
                ? "Under Review"
                : "No Risk Detected"}
          </h4>
          <div className="space-y-2 text-sm">
            <p className="flex justify-between">
              <span
                className={
                  riskColor === "red"
                    ? "text-red-700"
                    : riskColor === "amber"
                      ? "text-amber-700"
                      : "text-emerald-700"
                }
              >
                Reports:
              </span>
              <span className="font-medium">{data.riskSignals.reportsReceived}</span>
            </p>
            <p className="flex justify-between">
              <span
                className={
                  riskColor === "red"
                    ? "text-red-700"
                    : riskColor === "amber"
                      ? "text-amber-700"
                      : "text-emerald-700"
                }
              >
                Flagged:
              </span>
              <span className="font-medium">{data.riskSignals.isRestricted ? "Yes" : "No"}</span>
            </p>
          </div>
        </div>

        {/* Moderation Summary */}
        <div className="p-4 rounded-xl border border-gray-100 bg-white shadow-sm">
          <h4 className="text-xs font-bold uppercase text-gray-500 flex items-center gap-1.5 mb-3">
            <AlertTriangle className="w-3.5 h-3.5" /> Moderation Summary
          </h4>
          <div className="grid grid-cols-2 gap-y-3 gap-x-2 text-sm">
            <div>
              <p className="text-gray-400 text-xs">Reports</p>
              <p className="font-medium text-gray-800">{data.moderationSummary.reportsReceived}</p>
            </div>
            <div>
              <p className="text-gray-400 text-xs">Warnings</p>
              <p className="font-medium text-gray-800">{data.moderationSummary.warningsIssued}</p>
            </div>
            <div>
              <p className="text-gray-400 text-xs">Restrictions</p>
              <p className="font-medium text-gray-800">
                {data.moderationSummary.restrictionsApplied}
              </p>
            </div>
            <div>
              <p className="text-gray-400 text-xs">Appeals</p>
              <p className="font-medium text-gray-800">{data.moderationSummary.appealsSubmitted}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Areas */}
      <div className="grid grid-cols-2 gap-6">
        {/* Quick Actions (Informational) */}
        <div>
          <h4 className="text-xs font-bold uppercase text-gray-500 mb-3">Quick Actions</h4>
          <div className="space-y-2">
            <button className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg border border-gray-100 transition-colors">
              View Full Profile
            </button>
            <button className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg border border-gray-100 transition-colors">
              Export User Data
            </button>
          </div>
        </div>

        {/* Moderation Actions (Danger) */}
        <div>
          <h4 className="text-xs font-bold uppercase text-red-500 mb-3">Moderation Actions</h4>
          <div className="space-y-2">
            <button
              onClick={() => onAction("restrict")}
              disabled={data.riskSignals.isRestricted || data.riskSignals.isSuspended}
              className="w-full text-left px-3 py-2 text-sm text-orange-700 bg-orange-50 hover:bg-orange-100 disabled:opacity-50 border border-orange-100 rounded-lg transition-colors"
            >
              Restrict User
            </button>
            <button
              onClick={() => onAction(data.riskSignals.isSuspended ? "restore" : "suspend")}
              className={`w-full text-left px-3 py-2 text-sm border rounded-lg transition-colors ${
                data.riskSignals.isSuspended
                  ? "text-green-700 bg-green-50 hover:bg-green-100 border-green-100"
                  : "text-red-700 bg-red-50 hover:bg-red-100 border-red-100"
              }`}
            >
              {data.riskSignals.isSuspended ? "Restore User" : "Suspend User"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function TimelineView({ promise }: { promise: Promise<any[]> }) {
  const events = use(promise);

  if (!events || events.length === 0)
    return <div className="text-gray-400 text-sm italic">No activity recorded.</div>;

  return (
    <div>
      <h4 className="text-xs font-bold uppercase text-gray-400 flex items-center gap-1.5 mb-4">
        <Clock className="w-3.5 h-3.5" /> Activity Timeline
      </h4>
      <div className="relative border-l border-gray-200 ml-2 space-y-4">
        {events.map((evt, idx) => (
          <div key={idx} className="relative pl-4">
            <div className="absolute left-[-5px] top-1.5 w-2 h-2 bg-blue-500 rounded-full ring-4 ring-white"></div>
            <p className="text-sm font-medium text-gray-800">{evt.label}</p>
            <p className="text-xs text-gray-400">{new Date(evt.timestamp).toLocaleString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function AuditHistoryView({ promise }: { promise: Promise<any[]> }) {
  const audits = use(promise);

  if (!audits || audits.length === 0)
    return <div className="text-gray-400 text-sm italic">No audit history.</div>;

  return (
    <div>
      <h4 className="text-xs font-bold uppercase text-gray-400 flex items-center gap-1.5 mb-4">
        <Shield className="w-3.5 h-3.5" /> Audit History
      </h4>
      <div className="relative border-l border-gray-200 ml-2 space-y-4">
        {audits.map((audit, idx) => (
          <div key={idx} className="relative pl-4">
            <div className="absolute left-[-5px] top-1.5 w-2 h-2 bg-purple-500 rounded-full ring-4 ring-white"></div>
            <p className="text-sm font-medium text-gray-800">{audit.action}</p>
            <p className="text-xs text-gray-400">
              by <span className="font-medium text-gray-600">{audit.admin}</span> •{" "}
              {new Date(audit.timestamp).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

function ActionModal({
  action,
  userId,
  onClose,
  onSuccess,
}: {
  action: "restrict" | "suspend" | "restore";
  userId: string;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const [reason, setReason] = useState("");
  const [duration, setDuration] = useState("24 Hours");
  const [notes, setNotes] = useState("");
  const [checked, setChecked] = useState(false);

  const handleSubmit = async () => {
    if (action === "suspend" && !checked) return;
    if ((action === "suspend" || action === "restrict") && !reason)
      return alert("Please select a reason.");

    startTransition(async () => {
      const payload: AdminActionPayload = {
        userId,
        action,
        reason: action === "restore" ? "Restored by admin" : reason,
        adminNotes: notes,
      };
      if (action === "restrict") payload.duration = duration;

      const res = await performAdminAction(payload);
      if (res.success) {
        router.refresh();
        onSuccess();
      } else {
        alert(res.error);
      }
    });
  };

  const isSubmitDisabled =
    isPending ||
    ((action === "suspend" || action === "restrict") && !reason) ||
    (action === "suspend" && !checked);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-60 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 animate-in zoom-in-95 duration-200">
        <div className="flex items-center gap-3 mb-4">
          <div
            className={`p-2 rounded-lg ${action === "restore" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
          >
            <ShieldAlert className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 capitalize">{action} User</h3>
        </div>

        {action === "restore" ? (
          <p className="text-sm text-gray-600 mb-6">
            Are you sure you want to restore this user? They will regain full access to the
            platform.
          </p>
        ) : (
          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Reason</label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#E6701E]/20 focus:border-[#E6701E] outline-none"
              >
                <option value="">Select a reason...</option>
                <option value="Spam">Spam</option>
                <option value="Abuse">Abuse</option>
                <option value="Investigation">Investigation</option>
                <option value="Content Violation">Content Violation</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {action === "restrict" && (
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Duration</label>
                <select
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#E6701E]/20 focus:border-[#E6701E] outline-none"
                >
                  <option value="24 Hours">24 Hours</option>
                  <option value="7 Days">7 Days</option>
                  <option value="30 Days">30 Days</option>
                  <option value="Permanent">Permanent</option>
                </select>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Admin Notes</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Internal notes for audit log..."
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm h-20 resize-none focus:ring-2 focus:ring-[#E6701E]/20 focus:border-[#E6701E] outline-none"
              />
            </div>

            {action === "suspend" && (
              <div className="flex items-start gap-2 pt-2">
                <input
                  type="checkbox"
                  id="understand"
                  checked={checked}
                  onChange={(e) => setChecked(e.target.checked)}
                  className="mt-1 rounded text-red-600 focus:ring-red-500"
                />
                <label htmlFor="understand" className="text-xs text-gray-600 leading-tight">
                  I understand this action immediately revokes user access to the platform and
                  terminates active sessions.
                </label>
              </div>
            )}
          </div>
        )}

        <div className="flex gap-3 justify-end pt-4 border-t border-gray-100">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitDisabled}
            className={`px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors disabled:opacity-50 ${
              action === "restore"
                ? "bg-green-600 hover:bg-green-700"
                : "bg-red-600 hover:bg-red-700"
            }`}
          >
            {isPending ? "Processing..." : `Confirm ${action}`}
          </button>
        </div>
      </div>
    </div>
  );
}
