import React, { ReactNode } from "react";
import { BaseField, useField } from "../../shared/BaseField";
import { FieldWrapper, FieldLabel, FieldDescription, FieldHint, FieldError } from "../../shared"; // Shared across all fields

import { CheckboxRoot } from "../../../../primitives/Checkbox";
import { SelectionManifest } from "../../../registry";

export interface CheckboxFieldProps {
  name: string;
  label: ReactNode;
  description?: ReactNode;
  hint?: ReactNode;
  controlled?: boolean;
  disabled?: boolean;
  required?: boolean;
  className?: string;
}

const checkboxManifest: SelectionManifest = {
  multiple: false,
  searchable: false,
  clearable: false,
  creatable: false,
  asyncReady: false,
  virtualized: false,
  version: "1.0.0",
};

function CheckboxFieldInner({
  label,
  description,
  hint,
  className,
}: Omit<CheckboxFieldProps, "name" | "controlled" | "disabled" | "required">) {
  const {
    id,
    inputProps,
    validationState,
    isLoading,
    error,
    descriptionId,
    errorId,
    value,
    isDisabled,
  } = useField();

  const { ref, onChange, onBlur, disabled: fieldDisabled, name } = inputProps;

  const describedBy =
    [description ? descriptionId : null, error ? errorId : null].filter(Boolean).join(" ") ||
    undefined;

  return (
    <div className={className}>
      <div className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow-sm">
        <CheckboxRoot
          id={id}
          checked={value}
          onCheckedChange={(checked) => {
            if (onChange) {
              onChange({
                target: { name: name, type: "checkbox", checked, value: checked },
              });
            }
          }}
          disabled={isDisabled || fieldDisabled}
          aria-invalid={validationState === "error"}
          aria-describedby={describedBy}
          ref={ref}
        />
        <div className="space-y-1 leading-none">
          <FieldLabel>{label}</FieldLabel>
          <FieldDescription>{description}</FieldDescription>
          <FieldError />
        </div>
      </div>
      <FieldHint className="mt-2">{hint}</FieldHint>
    </div>
  );
}

export function CheckboxField(props: CheckboxFieldProps) {
  return (
    <BaseField
      name={props.name}
      controlled={props.controlled ?? true} // Checkbox works best controlled in RHF
      disabled={props.disabled}
      required={props.required}
      manifest={
        {
          id: "field-selection-checkbox",
          name: "CheckboxField",
          category: "choice",
          variant: "checkbox",
          version: "1.0.0",
          supportsValidation: true,
          supportsLoading: true,
          supportsPrefix: false,
          supportsSuffix: false,
          supportsCounter: false,
          selectionCapabilities: checkboxManifest,
        } as any
      }
    >
      {() => <CheckboxFieldInner {...props} />}
    </BaseField>
  );
}
