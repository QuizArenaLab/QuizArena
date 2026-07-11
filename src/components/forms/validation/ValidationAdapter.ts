export type ValidationSeverity = "Info" | "Success" | "Warning" | "Error";

export interface ValidationIssue {
  path: string[];
  message: string;
  severity: ValidationSeverity;
}

export interface ValidationResult {
  isValid: boolean;
  issues: ValidationIssue[];
}

export interface ValidationAdapter<T = any> {
  validate(data: unknown, schema: T): Promise<ValidationResult>;
  validateSync(data: unknown, schema: T): ValidationResult;
}
