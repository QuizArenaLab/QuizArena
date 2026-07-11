import React from "react";
import { BaseField } from "../shared";
import { NumberFieldProps, NumberFieldInner } from "./NumberField";

export interface CurrencyFieldProps extends NumberFieldProps {
  currencySymbol?: string;
  currencyCode?: string;
  locale?: string;
}

export function CurrencyField(props: CurrencyFieldProps) {
  // Use user-provided or default architecture placeholders for currency formatting
  const symbol = props.currencySymbol || "$";

  return (
    <BaseField
      name={props.name}
      controlled={props.controlled}
      disabled={props.disabled}
      required={props.required}
      manifest={{
        id: "field-currency",
        name: "CurrencyField",
        category: "number",
        variant: "currency",
        version: "1.0.0",
        supportsValidation: true,
        supportsLoading: true,
        supportsPrefix: true,
        supportsSuffix: true,
        supportsCounter: false,
      }}
    >
      {() => <NumberFieldInner {...props} prefix={props.prefix || symbol} />}
    </BaseField>
  );
}
