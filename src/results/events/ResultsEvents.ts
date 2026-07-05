export interface ResultsEvent {
  eventId: string;
  resultId: string;
  timestamp: Date;
}

export interface ResultGenerated extends ResultsEvent {
  type: 'ResultGenerated';
}

export interface ResultViewed extends ResultsEvent {
  type: 'ResultViewed';
  userId: string;
}

export interface ResultExported extends ResultsEvent {
  type: 'ResultExported';
  format: string;
}

export interface ResultShared extends ResultsEvent {
  type: 'ResultShared';
  target: string;
}
