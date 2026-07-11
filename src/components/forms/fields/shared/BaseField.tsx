import React, { createContext, useContext, ReactNode, useId, useEffect } from "react";
import { useQuizArenaForm } from "../../core/hooks/useQuizArenaForm";
import { FieldManifest } from "../../registry/FieldManifest";
import { FieldRegistry } from "../../registry/FieldRegistry";
import { useController, UseFormRegisterReturn, ControllerRenderProps } from "react-hook-form";

export interface BaseFieldProps {
  name: string;
  controlled?: boolean;
  manifest: FieldManifest;
  id?: string;
  defaultValue?: any;
  disabled?: boolean;
  required?: boolean;
  children: (context: FieldContextValue) => ReactNode;
}

export interface FieldContextValue {
  name: string;
  id: string;
  labelId: string;
  descriptionId: string;
  errorId: string;

  // Binding properties for the actual input primitive
  inputProps: UseFormRegisterReturn | ControllerRenderProps | any;

  // State
  value: any;

  // Validation & Lifecycle
  error?: string;
  isLoading?: boolean;
  validationState: "idle" | "success" | "warning" | "error" | "info" | "loading";
  isDisabled: boolean;
  isRequired: boolean;
}

export const FieldContext = createContext<FieldContextValue | undefined>(undefined);

export function useField() {
  const ctx = useContext(FieldContext);
  if (!ctx)
    throw new Error("useField must be used within a Field component (e.g., inside BaseField).");
  return ctx;
}

export function BaseField({
  name,
  controlled,
  manifest,
  id: externalId,
  defaultValue,
  disabled = false,
  required = false,
  children,
}: BaseFieldProps) {
  // 1. Registry
  useEffect(() => {
    FieldRegistry.register(manifest);
  }, [manifest]);

  // 2. Accessibility IDs
  const generatedId = useId();
  const id = externalId || `field-${generatedId}-${name}`;
  const labelId = `${id}-label`;
  const descriptionId = `${id}-description`;
  const errorId = `${id}-error`;

  // 3. Form Context
  let formCtx;
  try {
    formCtx = useQuizArenaForm();
  } catch (e) {
    // If not in a form context, this is a major architectural error in QuizArena,
    // but for isolated testing we might allow it if we wanted. The prompt states
    // we use a dummy FormProvider in playground, so we enforce it.
    throw e;
  }

  const { rhf, validation, lifecycle } = formCtx;

  // 4. Controlled vs Uncontrolled
  let inputProps: any = {};
  let value: any = undefined;

  if (controlled) {
    const { field } = useController({ name, control: rhf.control, defaultValue });
    inputProps = field;
    value = field.value;
  } else {
    // Uncontrolled
    inputProps = rhf.register(name, { value: defaultValue });
    value = rhf.watch(name);
  }

  // 5. Validation State & Errors
  // Check RHF built-in errors
  const rhfError = rhf.formState.errors[name];
  // Check ValidationEngine errors
  const engineIssue = validation.errors.find((e) => {
    // Basic match (string or array path)
    if (typeof e.path === "string") return e.path === name;
    if (Array.isArray(e.path)) return e.path.join(".") === name;
    return false;
  });

  const errorMessage = (rhfError?.message as string) || engineIssue?.message;

  // Async Validation Architecture
  // Check if form is validating or if there's a specific field validation running
  // (Architecture setup for future per-field async validation tracking)
  const isAsyncValidating = rhf.formState.isValidating;

  let validationState: FieldContextValue["validationState"] = "idle";

  if (isAsyncValidating && rhf.formState.isSubmitted) {
    validationState = "loading";
  } else if (errorMessage) {
    validationState = "error";
  } else if (rhf.formState.isSubmitted && !errorMessage) {
    validationState = "success";
  } else if (value !== undefined && value !== "" && !errorMessage && rhf.formState.isDirty) {
    // If touched and valid, we could show success or info
    validationState = "success";
  }

  // 6. Context Provision
  const isSubmitting = lifecycle.state === "SUBMITTING";
  const isFieldDisabled = disabled || isSubmitting;

  const contextValue: FieldContextValue = {
    name,
    id,
    labelId,
    descriptionId,
    errorId,
    inputProps,
    value,
    error: errorMessage,
    isLoading: isAsyncValidating,
    validationState,
    isDisabled: isFieldDisabled,
    isRequired: required, // In a full implementation, we'd infer from Zod schema via ValidationEngine
  };

  return (
    <FieldContext.Provider value={contextValue}>{children(contextValue)}</FieldContext.Provider>
  );
}
