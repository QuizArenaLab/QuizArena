import Link from "next/link";

/**
 * QuizArena Not Found
 *
 * Custom 404 page for the entire application.
 */
export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="text-center max-w-md">
        <div className="text-8xl mb-6">404</div>
        <h1 className="text-3xl font-bold text-navy mb-3">Page Not Found</h1>
        <p className="text-gray-500 mb-8">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors text-sm font-semibold shadow-lg shadow-primary/20"
        >
          ← Back to Home
        </Link>
      </div>
    </div>
  );
}
