import React, { ReactNode } from "react";
import { BaseField, useField } from "../../shared/BaseField";
import { FieldWrapper, FieldLabel, FieldDescription, FieldHint, FieldError } from "../../shared";
import { SwitchRoot } from "../../../../primitives/Switch";
import { SelectionManifest } from "../../../registry";

export interface SwitchFieldProps {
  name: string;
  label: ReactNode;
  description?: ReactNode;
  hint?: ReactNode;
  controlled?: boolean;
  disabled?: boolean;
  required?: boolean;
  className?: string;
}

const switchManifest: SelectionManifest = {
  multiple: false,
  searchable: false,
  clearable: false,
  creatable: false,
  asyncReady: false,
  virtualized: false,
  version: "1.0.0",
};

function SwitchFieldInner({
  label,
  description,
  hint,
  className,
}: Omit<SwitchFieldProps, "name" | "controlled" | "disabled" | "required">) {
  const { id, inputProps, validationState, isLoading, error, descriptionId, errorId, value } =
    useField();

  const describedBy =
    [description ? descriptionId : null, error ? errorId : null].filter(Boolean).join(" ") ||
    undefined;

  return (
    <div className={className}>
      <div className="flex flex-row items-center justify-between rounded-lg border p-4 shadow-sm">
        <div className="space-y-0.5">
          <FieldLabel>{label}</FieldLabel>
          <FieldDescription>{description}</FieldDescription>
        </div>
        <SwitchRoot
          id={id}
          checked={value}
          onCheckedChange={(checked) => {
            if (inputProps.onChange) {
              inputProps.onChange({
                target: { name: inputProps.name, type: "checkbox", checked, value: checked },
              });
            }
          }}
          disabled={isLoading || inputProps.disabled}
          aria-invalid={validationState === "error"}
          aria-describedby={describedBy}
          ref={inputProps.ref}
        />
      </div>
      <FieldError className="mt-2" />
      <FieldHint className="mt-2">{hint}</FieldHint>
    </div>
  );
}

export function SwitchField(props: SwitchFieldProps) {
  return (
    <BaseField
      name={props.name}
      controlled={props.controlled ?? true}
      disabled={props.disabled}
      required={props.required}
      manifest={
        {
          id: "field-selection-switch",
          name: "SwitchField",
          category: "choice",
          variant: "switch",
          version: "1.0.0",
          supportsValidation: true,
          supportsLoading: true,
          supportsPrefix: false,
          supportsSuffix: false,
          supportsCounter: false,
          selectionCapabilities: switchManifest,
        } as any
      }
    >
      {() => <SwitchFieldInner {...props} />}
    </BaseField>
  );
}
