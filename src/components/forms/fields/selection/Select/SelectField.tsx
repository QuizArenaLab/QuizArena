import React, { ReactNode } from "react";
import { BaseField, useField } from "../../shared/BaseField";
import { FieldWrapper, FieldLabel, FieldDescription, FieldHint, FieldError } from "../../shared";
import {
  SelectRoot,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  SelectGroup,
} from "../../../../primitives/Select";
import { SelectionManifest } from "../../../registry";
import { SelectionOptionModel, SelectionGroupType } from "../shared/SelectionModels";

export interface SelectGroupOption {
  group: string;
  type?: SelectionGroupType;
  items: SelectionOptionModel[];
}

export interface SelectFieldProps {
  name: string;
  label?: ReactNode;
  options: (SelectionOptionModel | SelectGroupOption)[];
  placeholder?: string;
  description?: ReactNode;
  hint?: ReactNode;
  controlled?: boolean;
  disabled?: boolean;
  required?: boolean;
  className?: string;
}

const selectManifest: SelectionManifest = {
  multiple: false,
  searchable: false, // Architecture: true for advanced combos
  clearable: true,
  creatable: false,
  asyncReady: false,
  virtualized: false,
  version: "1.0.0",
};

function SelectFieldInner({
  label,
  description,
  hint,
  options,
  placeholder,
  className,
}: Omit<SelectFieldProps, "name" | "controlled" | "disabled" | "required">) {
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

      <SelectRoot
        value={value}
        onValueChange={(val) => {
          if (inputProps.onChange) {
            inputProps.onChange({ target: { name: inputProps.name, value: val } });
          }
        }}
        disabled={isLoading || inputProps.disabled}
      >
        <SelectTrigger
          id={id}
          aria-invalid={validationState === "error"}
          aria-describedby={describedBy}
          ref={inputProps.ref}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>

        <SelectContent>
          {options.map((option, i) => {
            if ("items" in option) {
              return (
                <SelectGroup key={i}>
                  <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
                    {option.group}
                  </div>
                  {option.items.map((item: SelectionOptionModel) => (
                    <SelectItem key={item.value} value={item.value} disabled={item.disabled}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              );
            }
            return (
              <SelectItem key={option.value} value={option.value} disabled={option.disabled}>
                {option.label}
              </SelectItem>
            );
          })}
        </SelectContent>
      </SelectRoot>

      <FieldDescription>{description}</FieldDescription>
      <FieldError />
    </FieldWrapper>
  );
}

export function SelectField(props: SelectFieldProps) {
  return (
    <BaseField
      name={props.name}
      controlled={props.controlled ?? true}
      disabled={props.disabled}
      required={props.required}
      manifest={
        {
          id: "field-selection-select",
          name: "SelectField",
          category: "choice",
          variant: "select",
          version: "1.0.0",
          supportsValidation: true,
          supportsLoading: true,
          supportsPrefix: false,
          supportsSuffix: false,
          supportsCounter: false,
          selectionCapabilities: selectManifest,
        } as any
      }
    >
      {() => <SelectFieldInner {...props} />}
    </BaseField>
  );
}
