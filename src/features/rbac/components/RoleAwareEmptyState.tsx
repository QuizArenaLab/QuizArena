"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { ROLES, type Role } from "@/features/rbac/services/roles";
import { getEmptyStateMessage, type EmptyStateCategory } from "@/features/rbac/services/ui-visibility";
import { FileQuestion, FolderOpen, ClipboardList, DollarSign } from "lucide-react";

interface RoleAwareEmptyStateProps {
  category: EmptyStateCategory;
  icon?: "challenges" | "questions" | "reports" | "revenue";
  actionHref?: string;
}

const iconMap = {
  challenges: FolderOpen,
  questions: FileQuestion,
  reports: ClipboardList,
  revenue: DollarSign,
};

export function RoleAwareEmptyState({
  category,
  icon = "challenges",
  actionHref,
}: RoleAwareEmptyStateProps) {
  const { data: session } = useSession();
  const userRole = (session?.user?.role as Role) ?? ROLES.USER;
  const { title, description, action } = getEmptyStateMessage(category, userRole);
  const IconComponent = iconMap[icon];

  if (!title) return null;

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-12 text-center">
      <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
        <IconComponent className="w-8 h-8 text-gray-400" />
      </div>
      <h3 className="text-lg font-semibold text-navy mb-2">{title}</h3>
      <p className="text-gray-500 mb-6 max-w-sm mx-auto">{description}</p>
      {action && actionHref && (
        <Link
          href={actionHref}
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors"
        >
          {action}
        </Link>
      )}
    </div>
  );
}

export function ModeratorEmptyState({ category }: { category: EmptyStateCategory }) {
  const { data: session } = useSession();
  const userRole = (session?.user?.role as Role) ?? ROLES.USER;

  if (!hasMinimumRole(userRole, ROLES.MODERATOR)) {
    return null;
  }

  return <RoleAwareEmptyState category={category} />;
}

export function AdminEmptyState({ category }: { category: EmptyStateCategory }) {
  const { data: session } = useSession();
  const userRole = (session?.user?.role as Role) ?? ROLES.USER;

  if (!hasMinimumRole(userRole, ROLES.ADMIN)) {
    return null;
  }

  return <RoleAwareEmptyState category={category} />;
}

function hasMinimumRole(userRole: Role, minimumRole: Role): boolean {
  const hierarchy: Record<Role, number> = {
    [ROLES.USER]: 0,
    [ROLES.MODERATOR]: 1,
    [ROLES.ADMIN]: 2,
    [ROLES.SUPER_ADMIN]: 3,
  };
  return (hierarchy[userRole] ?? 0) >= (hierarchy[minimumRole] ?? 0);
}
