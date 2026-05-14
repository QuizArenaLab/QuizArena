/**
 * QuizArena — Home Page (Marketing Landing)
 *
 * Public-facing marketing page with navigation to auth.
 */
import { HeroSection } from "@/components/homePage/HeroSection";
import { ProblemSolutionSection } from "@/components/homePage/ProblemSolutionSection";
import { IntelligenceShowcaseSection } from "@/components/homePage/IntelligenceShowcaseSection";
import Link from "next/link";

export default function MarketingLandingPage() {
  return (
    <main className="min-h-screen bg-background font-sans text-navy flex flex-col">
      {/* Hero Section */}
      <HeroSection />

      {/* Problem & Solution Section */}
      <ProblemSolutionSection />

      {/* Intelligence Showcase */}
      <IntelligenceShowcaseSection />

      {/* Footer CTA */}
      <section className="bg-navy text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-4">Ready to Ace Your Exam?</h2>
          <p className="text-white/70 mb-8">
            Join thousands of aspirants preparing smarter with QuizArena.
          </p>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 bg-white text-navy px-8 py-4 rounded-xl font-bold hover:bg-gray-100 transition-colors shadow-lg"
          >
            Start Free Trial →
          </Link>
        </div>
      </section>
    </main>
  );
}
