export interface FreezeReport {
  warnings: string[];
  skipped: string[];
  compatibility: any;
  metrics: any;
  dependencies: string[];
  duration: number;
  integrity: any;
}
