export type AuthenticationEventType =
  | "LOGIN_SUCCESS"
  | "LOGIN_FAILURE"
  | "LOGOUT"
  | "SESSION_RESTORED"
  | "PASSWORD_RESET_REQUESTED"
  | "PASSWORD_CHANGED";
export interface AuthenticationEvent {
  type: AuthenticationEventType;
  payload?: any;
}
