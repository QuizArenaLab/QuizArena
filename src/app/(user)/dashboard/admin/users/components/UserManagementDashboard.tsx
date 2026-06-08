"use client";

import React, { useState, useEffect, useCallback, useTransition, useRef } from "react";
import { UserDirectoryResponse } from "@/features/admin/users/services/user-directory";
import { UserTable } from "./UserTable";
import { InspectDrawer } from "./InspectDrawer";
import { Search } from "lucide-react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

interface UserManagementDashboardProps {
  initialData: UserDirectoryResponse;
}

const filters = [
  { id: "all", label: "All Users" },
  { id: "premium", label: "Premium Users" },
  { id: "active", label: "Active Users" },
  { id: "new", label: "New Users" },
  { id: "inactive", label: "Inactive Users" },
  { id: "flagged", label: "Flagged Users" },
  { id: "suspended", label: "Suspended Users" },
];

export function UserManagementDashboard({ initialData }: UserManagementDashboardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [isPending, startTransition] = useTransition();
  const [inspectUserId, setInspectUserId] = useState<string | null>(null);

  const currentSearch = searchParams.get("search") || "";
  const currentFilter = searchParams.get("filter") || "all";
  const [searchInput, setSearchInput] = useState(currentSearch);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const updateQueryParams = useCallback(
    (updates: Record<string, string>) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([key, value]) => {
        if (value) {
          params.set(key, value);
        } else {
          params.delete(key);
        }
      });
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [searchParams, pathname, router]
  );

  // Debounced search
  useEffect(() => {
    const handler = setTimeout(() => {
      if (searchInput !== currentSearch) {
        startTransition(() => {
          updateQueryParams({ search: searchInput, page: "1" });
        });
      }
    }, 300);

    return () => clearTimeout(handler);
  }, [searchInput, currentSearch, updateQueryParams]);

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "/" && document.activeElement !== searchInputRef.current) {
        e.preventDefault();
        searchInputRef.current?.focus();
      } else if (e.key === "Escape" && document.activeElement === searchInputRef.current) {
        setSearchInput("");
        searchInputRef.current?.blur();
      } else if (e.key === "Enter" && document.activeElement === searchInputRef.current) {
        e.preventDefault();
        startTransition(() => {
          updateQueryParams({ search: searchInput, page: "1" });
        });
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [searchInput, updateQueryParams]);

  const handleFilterClick = (filterId: string) => {
    if (currentFilter !== filterId) {
      startTransition(() => {
        updateQueryParams({ filter: filterId, page: "1" });
      });
    }
  };

  const handlePageChange = (newPage: number) => {
    startTransition(() => {
      updateQueryParams({ page: String(newPage) });
    });
  };

  return (
    <div className="space-y-6 flex flex-col h-full min-h-[calc(100vh-250px)] relative">
      {/* Sticky Search & Actions Bar */}
      <div className="sticky top-16 z-40 bg-[#F8F9FC] pb-4 pt-2 -mt-2">
        <div className="flex flex-col gap-4">
          {/* Quick Filters */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide shrink-0">
            {filters.map((f) => (
              <button
                key={f.id}
                onClick={() => handleFilterClick(f.id)}
                className={`px-4 py-1.5 text-sm font-medium rounded-full whitespace-nowrap transition-colors ${
                  currentFilter === f.id
                    ? "bg-[#0A1C40] text-white"
                    : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 shrink-0 flex flex-col gap-4">
            <div>
              <h2 className="text-sm font-semibold text-gray-900">Find User</h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Search by name, username, email, or user ID.
              </p>
            </div>

            <div className="relative w-full max-w-xl">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search by full name, username, email, or user ID..."
                className="w-full pl-10 pr-12 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#E6701E]/20 focus:border-[#E6701E]"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                <span className="text-[10px] text-gray-400 border border-gray-200 rounded px-1.5 py-0.5 bg-gray-50 font-mono">
                  /
                </span>
              </div>
            </div>

            <div className="text-xs font-medium text-gray-500">
              {isPending ? (
                <span className="text-blue-600 flex items-center gap-2">
                  <div className="w-3 h-3 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  Searching...
                </span>
              ) : initialData.total === 0 ? (
                "No Users Found"
              ) : currentSearch ? (
                `Showing ${initialData.total} Search Results`
              ) : (
                `Showing ${initialData.total} ${filters.find((f) => f.id === currentFilter)?.label || "Users"}`
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-hidden min-h-[400px]">
        <UserTable
          users={initialData.users}
          page={initialData.page}
          limit={initialData.limit}
          total={initialData.total}
          totalPages={initialData.totalPages}
          onPageChange={handlePageChange}
          onInspect={setInspectUserId}
          isPending={isPending}
        />
      </div>

      {/* Inspect Drawer */}
      <InspectDrawer userId={inspectUserId} onClose={() => setInspectUserId(null)} />
    </div>
  );
}
