export type AuthenticationStatusPresentation =
  | "INITIAL"
  | "AUTHENTICATING"
  | "AUTHENTICATED"
  | "UNAUTHENTICATED"
  | "EMAIL_UNVERIFIED"
  | "PASSWORD_RESET"
  | "SESSION_EXPIRED"
  | "ACCOUNT_LOCKED"
  | "ERROR";
