import React from "react";
import { WidgetHeader } from "../index";
import { WidgetComingSoonState } from "../WidgetPlaceholderState";

export const ComingSoonWidget: React.FC = () => {
  return (
    <>
      <WidgetHeader />
      <WidgetComingSoonState minHeight={200} className="border-t border-slate-100" />
    </>
  );
};
