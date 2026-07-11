import {
  format,
  parse,
  isValid as dateFnsIsValid,
  isEqual as dateFnsIsEqual,
  isAfter as dateFnsIsAfter,
  isBefore as dateFnsIsBefore,
  addDays as dateFnsAddDays,
  subDays as dateFnsSubDays,
  startOfDay as dateFnsStartOfDay,
  endOfDay as dateFnsEndOfDay,
  startOfWeek as dateFnsStartOfWeek,
  endOfWeek as dateFnsEndOfWeek,
  startOfMonth as dateFnsStartOfMonth,
  endOfMonth as dateFnsEndOfMonth,
  getDaysInMonth as dateFnsGetDaysInMonth,
} from "date-fns";
import { DateAdapter } from "./DateAdapter";

export class DateFnsAdapter implements DateAdapter {
  formatDate(date: Date, formatStr: string): string {
    return format(date, formatStr);
  }

  parseDate(dateString: string, formatStr: string): Date | null {
    const parsed = parse(dateString, formatStr, new Date());
    return dateFnsIsValid(parsed) ? parsed : null;
  }

  isValid(date: Date | null | undefined): boolean {
    if (!date) return false;
    return dateFnsIsValid(date);
  }

  isEqual(dateLeft: Date, dateRight: Date): boolean {
    return dateFnsIsEqual(dateLeft, dateRight);
  }

  isAfter(date: Date, dateToCompare: Date): boolean {
    return dateFnsIsAfter(date, dateToCompare);
  }

  isBefore(date: Date, dateToCompare: Date): boolean {
    return dateFnsIsBefore(date, dateToCompare);
  }

  addDays(date: Date, amount: number): Date {
    return dateFnsAddDays(date, amount);
  }

  subDays(date: Date, amount: number): Date {
    return dateFnsSubDays(date, amount);
  }

  startOfDay(date: Date): Date {
    return dateFnsStartOfDay(date);
  }

  endOfDay(date: Date): Date {
    return dateFnsEndOfDay(date);
  }

  startOfWeek(date: Date, weekStartsOn: 0 | 1 | 2 | 3 | 4 | 5 | 6 = 0): Date {
    return dateFnsStartOfWeek(date, { weekStartsOn });
  }

  endOfWeek(date: Date, weekStartsOn: 0 | 1 | 2 | 3 | 4 | 5 | 6 = 0): Date {
    return dateFnsEndOfWeek(date, { weekStartsOn });
  }

  startOfMonth(date: Date): Date {
    return dateFnsStartOfMonth(date);
  }

  endOfMonth(date: Date): Date {
    return dateFnsEndOfMonth(date);
  }

  getDaysInMonth(date: Date): number {
    return dateFnsGetDaysInMonth(date);
  }
}

export const dateAdapter = new DateFnsAdapter();
