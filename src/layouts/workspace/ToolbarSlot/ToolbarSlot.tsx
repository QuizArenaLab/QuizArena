import React from "react";
import { ToolbarSlotProps } from "./ToolbarSlot.types";

export function ToolbarSlot({ children }: ToolbarSlotProps) {
  return <>{children}</>;
}

ToolbarSlot.slotId = "toolbar";
