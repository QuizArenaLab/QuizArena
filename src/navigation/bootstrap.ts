import { NavigationRegistry } from "./NavigationRegistry";
import { DefaultPermissions } from "./NavigationPermissions";

// Legacy Workspaces Ported to Navigation Manifests
NavigationRegistry.register({
  id: "user-home",
  title: "Workspace",
  icon: "LayoutDashboard",
  route: "/dashboard/home",
  permissions: [DefaultPermissions.USER],
  version: "1.0",
  registryVersion: "1.0",
  order: 10,
});

NavigationRegistry.register({
  id: "user-competitions",
  title: "Competitions",
  icon: "Trophy",
  route: "/dashboard/competitions",
  permissions: [DefaultPermissions.USER],
  version: "1.0",
  registryVersion: "1.0",
  order: 20,
});

NavigationRegistry.register({
  id: "mod-home",
  title: "Dashboard",
  icon: "LayoutDashboard",
  route: "/dashboard/home",
  permissions: [DefaultPermissions.MODERATOR],
  version: "1.0",
  registryVersion: "1.0",
  order: 10,
});

NavigationRegistry.register({
  id: "mod-manage-challenges",
  title: "Manage Challenges",
  icon: "Trophy",
  route: "/dashboard/manage-challenges",
  permissions: [DefaultPermissions.MODERATOR],
  version: "1.0",
  registryVersion: "1.0",
  order: 20,
});

NavigationRegistry.register({
  id: "admin-home",
  title: "Dashboard",
  icon: "LayoutDashboard",
  route: "/admin/dashboard",
  permissions: [DefaultPermissions.ADMIN],
  group: "OPERATIONS",
  version: "1.0",
  registryVersion: "1.0",
  order: 10,
});

NavigationRegistry.register({
  id: "sa-home",
  title: "Command Center",
  icon: "LayoutDashboard",
  route: "/dashboard/super-admin/home",
  permissions: [DefaultPermissions.SUPER_ADMIN],
  version: "1.0",
  registryVersion: "1.0",
  order: 10,
});

// Added a few more to prevent empty sidebars for roles
