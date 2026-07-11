import React from "react";
import { RelativeDatePreset } from "../types";

export interface DatePresetProps {
  preset: RelativeDatePreset;
  label: string;
  onClick: (preset: RelativeDatePreset) => void;
  isActive?: boolean;
}

export function DatePreset({ preset, label, onClick, isActive }: DatePresetProps) {
  return (
    <button
      type="button"
      onClick={() => onClick(preset)}
      className={`text-left px-3 py-1.5 text-sm w-full rounded-md transition-colors ${
        isActive
          ? "bg-blue-50 text-blue-700 font-medium"
          : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
      }`}
    >
      {label}
    </button>
  );
}
