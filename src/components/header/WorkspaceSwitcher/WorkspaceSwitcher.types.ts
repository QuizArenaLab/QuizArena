import React from "react";
import { IconName } from "@/icons/IconRegistry";

export interface WorkspaceSwitcherProps {
  workspaceName?: string;
  workspaceDescription?: string;
  workspaceIcon?: IconName;
  className?: string;
}
