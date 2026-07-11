import React, { ReactNode } from "react";
import {
  BaseField,
  useField,
  FieldWrapper,
  FieldLabel,
  FieldDescription,
  FieldHint,
  FieldError,
  FieldGroup,
  FieldPrefix,
  FieldSuffix,
} from "../shared";
import { Input } from "../../../primitives/Input";

export interface NumberFieldProps {
  name: string;
  label?: ReactNode;
  description?: ReactNode;
  hint?: ReactNode;
  placeholder?: string;
  controlled?: boolean;
  disabled?: boolean;
  required?: boolean;
  min?: number;
  max?: number;
  step?: number;
  prefix?: ReactNode;
  suffix?: ReactNode;
  className?: string;
}

export function NumberFieldInner({
  label,
  description,
  hint,
  placeholder,
  min,
  max,
  step,
  prefix,
  suffix,
  className,
}: Omit<NumberFieldProps, "name" | "controlled" | "disabled" | "required">) {
  const { id, inputProps, validationState, isLoading, error, descriptionId, errorId } = useField();

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
          type="number"
          placeholder={placeholder}
          validationState={validationState}
          isLoading={isLoading}
          aria-describedby={describedBy}
          min={min}
          max={max}
          step={step}
          {...inputProps}
        />
        <FieldSuffix>{suffix}</FieldSuffix>
      </FieldGroup>

      <FieldDescription>{description}</FieldDescription>
      <FieldError />
    </FieldWrapper>
  );
}

export function NumberField(props: NumberFieldProps) {
  return (
    <BaseField
      name={props.name}
      controlled={props.controlled}
      disabled={props.disabled}
      required={props.required}
      manifest={{
        id: "field-number",
        name: "NumberField",
        category: "number",
        variant: "default",
        version: "1.0.0",
        supportsValidation: true,
        supportsLoading: true,
        supportsPrefix: true,
        supportsSuffix: true,
        supportsCounter: false,
      }}
    >
      {() => <NumberFieldInner {...props} />}
    </BaseField>
  );
}
