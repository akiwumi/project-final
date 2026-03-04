import { useState } from "react";
import { motion } from "framer-motion";
import { Navbar } from "../components/layout/Navbar";
import { Footer } from "../components/layout/Footer";
import { Quote, Star, ArrowRight, Play } from "lucide-react";

function CTAButton({ href, children, variant = "gold" }) {
  const styles = {
    gold: "bg-[var(--ds-accent)] text-[var(--ds-text-on-dark)] hover:bg-[var(--ds-accent-hover)]",
    outline:
      "border-2 border-[var(--ds-text-on-dark)] text-[var(--ds-text-on-dark)] hover:bg-[var(--ds-text-on-dark)] hover:text-[var(--ds-bg-dark)]",
    dark:
      "border-2 border-[var(--ds-border)] text-[var(--ds-text-primary)] hover:border-[var(--ds-accent)] hover:text-[var(--ds-accent)]",
  };
  return (
    <a
      href={href}
      className={`inline-flex items-center gap-2 px-8 py-3.5 rounded-full font-semibold text-sm transition shadow-md ${styles[variant]}`}
    >
      {children}
      <ArrowRight className="w-4 h-4" />
    </a>
  );
}

function ImgPlaceholder({ label, aspect = "aspect-video", className = "" }) {
  return (
    <div
      className={`${aspect} ${className} rounded-2xl bg-[var(--ds-bg-dark)]/5 border-2 border-dashed border-[var(--ds-border)] flex flex-col items-center justify-center gap-2`}
    >
      <div className="w-10 h-10 rounded-full bg-[var(--ds-accent)]/20 flex items-center justify-center">
        <svg className="w-5 h-5 text-[var(--ds-accent)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>
      <span className="text-xs text-[var(--ds-text-muted)] font-medium text-center px-4">{label}</span>
    </div>
  );
}

