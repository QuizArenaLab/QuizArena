export interface RuntimeCommand {
  type: string;
  payload: any;
  timestamp: Date;
}

export interface StartRuntime extends RuntimeCommand {
  type: 'StartRuntime';
  payload: { artifactId: string; userId: string };
}

export interface ResumeRuntime extends RuntimeCommand {
  type: 'ResumeRuntime';
  payload: { sessionId: string };
}

export interface PauseRuntime extends RuntimeCommand {
  type: 'PauseRuntime';
  payload: { sessionId: string; reason?: string };
}

export interface SaveAnswer extends RuntimeCommand {
  type: 'SaveAnswer';
  payload: { questionId: string; answer: any };
}

export interface Navigate extends RuntimeCommand {
  type: 'Navigate';
  payload: { targetNodeId: string };
}

export interface MarkReview extends RuntimeCommand {
  type: 'MarkReview';
  payload: { questionId: string; isMarked: boolean };
}

export interface Recover extends RuntimeCommand {
  type: 'Recover';
  payload: { snapshotId: string };
}

export interface Submit extends RuntimeCommand {
  type: 'Submit';
  payload: { sessionId: string };
}

export interface Expire extends RuntimeCommand {
  type: 'Expire';
  payload: { sessionId: string };
}
