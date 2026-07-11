import React from "react";
import { BaseField } from "../shared/BaseField";
import { DateManifest } from "../../registry/DateManifest";

export interface TimezoneSelectorProps {
  name: string;
  disabled?: boolean;
  required?: boolean;
}

const timezoneSelectorManifest: DateManifest = {
  id: "core-timezoneselector",
  name: "TimezoneSelector",
  category: "timezone",
  version: "1.0.0",
  variant: "default",
  capabilities: {
    range: false,
    multiple: false,
    presets: true,
    timezone: true,
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

export function TimezoneSelector({ name, disabled, required }: TimezoneSelectorProps) {
  return (
    <BaseField
      name={name}
      controlled={true}
      manifest={timezoneSelectorManifest}
      disabled={disabled}
      required={required}
    >
      {(context) => (
        <div className="flex flex-col space-y-2">
          <select
            className={`border rounded-md px-3 py-2 text-sm ${context.isDisabled ? "bg-gray-100 cursor-not-allowed" : "bg-white"}`}
          >
            <option value="">Select Timezone...</option>
            <option value="UTC">UTC (GMT+0)</option>
            <option value="EST">EST (GMT-5)</option>
            <option value="PST">PST (GMT-8)</option>
          </select>
          {context.error && <span className="text-red-500 text-xs">{context.error}</span>}
        </div>
      )}
    </BaseField>
  );
}
