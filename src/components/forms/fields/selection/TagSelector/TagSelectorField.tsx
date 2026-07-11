import React, { ReactNode } from "react";
import { BaseField, useField } from "../../shared/BaseField";
import { FieldWrapper, FieldLabel, FieldDescription, FieldHint, FieldError } from "../../shared";
import { SelectionManifest } from "../../../registry";

export interface TagSelectorFieldProps {
  name: string;
  label?: ReactNode;
  placeholder?: string;
  description?: ReactNode;
  hint?: ReactNode;

  // Tag selector architecture
  creatable?: boolean;
  deletable?: boolean;
  selectExisting?: boolean;
  maxTags?: number;

  controlled?: boolean;
  disabled?: boolean;
  required?: boolean;
  className?: string;
}

const tagSelectorManifest: SelectionManifest = {
  multiple: true,
  searchable: true,
  clearable: true,
  creatable: true,
  asyncReady: false,
  virtualized: false,
  version: "1.0.0",
};

function TagSelectorFieldInner({
  label,
  description,
  hint,
  placeholder,
  className,
}: Omit<TagSelectorFieldProps, "name" | "controlled" | "disabled" | "required">) {
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
        {/* Mock Tags */}
        {Array.isArray(value) &&
          value.map((val: string) => (
            <span
              key={val}
              className="inline-flex items-center gap-1 rounded bg-primary px-2 py-0.5 text-xs font-semibold text-primary-foreground"
            >
              {val}
              <button
                type="button"
                className="text-primary-foreground/70 hover:text-primary-foreground outline-none"
              >
                ×
              </button>
            </span>
          ))}
        <input
          type="text"
          placeholder={placeholder || "Add tags..."}
          className="flex-1 min-w-[80px] bg-transparent outline-none border-none"
          readOnly
        />
      </div>

      <FieldDescription>{description}</FieldDescription>
      <FieldError />
    </FieldWrapper>
  );
}

export function TagSelectorField(props: TagSelectorFieldProps) {
  return (
    <BaseField
      name={props.name}
      controlled={props.controlled ?? true}
      disabled={props.disabled}
      required={props.required}
      manifest={
        {
          id: "field-selection-tagselector",
          name: "TagSelectorField",
          category: "choice",
          variant: "tag",
          version: "1.0.0",
          supportsValidation: true,
          supportsLoading: true,
          supportsPrefix: false,
          supportsSuffix: false,
          supportsCounter: true,
          selectionCapabilities: tagSelectorManifest,
        } as any
      }
    >
      {() => <TagSelectorFieldInner {...props} />}
    </BaseField>
  );
}
