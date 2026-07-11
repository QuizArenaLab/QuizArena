export interface NavigationCapabilities {
  nested: boolean;
  collapsible: boolean;
  badges: boolean;
  icons: boolean;
  permissions: boolean;
  responsive: boolean;
  grouping: boolean;
}

export const DefaultCapabilities: NavigationCapabilities = {
  nested: true,
  collapsible: true,
  badges: true,
  icons: true,
  permissions: true,
  responsive: true,
  grouping: true,
};
