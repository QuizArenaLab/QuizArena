import React from "react";
import { BaseField } from "../shared/BaseField";
import { DateManifest } from "../../registry/DateManifest";

export interface DurationPickerProps {
  name: string;
  disabled?: boolean;
  required?: boolean;
}

const durationPickerManifest: DateManifest = {
  id: "core-durationpicker",
  name: "DurationPicker",
  category: "duration",
  version: "1.0.0",
  variant: "default",
  capabilities: {
    range: false,
    multiple: false,
    presets: false,
    timezone: false,
    duration: true,
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

export function DurationPicker({ name, disabled, required }: DurationPickerProps) {
  return (
    <BaseField
      name={name}
      controlled={true}
      manifest={durationPickerManifest}
      disabled={disabled}
      required={required}
    >
      {(context) => (
        <div className="flex flex-col space-y-2">
          <div
            className={`flex items-center gap-2 ${context.isDisabled ? "opacity-50 pointer-events-none" : ""}`}
          >
            <input
              type="number"
              placeholder="DD"
              className="border rounded px-2 py-1 w-12 text-sm"
            />
            <span>:</span>
            <input
              type="number"
              placeholder="HH"
              className="border rounded px-2 py-1 w-12 text-sm"
            />
            <span>:</span>
            <input
              type="number"
              placeholder="MM"
              className="border rounded px-2 py-1 w-12 text-sm"
            />
            <span>:</span>
            <input
              type="number"
              placeholder="SS"
              className="border rounded px-2 py-1 w-12 text-sm"
            />
          </div>
          {context.error && <span className="text-red-500 text-xs">{context.error}</span>}
        </div>
      )}
    </BaseField>
  );
}
