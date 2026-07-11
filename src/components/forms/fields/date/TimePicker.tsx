import React from "react";
import { BaseField } from "../shared/BaseField";
import { DateManifest } from "../../registry/DateManifest";

export interface TimePickerProps {
  name: string;
  format?: "12h" | "24h";
  showSeconds?: boolean;
  disabled?: boolean;
  required?: boolean;
}

const timePickerManifest: DateManifest = {
  id: "core-timepicker",
  name: "TimePicker",
  category: "time",
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

export function TimePicker({
  name,
  format = "12h",
  showSeconds = false,
  disabled,
  required,
}: TimePickerProps) {
  return (
    <BaseField
      name={name}
      controlled={true}
      manifest={timePickerManifest}
      disabled={disabled}
      required={required}
    >
      {(context) => (
        <div className="flex flex-col space-y-2">
          <div
            className={`flex items-center border rounded-md px-3 py-2 ${context.isDisabled ? "bg-gray-100 cursor-not-allowed" : "bg-white"}`}
          >
            <span className="text-sm flex-1 text-gray-700">
              Time: {format} {showSeconds && "w/ Sec"}
            </span>
            <span>🕒</span>
          </div>
          {context.error && <span className="text-red-500 text-xs">{context.error}</span>}
        </div>
      )}
    </BaseField>
  );
}
