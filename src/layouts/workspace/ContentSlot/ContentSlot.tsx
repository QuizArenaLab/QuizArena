import React from "react";
import { ContentSlotProps } from "./ContentSlot.types";

export function ContentSlot({ children }: ContentSlotProps) {
  return <>{children}</>;
}

ContentSlot.slotId = "content";
