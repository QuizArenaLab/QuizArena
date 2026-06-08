"use client";

import React from "react";
import { UserDirectoryItem } from "@/features/admin/users/services/user-directory";
import { Users, ChevronLeft, ChevronRight, Search } from "lucide-react";

interface UserTableProps {
  users: UserDirectoryItem[];
  page: number;
  totalPages: number;
  total: number;
  limit: number;
  onPageChange: (page: number) => void;
  onInspect: (id: string) => void;
  isPending?: boolean;
}

export function UserTable({
  users,
  page,
  totalPages,
  total,
  limit,
  onPageChange,
  onInspect,
  isPending,
}: UserTableProps) {
  const formatDate = (date: Date | null) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTimeAgo = (date: Date | null) => {
    if (!date) return "Never";
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days === 0) return "Today";
    if (days === 1) return "Yesterday";
    if (days < 7) return `${days} days ago`;
    if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
    return formatDate(date);
  };

  const getHealthBadge = (health: string) => {
    switch (health) {
      case "Healthy":
        return (
          <span className="px-2 py-1 text-xs rounded-full bg-green-50 text-green-700">Healthy</span>
        );
      case "Warning":
        return (
          <span className="px-2 py-1 text-xs rounded-full bg-amber-50 text-amber-700">Warning</span>
        );
      case "Restricted":
        return (
          <span className="px-2 py-1 text-xs rounded-full bg-orange-50 text-orange-700">
            Restricted
          </span>
        );
      case "Suspended":
        return (
          <span className="px-2 py-1 text-xs rounded-full bg-red-50 text-red-700">Suspended</span>
        );
      default:
        return (
          <span className="px-2 py-1 text-xs rounded-full bg-gray-50 text-gray-600">{health}</span>
        );
    }
  };

  const getSubscriptionBadge = (sub: string) => {
    switch (sub) {
      case "Premium":
        return (
          <span className="px-2 py-1 text-xs rounded-full bg-blue-50 text-blue-700">Premium</span>
        );
      case "Challenge Pass":
        return (
          <span className="px-2 py-1 text-xs rounded-full bg-amber-50 text-amber-700">
            Challenge Pass
          </span>
        );
      default:
        return (
          <span className="px-2 py-1 text-xs rounded-full bg-gray-50 text-gray-600">Free</span>
        );
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "SUPER_ADMIN":
        return (
          <span className="text-xs px-2 py-1 rounded bg-purple-50 text-purple-700">
            SUPER_ADMIN
          </span>
        );
      case "ADMIN":
        return <span className="text-xs px-2 py-1 rounded bg-red-50 text-red-700">ADMIN</span>;
      case "MODERATOR":
        return (
          <span className="text-xs px-2 py-1 rounded bg-blue-50 text-blue-700">MODERATOR</span>
        );
      default:
        return <span className="text-xs px-2 py-1 rounded bg-gray-100 text-gray-600">{role}</span>;
    }
  };

  // Generate 5 skeleton rows
  const renderSkeletons = () => {
    return Array.from({ length: 5 }).map((_, i) => (
      <tr key={`skeleton-${i}`} className="animate-pulse">
        <td className="px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gray-200 rounded-full shrink-0"></div>
            <div className="space-y-2">
              <div className="h-3.5 bg-gray-200 rounded w-24"></div>
              <div className="h-2.5 bg-gray-200 rounded w-32"></div>
            </div>
          </div>
        </td>
        <td className="px-4 py-3">
          <div className="h-5 bg-gray-200 rounded w-16"></div>
        </td>
        <td className="px-4 py-3">
          <div className="h-5 bg-gray-200 rounded w-16"></div>
        </td>
        <td className="px-4 py-3">
          <div className="h-5 bg-gray-200 rounded w-16"></div>
        </td>
        <td className="px-4 py-3">
          <div className="h-4 bg-gray-200 rounded w-8"></div>
        </td>
        <td className="px-4 py-3">
          <div className="h-4 bg-gray-200 rounded w-16"></div>
        </td>
        <td className="px-4 py-3">
          <div className="h-4 bg-gray-200 rounded w-20"></div>
        </td>
        <td className="px-4 py-3 text-right">
          <div className="h-4 bg-gray-200 rounded w-12 ml-auto"></div>
        </td>
      </tr>
    ));
  };

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden flex flex-col h-full relative">
      {isPending && (
        <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] z-20 flex items-center justify-center">
          <div className="bg-white px-4 py-2 rounded-full shadow-md flex items-center gap-2 border border-gray-100">
            <div className="w-4 h-4 border-2 border-[#E6701E] border-t-transparent rounded-full animate-spin"></div>
            <span className="text-sm font-medium text-[#E6701E]">Searching...</span>
          </div>
        </div>
      )}

      <div className="overflow-x-auto flex-1 relative">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-100 sticky top-0 z-10">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                User
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Role
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Subscription
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                User Health
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Competitions
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Last Active
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Joined
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {isPending && users.length === 0 ? (
              renderSkeletons()
            ) : users.length > 0 ? (
              users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center shrink-0">
                        <span className="text-xs font-medium text-gray-600">
                          {user.name?.charAt(0).toUpperCase() ||
                            user.username?.charAt(0).toUpperCase() ||
                            "?"}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-[#0A1C40] leading-tight">
                          {user.name || user.username || "No name"}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          @{user.username} • {user.examCategory || "Unspecified"} •{" "}
                          {user.preparationLevel
                            ? user.preparationLevel.charAt(0) +
                              user.preparationLevel.slice(1).toLowerCase()
                            : "Beginner"}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">{getRoleBadge(user.role)}</td>
                  <td className="px-4 py-3">{getSubscriptionBadge(user.subscription)}</td>
                  <td className="px-4 py-3">{getHealthBadge(user.health)}</td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-[#0A1C40]">{user.competitions}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-gray-500">
                      {formatTimeAgo(user.lastActiveAt)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-gray-500">{formatDate(user.joinedAt)}</span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => onInspect(user.id)}
                      className="text-sm text-[#E6701E] hover:text-[#d25d15] font-medium transition-colors"
                    >
                      Inspect →
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="px-4 py-16">
                  <div className="flex flex-col items-center max-w-sm mx-auto text-center">
                    <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                      <Search className="w-6 h-6 text-gray-400" />
                    </div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-1">
                      No matching users found.
                    </h3>
                    <p className="text-sm text-gray-500 mb-6 max-w-sm">
                      There are no users matching your current filters. Try adjusting your search
                      parameters or clearing filters.
                    </p>
                    <div className="bg-gray-50 rounded-lg p-4 w-full text-left">
                      <p className="text-xs font-medium text-gray-700 mb-2">Try searching by:</p>
                      <ul className="text-xs text-gray-500 space-y-1 ml-4 list-disc marker:text-gray-400">
                        <li>Full name</li>
                        <li>Username</li>
                        <li>Email address</li>
                        <li>Exact User ID</li>
                      </ul>
                    </div>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between shrink-0 bg-white z-10 relative">
          <p className="text-sm text-gray-500">
            Showing {(page - 1) * limit + 1} to {Math.min(page * limit, total)} of {total} users
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onPageChange(page - 1)}
              disabled={page <= 1 || isPending}
              className={`p-2 rounded-lg border border-gray-200 ${
                page <= 1 || isPending ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-50"
              }`}
            >
              <ChevronLeft className="w-4 h-4 text-gray-600" />
            </button>
            <span className="text-sm text-gray-600">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => onPageChange(page + 1)}
              disabled={page >= totalPages || isPending}
              className={`p-2 rounded-lg border border-gray-200 ${
                page >= totalPages || isPending
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-gray-50"
              }`}
            >
              <ChevronRight className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
