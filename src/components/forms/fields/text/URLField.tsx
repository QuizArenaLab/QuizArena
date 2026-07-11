import React from "react";
import { BaseField } from "../shared";
import { TextFieldProps, TextFieldInner } from "./TextField";
import { Icon } from "@/icons";

export function URLField(props: TextFieldProps) {
  return (
    <BaseField
      name={props.name}
      controlled={props.controlled}
      disabled={props.disabled}
      required={props.required}
      manifest={{
        id: "field-url",
        name: "URLField",
        category: "text",
        variant: "url",
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
          type="url"
          prefix={props.prefix || <Icon name="Link" className="w-4 h-4" />}
          placeholder={props.placeholder || "https://"}
        />
      )}
    </BaseField>
  );
}
