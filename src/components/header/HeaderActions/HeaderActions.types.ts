import React, { ReactNode } from "react";

export interface HeaderActionsProps {
  className?: string;
  primaryActionOverride?: ReactNode;
  secondaryActionOverride?: ReactNode;
  overflowActionsOverride?: ReactNode[];
}
