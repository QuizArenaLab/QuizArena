import { DateValue } from "../types";
import { DateAdapter } from "../adapter/DateAdapter";
import { DateValidationRule } from "./DateValidationRules";

export interface DateValidationResult {
  isValid: boolean;
  errors: string[];
}

export class DateValidationEngine {
  private adapter: DateAdapter;

  constructor(adapter: DateAdapter) {
    this.adapter = adapter;
  }

  validate(value: DateValue, rules: DateValidationRule[]): DateValidationResult {
    const errors: string[] = [];

    for (const rule of rules) {
      if (!rule.validate(value, this.adapter)) {
        errors.push(rule.message);
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}
