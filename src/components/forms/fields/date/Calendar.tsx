import React from "react";
import { BaseField } from "../shared/BaseField";
import { DateManifest } from "../../registry/DateManifest";
import { DateMode, DateValue } from "./types";
import {
  CalendarRoot,
  CalendarGrid,
  CalendarHeader,
  CalendarNavigation,
  CalendarCell,
} from "./shared";

export interface CalendarProps {
  name: string;
  mode?: DateMode;
  disabled?: boolean;
  required?: boolean;
}

const calendarManifest: DateManifest = {
  id: "core-calendar",
  name: "Calendar",
  category: "date",
  version: "1.0.0",
  variant: "default",
  capabilities: {
    range: true,
    multiple: true,
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

export function Calendar({
  name,
  mode = "single",
  disabled = false,
  required = false,
}: CalendarProps) {
  return (
    <BaseField
      name={name}
      controlled={true}
      manifest={calendarManifest}
      disabled={disabled}
      required={required}
    >
      {(context) => {
        const { value, inputProps, error, validationState, isDisabled, id } = context;

        // Note: For a fully functioning calendar, we would use react-day-picker here.
        // This acts as the architectural wrapper connecting it to BaseField and our registries.
        return (
          <CalendarRoot className={isDisabled ? "opacity-50 pointer-events-none" : ""}>
            <CalendarHeader>
              <span className="font-semibold text-sm">October 2026</span>
              <CalendarNavigation />
            </CalendarHeader>
            <CalendarGrid>
              {/* Dummy rendering for architecture proof */}
              <tbody>
                <tr>
                  <CalendarCell isSelected={true}>15</CalendarCell>
                  <CalendarCell>16</CalendarCell>
                  <CalendarCell isToday={true}>17</CalendarCell>
                </tr>
              </tbody>
            </CalendarGrid>
            {error && <span className="text-red-500 text-xs mt-1">{error}</span>}
          </CalendarRoot>
        );
      }}
    </BaseField>
  );
}
