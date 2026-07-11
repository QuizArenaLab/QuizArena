"use client";

import React from "react";
import { HeaderActionsProps } from "./HeaderActions.types";
import { ComponentRegistry } from "@/registry";
import { useHeaderActions, useHeaderResponsive } from "@/providers/HeaderProvider";

export function HeaderActions({
  className = "",
  primaryActionOverride,
  secondaryActionOverride,
  overflowActionsOverride,
}: HeaderActionsProps) {
  const contextActions = useHeaderActions();
  const { isCompact } = useHeaderResponsive();

  const primaryAction = primaryActionOverride ?? contextActions.primaryAction;
  const secondaryAction = secondaryActionOverride ?? contextActions.secondaryAction;
  const overflowActions = overflowActionsOverride ?? contextActions.overflowActions;

  if (!primaryAction && !secondaryAction && (!overflowActions || overflowActions.length === 0)) {
    return null;
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {!isCompact && secondaryAction && <div className="shrink-0">{secondaryAction}</div>}
      {primaryAction && <div className="shrink-0">{primaryAction}</div>}

      {overflowActions && overflowActions.length > 0 && (
        <div className="shrink-0 flex items-center">
          {overflowActions.map((action, index) => (
            <React.Fragment key={index}>{action}</React.Fragment>
          ))}
        </div>
      )}
    </div>
  );
}

ComponentRegistry.register({
  id: "header-actions",
  name: "HeaderActions",
  category: "header",
  version: "1.0.0",
  status: "stable",
  owner: "workspace-architecture",
});
