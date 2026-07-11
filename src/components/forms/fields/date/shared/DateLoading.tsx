import React from "react";

export function DateLoading() {
  return (
    <div className="animate-pulse flex flex-col space-y-4 w-64 p-4 border border-gray-200 rounded-md">
      <div className="h-4 bg-gray-200 rounded w-3/4" />
      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: 35 }).map((_, i) => (
          <div key={i} className="h-8 bg-gray-200 rounded" />
        ))}
      </div>
    </div>
  );
}
