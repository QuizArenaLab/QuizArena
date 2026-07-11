import React, { useState } from "react";
import { BaseField } from "../shared";
import { TextFieldProps, TextFieldInner } from "./TextField";
import { Icon } from "@/icons";

export function PasswordField(props: TextFieldProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <BaseField
      name={props.name}
      controlled={props.controlled}
      disabled={props.disabled}
      required={props.required}
      manifest={{
        id: "field-password",
        name: "PasswordField",
        category: "text",
        variant: "password",
        version: "1.0.0",
        supportsValidation: true,
        supportsLoading: true,
        supportsPrefix: true,
        supportsSuffix: true,
        supportsCounter: true,
      }}
    >
      {() => (
        <TextFieldInner
          {...props}
          type={showPassword ? "text" : "password"}
          prefix={props.prefix || <Icon name="Lock" className="w-4 h-4" />}
          suffix={
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-muted-foreground hover:text-foreground focus:outline-none"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              <Icon name={showPassword ? "EyeOff" : "Eye"} className="w-4 h-4" />
            </button>
          }
        />
      )}
    </BaseField>
  );
}
