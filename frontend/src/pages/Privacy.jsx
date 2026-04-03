import { Navbar } from "../components/layout/Navbar";
import { Footer } from "../components/layout/Footer";

const PRIVACY_SECTIONS = [
  {
    title: "Information We Collect",
    body: "We collect account details, company profile information, and documents you submit to support investment workflows.",
  },
  {
    title: "How Information Is Used",
    body: "Data is used for onboarding, verification, platform operations, investor matching, and compliance requirements.",
  },
  {
    title: "Document Access",
    body: "Project documents are only shared with verified users according to your workflow and platform controls.",
  },
  {
    title: "Data Retention",
    body: "We retain data as long as needed for platform operations, legal compliance, and legitimate business purposes.",
  },
  {
    title: "Support Requests",
    body: "For privacy requests, contact support@connectafrica.com.",
  },
];

export function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[var(--ds-bg-light)]">
      <Navbar />
      <main className="pt-24 pb-20 px-4">
        <div className="max-w-3xl mx-auto">
          <h1
            className="text-3xl sm:text-4xl font-bold text-[var(--ds-text-primary)] mb-4"
            style={{ fontFamily: "var(--ds-font-display)" }}
          >
            Privacy Policy
          </h1>
          <p className="text-sm text-[var(--ds-text-secondary)] mb-8">
            This policy outlines how Connect Africa handles personal and business data on the platform.
          </p>

          <div className="space-y-4">
            {PRIVACY_SECTIONS.map((section) => (
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
