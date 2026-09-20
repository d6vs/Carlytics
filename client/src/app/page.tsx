import Navbar from "@/components/layout/Navbar";
import HeroSection from "@/components/landing/HeroSection";
import HowItWorks from "@/components/landing/HowItWorks";
import Link from "next/link";

export default function LandingPage() {
  return (
    <main>
      <Navbar />
      <HeroSection />
      <HowItWorks />

      {/* CTA Section */}
      <section className="py-32 bg-[#080B12] border-t border-zinc-800/50">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to know what your car is <span className="text-[#22C55E]">worth?</span>
          </h2>
          <p className="text-zinc-400 mb-12 text-lg max-w-2xl mx-auto">
            Join thousands of smart sellers getting accurate, AI-powered valuations — not guesswork.
          </p>
          <Link
            href="/valuate"
            className="inline-flex items-center gap-2 bg-[#16A34A] hover:bg-[#15803D] text-white font-semibold px-12 py-5 rounded-lg transition-colors text-lg"
          >
            Get Valuation
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
        </div>
      </section>
    </main>
  );
}
