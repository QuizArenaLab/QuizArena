import React from "react";
import { BaseField } from "../shared";
import { TextFieldProps, TextFieldInner } from "./TextField";
import { Icon } from "@/icons";

export function EmailField(props: TextFieldProps) {
  return (
    <BaseField
      name={props.name}
      controlled={props.controlled}
      disabled={props.disabled}
      required={props.required}
      manifest={{
        id: "field-email",
        name: "EmailField",
        category: "text",
        variant: "email",
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
          type="email"
          prefix={props.prefix || <Icon name="Mail" className="w-4 h-4" />}
          placeholder={props.placeholder || "you@example.com"}
        />
      )}
    </BaseField>
  );
}
