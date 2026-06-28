export interface TimerThresholds {
  warningSeconds: number; // e.g. 600 for 10 mins
  criticalSeconds: number; // e.g. 120 for 2 mins
}

export interface WorkspaceConfiguration {
  showPalette: boolean;
  showTimer: boolean;
  showProgress: boolean;
  allowReviewMark: boolean;
  allowPreviousNavigation: boolean;
  requireFullscreen: boolean;
  timerThresholds: TimerThresholds;
  
  // Future capabilities
  enableCalculator?: boolean;
  enableNotes?: boolean;
}
