import React from "react";
import { BaseField } from "../shared";
import { NumberFieldProps, NumberFieldInner } from "./NumberField";
import { Icon } from "@/icons";

export function PercentageField(props: NumberFieldProps) {
  return (
    <BaseField
      name={props.name}
      controlled={props.controlled}
      disabled={props.disabled}
      required={props.required}
      manifest={{
        id: "field-percentage",
        name: "PercentageField",
        category: "number",
        variant: "percentage",
        version: "1.0.0",
        supportsValidation: true,
        supportsLoading: true,
        supportsPrefix: true,
        supportsSuffix: true,
        supportsCounter: false,
      }}
    >
      {() => (
        <NumberFieldInner
          {...props}
          suffix={props.suffix || <Icon name="Percent" className="w-4 h-4" />}
          step={props.step || 1}
        />
      )}
    </BaseField>
  );
}
