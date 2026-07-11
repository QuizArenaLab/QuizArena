import { createContext } from "react";
import { UseFormReturn, FieldValues } from "react-hook-form";
import { FormManifest } from "../registry/FormManifest";
import { FormLifecycleState } from "./FormLifecycle";
import { DirtyState } from "./FormState";
import { ValidationResult, ValidationIssue } from "../validation/ValidationAdapter";
import { FormEvent, UnenrichedFormEvent } from "./FormEvents";

export interface FormContextValue<TFieldValues extends FieldValues = any> {
  manifest: FormManifest;
  rhf: UseFormReturn<TFieldValues>;
  lifecycle: {
    state: FormLifecycleState;
    transition: (nextState: FormLifecycleState) => boolean;
  };
  dirty: {
    state: DirtyState;
    isDirty: boolean;
    setPristine: () => void;
    setModified: () => void;
    setRestored: () => void;
    setReset: () => void;
    setSubmitted: () => void;
  };
  validation: {
    isValid: boolean;
    issues: ValidationIssue[];
    errors: ValidationIssue[];
    warnings: ValidationIssue[];
    missing: ValidationIssue[];
    info: ValidationIssue[];
    success: ValidationIssue[];
    updateValidation: (result: ValidationResult) => void;
  };
  events: {
    dispatch: (event: UnenrichedFormEvent) => void;
  };
}

export const FormContext = createContext<FormContextValue | undefined>(undefined);
