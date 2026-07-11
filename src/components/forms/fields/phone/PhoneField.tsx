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
import { Icon } from "@/icons";

export interface PhoneFieldProps {
  name: string;
  label?: ReactNode;
  description?: ReactNode;
  hint?: ReactNode;
  placeholder?: string;
  controlled?: boolean;
  disabled?: boolean;
  required?: boolean;
  prefix?: ReactNode;
  suffix?: ReactNode;
  className?: string;
}

function PhoneFieldInner({
  label,
  description,
  hint,
  placeholder,
  prefix,
  suffix,
  className,
}: Omit<PhoneFieldProps, "name" | "controlled" | "disabled" | "required">) {
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
          type="tel"
          placeholder={placeholder || "+1 (555) 000-0000"}
          validationState={validationState}
          isLoading={isLoading}
          aria-describedby={describedBy}
          {...inputProps}
        />
        <FieldSuffix>{suffix}</FieldSuffix>
      </FieldGroup>

      <FieldDescription>{description}</FieldDescription>
      <FieldError />
    </FieldWrapper>
  );
}

export function PhoneField(props: PhoneFieldProps) {
  return (
    <BaseField
      name={props.name}
      controlled={props.controlled}
      disabled={props.disabled}
      required={props.required}
      manifest={{
        id: "field-phone",
        name: "PhoneField",
        category: "phone",
        variant: "default",
        version: "1.0.0",
        supportsValidation: true,
        supportsLoading: true,
        supportsPrefix: true,
        supportsSuffix: true,
        supportsCounter: false,
      }}
    >
      {() => (
        <PhoneFieldInner
          {...props}
          prefix={props.prefix || <Icon name="Phone" className="w-4 h-4" />}
        />
      )}
    </BaseField>
  );
}
