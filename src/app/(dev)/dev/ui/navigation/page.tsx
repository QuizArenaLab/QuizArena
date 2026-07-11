"use client";

import React from "react";
import { NavigationProvider } from "@/providers/NavigationProvider";
import { ResponsiveSidebar } from "@/components/navigation/ResponsiveSidebar";
import {
  NavigationRegistry,
  NavigationManifest,
  DefaultPermissions,
  NavigationDirection,
} from "@/navigation";

// Register dummy data for playground
const dummyManifests: NavigationManifest[] = [
  // Flat items
  {
    id: "home",
    title: "Home",
    icon: "Home",
    route: "/dev/ui/navigation",
    version: "1.0",
    registryVersion: "1.0",
    order: 10,
  },
  {
    id: "dashboard",
    title: "Dashboard",
    icon: "LayoutDashboard",
    route: "/dev/ui/navigation/dashboard",
    version: "1.0",
    registryVersion: "1.0",
    order: 20,
    badge: { label: "NEW", status: "success" },
  },

  // Grouped items
  {
    id: "settings",
    title: "Settings",
    icon: "Settings",
    route: "/dev/ui/navigation/settings",
    version: "1.0",
    registryVersion: "1.0",
    order: 30,
    group: "SYSTEM",
    activeIcon: "Settings2", // demonstration of active icon
  },
  {
    id: "billing",
    title: "Billing",
    icon: "CreditCard",
    route: "/dev/ui/navigation/billing",
    version: "1.0",
    registryVersion: "1.0",
    order: 40,
    group: "SYSTEM",
    badge: { count: 3, status: "error" },
  },

  // Deep Nesting
  {
    id: "org",
    title: "Organization",
    icon: "Building",
    route: "/dev/ui/navigation/org",
    version: "1.0",
    registryVersion: "1.0",
    order: 50,
    group: "ADMIN",
  },
  {
    id: "org-users",
    title: "Users",
    route: "/dev/ui/navigation/org/users",
    version: "1.0",
    registryVersion: "1.0",
    parent: "org",
    order: 10,
  },
  {
    id: "org-users-active",
    title: "Active",
    route: "/dev/ui/navigation/org/users/active",
    version: "1.0",
    registryVersion: "1.0",
    parent: "org-users",
    order: 10,
  },
  {
    id: "org-roles",
    title: "Roles",
    route: "/dev/ui/navigation/org/roles",
    version: "1.0",
    registryVersion: "1.0",
    parent: "org",
    order: 20,
    permissions: [DefaultPermissions.SUPER_ADMIN],
  },
];

dummyManifests.forEach((m) => NavigationRegistry.register(m));

// Large Navigation items
for (let i = 1; i <= 20; i++) {
  NavigationRegistry.register({
    id: `large-nav-${i}`,
    title: `Item ${i}`,
    icon: "FileText",
    route: `/dev/ui/navigation/item-${i}`,
    version: "1.0",
    registryVersion: "1.0",
    group: "LARGE NAVIGATION",
    order: 100 + i,
  });
}

export default function NavigationPlayground() {
  const [role, setRole] = React.useState<string>(DefaultPermissions.USER);
  const [direction, setDirection] = React.useState<NavigationDirection>("LTR");

  const resolvedGroups = NavigationRegistry.resolveTree([role]);

  return (
    <div
      className={`flex h-screen bg-gray-50 overflow-hidden ${direction === "RTL" ? "rtl" : "ltr"}`}
      dir={direction === "RTL" ? "rtl" : "ltr"}
    >
      <NavigationProvider defaultCollapsed={false}>
        <ResponsiveSidebar
          groups={resolvedGroups}
          currentRoute="/dev/ui/navigation"
          headerNode={
            <div className="p-4 font-bold text-lg text-primary text-center border-b border-gray-100">
              QuizArena
            </div>
          }
        />

        <main className="flex-1 p-8 overflow-y-auto">
          <h1 className="text-3xl font-bold mb-6 text-navy">Navigation Playground</h1>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-6 max-w-2xl">
            <div>
              <h2 className="text-xl font-bold mb-4">Controls</h2>
              <div className="flex gap-4 items-center">
                <label className="font-semibold text-sm">Role Simulator:</label>
                <select
                  className="border rounded p-2"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                >
                  <option value={DefaultPermissions.USER}>User (Hides Super Admin items)</option>
                  <option value={DefaultPermissions.SUPER_ADMIN}>Super Admin (Shows all)</option>
                </select>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-bold mb-4">Features Demonstrated</h2>
              <ul className="list-disc pl-5 space-y-2 text-sm text-gray-600">
                <li>
                  <strong>Deep Nesting:</strong> See &quot;Organization -&gt; Users -&gt;
                  Active&quot;
                </li>
                <li>
                  <strong>Large Navigation:</strong> Scroll down to see 20 dynamically generated
                  items.
                </li>
                <li>
                  <strong>Permission Filtering:</strong> Toggle role to Super Admin to see
                  &quot;Roles&quot; appear under Organization.
                </li>
                <li>
                  <strong>RTL Preview:</strong>{" "}
                  <button
                    onClick={() => setDirection(direction === "LTR" ? "RTL" : "LTR")}
                    className="text-primary underline"
                  >
                    Toggle RTL (Current: {direction})
                  </button>
                </li>
                <li>
                  <strong>Responsive Breakpoints:</strong> Resize the window to see Laptop
                  (collapsed) and Tablet (drawer) behaviors.
                </li>
              </ul>
            </div>
          </div>
        </main>
      </NavigationProvider>
    </div>
  );
}
