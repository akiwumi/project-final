import { Navbar } from "../components/layout/Navbar";
import { Footer } from "../components/layout/Footer";
import { HeroVideo } from "../components/landing/HeroVideo";
import { HowItWorks } from "../components/landing/HowItWorks";
import { ProblemSolution } from "../components/landing/ProblemSolution";
import { StatsSection } from "../components/landing/StatsSection";
import { Testimonials } from "../components/landing/Testimonials";

export function LandingPage() {
  return (
    <div className="min-h-screen bg-[var(--ds-bg-light)]">
      <Navbar />
      <main>
        <HeroVideo />
        <HowItWorks />
        <ProblemSolution />
        <StatsSection />
        <Testimonials />
        <section id="advice" className="py-12 bg-[var(--ds-bg-light)]" />
        <section id="rules" className="py-12 bg-[var(--ds-surface)]" />
        <section id="terms" className="py-12 bg-[var(--ds-bg-light)]" />
        <section id="about" className="py-12 bg-[var(--ds-surface)]" />
      </main>
      <Footer />
    </div>
  );
}
