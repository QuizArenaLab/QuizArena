export interface RuntimeEvent {
  eventId: string;
  timestamp: Date;
  sessionId: string;
}

export interface RuntimeInitialized extends RuntimeEvent {
  type: 'RuntimeInitialized';
  context: any;
}

export interface SessionStarted extends RuntimeEvent {
  type: 'SessionStarted';
}

export interface SessionRecovered extends RuntimeEvent {
  type: 'SessionRecovered';
  snapshot: any;
}

export interface AnswerChanged extends RuntimeEvent {
  type: 'AnswerChanged';
  questionId: string;
  answerPayload: any;
}

export interface AnswerSynced extends RuntimeEvent {
  type: 'AnswerSynced';
  questionId: string;
  syncTimestamp: Date;
}

export interface QuestionVisited extends RuntimeEvent {
  type: 'QuestionVisited';
  questionId: string;
}

export interface ReviewMarked extends RuntimeEvent {
  type: 'ReviewMarked';
  questionId: string;
  isMarked: boolean;
}

export interface ConnectionLost extends RuntimeEvent {
  type: 'ConnectionLost';
}

export interface ConnectionRecovered extends RuntimeEvent {
  type: 'ConnectionRecovered';
}

export interface SubmissionTriggered extends RuntimeEvent {
  type: 'SubmissionTriggered';
}

export interface RuntimeCompleted extends RuntimeEvent {
  type: 'RuntimeCompleted';
}
