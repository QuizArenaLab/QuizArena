export interface QuestionBrowserLayout {
  hasSidebar: boolean;
  hasToolbar: boolean;
  hasHeader: boolean;
  hasFooter: boolean;
  isCompact: boolean;
  sidebarWidth?: string; // e.g. "300px" or "w-64"
  layoutMode: "fixed" | "fluid";
}
