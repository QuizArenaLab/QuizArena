import React, { ReactNode } from "react";
import { BaseField, useField } from "../../shared/BaseField";
import { FieldWrapper, FieldLabel, FieldDescription, FieldHint, FieldError } from "../../shared";
import { SelectionManifest } from "../../../registry";
import {
  SelectionOptionModel,
  SelectionSearchStrategy,
  SelectionDataSourceStrategy,
} from "../shared/SelectionModels";

export interface ComboboxFieldProps {
  name: string;
  label?: ReactNode;
  options: SelectionOptionModel[];
  placeholder?: string;
  description?: ReactNode;
  hint?: ReactNode;

  // Combobox architecture
  searchable?: boolean;
  searchStrategy?: SelectionSearchStrategy;
  creatable?: boolean;
  freeTyping?: boolean;
  asyncReady?: boolean;
  dataSource?: SelectionDataSourceStrategy;

  controlled?: boolean;
  disabled?: boolean;
  required?: boolean;
  className?: string;
}

const comboboxManifest: SelectionManifest = {
  multiple: false,
  searchable: true,
  clearable: true,
  creatable: true,
  asyncReady: true,
  virtualized: false,
  version: "1.0.0",
};

function ComboboxFieldInner({
  label,
  description,
  hint,
  placeholder,
  className,
  options,
}: Omit<ComboboxFieldProps, "name" | "controlled" | "disabled" | "required">) {
  const { id, validationState, isLoading, error, descriptionId, errorId, value } = useField();

  const describedBy =
    [description ? descriptionId : null, error ? errorId : null].filter(Boolean).join(" ") ||
    undefined;

  return (
    <FieldWrapper className={className}>
      <div className="flex justify-between">
        <FieldLabel>{label}</FieldLabel>
        <FieldHint>{hint}</FieldHint>
      </div>

      <div
        id={id}
        aria-invalid={validationState === "error"}
        aria-describedby={describedBy}
        aria-busy={isLoading}
        className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <span className="text-muted-foreground">
          {value
            ? options.find((o) => o.value === value)?.label || value
            : placeholder || "Select..."}
        </span>
        <span className="text-muted-foreground">▼</span>
      </div>

      <FieldDescription>{description}</FieldDescription>
      <FieldError />
    </FieldWrapper>
  );
}

export function ComboboxField(props: ComboboxFieldProps) {
  return (
    <BaseField
      name={props.name}
      controlled={props.controlled ?? true}
      disabled={props.disabled}
      required={props.required}
      manifest={
        {
          id: "field-selection-combobox",
          name: "ComboboxField",
          category: "choice",
          variant: "combobox",
          version: "1.0.0",
          supportsValidation: true,
          supportsLoading: true,
          supportsPrefix: false,
          supportsSuffix: false,
          supportsCounter: false,
          selectionCapabilities: comboboxManifest,
        } as any
      }
    >
      {() => <ComboboxFieldInner {...props} />}
    </BaseField>
  );
}
