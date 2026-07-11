import React from "react";
import { BaseField } from "../shared/BaseField";
import { DateManifest } from "../../registry/DateManifest";
import { RelativeDatePreset } from "./types";

export interface RelativeDatePickerProps {
  name: string;
  disabled?: boolean;
  required?: boolean;
}

const relativeDatePickerManifest: DateManifest = {
  id: "core-relativedatepicker",
  name: "RelativeDatePicker",
  category: "date",
  version: "1.0.0",
  variant: "default",
  capabilities: {
    range: true,
    multiple: false,
    presets: true,
    timezone: false,
    duration: false,
    validation: true,
    keyboardNavigation: true,
    accessibility: true,
  },
  owner: "Platform Team",
  accessibility: { ariaLabels: true, keyboardNav: true },
  responsive: true,
  registryVersion: "1.0",
  supportsValidation: true,
  supportsLoading: true,
  supportsPrefix: false,
  supportsSuffix: false,
  supportsCounter: false,
};

const presets: RelativeDatePreset[] = [
  "Today",
  "Yesterday",
  "Last7Days",
  "Last30Days",
  "ThisWeek",
  "LastWeek",
  "ThisMonth",
  "LastMonth",
  "ThisQuarter",
  "LastQuarter",
  "ThisYear",
  "Custom",
];

export function RelativeDatePicker({ name, disabled, required }: RelativeDatePickerProps) {
  return (
    <BaseField
      name={name}
      controlled={true}
      manifest={relativeDatePickerManifest}
      disabled={disabled}
      required={required}
    >
      {(context) => (
        <div className="flex flex-col space-y-2 w-48">
          <select
            className={`border rounded-md px-3 py-2 text-sm ${context.isDisabled ? "bg-gray-100 cursor-not-allowed" : "bg-white"}`}
          >
            <option value="">Select relative date...</option>
            {presets.map((preset) => (
              <option key={preset} value={preset}>
                {preset.replace(/([A-Z0-9])/g, " $1").trim()}
              </option>
            ))}
          </select>
          {context.error && <span className="text-red-500 text-xs">{context.error}</span>}
        </div>
      )}
    </BaseField>
  );
}
