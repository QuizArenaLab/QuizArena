"use client";

import React from "react";
import { SkeletonLayoutProps } from "./SkeletonLayout.types";
import { ComponentRegistry } from "@/registry";
import { Skeleton } from "@/components/primitives/Skeleton";

export function SkeletonLayout({
  variant = "dashboard",
  rows = 5,
  className = "",
}: SkeletonLayoutProps) {
  switch (variant) {
    case "table":
      return (
        <div className={`w-full flex flex-col gap-4 ${className}`}>
          {Array.from({ length: rows }).map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-4 w-full h-12 border-b border-gray-100 pb-4"
            >
              <Skeleton className="h-6 w-8 rounded-md" />
              <Skeleton className="h-6 w-1/4 rounded-md" />
              <Skeleton className="h-6 w-1/3 rounded-md" />
              <Skeleton className="h-6 w-1/5 rounded-md ml-auto" />
            </div>
          ))}
        </div>
      );
    case "form":
      return (
        <div className={`w-full max-w-2xl flex flex-col gap-6 ${className}`}>
          <div className="space-y-2">
            <Skeleton className="h-5 w-32 rounded-md" />
            <Skeleton className="h-10 w-full rounded-md" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-5 w-24 rounded-md" />
            <Skeleton className="h-10 w-full rounded-md" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-5 w-48 rounded-md" />
            <Skeleton className="h-32 w-full rounded-md" />
          </div>
          <div className="flex gap-4 mt-4">
            <Skeleton className="h-10 w-24 rounded-md" />
            <Skeleton className="h-10 w-24 rounded-md" />
          </div>
        </div>
      );
    case "card":
      return (
        <div
          className={`flex flex-col gap-4 p-4 border border-gray-200 rounded-xl bg-white shadow-sm w-full ${className}`}
        >
          <div className="flex items-center gap-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-5 w-1/3 rounded-md" />
              <Skeleton className="h-4 w-1/4 rounded-md" />
            </div>
          </div>
          <Skeleton className="h-24 w-full rounded-md mt-2" />
          <div className="flex justify-between items-center mt-2">
            <Skeleton className="h-8 w-20 rounded-md" />
            <Skeleton className="h-8 w-20 rounded-md" />
          </div>
        </div>
      );
    case "sidebar":
      return (
        <div
          className={`flex flex-col gap-6 w-full h-full p-4 border-r border-gray-200 ${className}`}
        >
          <Skeleton className="h-8 w-3/4 rounded-md mb-4" />
          <div className="space-y-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="h-6 w-6 rounded-md" />
                <Skeleton className="h-5 w-2/3 rounded-md" />
              </div>
            ))}
          </div>
        </div>
      );
    case "header":
      return (
        <div
          className={`flex items-center w-full h-16 px-6 border-b border-gray-200 gap-4 ${className}`}
        >
          <Skeleton className="h-6 w-6 rounded-md" />
          <Skeleton className="h-6 w-48 rounded-md" />
          <div className="flex-1" />
          <Skeleton className="h-8 w-64 rounded-md hidden md:block" />
          <Skeleton className="h-10 w-10 rounded-full ml-4" />
        </div>
      );
    case "dashboard":
    default:
      return (
        <div className={`w-full flex flex-col gap-6 ${className}`}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Skeleton className="h-32 w-full rounded-xl" />
            <Skeleton className="h-32 w-full rounded-xl" />
            <Skeleton className="h-32 w-full rounded-xl" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1">
            <div className="lg:col-span-2">
              <Skeleton className="h-[400px] w-full rounded-xl" />
            </div>
            <div>
              <Skeleton className="h-[400px] w-full rounded-xl" />
            </div>
          </div>
        </div>
      );
  }
}

ComponentRegistry.register({
  id: "skeleton-layout",
  name: "SkeletonLayout",
  category: "workspace-state" as any,
  version: "1.0.0",
  status: "stable",
  owner: "workspace-architecture",
});
