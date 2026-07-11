import React from "react";

export interface WorkspaceLayoutContract {
  Header?: React.ReactNode;
  Navigation?: React.ReactNode;
  Toolbar?: React.ReactNode;
  Content: React.ReactNode;
  Aside?: React.ReactNode;
  Footer?: React.ReactNode;
}
