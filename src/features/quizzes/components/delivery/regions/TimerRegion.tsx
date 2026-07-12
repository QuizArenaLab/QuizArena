"use client";
import React from "react";
import { QuizTimer } from "../../../components/timer";
import { useQuizDelivery } from "../../../delivery";

export function TimerRegion({
  children,
  className = "",
}: {
  children?: React.ReactNode;
  className?: string;
}) {
  const { timerVisible } = useQuizDelivery();

  if (!timerVisible) return null;

  return (
    <div className={`${className}`}>
      <QuizTimer className="border-none bg-transparent shadow-none p-0">{children}</QuizTimer>
    </div>
  );
}
