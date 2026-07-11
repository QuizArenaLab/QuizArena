import React, { ReactNode } from "react";
import { BaseField, useField } from "../../shared/BaseField";
import { FieldWrapper, FieldLabel, FieldDescription, FieldHint, FieldError } from "../../shared";
import { SelectionManifest } from "../../../registry";
import { SelectionOptionModel, MultiSelectCategory } from "../shared/SelectionModels";

export interface MultiSelectFieldProps {
  name: string;
  label?: ReactNode;
  options: SelectionOptionModel[];
  placeholder?: string;
  description?: ReactNode;
  hint?: ReactNode;
  category?: MultiSelectCategory;

  // Advanced MultiSelect capabilities
  maxSelection?: number;
  minSelection?: number;
  preventDuplicates?: boolean;

  controlled?: boolean;
  disabled?: boolean;
  required?: boolean;
  className?: string;
}

const multiSelectManifest: SelectionManifest = {
  multiple: true,
  searchable: true,
  clearable: true,
  creatable: false,
  asyncReady: false,
  virtualized: false,
  version: "1.0.0",
};

// Simplified Architecture Implementation of MultiSelect
// Real implementation uses Combobox (Popover + cmdk/input wrapper)
function MultiSelectFieldInner({
  label,
  description,
  hint,
  placeholder,
  className,
  options,
}: Omit<MultiSelectFieldProps, "name" | "controlled" | "disabled" | "required">) {
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
        className="flex min-h-10 w-full flex-wrap items-center gap-2 rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {/* Mock Chips */}
        {Array.isArray(value) &&
          value.map((val: string) => (
            <span
              key={val}
              className="inline-flex items-center gap-1 rounded bg-secondary px-2 py-0.5 text-xs font-semibold text-secondary-foreground"
            >
              {options.find((o) => o.value === val)?.label || val}
              <button
                type="button"
                className="text-muted-foreground hover:text-foreground outline-none"
              >
                ×
              </button>
            </span>
          ))}
        {(!value || value.length === 0) && (
          <span className="text-muted-foreground">{placeholder || "Select multiple..."}</span>
        )}
      </div>

      <FieldDescription>{description}</FieldDescription>
      <FieldError />
    </FieldWrapper>
  );
}

export function MultiSelectField(props: MultiSelectFieldProps) {
  return (
    <BaseField
      name={props.name}
      controlled={props.controlled ?? true}
      disabled={props.disabled}
      required={props.required}
      manifest={
        {
          id: "field-selection-multiselect",
          name: "MultiSelectField",
          category: "choice",
          variant: "multiselect",
          version: "1.0.0",
          supportsValidation: true,
          supportsLoading: true,
          supportsPrefix: false,
          supportsSuffix: false,
          supportsCounter: false,
          selectionCapabilities: multiSelectManifest,
        } as any
      }
    >
      {() => <MultiSelectFieldInner {...props} />}
    </BaseField>
  );
}
