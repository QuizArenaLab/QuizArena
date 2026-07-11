import { z } from "zod";
import { ValidationAdapter, ValidationResult, ValidationIssue } from "./ValidationAdapter";

export class ZodAdapter implements ValidationAdapter<z.ZodType<any, any>> {
  async validate(data: unknown, schema: z.ZodType<any, any>): Promise<ValidationResult> {
    try {
      await schema.parseAsync(data);
      return { isValid: true, issues: [] };
    } catch (error) {
      if (error instanceof z.ZodError) {
        const issues: ValidationIssue[] = error.issues.map((err: z.ZodIssue) => ({
          path: err.path.map(String),
          message: err.message,
          severity: "Error",
        }));
        return { isValid: false, issues };
      }
      return {
        isValid: false,
        issues: [{ path: [], message: "Unknown validation error", severity: "Error" }],
      };
    }
  }

  validateSync(data: unknown, schema: z.ZodType<any, any>): ValidationResult {
    const result = schema.safeParse(data);
    if (result.success) {
      return { isValid: true, issues: [] };
    } else {
      const issues: ValidationIssue[] = result.error.issues.map((err: z.ZodIssue) => ({
        path: err.path.map(String),
        message: err.message,
        severity: "Error",
      }));
      return { isValid: false, issues };
    }
  }
}
