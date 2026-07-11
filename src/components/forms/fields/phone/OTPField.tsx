import React, { ReactNode } from "react";
import {
  BaseField,
  useField,
  FieldWrapper,
  FieldLabel,
  FieldDescription,
  FieldHint,
  FieldError,
} from "../shared";

export interface OTPFieldProps {
  name: string;
  label?: ReactNode;
  description?: ReactNode;
  hint?: ReactNode;
  length?: 4 | 6 | 8;
  controlled?: boolean;
  disabled?: boolean;
  required?: boolean;
  className?: string;
}

function OTPFieldInner({
  label,
  description,
  hint,
  length = 6,
  className,
}: Omit<OTPFieldProps, "name" | "controlled" | "disabled" | "required">) {
  const {
    id,
    inputProps,
    validationState,
    isLoading,
    error,
    descriptionId,
    errorId,
    value,
    isDisabled,
  } = useField();

  const describedBy =
    [description ? descriptionId : null, error ? errorId : null].filter(Boolean).join(" ") ||
    undefined;

  // Simple architecture implementation of OTP inputs
  // (In a real scenario, this would use refs to auto-focus next input, handle paste, etc.)
  // For now, we render the architecture structure.

  const otpValue = (typeof value === "string" ? value : "").padEnd(length, "");
  const digits = Array.from({ length }, (_, i) => otpValue[i] || "");

  return (
    <FieldWrapper className={className}>
      <div className="flex justify-between">
        <FieldLabel>{label}</FieldLabel>
        <FieldHint>{hint}</FieldHint>
      </div>

      <div
        className="flex items-center gap-2"
        id={id}
        aria-invalid={validationState === "error"}
        aria-busy={isLoading}
        aria-describedby={describedBy}
      >
        {digits.map((digit, index) => (
          <input
            key={index}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            disabled={isDisabled || isLoading}
            className={`w-10 h-12 text-center text-lg font-medium rounded-md border ${
              validationState === "error"
                ? "border-destructive"
                : validationState === "success"
                  ? "border-green-500"
                  : "border-input"
            } bg-transparent shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50`}
            // Simple onChange architecture mock
            onChange={(e) => {
              const newValue = e.target.value;
              const newOtpValue =
                otpValue.substring(0, index) + newValue + otpValue.substring(index + 1);
              if (inputProps.onChange) {
                // If it's a simulated event for RHF register
                inputProps.onChange({
                  target: { name: inputProps.name, value: newOtpValue.substring(0, length) },
                });
              }
            }}
            onBlur={inputProps.onBlur}
          />
        ))}
      </div>

      <FieldDescription>{description}</FieldDescription>
      <FieldError />
    </FieldWrapper>
  );
}

export function OTPField(props: OTPFieldProps) {
  return (
    <BaseField
      name={props.name}
      controlled={props.controlled}
      disabled={props.disabled}
      required={props.required}
      manifest={{
        id: "field-otp",
        name: "OTPField",
        category: "phone",
        variant: "otp",
        version: "1.0.0",
        supportsValidation: true,
        supportsLoading: true,
        supportsPrefix: false,
        supportsSuffix: false,
        supportsCounter: false,
      }}
    >
      {() => <OTPFieldInner {...props} />}
    </BaseField>
  );
}
