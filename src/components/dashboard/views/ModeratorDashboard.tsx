import { ROLES } from "@/lib/rbac/roles";
import { FolderCog, Trophy, FileText, ClipboardList, Plus } from "lucide-react";
import Link from "next/link";

export async function ModeratorDashboardView() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-amber-50 rounded-lg">
            <FolderCog className="w-6 h-6 text-amber-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-navy">Moderator Dashboard</h1>
            <p className="text-sm text-gray-500">Content management and publishing</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link
          href="/dashboard/create-challenge"
          className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-100 hover:border-primary/30 hover:shadow-sm transition-all group"
        >
          <div className="p-2.5 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
            <Plus className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="font-semibold text-navy">Create Challenge</p>
            <p className="text-xs text-gray-500">Start a new challenge</p>
          </div>
        </Link>

        <Link
          href="/dashboard/manage-challenges"
          className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-100 hover:border-primary/30 hover:shadow-sm transition-all group"
        >
          <div className="p-2.5 bg-amber-50 rounded-lg group-hover:bg-amber-100 transition-colors">
            <Trophy className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <p className="font-semibold text-navy">Manage Challenges</p>
            <p className="text-xs text-gray-500">Edit or publish challenges</p>
          </div>
        </Link>

        <Link
          href="/dashboard/questions"
          className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-100 hover:border-primary/30 hover:shadow-sm transition-all group"
        >
          <div className="p-2.5 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors">
            <FileText className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <p className="font-semibold text-navy">Question Bank</p>
            <p className="text-xs text-gray-500">Create and manage questions</p>
          </div>
        </Link>

        <Link
          href="/dashboard/content"
          className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-100 hover:border-primary/30 hover:shadow-sm transition-all group"
        >
          <div className="p-2.5 bg-green-50 rounded-lg group-hover:bg-green-100 transition-colors">
            <ClipboardList className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <p className="font-semibold text-navy">Content Queue</p>
            <p className="text-xs text-gray-500">Review pending content</p>
          </div>
        </Link>
      </div>

      {/* Stats Placeholder */}
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-navy mb-4">Content Overview</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
          <div className="text-center">
            <p className="text-3xl font-bold text-navy">0</p>
            <p className="text-sm text-gray-500">Active Challenges</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-navy">0</p>
            <p className="text-sm text-gray-500">Published</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-navy">0</p>
            <p className="text-sm text-gray-500">Draft</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-navy">0</p>
            <p className="text-sm text-gray-500">Questions</p>
          </div>
        </div>
      </div>

      {/* Empty State */}
      <div className="bg-white rounded-xl border border-gray-100 p-12 text-center">
        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <Trophy className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-navy mb-2">No challenges published yet</h3>
        <p className="text-gray-500 mb-6">Create your first challenge to get started</p>
        <Link
          href="/dashboard/create-challenge"
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Create Challenge
        </Link>
      </div>
    </div>
  );
}
