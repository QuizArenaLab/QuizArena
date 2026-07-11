export type FormState =
  | "INITIAL"
  | "DIRTY"
  | "VALIDATING"
  | "VALID"
  | "INVALID"
  | "SUBMITTING"
  | "SUCCESS"
  | "ERROR"
  | "DISABLED";

export type DirtyState = "Pristine" | "Modified" | "Restored" | "Reset" | "Submitted";
