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
  FieldGroup,
  FieldPrefix,
  FieldSuffix,
} from "../shared";
import { Input } from "../../../primitives/Input";

export interface TextFieldProps {
  name: string;
  label?: ReactNode;
  description?: ReactNode;
  hint?: ReactNode;
  placeholder?: string;
  controlled?: boolean;
  disabled?: boolean;
  required?: boolean;
  maxLength?: number;
  prefix?: ReactNode;
  suffix?: ReactNode;
  className?: string;
}

export function TextFieldInner({
  label,
  description,
  hint,
  placeholder,
  maxLength,
  prefix,
  suffix,
  className,
  ...props
}: Omit<TextFieldProps, "name" | "controlled" | "disabled" | "required"> & { type?: string }) {
  const { id, inputProps, validationState, isLoading, error, descriptionId, errorId } = useField();

  // Compute aria-describedby
  const describedBy =
    [description ? descriptionId : null, error ? errorId : null].filter(Boolean).join(" ") ||
    undefined;

  return (
    <FieldWrapper className={className}>
      <div className="flex justify-between">
        <FieldLabel>{label}</FieldLabel>
        <FieldHint>{hint}</FieldHint>
      </div>

      <FieldGroup>
        <FieldPrefix>{prefix}</FieldPrefix>
        <Input
          id={id}
          type={props.type || "text"}
          placeholder={placeholder}
          validationState={validationState}
          isLoading={isLoading}
          aria-describedby={describedBy}
          maxLength={maxLength}
          {...inputProps}
        />
        <FieldSuffix>{suffix}</FieldSuffix>
      </FieldGroup>

      <div className="flex justify-between items-start mt-1">
        <FieldDescription>{description}</FieldDescription>
        <FieldCounter maxLength={maxLength} />
      </div>

      <FieldError />
    </FieldWrapper>
  );
}

export function TextField(props: TextFieldProps) {
  return (
    <BaseField
      name={props.name}
      controlled={props.controlled}
      disabled={props.disabled}
      required={props.required}
      manifest={{
        id: "field-text",
        name: "TextField",
        category: "text",
        variant: "default",
        version: "1.0.0",
        supportsValidation: true,
        supportsLoading: true,
        supportsPrefix: true,
        supportsSuffix: true,
        supportsCounter: true,
      }}
    >
      {() => <TextFieldInner {...props} />}
    </BaseField>
  );
}
