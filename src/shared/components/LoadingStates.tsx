/**
 * QuizArena — Loading States
 *
 * Shared loading skeletons for:
 * - Page transitions
 * - Auth state hydration
 * - Content loading
 */
"use client";

interface LoadingStateProps {
  fullPage?: boolean;
  message?: string;
}

/**
 * Full-page loading overlay — used during auth checks
 */
export function FullPageLoading({ message = "Loading..." }: LoadingStateProps) {
  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm text-gray-500 animate-pulse">{message}</p>
      </div>
    </div>
  );
}

/**
 * Inline loading skeleton
 */
export function Skeleton({
  className = "h-4 w-full",
  count = 1,
}: {
  className?: string;
  count?: number;
}) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className={`${className} bg-gray-200 rounded-lg animate-pulse`} />
      ))}
    </div>
  );
}

/**
 * Centered loading spinner
 */
export function Spinner({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const sizeMap = { sm: "w-4 h-4", md: "w-8 h-8", lg: "w-12 h-12" };
  const sizeClass = sizeMap[size] || sizeMap.md;

  return (
    <div className="flex items-center justify-center">
      <div
        className={`${sizeClass} border-2 border-gray-200 border-t-primary rounded-full animate-spin`}
      />
    </div>
  );
}
