import { useEffect } from "react";
import { ArrowRight, CheckCircle2, Circle, XCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { Footer } from "../components/layout/Footer";
import { Navbar } from "../components/layout/Navbar";
import { setBreadcrumbSchema, setFaqSchema, setPageSeo } from "../lib/seo";

const SITE_URL = "https://stirling-qr.com";

const COMPARISON_PAGES = {
  qrcodeMonkey: {
    path: "/compare/qr-code-monkey-alternative",
    breadcrumbName: "QRCode Monkey Alternative",
    metaTitle: "Best QRCode Monkey Alternative for Dynamic QR Campaigns (2026)",
    metaDescription:
      "Looking for a QRCode Monkey alternative? Compare Stirling QR vs QRCode Monkey for dynamic edits, analytics, branding, and marketing workflows.",
    heroEyebrow: "QRCode Monkey Alternative",
    heroTitle: "A Better QRCode Monkey Alternative for Teams That Need More Than Static QR Codes",
    heroBody:
      "QRCode Monkey is popular for fast static codes. Stirling QR is built for teams that need destination edits, campaign analytics, and brand control in one place.",
    primaryCta: { label: "Start Building Dynamic QR Campaigns", href: "https://stirling-qr.com" },
    secondaryCta: { label: "See Live Demo", href: "https://stirling-qr.com/demo" },
    quickDecision: {
      leftTitle: "Choose QRCode Monkey if",
      leftBody: "You only need one-off static QR codes for simple print use.",
      rightTitle: "Choose Stirling QR if",
      rightBody:
        "You need to update links after printing, track results, and run QR as a repeatable marketing channel.",
    },
    comparisonRows: [
      { label: "Static QR code creation", us: "Yes", them: "Yes" },
      { label: "Dynamic QR destination edits", us: "Yes", them: "Limited" },
      { label: "Campaign-level analytics", us: "Yes", them: "Limited in basic free flow" },
      { label: "Brand controls (logo, colors, style)", us: "Yes", them: "Yes" },
      { label: "Team marketing workflow focus", us: "Yes", them: "Mostly design-first static generation" },
      { label: "Built for post-print optimization", us: "Yes", them: "Limited" },
    ],
    reasonsTitle: "Why teams switch from QRCode Monkey to Stirling QR",
    reasons: [
      {
        title: "Update destinations without reprinting",
        body: "When campaigns change, your QR should not become obsolete. Keep one printed code while updating where it sends users.",
      },
      {
        title: "Measure what actually works",
        body: "Track scan performance by campaign, channel, and placement so you can improve ROI over time.",
      },
      {
        title: "Keep branding consistent at scale",
        body: "Apply reusable design patterns across packaging, posters, flyers, menus, and retail displays.",
      },
    ],
    competitorStrengthsTitle: "Where QRCode Monkey is still strong",
    competitorStrengths: [
      "Fast for simple one-off static generation",
      "Familiar UI for quick design and download",
      "Good fit for non-marketing use cases without tracking",
    ],
    bestChoice: {
      usTitle: "Use Stirling QR",
      usItems: [
        "Product packaging",
        "Events and lead generation",
        "Menus and local campaigns",
        "Retail promotions and attribution",
      ],
      themTitle: "Use QRCode Monkey",
      themItems: ["Quick static code for short-term, non-measured usage"],
    },
    faq: [
      {
        q: "Can I migrate existing QR campaigns?",
        a: "Yes. Most teams migrate active campaigns first, then replace older static assets over time.",
      },
      {
        q: "Will dynamic QR hurt scan speed?",
        a: "No. With a solid setup, users still get a fast scan experience while your team keeps post-print flexibility.",
      },
      {
        q: "Is this better for marketing teams?",
        a: "Yes. It is designed for teams that need ongoing testing and optimization, not only one-time code generation.",
      },
    ],
    finalCtaTitle: "Ready to move beyond static QR codes?",
    finalCtaBody: "Build your first campaign and optimize scan performance from day one.",
    finalCtaButton: { label: "Create My First Campaign", href: "https://stirling-qr.com" },
  },
  qrTiger: {
    path: "/compare/qr-tiger-alternative",
    breadcrumbName: "QR TIGER Alternative",
    metaTitle: "Top QR TIGER Alternative for Custom QR Marketing | Stirling QR",
    metaDescription:
      "Compare Stirling QR vs QR TIGER and choose the right platform for dynamic QR campaigns, customization, analytics, and marketing execution.",
    heroEyebrow: "QR TIGER Alternative",
    heroTitle: "Stirling QR vs QR TIGER: Which Platform Fits Your QR Marketing Workflow?",
    heroBody:
      "QR TIGER is feature-rich and well known. Stirling QR is built for teams that want deep customization and campaign control without unnecessary complexity.",
    primaryCta: { label: "Try Stirling QR", href: "https://stirling-qr.com" },
    secondaryCta: { label: "Compare Features", href: "https://stirling-qr.com/features" },
    quickDecision: {
      leftTitle: "Choose QR TIGER if",
      leftBody: "You need a broader enterprise-style toolset and a deep third-party integration footprint.",
      rightTitle: "Choose Stirling QR if",
      rightBody: "You want a cleaner workflow for customizable QR marketing campaigns and fast execution.",
    },
    comparisonRows: [
      { label: "Dynamic QR campaign management", us: "Yes", them: "Yes" },
      { label: "Deep branding and customization", us: "Yes", them: "Yes" },
      { label: "Marketing workflow simplicity", us: "Strong focus", them: "Feature-rich, can feel heavier for small teams" },
      { label: "Post-print campaign changes", us: "Yes", them: "Yes" },
      { label: "Analytics for performance decisions", us: "Yes", them: "Yes" },
      { label: "Best fit", us: "SMB and growth teams", them: "Integration-heavy teams" },
    ],
    reasonsTitle: "Why brands choose Stirling QR over QR TIGER",
    reasons: [
      {
        title: "Faster setup for campaign teams",
        body: "Reduce setup friction so your team can launch quickly and iterate often.",
      },
      {
        title: "Strong customization without bloat",
        body: "Use design and control options that matter for brand consistency and conversion outcomes.",
      },
      {
        title: "Built for practical execution",
        body: "Support the full loop from print to scan to conversion, then optimize with clear performance data.",
      },
    ],
    competitorStrengthsTitle: "When QR TIGER may be the better fit",
    competitorStrengths: [
      "You need specific third-party integrations on day one",
      "Your team already runs multi-tool automation around QR operations",
      "You prefer a broad platform footprint even with longer onboarding",
    ],
    bestChoice: {
      usTitle: "Choose Stirling QR",
      usItems: [
        "Lean marketing teams",
        "Agencies and ecommerce brands",
        "Growth teams optimizing speed and ROI",
      ],
      themTitle: "Choose QR TIGER",
      themItems: ["Teams with established enterprise workflows and integration-heavy requirements"],
    },
    faq: [
      {
        q: "Is Stirling QR only for small businesses?",
        a: "No. It works for fast-moving SMB teams and larger teams that prioritize agility and clean execution.",
      },
      {
        q: "Can I keep strict brand standards?",
        a: "Yes. You can set and maintain consistent styling across online and offline campaign assets.",
      },
      {
        q: "Can I optimize campaigns over time?",
        a: "Yes. Scan tracking helps improve placements, creative, and conversion outcomes.",
      },
    ],
    finalCtaTitle: "Want enterprise outcomes without enterprise friction?",
    finalCtaBody: "Launch your next QR campaign with a workflow built for speed and control.",
    finalCtaButton: { label: "Launch My Campaign", href: "https://stirling-qr.com" },
  },
  meQr: {
    path: "/compare/me-qr-alternative",
    breadcrumbName: "ME-QR Alternative",
    metaTitle: "Best ME-QR Alternative for Branded Dynamic QR Campaigns (2026)",
    metaDescription:
      "Compare Stirling QR vs ME-QR for dynamic QR control, scan analytics, branding, and a cleaner marketing-focused experience.",
    heroEyebrow: "ME-QR Alternative",
    heroTitle: "Looking for a Better ME-QR Alternative? Meet Stirling QR",
    heroBody:
      "ME-QR helps users generate QR codes quickly. Stirling QR is built for serious marketing execution with campaign control and conversion-focused optimization.",
    primaryCta: { label: "Start With Stirling QR", href: "https://stirling-qr.com" },
    secondaryCta: { label: "See Comparison", href: "https://stirling-qr.com/features" },
    quickDecision: {
      leftTitle: "Choose ME-QR if",
      leftBody: "You only need occasional codes for low-stakes usage.",
      rightTitle: "Choose Stirling QR if",
      rightBody: "You need scalable, brand-controlled campaigns with measurable outcomes.",
    },
    comparisonRows: [
      { label: "Dynamic QR campaign control", us: "Yes", them: "Yes" },
      { label: "Marketing-first workflow", us: "Yes", them: "General-purpose" },
      { label: "Brand consistency controls", us: "Yes", them: "Yes" },
      { label: "Scan analytics for optimization", us: "Yes", them: "Yes" },
      { label: "Built for growth campaigns", us: "Strong focus", them: "Varies by plan and setup" },
      { label: "Best for", us: "Performance marketing teams", them: "Mixed personal and business use" },
    ],
    reasonsTitle: "Why teams move from ME-QR to Stirling QR",
    reasons: [
      {
        title: "Cleaner path from scan to conversion",
        body: "Deliver a predictable user journey with strong branding and fewer campaign-side surprises.",
      },
      {
        title: "Better fit for repeatable systems",
        body: "Run campaigns as a long-term growth channel instead of relying on one-off code generation.",
      },
      {
        title: "More confidence for printed assets",
        body: "When QR is on packaging or offline media, stable management and fast destination control are critical.",
      },
    ],
    competitorStrengthsTitle: "Where ME-QR may still work well",
    competitorStrengths: [
      "Personal projects and occasional low-stakes use",
      "Early-stage teams testing QR adoption before scaling",
      "Users who prefer broad all-purpose generator style tools",
    ],
    bestChoice: {
      usTitle: "Choose Stirling QR",
      usItems: [
        "Revenue and lead generation campaigns",
        "Retention and lifecycle workflows",
        "Teams that need measurable campaign outcomes",
      ],
      themTitle: "Choose ME-QR",
      themItems: ["Occasional usage where campaign performance is not business-critical"],
    },
    faq: [
      {
        q: "Is Stirling QR hard to adopt?",
        a: "No. Most teams launch quickly and expand usage as campaign needs grow.",
      },
      {
        q: "Can I run static and dynamic campaigns together?",
        a: "Yes. Teams often start with both and increase dynamic usage as optimization needs grow.",
      },
      {
        q: "Does this support brand-focused design?",
        a: "Yes. Design controls help keep scan experiences aligned with your visual identity.",
      },
    ],
    finalCtaTitle: "Ready for a true marketing-grade ME-QR alternative?",
    finalCtaBody: "Run branded, measurable QR campaigns with confidence.",
    finalCtaButton: { label: "Get Started With Stirling QR", href: "https://stirling-qr.com" },
  },
};

const COMPARISON_LINKS = [
  {
    key: "qrcodeMonkey",
    label: "Stirling QR vs QRCode Monkey",
    to: "/compare/qr-code-monkey-alternative",
  },
  {
    key: "qrTiger",
    label: "Stirling QR vs QR TIGER",
    to: "/compare/qr-tiger-alternative",
  },
  {
    key: "meQr",
    label: "Stirling QR vs ME-QR",
    to: "/compare/me-qr-alternative",
  },
];

function SectionTitle({ eyebrow, title, body }) {
  return (
    <div className="max-w-3xl">
      {eyebrow ? (
        <p className="text-xs uppercase tracking-[0.2em] text-[var(--ds-accent)] mb-3 font-medium">
          {eyebrow}
        </p>
      ) : null}
      <h2
        className="text-3xl sm:text-4xl font-bold text-[var(--ds-text-primary)] mb-4"
        style={{ fontFamily: "var(--ds-font-display)", fontStyle: "italic" }}
      >
        {title}
      </h2>
      {body ? <p className="text-[var(--ds-text-secondary)] leading-relaxed">{body}</p> : null}
    </div>
  );
}

function BulletList({ items }) {
  return (
    <ul className="space-y-2">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-2 text-[var(--ds-text-secondary)]">
          <CheckCircle2 className="w-4 h-4 mt-1 shrink-0 text-[var(--ds-accent-green)]" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function ComparisonCell({ value, isUs }) {
  if (value === "Yes") {
    return (
      <span className={`inline-flex items-center gap-1.5 font-medium ${isUs ? "text-[var(--ds-accent-green)]" : "text-[var(--ds-text-primary)]"}`}>
        <CheckCircle2 className="w-4 h-4" />
        Yes
      </span>
    );
  }

  if (value === "No") {
    return (
      <span className="inline-flex items-center gap-1.5 font-medium text-[var(--ds-text-muted)]">
        <XCircle className="w-4 h-4" />
        No
      </span>
    );
  }

  return <span className="text-[var(--ds-text-secondary)]">{value}</span>;
}

function CtaLink({ href, label, secondary = false }) {
  return (
    <a
      href={href}
      className={`inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold transition ${
        secondary
          ? "border border-[var(--ds-text-on-dark)] text-[var(--ds-text-on-dark)] hover:bg-[var(--ds-text-on-dark)] hover:text-[var(--ds-bg-dark)]"
          : "bg-[var(--ds-accent)] text-[var(--ds-bg-dark)] hover:bg-[var(--ds-accent-hover)]"
      }`}
    >
      {label}
      <ArrowRight className="w-4 h-4" />
    </a>
  );
}

function ComparisonPage({ pageKey }) {
  const data = COMPARISON_PAGES[pageKey];
  const relatedPages = COMPARISON_LINKS.filter((page) => page.key !== pageKey);

  useEffect(() => {
    const canonicalUrl = `${SITE_URL}${data.path}`;
    const cleanupSeo = setPageSeo({
      title: data.metaTitle,
      description: data.metaDescription,
      url: canonicalUrl,
      ogType: "article",
    });
    const cleanupFaqSchema = setFaqSchema(data.faq, `faq-${pageKey}`);
    const cleanupBreadcrumbSchema = setBreadcrumbSchema(
      [
        { name: "Home", url: `${SITE_URL}/` },
        { name: "Compare", url: `${SITE_URL}/compare` },
        { name: data.breadcrumbName, url: canonicalUrl },
      ],
      `breadcrumb-${pageKey}`
    );

    return () => {
      cleanupSeo();
      cleanupFaqSchema();
      cleanupBreadcrumbSchema();
    };
  }, [data.breadcrumbName, data.faq, data.metaDescription, data.metaTitle, data.path, pageKey]);

  return (
    <div className="min-h-screen bg-[var(--ds-bg-light)]">
      <Navbar />
      <main className="pt-16">
        <section className="bg-[var(--ds-bg-dark)] text-[var(--ds-text-on-dark)] px-4 py-20">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-xs uppercase tracking-[0.2em] text-[var(--ds-accent)] mb-4 font-medium">
              {data.heroEyebrow}
            </p>
            <h1
              className="text-4xl sm:text-5xl font-bold leading-tight mb-6"
              style={{ fontFamily: "var(--ds-font-display)", fontStyle: "italic" }}
            >
              {data.heroTitle}
            </h1>
            <p className="text-[var(--ds-text-on-dark)]/75 text-lg leading-relaxed max-w-3xl mx-auto mb-10">
              {data.heroBody}
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <CtaLink href={data.primaryCta.href} label={data.primaryCta.label} />
              <CtaLink href={data.secondaryCta.href} label={data.secondaryCta.label} secondary />
            </div>
          </div>
        </section>

        <section className="px-4 py-16 bg-[var(--ds-surface)]">
          <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-6">
            <div className="border border-[var(--ds-border)] rounded-2xl bg-white p-7">
              <h2
                className="text-xl font-bold text-[var(--ds-text-primary)] mb-3"
                style={{ fontFamily: "var(--ds-font-display)", fontStyle: "italic" }}
              >
                {data.quickDecision.leftTitle}
              </h2>
              <p className="text-[var(--ds-text-secondary)] leading-relaxed">{data.quickDecision.leftBody}</p>
            </div>
            <div className="border border-[var(--ds-border)] rounded-2xl bg-white p-7">
              <h2
                className="text-xl font-bold text-[var(--ds-text-primary)] mb-3"
                style={{ fontFamily: "var(--ds-font-display)", fontStyle: "italic" }}
              >
                {data.quickDecision.rightTitle}
              </h2>
              <p className="text-[var(--ds-text-secondary)] leading-relaxed">{data.quickDecision.rightBody}</p>
            </div>
          </div>
        </section>

        <section className="px-4 py-16 bg-[var(--ds-bg-light)]">
          <div className="max-w-6xl mx-auto">
            <SectionTitle
              eyebrow="Feature Comparison"
              title="What Changes in Day-to-Day Campaign Work"
              body="Use this view to decide which platform best matches your campaign complexity and measurement needs."
            />
            <div className="mt-8 overflow-x-auto border border-[var(--ds-border)] rounded-2xl bg-white">
              <table className="w-full min-w-[700px]">
                <thead className="bg-[var(--ds-bg-dark)] text-[var(--ds-text-on-dark)]">
                  <tr>
                    <th className="text-left p-4 text-sm font-semibold">What teams care about</th>
                    <th className="text-left p-4 text-sm font-semibold">Stirling QR</th>
                    <th className="text-left p-4 text-sm font-semibold">Alternative</th>
                  </tr>
                </thead>
                <tbody>
                  {data.comparisonRows.map((row, index) => (
                    <tr key={row.label} className={index % 2 === 0 ? "bg-white" : "bg-[#fcfaf6]"}>
                      <td className="p-4 font-medium text-[var(--ds-text-primary)]">{row.label}</td>
                      <td className="p-4">
                        <ComparisonCell value={row.us} isUs />
                      </td>
                      <td className="p-4">
                        <ComparisonCell value={row.them} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section className="px-4 py-16 bg-[var(--ds-surface)]">
          <div className="max-w-6xl mx-auto">
            <SectionTitle title={data.reasonsTitle} />
            <div className="mt-8 grid md:grid-cols-3 gap-6">
              {data.reasons.map((reason) => (
                <article key={reason.title} className="bg-white border border-[var(--ds-border)] rounded-2xl p-6">
                  <h3
                    className="text-xl text-[var(--ds-text-primary)] font-bold mb-3"
                    style={{ fontFamily: "var(--ds-font-display)", fontStyle: "italic" }}
                  >
                    {reason.title}
                  </h3>
                  <p className="text-[var(--ds-text-secondary)] leading-relaxed">{reason.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="px-4 py-16 bg-[var(--ds-bg-light)]">
          <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-8">
            <div className="bg-white border border-[var(--ds-border)] rounded-2xl p-7">
              <h2
                className="text-2xl font-bold text-[var(--ds-text-primary)] mb-5"
                style={{ fontFamily: "var(--ds-font-display)", fontStyle: "italic" }}
              >
                {data.competitorStrengthsTitle}
              </h2>
              <ul className="space-y-3">
                {data.competitorStrengths.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-[var(--ds-text-secondary)]">
                    <Circle className="w-3 h-3 mt-2 shrink-0 text-[var(--ds-text-muted)]" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-white border border-[var(--ds-border)] rounded-2xl p-7">
              <h2
                className="text-2xl font-bold text-[var(--ds-text-primary)] mb-5"
                style={{ fontFamily: "var(--ds-font-display)", fontStyle: "italic" }}
              >
                Best Choice by Use Case
              </h2>
              <h3 className="font-semibold text-[var(--ds-text-primary)] mb-2">{data.bestChoice.usTitle}</h3>
              <BulletList items={data.bestChoice.usItems} />
              <h3 className="font-semibold text-[var(--ds-text-primary)] mt-5 mb-2">{data.bestChoice.themTitle}</h3>
              <BulletList items={data.bestChoice.themItems} />
            </div>
          </div>
        </section>

        <section className="px-4 py-16 bg-[var(--ds-surface)]">
          <div className="max-w-6xl mx-auto">
            <SectionTitle title="FAQ" />
            <div className="mt-8 grid md:grid-cols-3 gap-6">
              {data.faq.map((item) => (
                <article key={item.q} className="bg-white border border-[var(--ds-border)] rounded-2xl p-6">
                  <h3
                    className="text-lg text-[var(--ds-text-primary)] font-bold mb-3"
                    style={{ fontFamily: "var(--ds-font-display)", fontStyle: "italic" }}
                  >
                    {item.q}
                  </h3>
                  <p className="text-[var(--ds-text-secondary)] leading-relaxed">{item.a}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="px-4 py-12 bg-[var(--ds-bg-light)]">
          <div className="max-w-6xl mx-auto">
            <SectionTitle
              title="Also Compare"
              body="Review other side-by-side breakdowns to find the best fit for your team."
            />
            <div className="mt-6 grid md:grid-cols-2 gap-4">
              {relatedPages.map((page) => (
                <Link
                  key={page.to}
                  to={page.to}
                  className="inline-flex items-center justify-between gap-3 rounded-2xl border border-[var(--ds-border)] bg-white px-5 py-4 text-[var(--ds-text-primary)] hover:border-[var(--ds-accent)] transition"
                >
                  <span className="font-medium">{page.label}</span>
                  <ArrowRight className="w-4 h-4 text-[var(--ds-accent-green)]" />
                </Link>
              ))}
            </div>
            <Link
              to="/compare"
              className="inline-flex items-center gap-2 mt-5 text-sm font-semibold text-[var(--ds-accent-green)] hover:underline"
            >
              View all comparisons
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>

        <section className="px-4 pb-20 bg-[var(--ds-bg-dark)] text-[var(--ds-text-on-dark)]">
          <div className="max-w-4xl mx-auto text-center border border-white/10 rounded-3xl px-6 py-14">
            <h2
              className="text-3xl sm:text-4xl font-bold mb-4"
              style={{ fontFamily: "var(--ds-font-display)", fontStyle: "italic" }}
            >
              {data.finalCtaTitle}
            </h2>
            <p className="text-[var(--ds-text-on-dark)]/75 max-w-2xl mx-auto mb-8">{data.finalCtaBody}</p>
            <CtaLink href={data.finalCtaButton.href} label={data.finalCtaButton.label} />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

export function QRCodeMonkeyAlternativePage() {
  return <ComparisonPage pageKey="qrcodeMonkey" />;
}

export function QRTigerAlternativePage() {
  return <ComparisonPage pageKey="qrTiger" />;
}

export function MEQRAlternativePage() {
  return <ComparisonPage pageKey="meQr" />;
}
