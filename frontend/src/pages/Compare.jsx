import { useEffect } from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Footer } from "../components/layout/Footer";
import { Navbar } from "../components/layout/Navbar";
import { setBreadcrumbSchema, setPageSeo } from "../lib/seo";

const SITE_URL = "https://stirling-qr.com";
const COMPARE_PATH = "/compare";
const COMPARE_TITLE = "QR Platform Comparisons | Stirling QR Alternatives";
const COMPARE_DESCRIPTION =
  "Compare Stirling QR with QRCode Monkey, QR TIGER, and ME-QR to choose the best platform for dynamic campaigns, branding, and analytics.";

const COMPARE_PAGES = [
  {
    title: "Stirling QR vs QRCode Monkey",
    body: "For teams moving from static-only generation to editable, measurable QR campaigns.",
    to: "/compare/qr-code-monkey-alternative",
  },
  {
    title: "Stirling QR vs QR TIGER",
    body: "For teams that want campaign control and branding depth with faster day-to-day execution.",
    to: "/compare/qr-tiger-alternative",
  },
  {
    title: "Stirling QR vs ME-QR",
    body: "For teams that need marketing-grade QR workflows, not just occasional code generation.",
    to: "/compare/me-qr-alternative",
  },
];

export function ComparePage() {
  useEffect(() => {
    const canonicalUrl = `${SITE_URL}${COMPARE_PATH}`;
    const cleanupSeo = setPageSeo({
      title: COMPARE_TITLE,
      description: COMPARE_DESCRIPTION,
      url: canonicalUrl,
      ogType: "website",
    });
    const cleanupBreadcrumbSchema = setBreadcrumbSchema(
      [
        { name: "Home", url: `${SITE_URL}/` },
        { name: "Compare", url: canonicalUrl },
      ],
      "breadcrumb-compare"
    );

    return () => {
      cleanupSeo();
      cleanupBreadcrumbSchema();
    };
  }, []);

  return (
    <div className="min-h-screen bg-[var(--ds-bg-light)]">
      <Navbar />
      <main className="pt-16">
        <section className="bg-[var(--ds-bg-dark)] text-[var(--ds-text-on-dark)] px-4 py-20">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-xs uppercase tracking-[0.2em] text-[var(--ds-accent)] mb-4 font-medium">
              Compare Platforms
            </p>
            <h1
              className="text-4xl sm:text-5xl font-bold leading-tight mb-6"
              style={{ fontFamily: "var(--ds-font-display)", fontStyle: "italic" }}
            >
              Choose the Right QR Platform for Your Growth Stage
            </h1>
            <p className="text-[var(--ds-text-on-dark)]/75 text-lg leading-relaxed max-w-3xl mx-auto">
              Explore side-by-side breakdowns of Stirling QR against major QR tools so you can pick based on campaign
              needs, workflow complexity, and optimization goals.
            </p>
          </div>
        </section>

        <section className="px-4 py-16 bg-[var(--ds-surface)]">
          <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-6">
            {COMPARE_PAGES.map((page) => (
              <article key={page.to} className="bg-white border border-[var(--ds-border)] rounded-2xl p-6">
                <h2
                  className="text-2xl text-[var(--ds-text-primary)] font-bold mb-3"
                  style={{ fontFamily: "var(--ds-font-display)", fontStyle: "italic" }}
                >
                  {page.title}
                </h2>
                <p className="text-[var(--ds-text-secondary)] leading-relaxed mb-6">{page.body}</p>
                <Link
                  to={page.to}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--ds-accent-green)] hover:underline"
                >
                  Read comparison
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </article>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
