export type DateMode = "single" | "multiple" | "range" | "week" | "month" | "quarter" | "year";

export interface DateRange {
  from?: Date;
  to?: Date;
}

export type DateValue = Date | Date[] | DateRange | null;

export interface DurationValue {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export type RelativeDatePreset =
  | "Today"
  | "Yesterday"
  | "Last7Days"
  | "Last30Days"
  | "ThisWeek"
  | "LastWeek"
  | "ThisMonth"
  | "LastMonth"
  | "ThisQuarter"
  | "LastQuarter"
  | "ThisYear"
  | "Custom";

// Localization Readiness Architecture (no implementation required, just API contracts)
export interface DateLocalization {
  locale: string;
  calendarSystem: string;
  dateFormat: string;
  timeFormat: string;
  firstDayOfWeek: 0 | 1 | 2 | 3 | 4 | 5 | 6; // 0 = Sunday, 1 = Monday
}
