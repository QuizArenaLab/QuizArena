import React, { ReactNode, useCallback } from "react";
import { useForm, UseFormProps } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormContext, FormContextValue } from "../core/FormContext";
import { FormManifest } from "../registry/FormManifest";
import { useFormLifecycle } from "../core/hooks/useFormLifecycle";
import { useDirtyState } from "../core/hooks/useDirtyState";
import { useValidation } from "../core/hooks/useValidation";
import { FormEvent, UnenrichedFormEvent } from "../core/FormEvents";
import { FormRegistry } from "../registry/FormRegistry";
import { useOptionalAnalyticsContext } from "../core/AnalyticsContext";

export interface FormProviderProps {
  manifestId: string;
  children: ReactNode;
  defaultValues?: any;
  onSubmit?: (data: any) => void;
  onEvent?: (event: FormEvent) => void;
}

export function FormProvider({
  manifestId,
  children,
  defaultValues,
  onSubmit,
  onEvent,
}: FormProviderProps) {
  const manifest = FormRegistry.get(manifestId);
  if (!manifest) {
    throw new Error(`FormManifest with id ${manifestId} not found in FormRegistry.`);
  }

  const rhfOptions: UseFormProps = {
    defaultValues,
    mode: "onTouched",
  };

  if (manifest.validationSchema) {
    rhfOptions.resolver = zodResolver(manifest.validationSchema);
  }

  const rhf = useForm(rhfOptions);
  const lifecycle = useFormLifecycle();
  const dirty = useDirtyState();
  const validation = useValidation();

  const analytics = useOptionalAnalyticsContext();
  const [correlationId] = React.useState(() => crypto.randomUUID());

  const dispatch = useCallback(
    (event: UnenrichedFormEvent) => {
      if (onEvent) {
        const enrichedEvent: FormEvent = {
          ...event,
          correlationId,
          occurredAt: Date.now(),
          eventVersion: "1.0",
          analyticsSchemaVersion: "1.0",
          analyticsSource: analytics?.analyticsSource || "Form",
          manifestId,
          ...(analytics || {}),
        } as FormEvent;
        onEvent(enrichedEvent);
      }
    },
    [onEvent, correlationId, manifestId, analytics]
  );

  const value: FormContextValue = {
    manifest,
    rhf,
    lifecycle,
    dirty,
    validation,
    events: {
      dispatch,
    },
  };

  return (
    <FormContext.Provider value={value}>
      <form
        onSubmit={rhf.handleSubmit(async (data) => {
          lifecycle.transition("SUBMITTING");
          dispatch({ type: "FormSubmitted", payload: data });
          if (onSubmit) {
            await onSubmit(data);
          }
          lifecycle.transition("SUBMITTED");
        })}
        className="w-full h-full"
      >
        {children}
      </form>
    </FormContext.Provider>
  );
}
