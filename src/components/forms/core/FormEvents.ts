import { FormLifecycleState } from "./FormLifecycle";

export type FormEventType =
  | "FormCreated"
  | "FormChanged"
  | "FormValidated"
  | "FormSubmitted"
  | "FormReset"
  | "FormLifecycleTransitioned";

export interface FormValidatedEventPayload {
  errorCount: number;
  warningCount: number;
  infoCount: number;
  successCount: number;
  failingFields: string[];
}

export interface FormChangedEventPayload {
  fieldId: string;
  interactionCount: number;
  focusCount: number;
  blurCount: number;
  editCount: number;
}

export interface FormLifecycleTransitionedPayload {
  previousState: FormLifecycleState;
  currentState: FormLifecycleState;
  transitionDuration: number;
}

export interface UnenrichedFormEvent<T = any> {
  type: FormEventType;
  payload?: T;
}

export interface FormEvent<T = any> extends UnenrichedFormEvent<T> {
  // Analytics Telemetry
  correlationId: string;
  occurredAt: number;
  eventVersion: string;
  analyticsSchemaVersion: string;
  analyticsSource: string;
  manifestId: string;
  sessionId?: string;
  userId?: string;
  workspaceId?: string;
  tenantId?: string;
  deviceId?: string;
  locale?: string;
  timezone?: string;
}

export type FormEventListener = (event: FormEvent) => void;
