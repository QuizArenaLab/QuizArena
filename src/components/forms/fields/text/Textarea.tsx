import React, { ReactNode } from "react";
import {
  BaseField,
  useField,
  FieldWrapper,
  FieldLabel,
  FieldDescription,
  FieldHint,
  FieldError,
  FieldCounter,
} from "../shared";

export interface TextareaProps {
  name: string;
  label?: ReactNode;
  description?: ReactNode;
  hint?: ReactNode;
  placeholder?: string;
  controlled?: boolean;
  disabled?: boolean;
  required?: boolean;
  maxLength?: number;
  rows?: number;
  className?: string;
}

export function Textarea(props: TextareaProps) {
  return (
    <BaseField
      name={props.name}
      controlled={props.controlled}
      disabled={props.disabled}
      required={props.required}
      manifest={{
        id: "field-textarea",
        name: "Textarea",
        category: "text",
        variant: "multiline",
        version: "1.0.0",
        supportsValidation: true,
        supportsLoading: true,
        supportsPrefix: false,
        supportsSuffix: false,
        supportsCounter: true,
      }}
    >
      {() => <TextareaInner {...props} />}
    </BaseField>
  );
}

function TextareaInner({
  label,
  description,
  hint,
  placeholder,
  maxLength,
  rows = 4,
  className,
}: Omit<TextareaProps, "name" | "controlled" | "disabled" | "required">) {
  const { id, inputProps, validationState, isLoading, error, descriptionId, errorId } = useField();

  const describedBy =
    [description ? descriptionId : null, error ? errorId : null].filter(Boolean).join(" ") ||
    undefined;

  let borderColor = "border-input";
  if (validationState === "error")
    borderColor = "border-destructive focus-visible:ring-destructive";
  else if (validationState === "success")
    borderColor = "border-green-500 focus-visible:ring-green-500";
  else if (validationState === "warning")
    borderColor = "border-amber-500 focus-visible:ring-amber-500";

  return (
    <FieldWrapper className={className}>
      <div className="flex justify-between">
        <FieldLabel>{label}</FieldLabel>
        <FieldHint>{hint}</FieldHint>
      </div>

      <div className="relative">
        <textarea
          id={id}
          placeholder={placeholder}
          aria-invalid={validationState === "error"}
          aria-busy={isLoading}
          aria-describedby={describedBy}
          maxLength={maxLength}
          rows={rows}
          className={`flex w-full rounded-md border ${borderColor} bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50`}
          {...inputProps}
        />
      </div>

      <div className="flex justify-between items-start mt-1">
        <FieldDescription>{description}</FieldDescription>
        <FieldCounter maxLength={maxLength} />
      </div>

      <FieldError />
    </FieldWrapper>
  );
}
