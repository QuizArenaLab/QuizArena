import React from "react";
import { BaseField } from "../shared/BaseField";
import { DateManifest } from "../../registry/DateManifest";
import { Calendar } from "./Calendar";
import { DateMode } from "./types";

export interface DatePickerProps {
  name: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  readOnly?: boolean;
}

const datePickerManifest: DateManifest = {
  id: "core-datepicker",
  name: "DatePicker",
  category: "date",
  version: "1.0.0",
  variant: "default",
  capabilities: {
    range: false,
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
  supportsPrefix: true,
  supportsSuffix: true,
  supportsCounter: false,
};

export function DatePicker({ name, placeholder, disabled, required, readOnly }: DatePickerProps) {
  return (
    <BaseField
      name={name}
      controlled={true}
      manifest={datePickerManifest}
      disabled={disabled || readOnly}
      required={required}
    >
      {(context) => {
        const { value, inputProps, error, isDisabled, id } = context;

        return (
          <div className="flex flex-col space-y-2">
            <div
              className={`flex items-center border rounded-md px-3 py-2 ${isDisabled ? "bg-gray-100 cursor-not-allowed" : "bg-white"}`}
            >
              <span className="text-sm flex-1 text-gray-700">
                {value
                  ? value instanceof Date
                    ? value.toDateString()
                    : "Invalid Date"
                  : placeholder || "Select a date"}
              </span>
              <button type="button" aria-label="Open calendar" disabled={isDisabled}>
                📅
              </button>
            </div>
            {error && (
              <span className="text-red-500 text-xs" id={context.errorId}>
                {error}
              </span>
            )}
          </div>
        );
      }}
    </BaseField>
  );
}
