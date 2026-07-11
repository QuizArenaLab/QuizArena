import React from "react";
import { HeaderSlotProps } from "./HeaderSlot.types";

export function HeaderSlot({ children }: HeaderSlotProps) {
  return <>{children}</>;
}

HeaderSlot.slotId = "header";
