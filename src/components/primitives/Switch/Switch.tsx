import * as React from "react";
import * as SwitchPrimitives from "@radix-ui/react-switch";
import { cn } from "@/utilities";
import { PrimitiveRegistry } from "@/registry";

const SwitchRoot = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
>(({ className, ...props }, ref) => (
  <SwitchPrimitives.Root
    className={cn(
      "peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input",
      className
    )}
    {...props}
    ref={ref}
  >
    <SwitchPrimitives.Thumb
      className={cn(
        "pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0"
      )}
    />
  </SwitchPrimitives.Root>
));
SwitchRoot.displayName = SwitchPrimitives.Root.displayName;

PrimitiveRegistry.register({
  id: "primitive-switch",
  name: "Switch",
  version: "1.0.0",
  registryVersion: "1.0.0",
  status: "stable",
  category: "primitives",
  description: "A control that allows the user to toggle between checked and not checked.",
  dependencies: ["@radix-ui/react-switch"],
  tokens: ["bg-primary", "bg-input", "bg-background", "ring-ring"],
  accessibility: ["aria-checked", "keyboard navigation (Space, Enter)"],
  responsive: true,
  motion: ["transition-transform", "transition-colors"],
  component: SwitchRoot,
});

export { SwitchRoot };