function VideoPlaceholder({ label }) {
  return (
    <div className="aspect-video rounded-2xl bg-[var(--ds-bg-dark)] border-2 border-dashed border-[var(--ds-accent)]/30 flex flex-col items-center justify-center gap-3 cursor-pointer group">
      <div className="w-14 h-14 rounded-full bg-[var(--ds-accent)]/20 flex items-center justify-center group-hover:bg-[var(--ds-accent)]/40 transition">
        <Play className="w-6 h-6 text-[var(--ds-accent)] ml-0.5" />
      </div>
      <span className="text-xs text-[var(--ds-text-on-dark)]/60 font-medium text-center px-4">{label}</span>
    </div>
  );
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const TABS = ["All", "Entrepreneurs", "Investors", "Service Providers"];

const TESTIMONIALS = [
  {
    role: "Entrepreneurs",
    name: "Kwame Asante",
    title: "Founder & CEO",
    company: "AgriTech East Africa",
    country: "Kenya",
    flag: "🇰🇪",
    stars: 5,
    quote:
      "Within two weeks of listing our project on Connect Africa we had three serious expressions of interest from investors we never would have reached through our network. The structure of the platform meant investors came to us already informed — the conversations were substantive from day one.",
    outcome: "Raised €350,000 — Series A",
    imgLabel: "Photo of Kwame Asante",
  },
  {
    role: "Investors",
    name: "Sarah Mitchell",
    title: "Partner",
    company: "Global Ventures LP",
    country: "United Kingdom",
    flag: "🇬🇧",
    stars: 5,
    quote:
      "Connect Africa gave me access to a quality of deal flow I simply couldn't find on other platforms. The verification layer is what makes the difference. I know that when I open a listing, the fundamentals have already been checked. It saves weeks of preliminary due diligence.",
    outcome: "3 investments closed across 2 countries",
    imgLabel: "Photo of Sarah Mitchell",
  },
  {
    role: "Service Providers",
    name: "Amara Diallo",
    title: "Managing Partner",
    company: "Diallo Legal & Compliance",
    country: "Nigeria",
    flag: "🇳🇬",
    stars: 5,
    quote:
      "Being a verified provider on Connect Africa completely changed our client acquisition. We no longer cold-pitch — clients come to us at exactly the moment they need legal support in a cross-border deal. The quality of leads is outstanding.",
    outcome: "40% increase in qualified leads year 1",
    imgLabel: "Photo of Amara Diallo",
  },
  {
    role: "Entrepreneurs",
    name: "Fatima Nkosi",
    title: "Co-Founder",
    company: "HealthLink Ventures",
    country: "South Africa",
    flag: "🇿🇦",
    stars: 5,
    quote:
      "The submission process felt rigorous — which is exactly what we needed. Going through the verification gave us the confidence to present to investors knowing our documentation was airtight. We're now in active discussion with two investor groups.",
    outcome: "Currently in due diligence — €1.2M target",
    imgLabel: "Photo of Fatima Nkosi",
  },
  {
    role: "Investors",
    name: "James Laurent",
    title: "Director",
    company: "Meridian Impact Fund",
    country: "France",
    flag: "🇫🇷",
    stars: 5,
    quote:
      "I've used several platforms to source African investment opportunities. Connect Africa is in a different category. The combination of structured listings, mandatory phone verification, and clear deal workflows makes it the only platform I now recommend to colleagues.",
    outcome: "2 portfolio companies sourced via platform",
    imgLabel: "Photo of James Laurent",
  },
  {
    role: "Entrepreneurs",
    name: "Chidi Okonkwo",
    title: "Founder",
    company: "SolarGrid Nigeria",
    country: "Nigeria",
    flag: "🇳🇬",
    stars: 5,
    quote:
      "We had tried multiple fundraising routes before Connect Africa. The difference is credibility. When an investor sees your listing here they already trust the basics. Our pitch meetings are now about vision and growth — not proving we're legitimate.",
    outcome: "Seed round of €280,000 closed",
    imgLabel: "Photo of Chidi Okonkwo",
  },
];

const CASE_STUDIES = [
  {
    company: "AgriPay Ghana",
    sector: "FinTech",
    country: "Ghana",
    flag: "🇬🇭",
    headline: "From unknown startup to funded in 60 days",
    summary:
      "AgriPay submitted their mobile payments platform for smallholder farmers in February. Within 60 days they had completed verification, received 9 expressions of investor interest, and entered due diligence with two European impact funds.",
    amount: "€150,000 raised",
    timeline: "60 days from listing to term sheet",
    imgLabel: "AgriPay team in the field with farmers",
  },
  {
    company: "EduReach Africa",
    sector: "EdTech",
    country: "Nigeria",
    flag: "🇳🇬",
    headline: "How a Series A raise became a partnership network",
    summary:
      "EduReach used Connect Africa not just to raise capital but to find the legal and compliance partners they needed to operate across three jurisdictions. Their investor, introduced via the platform, also connected them with a ministry partnership in Ethiopia.",
    amount: "€1.5M raised",
    timeline: "4 months from submission to close",
    imgLabel: "EduReach tablet deployment in rural school",
  },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export function TestimonialsPage() {
  const [activeTab, setActiveTab] = useState("All");

  const filtered =
    activeTab === "All"
      ? TESTIMONIALS
      : TESTIMONIALS.filter((t) => t.role === activeTab);

  return (
    <div className="min-h-screen bg-[var(--ds-bg-light)]">
      <Navbar />
      <main className="pt-16">

        {/* ── Hero ── */}
        <section className="bg-[var(--ds-bg-dark)] text-[var(--ds-text-on-dark)] py-24 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <motion.p
              className="text-xs uppercase tracking-[0.2em] text-[var(--ds-accent)] mb-4 font-medium"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
            >
              Testimonials
            </motion.p>
            <motion.h1
              className="text-4xl sm:text-5xl font-bold mb-6"
              style={{ fontFamily: "var(--ds-font-display)", fontStyle: "italic", lineHeight: "var(--ds-line-tight)" }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              Real people. Real deals. Real results.
            </motion.h1>
            <motion.p
              className="text-[var(--ds-text-on-dark)]/70 text-lg leading-relaxed max-w-2xl mx-auto mb-10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              Entrepreneurs have raised capital. Investors have found opportunities they couldn't access elsewhere.
              Service providers have built thriving practices. Here's what they have to say.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <CTAButton href="/choose-role">Join them today</CTAButton>
            </motion.div>
          </div>
        </section>

        {/* ── Featured video testimonials ── */}
        <section className="py-16 px-4 bg-[var(--ds-surface)]">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-10">
              <p className="text-xs uppercase tracking-[0.2em] text-[var(--ds-accent)] mb-3 font-medium">
                Video Stories
              </p>
              <h2
                className="text-2xl sm:text-3xl font-bold text-[var(--ds-text-primary)]"
                style={{ fontFamily: "var(--ds-font-display)", fontStyle: "italic" }}
              >
                Hear it directly from our users
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {[
                "Kwame Asante — How Connect Africa changed our fundraising approach",
                "Sarah Mitchell — Why verified deal flow matters for investors",
                "Amara Diallo — Growing a cross-border legal practice through the platform",
              ].map((label) => (
                <VideoPlaceholder key={label} label={label} />
              ))}
            </div>
          </div>
        </section>

        {/* ── Testimonial cards ── */}
        <section className="py-20 px-4 bg-[var(--ds-bg-light)]">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-10">
              <p className="text-xs uppercase tracking-[0.2em] text-[var(--ds-accent)] mb-3 font-medium">
                What Our Users Say
              </p>
              <h2
                className="text-2xl sm:text-3xl font-bold text-[var(--ds-text-primary)] mb-8"
                style={{ fontFamily: "var(--ds-font-display)", fontStyle: "italic" }}
              >
                Across every role, across the continent
              </h2>

              {/* Filter tabs */}
              <div className="flex flex-wrap justify-center gap-2">
                {TABS.map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setActiveTab(tab)}
                    className={`px-5 py-2 rounded-full text-sm font-medium transition ${
                      activeTab === tab
                        ? "bg-[var(--ds-accent)] text-[var(--ds-text-on-dark)]"
                        : "bg-white border border-[var(--ds-border)] text-[var(--ds-text-secondary)] hover:border-[var(--ds-accent)]/50"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" layout>
              {filtered.map((t, i) => (
                <motion.article
                  key={t.name}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                  className="bg-white rounded-2xl p-6 border border-[var(--ds-border)] hover:shadow-md transition-shadow flex flex-col"
                >
                  {/* Stars */}
                  <div className="flex gap-0.5 mb-4">
                    {Array.from({ length: t.stars }).map((_, j) => (
                      <Star key={j} className="w-3.5 h-3.5 fill-[var(--ds-accent)] text-[var(--ds-accent)]" />
                    ))}
                  </div>

                  {/* Quote */}
                  <Quote className="w-7 h-7 text-[var(--ds-accent)] mb-3 shrink-0" />
                  <p className="text-sm text-[var(--ds-text-secondary)] leading-relaxed italic flex-1 mb-4">
                    &ldquo;{t.quote}&rdquo;
                  </p>

                  {/* Outcome badge */}
                  <div className="mb-5 px-3 py-2 rounded-xl bg-[var(--ds-accent-green)]/10 text-[var(--ds-accent-green)] text-xs font-semibold">
                    {t.outcome}
                  </div>

                  {/* Author */}
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[var(--ds-accent)]/10 border-2 border-dashed border-[var(--ds-accent)]/30 flex items-center justify-center text-[var(--ds-accent)] font-bold text-sm shrink-0">
                      {t.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-[var(--ds-text-primary)]">
                        {t.name} {t.flag}
                      </p>
                      <p className="text-xs text-[var(--ds-text-muted)]">
                        {t.title} · {t.company}
                      </p>
                    </div>
                  </div>
                </motion.article>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ── Case studies ── */}
        <section className="py-20 px-4 bg-[var(--ds-surface)]">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <p className="text-xs uppercase tracking-[0.2em] text-[var(--ds-accent)] mb-3 font-medium">
                Case Studies
              </p>
              <h2
                className="text-2xl sm:text-3xl font-bold text-[var(--ds-text-primary)]"
                style={{ fontFamily: "var(--ds-font-display)", fontStyle: "italic" }}
              >
                Success in depth
              </h2>
            </div>

            <div className="space-y-10">
              {CASE_STUDIES.map((cs, i) => (
                <motion.div
                  key={cs.company}
                  className={`flex flex-col ${i % 2 === 1 ? "lg:flex-row-reverse" : "lg:flex-row"} gap-10 items-center`}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-lg">{cs.flag}</span>
                      <span className="text-xs text-[var(--ds-text-muted)] font-medium uppercase tracking-wider">
                        {cs.sector} · {cs.country}
                      </span>
                    </div>
                    <h3
                      className="text-xl font-bold text-[var(--ds-text-primary)] mb-3"
                      style={{ fontFamily: "var(--ds-font-display)", fontStyle: "italic" }}
                    >
                      {cs.headline}
                    </h3>
                    <p className="text-sm text-[var(--ds-text-secondary)] leading-relaxed mb-6">
                      {cs.summary}
                    </p>
                    <div className="flex gap-6 mb-6">
                      <div>
                        <p className="text-xs text-[var(--ds-text-muted)] mb-0.5">Result</p>
                        <p className="text-sm font-bold text-[var(--ds-accent-green)]">{cs.amount}</p>
                      </div>
                      <div>
                        <p className="text-xs text-[var(--ds-text-muted)] mb-0.5">Timeline</p>
                        <p className="text-sm font-bold text-[var(--ds-text-primary)]">{cs.timeline}</p>
                      </div>
                    </div>
                    <CTAButton href="/how-it-works" variant="dark">See how they did it</CTAButton>
                  </div>
                  <div className="flex-1 w-full">
                    <ImgPlaceholder label={cs.imgLabel} aspect="aspect-[4/3]" />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Bottom CTA ── */}
        <section className="py-20 px-4 bg-[var(--ds-bg-dark)] text-[var(--ds-text-on-dark)] text-center">
          <div className="max-w-2xl mx-auto">
            <motion.h2
              className="text-3xl font-bold mb-4"
              style={{ fontFamily: "var(--ds-font-display)", fontStyle: "italic" }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              Your success story starts here
            </motion.h2>
            <p className="text-[var(--ds-text-on-dark)]/70 mb-8 text-sm leading-relaxed">
              Join the entrepreneurs, investors, and service providers who are already
              building the next chapter of African investment.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <CTAButton href="/choose-role">Create your account</CTAButton>
              <CTAButton href="/why-us" variant="outline">Why Connect Africa</CTAButton>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}
