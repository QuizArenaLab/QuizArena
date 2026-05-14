/**
 * Loading state for home/landing page
 */
"use client";

export default function HomeLoading() {
  return (
    <div
      className="min-h-screen bg-background flex items-center justify-center"
      role="status"
      aria-busy="true"
      aria-live="polite"
      aria-label="Loading page content"
    >
      <div className="animate-pulse space-y-4 max-w-4xl mx-auto px-4 w-full">
        <div className="h-16 bg-gray-200 rounded-lg w-1/3" />
        <div className="h-96 bg-gray-200 rounded-2xl" />
        <div className="space-y-3">
          <div className="h-6 bg-gray-200 rounded-lg w-2/3" />
          <div className="h-6 bg-gray-200 rounded-lg w-1/2" />
          <div className="h-6 bg-gray-200 rounded-lg w-3/4" />
        </div>
      </div>
    </div>
  );
}
