import React, { ReactNode } from "react";
import { BaseField, useField } from "../../shared/BaseField";
import { FieldWrapper, FieldLabel, FieldDescription, FieldHint, FieldError } from "../../shared";
import { SelectionManifest } from "../../../registry";

export interface AutocompleteFieldProps {
  name: string;
  label?: ReactNode;
  placeholder?: string;
  description?: ReactNode;
  hint?: ReactNode;

  // Autocomplete architecture
  history?: boolean;
  recentSearches?: boolean;
  suggested?: boolean;
  popular?: boolean;

  controlled?: boolean;
  disabled?: boolean;
  required?: boolean;
  className?: string;
}

const autocompleteManifest: SelectionManifest = {
  multiple: false,
  searchable: true,
  clearable: true,
  creatable: true,
  asyncReady: true,
  virtualized: false,
  version: "1.0.0",
};

function AutocompleteFieldInner({
  label,
  description,
  hint,
  placeholder,
  className,
}: Omit<AutocompleteFieldProps, "name" | "controlled" | "disabled" | "required">) {
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
        className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <input
          type="text"
          value={value || ""}
          placeholder={placeholder || "Type to search..."}
          className="w-full bg-transparent outline-none border-none"
          readOnly
        />
      </div>

      <FieldDescription>{description}</FieldDescription>
      <FieldError />
    </FieldWrapper>
  );
}

export function AutocompleteField(props: AutocompleteFieldProps) {
  return (
    <BaseField
      name={props.name}
      controlled={props.controlled ?? true}
      disabled={props.disabled}
      required={props.required}
      manifest={
        {
          id: "field-selection-autocomplete",
          name: "AutocompleteField",
          category: "choice",
          variant: "autocomplete",
          version: "1.0.0",
          supportsValidation: true,
          supportsLoading: true,
          supportsPrefix: true,
          supportsSuffix: true,
          supportsCounter: false,
          selectionCapabilities: autocompleteManifest,
        } as any
      }
    >
      {() => <AutocompleteFieldInner {...props} />}
    </BaseField>
  );
}
