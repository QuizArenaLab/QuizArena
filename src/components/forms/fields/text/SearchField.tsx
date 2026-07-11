import React from "react";
import { BaseField } from "../shared";
import { TextFieldProps, TextFieldInner } from "./TextField";
import { Icon } from "@/icons";

export interface SearchFieldProps extends TextFieldProps {
  debounceMs?: number; // Architecture for future debounce support
  onClear?: () => void;
}

export function SearchField(props: SearchFieldProps) {
  return (
    <BaseField
      name={props.name}
      controlled={props.controlled}
      disabled={props.disabled}
      required={props.required}
      manifest={{
        id: "field-search",
        name: "SearchField",
        category: "text",
        variant: "search",
        version: "1.0.0",
        supportsValidation: true,
        supportsLoading: true,
        supportsPrefix: true,
        supportsSuffix: true,
        supportsCounter: true,
      }}
    >
      {({ value, inputProps }) => (
        <TextFieldInner
          {...props}
          type="search"
          prefix={props.prefix || <Icon name="Search" className="w-4 h-4" />}
          suffix={
            props.suffix ||
            (value ? (
              <button
                type="button"
                onClick={() => {
                  inputProps.onChange?.({ target: { name: props.name, value: "" } });
                  props.onClear?.();
                }}
                className="text-muted-foreground hover:text-foreground focus:outline-none"
                aria-label="Clear search"
              >
                <Icon name="X" className="w-4 h-4" />
              </button>
            ) : null)
          }
          placeholder={props.placeholder || "Search..."}
        />
      )}
    </BaseField>
  );
}
