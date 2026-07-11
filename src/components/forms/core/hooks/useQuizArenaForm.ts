import { useContext } from "react";
import { FieldValues } from "react-hook-form";
import { FormContext, FormContextValue } from "../FormContext";

export function useQuizArenaForm<
  TFieldValues extends FieldValues = any,
>(): FormContextValue<TFieldValues> {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error("useQuizArenaForm must be used within a FormProvider");
  }
  return context;
}
