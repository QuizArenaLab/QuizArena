import React, { ReactNode } from "react";
import { useField } from "./BaseField";
import {
  InputWrapper,
  InputLabel,
  InputDescription,
  InputHint,
  InputError,
  InputCounter,
  InputPrefix,
  InputSuffix,
  InputGroup,
  InputField,
} from "../../../primitives/Input";

export function FieldWrapper({ children, className }: { children: ReactNode; className?: string }) {
  return <InputWrapper className={className}>{children}</InputWrapper>;
}

export function FieldGroup({ children, className }: { children: ReactNode; className?: string }) {
  return <InputGroup className={className}>{children}</InputGroup>;
}

export function FieldInputContainer({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <InputField className={className}>{children}</InputField>;
}

export function FieldLabel({ children, className }: { children?: ReactNode; className?: string }) {
  const { labelId, id, isRequired } = useField();

  if (!children) return null;

  return (
    <InputLabel id={labelId} htmlFor={id} className={className}>
      {children}
      {isRequired && (
        <span className="text-destructive ml-1" aria-hidden="true">
          *
        </span>
      )}
    </InputLabel>
  );
}

export function FieldDescription({
  children,
  className,
}: {
  children?: ReactNode;
  className?: string;
}) {
  const { descriptionId } = useField();

  if (!children) return null;

  return (
    <InputDescription id={descriptionId} className={className}>
      {children}
    </InputDescription>
  );
}

export function FieldHint({ children, className }: { children?: ReactNode; className?: string }) {
  if (!children) return null;

  return <InputHint className={className}>{children}</InputHint>;
}

export function FieldError({ className }: { className?: string }) {
  const { errorId, error, validationState } = useField();

  if (!error) return null;

  return (
    <InputError id={errorId} validationState={validationState} className={className}>
      {error}
    </InputError>
  );
}

export function FieldCounter({ maxLength, className }: { maxLength?: number; className?: string }) {
  const { value } = useField();

  // Requirement: "Current, Maximum, Remaining"
  const current = typeof value === "string" ? value.length : 0;

  if (maxLength === undefined) return null;

  const remaining = maxLength - current;

  return (
    <div
      className={`flex items-center gap-2 text-[0.75rem] text-muted-foreground ml-auto ${className || ""}`}
    >
      <span>Current: {current}</span>
      <span>Remaining: {remaining}</span>
      <span>Max: {maxLength}</span>
    </div>
  );
}

export function FieldPrefix({ children, className }: { children?: ReactNode; className?: string }) {
  if (!children) return null;
  return <InputPrefix className={className}>{children}</InputPrefix>;
}

export function FieldSuffix({ children, className }: { children?: ReactNode; className?: string }) {
  if (!children) return null;
  return <InputSuffix className={className}>{children}</InputSuffix>;
}
