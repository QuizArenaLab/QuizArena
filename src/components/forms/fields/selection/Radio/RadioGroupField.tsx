import React, { ReactNode } from "react";
import { BaseField, useField } from "../../shared/BaseField";
import { FieldWrapper, FieldLabel, FieldDescription, FieldHint, FieldError } from "../../shared";
import { RadioRoot, RadioItem } from "../../../../primitives/Radio";
import { SelectionManifest } from "../../../registry";
import { SelectionOptionModel } from "../shared/SelectionModels";

export interface RadioGroupFieldProps {
  name: string;
  label?: ReactNode;
  options: SelectionOptionModel[];
  orientation?: "horizontal" | "vertical";
  description?: ReactNode;
  hint?: ReactNode;
  controlled?: boolean;
  disabled?: boolean;
  required?: boolean;
  className?: string;
}

const radioManifest: SelectionManifest = {
  multiple: false,
  searchable: false,
  clearable: false,
  creatable: false,
  asyncReady: false,
  virtualized: false,
  version: "1.0.0",
};

function RadioGroupFieldInner({
  label,
  description,
  hint,
  options,
  orientation = "vertical",
  className,
}: Omit<RadioGroupFieldProps, "name" | "controlled" | "disabled" | "required">) {
  const { id, inputProps, validationState, isLoading, error, descriptionId, errorId, value } =
    useField();

  const describedBy =
    [description ? descriptionId : null, error ? errorId : null].filter(Boolean).join(" ") ||
    undefined;

  return (
    <FieldWrapper className={className}>
      <div className="flex justify-between">
        <FieldLabel>{label}</FieldLabel>
        <FieldHint>{hint}</FieldHint>
      </div>

      <RadioRoot
        id={id}
        value={value}
        onValueChange={(val) => {
          if (inputProps.onChange) {
            inputProps.onChange({ target: { name: inputProps.name, value: val } });
          }
        }}
        disabled={isLoading || inputProps.disabled}
        aria-invalid={validationState === "error"}
        aria-describedby={describedBy}
        className={orientation === "horizontal" ? "flex flex-row gap-4" : "flex flex-col gap-3"}
      >
        {options.map((option) => (
          <div key={option.id} className="flex items-center space-x-3 space-y-0">
            <RadioItem value={option.value} id={`${id}-${option.id}`} disabled={option.disabled} />
            <div className="space-y-1 leading-none">
              <label
                htmlFor={`${id}-${option.id}`}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {option.label}
              </label>
              {option.description && (
                <p className="text-[0.8rem] text-muted-foreground">{option.description}</p>
              )}
            </div>
          </div>
        ))}
      </RadioRoot>

      <FieldDescription>{description}</FieldDescription>
      <FieldError />
    </FieldWrapper>
  );
}

export function RadioGroupField(props: RadioGroupFieldProps) {
  return (
    <BaseField
      name={props.name}
      controlled={props.controlled ?? true}
      disabled={props.disabled}
      required={props.required}
      manifest={
        {
          id: "field-selection-radio",
          name: "RadioGroupField",
          category: "choice",
          variant: "radio",
          version: "1.0.0",
          supportsValidation: true,
          supportsLoading: true,
          supportsPrefix: false,
          supportsSuffix: false,
          supportsCounter: false,
          selectionCapabilities: radioManifest,
        } as any
      }
    >
      {() => <RadioGroupFieldInner {...props} />}
    </BaseField>
  );
}
