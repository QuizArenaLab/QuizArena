import { DateValue } from "../types";

export interface DateAdapter {
  formatDate(date: Date, formatStr: string): string;
  parseDate(dateString: string, formatStr: string): Date | null;
  isValid(date: Date | null): boolean;
  isEqual(dateLeft: Date, dateRight: Date): boolean;
  isAfter(date: Date, dateToCompare: Date): boolean;
  isBefore(date: Date, dateToCompare: Date): boolean;
  addDays(date: Date, amount: number): Date;
  subDays(date: Date, amount: number): Date;
  startOfDay(date: Date): Date;
  endOfDay(date: Date): Date;
  startOfWeek(date: Date, weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6): Date;
  endOfWeek(date: Date, weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6): Date;
  startOfMonth(date: Date): Date;
  endOfMonth(date: Date): Date;
  getDaysInMonth(date: Date): number;
}
