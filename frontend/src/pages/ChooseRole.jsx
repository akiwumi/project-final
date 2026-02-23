import { Navbar } from "../components/layout/Navbar";
import { Footer } from "../components/layout/Footer";
import { Rocket, Users, Briefcase } from "lucide-react";

const categories = [
  {
    id: "entrepreneur",
    title: "Entrepreneur",
    icon: Rocket,
    description:
      "You're building a venture and need capital, visibility, and structured introductions to investors. List your project, get reviewed, and receive serious interest from vetted investors across our network.",
    ctaLabel: "I'm an Entrepreneur",
    ctaHref: "/register?role=entrepreneur",
    accent: "bg-[var(--ds-accent)] text-[var(--ds-text-on-dark)] hover:bg-[var(--ds-accent-hover)]",
  },
  {
    id: "investor",
    title: "Investor",
    icon: Users,
    description:
      "You want to discover and back vetted ventures across African markets. Browse by country, sector, and stage; request introductions; and move into deal rooms with structured workflows and verified data.",
    ctaLabel: "I'm an Investor",
    ctaHref: "/investor",
    accent: "bg-[var(--ds-accent)] text-[var(--ds-text-on-dark)] hover:bg-[var(--ds-accent-hover)]",
  },
  {
    id: "provider",
    title: "Service Provider",
    icon: Briefcase,
    description:
      "You offer legal, compliance, due diligence, or other professional services and want to connect with investors and entrepreneurs. Get verified, increase visibility, and receive qualified leads.",
    ctaLabel: "I'm a Service Provider",
    ctaHref: "/register?role=provider",
    accent: "bg-[var(--ds-accent)] text-[var(--ds-text-on-dark)] hover:bg-[var(--ds-accent-hover)]",
  },
];

export function ChooseRole() {
  return (
    <div className="min-h-screen bg-[var(--ds-bg-light)]">
      <Navbar />
      <main className="pt-16">
        {/* Hero section */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h1
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-[var(--ds-text-primary)] mb-6"
            style={{ lineHeight: "var(--ds-line-tight)" }}
          >
            Choose how you want to connect
          </h1>
          <p className="text-lg text-[var(--ds-text-secondary)] leading-[var(--ds-line-relaxed)] max-w-2xl mx-auto">
            Select the category that best fits your role. Picking the right one ensures you see the right tools, workflows, and opportunities. You can always update your profile later if your focus changes.
          </p>
        </section>

        {/* Cards section */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {categories.map((cat) => (
              <article
                key={cat.id}
                className="flex flex-col bg-[var(--ds-surface)] rounded-2xl border border-[var(--ds-border)] p-8 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex justify-center mb-6">
                  <div className="p-4 rounded-xl bg-[var(--ds-accent)]/10 text-[var(--ds-accent)]">
                    <cat.icon className="w-10 h-10" />
                  </div>
                </div>
                <h2 className="text-xl font-bold text-[var(--ds-text-primary)] text-center mb-4">
                  {cat.title}
                </h2>
                <p className="text-[var(--ds-text-secondary)] leading-[var(--ds-line-relaxed)] flex-1 mb-6">
                  {cat.description}
                </p>
                <a
                  href={cat.ctaHref}
                  className={`inline-block text-center font-semibold px-6 py-3 rounded-xl transition ${cat.accent}`}
                >
                  {cat.ctaLabel}
                </a>
              </article>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
