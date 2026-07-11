// Definitions only. No event dispatcher. No listeners.
export type HeaderEventType =
  | "HeaderMounted"
  | "HeaderUpdated"
  | "ActionClicked"
  | "ProfileOpened"
  | "WorkspaceSwitcherOpened"
  | "NotificationBellOpened";

export interface HeaderEventPayloads {
  HeaderMounted: { id: string; timestamp: number };
  HeaderUpdated: { id: string; timestamp: number };
  ActionClicked: { actionId: string; timestamp: number };
  ProfileOpened: { timestamp: number };
  WorkspaceSwitcherOpened: { timestamp: number };
  NotificationBellOpened: { timestamp: number };
}
