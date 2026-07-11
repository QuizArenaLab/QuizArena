import * as React from "react";
import { cn } from "@/utilities";
import { PrimitiveRegistry } from "@/registry";
import { Icon } from "@/icons";
import { ValidationState } from "@/types";
import {
  InputProps,
  InputWrapperProps,
  InputLabelProps,
  InputDescriptionProps,
  InputHintProps,
  InputErrorProps,
  InputPrefixProps,
  InputSuffixProps,
  InputLeftAddonProps,
  InputRightAddonProps,
  InputCounterProps,
  inputVariants,
} from "./Input.types";

const InputWrapper = React.forwardRef<HTMLDivElement, InputWrapperProps>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex flex-col space-y-1.5 w-full", className)} {...props} />
  )
);
InputWrapper.displayName = "InputWrapper";

const InputGroup = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("relative flex w-full items-center", className)} {...props} />
  )
);
InputGroup.displayName = "InputGroup";

const InputField = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex w-full rounded-md shadow-sm", className)} {...props} />
  )
);
InputField.displayName = "InputField";

const InputLeftAddon = React.forwardRef<HTMLDivElement, InputLeftAddonProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "flex items-center justify-center rounded-l-md border border-r-0 border-input bg-muted px-3 text-sm text-muted-foreground",
        className
      )}
      {...props}
    />
  )
);
InputLeftAddon.displayName = "InputLeftAddon";

const InputRightAddon = React.forwardRef<HTMLDivElement, InputRightAddonProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "flex items-center justify-center rounded-r-md border border-l-0 border-input bg-muted px-3 text-sm text-muted-foreground",
        className
      )}
      {...props}
    />
  )
);
InputRightAddon.displayName = "InputRightAddon";

const InputLabel = React.forwardRef<HTMLLabelElement, InputLabelProps>(
  ({ className, ...props }, ref) => (
    <label
      ref={ref}
      className={cn(
        "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
        className
      )}
      {...props}
    />
  )
);
InputLabel.displayName = "InputLabel";

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, validationState, type, isLoading, ...props }, ref) => {
    if (isLoading) {
      return (
        <div className="relative flex w-full items-center">
          <input
            type={type}
            className={cn(inputVariants({ validationState, className }), "pr-10")}
            ref={ref}
            aria-invalid={validationState === "error"}
            aria-busy={true}
            {...props}
          />
          <div className="absolute right-3 flex h-full items-center justify-center pointer-events-none">
            <Icon
              name="Loader2"
              className="h-4 w-4 animate-spin text-muted-foreground"
              aria-hidden="true"
            />
          </div>
        </div>
      );
    }

    return (
      <input
        type={type}
        className={cn(inputVariants({ validationState, className }))}
        ref={ref}
        aria-invalid={validationState === "error"}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

const InputDescription = React.forwardRef<HTMLParagraphElement, InputDescriptionProps>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn("text-[0.8rem] text-muted-foreground", className)} {...props} />
  )
);
InputDescription.displayName = "InputDescription";

const InputHint = React.forwardRef<HTMLParagraphElement, InputHintProps>(
  ({ className, ...props }, ref) => (
    <p
      ref={ref}
      className={cn("text-[0.8rem] text-muted-foreground italic", className)}
      {...props}
    />
  )
);
InputHint.displayName = "InputHint";

const InputError = React.forwardRef<HTMLParagraphElement, InputErrorProps>(
  ({ className, validationState = "error", children, ...props }, ref) => {
    if (!children) return null;

    const colors: Record<ValidationState, string> = {
      idle: "text-muted-foreground",
      success: "text-green-500",
      warning: "text-amber-500",
      error: "text-destructive",
      info: "text-blue-500",
      loading: "text-muted-foreground animate-pulse",
    };

    return (
      <p
        ref={ref}
        className={cn("text-[0.8rem] font-medium", colors[validationState], className)}
        {...props}
      >
        {children}
      </p>
    );
  }
);
InputError.displayName = "InputError";

const InputPrefix = React.forwardRef<HTMLDivElement, InputPrefixProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "absolute left-3 flex h-full items-center justify-center text-muted-foreground pointer-events-none",
        className
      )}
      {...props}
    />
  )
);
InputPrefix.displayName = "InputPrefix";

const InputSuffix = React.forwardRef<HTMLDivElement, InputSuffixProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "absolute right-3 flex h-full items-center justify-center text-muted-foreground pointer-events-none",
        className
      )}
      {...props}
    />
  )
);
InputSuffix.displayName = "InputSuffix";

const InputCounter = React.forwardRef<HTMLSpanElement, InputCounterProps>(
  ({ className, current, max, ...props }, ref) => (
    <span
      ref={ref}
      className={cn("text-[0.75rem] text-muted-foreground ml-auto", className)}
      {...props}
    >
      {current}
      {max !== undefined ? ` / ${max}` : ""}
    </span>
  )
);
InputCounter.displayName = "InputCounter";

PrimitiveRegistry.register({
  id: "primitive-input",
  name: "Input",
  version: "1.0.0",
  registryVersion: "1.0.0",
  status: "stable",
  category: "primitives",
  description:
    "Comprehensive input architecture supporting labels, hints, validation states, prefixes, and addons.",
  dependencies: ["class-variance-authority", "IconRegistry"],
  tokens: ["bg-transparent", "border-input", "ring-ring", "text-muted-foreground"],
  accessibility: ["aria-invalid", "aria-busy", "label association"],
  responsive: true,
  motion: ["focus-ring"],
  component: Input, // Default component mapping, though composable pieces exist
});

export {
  InputWrapper,
  InputGroup,
  InputField,
  InputLeftAddon,
  InputRightAddon,
  InputLabel,
  Input,
  InputDescription,
  InputHint,
  InputError,
  InputPrefix,
  InputSuffix,
  InputCounter,
};
