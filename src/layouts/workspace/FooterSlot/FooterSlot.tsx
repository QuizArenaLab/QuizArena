import React from "react";
import { FooterSlotProps } from "./FooterSlot.types";

export function FooterSlot({ children }: FooterSlotProps) {
  return <>{children}</>;
}

FooterSlot.slotId = "footer";
