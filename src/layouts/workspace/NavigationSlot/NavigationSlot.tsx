import React from "react";
import { NavigationSlotProps } from "./NavigationSlot.types";

export function NavigationSlot({ children }: NavigationSlotProps) {
  return <>{children}</>;
}

NavigationSlot.slotId = "navigation";
