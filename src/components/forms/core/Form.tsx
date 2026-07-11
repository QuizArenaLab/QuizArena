import React, { ReactNode } from "react";
import { FormProvider } from "../providers/FormProvider";
import { FormEvent } from "./FormEvents";

export interface FormProps {
  manifestId: string;
  children: ReactNode;
  defaultValues?: any;
  onSubmit?: (data: any) => void;
  onEvent?: (event: FormEvent) => void;
}

/**
 * Generic Enterprise Form wrapper.
 * This is the public API that all QuizArena forms use.
 */
export function Form(props: FormProps) {
  return (
    <FormProvider
      manifestId={props.manifestId}
      defaultValues={props.defaultValues}
      onSubmit={props.onSubmit}
      onEvent={props.onEvent}
    >
      {props.children}
    </FormProvider>
  );
}
