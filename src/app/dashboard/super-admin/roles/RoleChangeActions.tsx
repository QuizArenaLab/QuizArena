"use client";

import { useState } from "react";
import {
  promoteToModerator,
  promoteToAdmin,
  demoteToUser,
  assignSuperAdmin,
  revokeSuperAdmin,
} from "@/actions/super-admin/role-governance";
import { ArrowUpCircle, ArrowDownCircle, Shield, AlertTriangle } from "lucide-react";

interface User {
  id: string;
  name: string | null;
  username: string | null;
  email: string | null;
  role: string;
}

interface RoleChangeActionsProps {
  user: User;
  action:
    | "promoteToModerator"
    | "promoteToAdmin"
    | "assignSuperAdmin"
    | "demoteToUser"
    | "revokeSuperAdmin";
}

export function RoleChangeActions({ user, action }: RoleChangeActionsProps) {
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleAction = async (reason?: string) => {
    setLoading(true);
    try {
      let result: { success: boolean; error?: string };

      switch (action) {
        case "promoteToModerator":
          result = await promoteToModerator(user.id, reason);
          break;
        case "promoteToAdmin":
          result = await promoteToAdmin(user.id, reason);
          break;
        case "assignSuperAdmin":
          result = await assignSuperAdmin(user.id, reason);
          break;
        case "demoteToUser":
          result = await demoteToUser(user.id, reason);
          break;
        case "revokeSuperAdmin":
          result = await revokeSuperAdmin(user.id, reason);
          break;
        default:
          result = { success: false, error: "Invalid action" };
      }

      if (!result.success) {
        alert(result.error || "Action failed");
      } else {
        window.location.reload();
      }
    } catch {
      alert("An error occurred");
    } finally {
      setLoading(false);
      setShowConfirm(false);
    }
  };

  const isPromotion =
    action === "promoteToModerator" || action === "promoteToAdmin" || action === "assignSuperAdmin";
  const isHighRisk = action === "revokeSuperAdmin" || action === "demoteToUser";

  const getButtonConfig = () => {
    switch (action) {
      case "promoteToModerator":
        return { icon: ArrowUpCircle, label: "Promote", color: "blue", toRole: "Moderator" };
      case "promoteToAdmin":
        return { icon: ArrowUpCircle, label: "Promote", color: "red", toRole: "Admin" };
      case "assignSuperAdmin":
        return { icon: Shield, label: "Make Super Admin", color: "purple", toRole: "Super Admin" };
      case "demoteToUser":
        return { icon: ArrowDownCircle, label: "Demote", color: "red", toRole: "User" };
      case "revokeSuperAdmin":
        return { icon: ArrowDownCircle, label: "Revoke", color: "red", toRole: "Admin" };
      default:
        return { icon: ArrowUpCircle, label: "Change", color: "gray", toRole: "" };
    }
  };

  const config = getButtonConfig();
  const IconComponent = config.icon;

  const colorClasses = {
    blue: "bg-blue-50 text-blue-700 hover:bg-blue-100",
    red: "bg-red-50 text-red-700 hover:bg-red-100",
    purple: "bg-purple-50 text-purple-700 hover:bg-purple-100",
    gray: "bg-gray-50 text-gray-700 hover:bg-gray-100",
  };

  return (
    <>
      <button
        onClick={() => setShowConfirm(true)}
        disabled={loading}
        className={`flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-lg transition-colors disabled:opacity-50 ${colorClasses[config.color as keyof typeof colorClasses]}`}
      >
        <IconComponent className="w-3 h-3" />
        {loading ? "Loading..." : config.label}
      </button>

      {showConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <div className={`p-2 rounded-full ${isHighRisk ? "bg-red-100" : "bg-green-100"}`}>
                {isHighRisk ? (
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                ) : (
                  <Shield className="w-5 h-5 text-green-600" />
                )}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-[#0A1C40]">
                  {isPromotion ? "Confirm Promotion" : "Confirm Role Change"}
                </h3>
              </div>
            </div>

            <p className="text-gray-500 text-sm mb-4">
              {isPromotion ? (
                <>
                  You are about to promote{" "}
                  <strong>{user.name || user.username || "this user"}</strong> to{" "}
                  <strong>{config.toRole}</strong>.
                </>
              ) : (
                <>
                  You are about to change{" "}
                  <strong>{user.name || user.username || "this user"}</strong>
                  {`'s role to `}
                  <strong>{config.toRole}</strong>.
                  {isHighRisk && " This is a high-risk action that will remove privileges."}
                </>
              )}
            </p>

            <textarea
              id="reason"
              placeholder="Reason for this role change (optional)..."
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-[#E6701E]/20 focus:border-[#E6701E]"
              rows={3}
            />

            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  const reason = (document.getElementById("reason") as HTMLTextAreaElement)?.value;
                  handleAction(reason);
                }}
                className={`flex-1 px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors ${
                  isHighRisk ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"
                }`}
              >
                {isPromotion ? "Promote" : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
