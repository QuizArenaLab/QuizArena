export interface TimezoneItem {
  id: string;
  name: string;
  offset: string;
  offsetValue: number;
  tags?: string[];
}

class TimezoneRegistryService {
  private timezones: Map<string, TimezoneItem> = new Map();

  register(timezone: TimezoneItem): void {
    this.timezones.set(timezone.id, timezone);
  }

  registerBatch(timezones: TimezoneItem[]): void {
    timezones.forEach((tz) => this.timezones.set(tz.id, tz));
  }

  get(id: string): TimezoneItem | undefined {
    return this.timezones.get(id);
  }

  getAll(): TimezoneItem[] {
    return Array.from(this.timezones.values());
  }
}

export const TimezoneRegistry = new TimezoneRegistryService();
