import React from "react";
import { BaseField } from "../shared/BaseField";
import { DateManifest } from "../../registry/DateManifest";

export interface QuarterPickerProps {
  name: string;
  disabled?: boolean;
  required?: boolean;
}

const quarterPickerManifest: DateManifest = {
  id: "core-quarterpicker",
  name: "QuarterPicker",
  category: "date",
  version: "1.0.0",
  variant: "default",
  capabilities: {
    range: false,
    multiple: false,
    presets: false,
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

export function QuarterPicker({ name, disabled, required }: QuarterPickerProps) {
  return (
    <BaseField
      name={name}
      controlled={true}
      manifest={quarterPickerManifest}
      disabled={disabled}
      required={required}
    >
      {(context) => (
        <div className="flex flex-col space-y-2">
          <div
            className={`flex items-center border rounded-md px-3 py-2 ${context.isDisabled ? "bg-gray-100 cursor-not-allowed" : "bg-white"}`}
          >
            <span className="text-sm flex-1 text-gray-700">Select Quarter</span>
            <span>📅</span>
          </div>
          {context.error && <span className="text-red-500 text-xs">{context.error}</span>}
        </div>
      )}
    </BaseField>
  );
}
