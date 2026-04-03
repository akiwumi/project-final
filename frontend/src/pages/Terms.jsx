import { Navbar } from "../components/layout/Navbar";
import { Footer } from "../components/layout/Footer";

const TERMS_SECTIONS = [
  {
    title: "Platform Use & Eligibility",
    body: "You must be at least 18 years old and legally authorized to represent your company.",
  },
  {
    title: "Project Submission Fee",
    body: "Each project submission requires a one-time EUR 1,000 fee per project.",
  },
  {
    title: "Refund Policy",
    body: "If a project fails screening, 80% of the submission fee is refunded and 20% is retained as an administrative fee.",
  },
  {
    title: "Verification Requirements",
    body: "All project submissions require a phone verification call before approval.",
  },
  {
    title: "Code of Conduct",
    body: "Users must engage professionally and comply with all applicable laws.",
  },
];

export function TermsPage() {
  return (
    <div className="min-h-screen bg-[var(--ds-bg-light)]">
      <Navbar />
      <main className="pt-24 pb-20 px-4">
        <div className="max-w-3xl mx-auto">
          <h1
            className="text-3xl sm:text-4xl font-bold text-[var(--ds-text-primary)] mb-4"
            style={{ fontFamily: "var(--ds-font-display)" }}
          >
            Terms of Service
          </h1>
          <p className="text-sm text-[var(--ds-text-secondary)] mb-8">
            These terms explain how Connect Africa is used and what users can expect from the platform.
          </p>

          <div className="space-y-4">
            {TERMS_SECTIONS.map((section) => (
              <section
                key={section.title}
                className="bg-white rounded-2xl border border-[var(--ds-border)] p-6"
              >
                <h2 className="text-base font-semibold text-[var(--ds-text-primary)] mb-2">
                  {section.title}
                </h2>
                <p className="text-sm text-[var(--ds-text-secondary)] leading-relaxed">
                  {section.body}
                </p>
              </section>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
