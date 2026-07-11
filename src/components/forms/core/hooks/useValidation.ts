import { useState, useCallback } from "react";
import { ValidationResult, ValidationIssue } from "../../validation/ValidationAdapter";

export function useValidation() {
  const [isValid, setIsValid] = useState(true);
  const [issues, setIssues] = useState<ValidationIssue[]>([]);

  const updateValidation = useCallback((result: ValidationResult) => {
    setIsValid(result.isValid);
    setIssues(result.issues);
  }, []);

  const errors = issues.filter((i) => i.severity === "Error");
  const warnings = issues.filter((i) => i.severity === "Warning");
  const missing = issues.filter(
    (i) => i.severity === "Error" && i.message.toLowerCase().includes("required")
  ); // basic heuristic
  const info = issues.filter((i) => i.severity === "Info");
  const success = issues.filter((i) => i.severity === "Success");

  return {
    isValid,
    issues,
    errors,
    warnings,
    missing,
    info,
    success,
    updateValidation,
  };
}
