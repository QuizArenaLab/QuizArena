"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { ROLES, type Role } from "@/features/rbac/services/roles";
import { getDashboardFocus } from "@/features/rbac/services/ui-visibility";
import { FileText, DollarSign, Shield, Trophy, Target } from "lucide-react";

interface RoleAwareDashboardHeaderProps {
  children?: React.ReactNode;
}

export function RoleAwareDashboardHeader({ children }: RoleAwareDashboardHeaderProps) {
  const { data: session } = useSession();
  const userRole = (session?.user?.role as Role) ?? ROLES.USER;
  const focus = getDashboardFocus(userRole);

  const roleConfig = {
    [ROLES.USER]: {
      icon: Target,
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600",
    },
    [ROLES.MODERATOR]: {
      icon: FileText,
      bgColor: "bg-amber-50",
      iconColor: "text-amber-600",
    },
    [ROLES.ADMIN]: {
      icon: Shield,
      bgColor: "bg-indigo-50",
      iconColor: "text-indigo-600",
    },
    [ROLES.SUPER_ADMIN]: {
      icon: DollarSign,
      bgColor: "bg-purple-50",
      iconColor: "text-purple-600",
    },
  };

  const config = roleConfig[userRole] ?? roleConfig[ROLES.USER];
  const IconComponent = config.icon;

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className={`p-2.5 ${config.bgColor} rounded-lg`}>
          <IconComponent className={`w-6 h-6 ${config.iconColor}`} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-navy">{focus.primary}</h1>
          <p className="text-sm text-gray-500">{focus.secondary}</p>
        </div>
      </div>
      {children}
    </div>
  );
}

export function RoleAwareQuickActions() {
  const { data: session } = useSession();
  const userRole = (session?.user?.role as Role) ?? ROLES.USER;
  const focus = getDashboardFocus(userRole);

  const actionHrefMap: Record<string, string> = {
    "Browse Challenges": "/challenges",
    "View Analytics": "/analytics",
    "Check Rankings": "/leaderboard",
    "Create Challenge": "/dashboard/create-challenge",
    "Manage Questions": "/dashboard/questions",
    "Review Queue": "/dashboard/content",
    "User Moderation": "/dashboard/users",
    "View Reports": "/dashboard/reports",
    "Moderator Oversight": "/dashboard/moderators",
    "Revenue Dashboard": "/dashboard/financials",
    "Role Management": "/dashboard/roles",
    "Platform Settings": "/dashboard/platform",
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {focus.quickActions.map((action) => (
        <Link
          key={action}
          href={actionHrefMap[action] || "/dashboard"}
          className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-100 hover:border-primary/30 hover:shadow-sm transition-all"
        >
          <div className="p-2 bg-gray-50 rounded-lg">
            <Trophy className="w-4 h-4 text-gray-500" />
          </div>
          <span className="text-sm font-medium text-navy">{action}</span>
        </Link>
      ))}
    </div>
  );
}

export function RoleBasedDashboardStats() {
  const { data: session } = useSession();
  const userRole = (session?.user?.role as Role) ?? ROLES.USER;

  const statsConfig = {
    [ROLES.USER]: [
      { label: "Challenges Completed", value: "0" },
      { label: "Current Streak", value: "0" },
      { label: "Accuracy Rate", value: "0%" },
      { label: "Total Points", value: "0" },
    ],
    [ROLES.MODERATOR]: [
      { label: "Active Challenges", value: "0" },
      { label: "Published", value: "0" },
      { label: "Draft", value: "0" },
      { label: "Questions", value: "0" },
    ],
    [ROLES.ADMIN]: [
      { label: "Total Users", value: "0" },
      { label: "Active Moderators", value: "0" },
      { label: "Pending Reports", value: "0" },
      { label: "Content Queue", value: "0" },
    ],
    [ROLES.SUPER_ADMIN]: [
      { label: "Total Revenue", value: "$0" },
      { label: "Active Users", value: "0" },
      { label: "Platform Health", value: "100%" },
      { label: "Admins", value: "0" },
    ],
  };

  const stats = statsConfig[userRole] ?? statsConfig[ROLES.USER];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
      {stats.map((stat) => (
        <div key={stat.label} className="text-center">
          <p className="text-3xl font-bold text-navy">{stat.value}</p>
          <p className="text-sm text-gray-500">{stat.label}</p>
        </div>
      ))}
    </div>
  );
}

export function getRoleBasedEmptyState(userRole: Role) {
  const emptyStates = {
    [ROLES.USER]: {
      title: "Welcome to QuizArena!",
      description: "Start by exploring challenges in your category.",
      action: "Browse Challenges",
      href: "/challenges",
    },
    [ROLES.MODERATOR]: {
      title: "Start creating content",
      description: "Create your first challenge to build your portfolio.",
      action: "Create Challenge",
      href: "/dashboard/create-challenge",
    },
    [ROLES.ADMIN]: {
      title: "Platform overview",
      description: "Your admin dashboard is ready. Monitor platform health here.",
      action: "View Reports",
      href: "/dashboard/reports",
    },
    [ROLES.SUPER_ADMIN]: {
      title: "Platform authority",
      description: "Full platform control and analytics at your fingertips.",
      action: "View Revenue",
      href: "/dashboard/financials",
    },
  };

  return emptyStates[userRole] ?? emptyStates[ROLES.USER];
}
