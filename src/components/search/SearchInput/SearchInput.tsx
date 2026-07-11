import React, { forwardRef } from "react";
import { SearchInputState } from "../../../search";
import { InputWrapper, InputGroup, Input, InputPrefix, InputSuffix } from "../../primitives/Input";
import { Icon } from "../../../icons";
import { Button } from "../../primitives/Button";
import { cn } from "../../../utilities";

export interface SearchInputProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "value" | "onChange"
> {
  value?: string;
  onChange?: (value: string) => void;
  onClear?: () => void;
  state?: SearchInputState;
}

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  (
    {
      value = "",
      onChange,
      onClear,
      state = "Idle",
      className,
      placeholder = "Search...",
      disabled,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || state === "Disabled";
    const isLoading = state === "Loading";

    let validationState: "idle" | "error" | "success" = "idle";
    if (state === "Error") validationState = "error";
    if (state === "Success") validationState = "success";

    return (
      <InputWrapper className={className}>
        <InputGroup>
          <InputPrefix>
            <Icon name="Search" className="h-4 w-4" />
          </InputPrefix>
          <Input
            ref={ref}
            type="search"
            value={value}
            onChange={(e) => onChange?.(e.target.value)}
            placeholder={placeholder}
            disabled={isDisabled}
            isLoading={isLoading}
            validationState={validationState}
            className={cn("pl-9", value ? "pr-9" : "")}
            role="searchbox"
            {...props}
          />
          {value && !isLoading && !isDisabled && (
            <InputSuffix className="pointer-events-auto">
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 rounded-full"
                onClick={onClear}
                aria-label="Clear search"
              >
                <Icon name="X" className="h-3 w-3" />
              </Button>
            </InputSuffix>
          )}
        </InputGroup>
      </InputWrapper>
    );
  }
);

SearchInput.displayName = "SearchInput";
