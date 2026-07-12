import React from "react";
import { WidgetHeader } from "../index";
import { WidgetPlaceholder } from "../WidgetPlaceholderState";

export const PlaceholderWidget: React.FC = () => {
  return (
    <>
      <WidgetHeader />
      <WidgetPlaceholder minHeight={200} className="opacity-50 border-t border-slate-100" />
    </>
  );
};
