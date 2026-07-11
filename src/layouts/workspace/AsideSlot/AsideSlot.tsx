import React from "react";
import { AsideSlotProps } from "./AsideSlot.types";

export function AsideSlot({ children }: AsideSlotProps) {
  return <>{children}</>;
}

AsideSlot.slotId = "aside";
