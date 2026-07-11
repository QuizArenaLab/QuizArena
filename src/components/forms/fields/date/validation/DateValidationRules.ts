import { DateValue } from "../types";
import { DateAdapter } from "../adapter/DateAdapter";

export interface DateValidationRule {
  id: string;
  validate: (value: DateValue, adapter: DateAdapter) => boolean;
  message: string;
}

export const DateValidationRules = {
  required: (message = "Date is required"): DateValidationRule => ({
    id: "required",
    validate: (value) => {
      if (Array.isArray(value)) return value.length > 0;
      if (value && typeof value === "object" && "from" in value) {
        return !!value.from;
      }
      return value !== null;
    },
    message,
  }),

  minDate: (min: Date, message?: string): DateValidationRule => ({
    id: "minDate",
    validate: (value, adapter) => {
      if (!value) return true;
      if (Array.isArray(value)) {
        return value.every((d) => !adapter.isBefore(d, min));
      }
      if ("from" in (value as any)) {
        const range = value as { from?: Date; to?: Date };
        if (range.from && adapter.isBefore(range.from, min)) return false;
        if (range.to && adapter.isBefore(range.to, min)) return false;
        return true;
      }
      return !adapter.isBefore(value as Date, min);
    },
    message: message || `Date must be on or after ${min.toISOString().split("T")[0]}`,
  }),

  maxDate: (max: Date, message?: string): DateValidationRule => ({
    id: "maxDate",
    validate: (value, adapter) => {
      if (!value) return true;
      if (Array.isArray(value)) {
        return value.every((d) => !adapter.isAfter(d, max));
      }
      if ("from" in (value as any)) {
        const range = value as { from?: Date; to?: Date };
        if (range.from && adapter.isAfter(range.from, max)) return false;
        if (range.to && adapter.isAfter(range.to, max)) return false;
        return true;
      }
      return !adapter.isAfter(value as Date, max);
    },
    message: message || `Date must be on or before ${max.toISOString().split("T")[0]}`,
  }),
};
