import { HeroSection } from "@/components/homePage/HeroSection";
import { ProblemSolutionSection } from "@/components/homePage/ProblemSolutionSection";
import { IntelligenceShowcaseSection } from "@/components/homePage/IntelligenceShowcaseSection";

export default function MarketingLandingPage() {
  return (
    <main className="min-h-screen bg-background font-sans text-navy flex flex-col">
      {/* 
        Navigation is intentionally excluded per project instructions. 
        Placeholder for future Header/Nav implementation.
      */}

      {/* STEP 1: Attention (Hero Section) */}
      <HeroSection />

      {/* STEP 2: Problem Identification (Competitive Preparation System) */}
      <ProblemSolutionSection />

      {/* STEP 3: Product Credibility (Platform Intelligence Showcase) */}
      <IntelligenceShowcaseSection />

      {/* 
        Future Sections (Pricing, FAQ, Footer) will go here.
      */}
    </main>
  );
}
