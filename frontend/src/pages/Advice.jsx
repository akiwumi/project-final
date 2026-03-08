import { useState } from "react";
import { motion } from "framer-motion";
import { Navbar } from "../components/layout/Navbar";
import { Footer } from "../components/layout/Footer";
import { Clock, ArrowRight, BookOpen, TrendingUp, ShieldCheck, Globe2, Tag } from "lucide-react";

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

// ─── Data ─────────────────────────────────────────────────────────────────────

const CATEGORIES = [
  "All",
  "For Entrepreneurs",
  "For Investors",
  "Due Diligence",
  "Legal & Compliance",
  "Market Insights",
  "Fundraising",
];

const FEATURED = {
  category: "Fundraising",
  readTime: "8 min read",
  title: "How to write a pitch deck that serious investors actually read",
  excerpt:
    "Most pitch decks are ignored within the first 30 seconds. The ones that get through share a set of structural and narrative principles that are learnable — and that make the difference between a polite pass and a live conversation. We break down exactly what works and why.",
  author: "Connect Africa Editorial Team",
  date: "February 2026",
  imgLabel: "Entrepreneur preparing a pitch deck at a desk — editorial photography placeholder",
  tags: ["Pitch Deck", "Fundraising", "Entrepreneurs"],
};

const ARTICLES = [
  {
    category: "For Entrepreneurs",
    readTime: "6 min read",
    title: "The five documents every investor will ask for — and how to prepare them",
    excerpt:
      "Before you list your project, ensure you have these five documents in order. Investors move faster when everything is ready, and the quality of your documentation signals the quality of your operations.",
    author: "Connect Africa Team",
    date: "February 2026",
    imgLabel: "Documents and financial reports on a desk",
    tags: ["Due Diligence", "Documentation"],
  },
  {
    category: "For Investors",
    readTime: "7 min read",
    title: "Cross-border investment in Africa: what the numbers actually say",
    excerpt:
      "FDI into Africa grew 54% over the past decade. Yet the narrative of high risk persists. We look at the data — country by country, sector by sector — and what it means for investors building a diversified emerging markets portfolio.",
    author: "Market Insights Desk",
    date: "January 2026",
    imgLabel: "Data visualisation of investment flows across Africa",
    tags: ["Market Insights", "Data"],
  },
  {
    category: "Due Diligence",
    readTime: "9 min read",
    title: "A practical due diligence checklist for African ventures",
    excerpt:
      "Due diligence in emerging markets requires adapting standard processes to local realities — regulatory complexity, currency risk, data availability. This checklist covers every phase, from initial screening to final investment committee.",
    author: "Diallo Legal & Compliance",
    date: "January 2026",
    imgLabel: "Compliance documents and legal review materials",
    tags: ["Due Diligence", "Investors", "Legal"],
  },
  {
    category: "Legal & Compliance",
    readTime: "5 min read",
    title: "Registering a company across African jurisdictions: what you need to know",
    excerpt:
      "Expanding across African markets means navigating 54 different regulatory environments. We outline the core requirements, common pitfalls, and how to use local service providers effectively to stay compliant.",
    author: "Legal Advisory Panel",
    date: "December 2025",
    imgLabel: "Legal team discussing cross-border compliance",
    tags: ["Legal", "Compliance", "Entrepreneurs"],
  },
  {
    category: "Fundraising",
    readTime: "5 min read",
    title: "Seed vs Series A: understanding what investors expect at each stage",
    excerpt:
      "The jump from seed to Series A is not just about size — it's about proof. What metrics, team composition, and market validation do investors need to see before committing to a larger round? We lay out the benchmarks.",
    author: "Connect Africa Team",
    date: "December 2025",
    imgLabel: "Startup team reviewing growth charts at a whiteboard",
    tags: ["Fundraising", "Entrepreneurs", "Investors"],
  },
  {
    category: "Market Insights",
    readTime: "10 min read",
    title: "The sectors attracting the most investment in Africa right now",
    excerpt:
      "FinTech, CleanEnergy, and AgriTech continue to dominate, but EdTech and HealthTech are closing the gap fast. We analyse where capital is flowing, which markets are emerging, and what the next 12 months look like for each sector.",
    author: "Market Insights Desk",
    date: "November 2025",
    imgLabel: "Sector investment breakdown chart and Africa map",
    tags: ["Market Insights", "Sectors"],
  },
];

const QUICK_TIPS = [
  {
    icon: TrendingUp,
    title: "Validate before you pitch",
    body: "Investors want traction evidence, not just ideas. Even a small pilot — 50 users, 3 months of data — is worth more than projections alone.",
  },
  {
    icon: ShieldCheck,
    title: "Prepare your cap table early",
    body: "A messy or unclear ownership structure is one of the most common deal-breakers at due diligence. Clean it up before you start raising.",
  },
  {
    icon: Globe2,
    title: "Know your target investor",
    body: "Not all capital is equal. Impact investors, strategic investors, and pure financial investors have different requirements and timelines. Match your pitch to the audience.",
  },
  {
    icon: BookOpen,
    title: "Understand the 80/20 refund policy",
    body: "Our submission fee includes an 80% refund if your project fails screening. Use this as an incentive to ensure your documentation is as strong as possible before submitting.",
  },
];

function ArticleCard({ article, featured = false }) {
  if (featured) {
    return (
      <motion.article
        className="bg-white rounded-2xl border border-[var(--ds-border)] overflow-hidden hover:shadow-md transition-shadow"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <div className="flex flex-col lg:flex-row">
          <div className="lg:w-1/2">
            <ImgPlaceholder label={article.imgLabel} aspect="aspect-[16/10] lg:h-full lg:aspect-auto" className="rounded-none rounded-t-2xl lg:rounded-l-2xl lg:rounded-tr-none h-full" />
          </div>
          <div className="flex-1 p-8 flex flex-col justify-center">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-xs font-semibold text-[var(--ds-accent)] uppercase tracking-wider">
                {article.category}
              </span>
              <span className="text-xs text-[var(--ds-text-muted)] flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {article.readTime}
              </span>
            </div>
            <h2
              className="text-xl sm:text-2xl font-bold text-[var(--ds-text-primary)] mb-4 leading-snug"
              style={{ fontFamily: "var(--ds-font-display)", fontStyle: "italic" }}
            >
              {article.title}
            </h2>
            <p className="text-sm text-[var(--ds-text-secondary)] leading-relaxed mb-6">
              {article.excerpt}
            </p>
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div>
                <p className="text-xs text-[var(--ds-text-muted)]">
                  {article.author} · {article.date}
                </p>
              </div>
              <a
                href="#"
                className="flex items-center gap-1.5 text-sm font-semibold text-[var(--ds-accent)] hover:text-[var(--ds-accent-hover)] transition"
              >
                Read article
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </motion.article>
    );
  }

  return (
    <motion.article
      className="bg-white rounded-2xl border border-[var(--ds-border)] overflow-hidden hover:shadow-md transition-shadow flex flex-col"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      <ImgPlaceholder label={article.imgLabel} aspect="aspect-[16/9]" className="rounded-none" />
      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-xs font-semibold text-[var(--ds-accent)] uppercase tracking-wider">
            {article.category}
          </span>
          <span className="text-xs text-[var(--ds-text-muted)] flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {article.readTime}
          </span>
        </div>
        <h3
          className="text-base font-bold text-[var(--ds-text-primary)] mb-2 leading-snug"
          style={{ fontFamily: "var(--ds-font-display)", fontStyle: "italic" }}
        >
          {article.title}
        </h3>
        <p className="text-xs text-[var(--ds-text-secondary)] leading-relaxed mb-4 flex-1">
          {article.excerpt}
        </p>
        <div className="flex flex-wrap gap-1.5 mb-4">
          {article.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs px-2 py-0.5 rounded-full bg-[var(--ds-bg-light)] border border-[var(--ds-border)] text-[var(--ds-text-muted)]"
            >
              {tag}
            </span>
          ))}
        </div>
        <div className="flex items-center justify-between pt-3 border-t border-[var(--ds-border)]">
          <p className="text-xs text-[var(--ds-text-muted)]">{article.date}</p>
          <a
            href="#"
            className="flex items-center gap-1 text-xs font-semibold text-[var(--ds-accent)] hover:text-[var(--ds-accent-hover)] transition"
          >
            Read
            <ArrowRight className="w-3 h-3" />
          </a>
        </div>
      </div>
    </motion.article>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export function AdvicePage() {
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered =
    activeCategory === "All"
      ? ARTICLES
      : ARTICLES.filter((a) => a.category === activeCategory || a.tags.includes(activeCategory));

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
              Advice & Insights
            </motion.p>
            <motion.h1
              className="text-4xl sm:text-5xl font-bold mb-6"
              style={{ fontFamily: "var(--ds-font-display)", fontStyle: "italic", lineHeight: "var(--ds-line-tight)" }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              Everything you need to move a deal forward
            </motion.h1>
            <motion.p
              className="text-[var(--ds-text-on-dark)]/70 text-lg leading-relaxed max-w-2xl mx-auto mb-10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              Practical guides, market intelligence, and expert perspectives for
              entrepreneurs raising capital, investors evaluating opportunities, and
              service providers operating across African markets.
            </motion.p>
            <motion.div
              className="flex flex-wrap gap-4 justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <CTAButton href="/choose-role">Get started on the platform</CTAButton>
              <CTAButton href="#articles" variant="outline">Browse all articles</CTAButton>
            </motion.div>
          </div>
        </section>

        {/* ── Quick tips ── */}
        <section className="py-14 px-4 bg-[var(--ds-surface)]">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-10">
              <p className="text-xs uppercase tracking-[0.2em] text-[var(--ds-accent)] mb-3 font-medium">
                Quick Tips
              </p>
              <h2
                className="text-2xl font-bold text-[var(--ds-text-primary)]"
                style={{ fontFamily: "var(--ds-font-display)", fontStyle: "italic" }}
              >
                Four things to know before you start
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {QUICK_TIPS.map((tip, i) => (
                <motion.div
                  key={tip.title}
                  className="bg-[var(--ds-bg-light)] rounded-2xl p-5 border border-[var(--ds-border)]"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.07 }}
                >
                  <div className="p-2 w-fit rounded-xl bg-[var(--ds-accent)]/10 mb-3">
                    <tip.icon className="w-4 h-4 text-[var(--ds-accent)]" />
                  </div>
                  <h3 className="font-semibold text-sm text-[var(--ds-text-primary)] mb-2">
                    {tip.title}
                  </h3>
                  <p className="text-xs text-[var(--ds-text-secondary)] leading-relaxed">
                    {tip.body}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Featured article ── */}
        <section className="py-16 px-4 bg-[var(--ds-bg-light)]">
          <div className="max-w-6xl mx-auto">
            <p className="text-xs uppercase tracking-[0.2em] text-[var(--ds-accent)] mb-6 font-medium">
              Featured Article
            </p>
            <ArticleCard article={FEATURED} featured />
          </div>
        </section>

        {/* ── Articles grid ── */}
        <section id="articles" className="py-16 px-4 bg-[var(--ds-surface)]">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-[var(--ds-accent)] mb-1 font-medium">
                  All Articles
                </p>
                <h2
                  className="text-2xl font-bold text-[var(--ds-text-primary)]"
                  style={{ fontFamily: "var(--ds-font-display)", fontStyle: "italic" }}
                >
                  Browse by topic
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-[var(--ds-text-muted)]" />
                <span className="text-xs text-[var(--ds-text-muted)]">Filter:</span>
              </div>
            </div>

            {/* Category pills */}
            <div className="flex flex-wrap gap-2 mb-8">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition ${
                    activeCategory === cat
                      ? "bg-[var(--ds-accent)] text-white"
                      : "bg-white border border-[var(--ds-border)] text-[var(--ds-text-secondary)] hover:border-[var(--ds-accent)]/50"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {filtered.length === 0 ? (
              <p className="text-sm text-[var(--ds-text-muted)] text-center py-12">
                No articles in this category yet. Check back soon.
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map((a) => (
                  <ArticleCard key={a.title} article={a} />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* ── Newsletter CTA ── */}
        <section className="py-16 px-4 bg-[var(--ds-bg-light)]">
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-2xl border border-[var(--ds-border)] p-8 sm:p-12 text-center">
              <p className="text-xs uppercase tracking-[0.2em] text-[var(--ds-accent)] mb-3 font-medium">
                Stay Informed
              </p>
              <h2
                className="text-2xl font-bold text-[var(--ds-text-primary)] mb-4"
                style={{ fontFamily: "var(--ds-font-display)", fontStyle: "italic" }}
              >
                Get our monthly market briefing
              </h2>
              <p className="text-sm text-[var(--ds-text-secondary)] leading-relaxed mb-8 max-w-md mx-auto">
                Sector trends, new listings highlights, regulatory updates, and curated advice —
                delivered to your inbox every month. No spam. Unsubscribe any time.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <input
                  type="email"
                  className="flex-1 px-4 py-3 rounded-xl border border-[var(--ds-border)] text-sm text-[var(--ds-text-primary)] placeholder:text-[var(--ds-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--ds-accent)] focus:border-transparent"
                  placeholder="your@email.com"
                />
                <button
                  type="button"
                  className="px-6 py-3 rounded-xl bg-[var(--ds-accent)] text-[var(--ds-text-on-dark)] font-semibold text-sm hover:bg-[var(--ds-accent-hover)] transition whitespace-nowrap"
                >
                  Subscribe
                </button>
              </div>
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
              Ready to put this advice into action?
            </motion.h2>
            <p className="text-[var(--ds-text-on-dark)]/70 mb-8 text-sm leading-relaxed">
              Create your account, complete your profile, and start connecting with the right
              people at the right moment.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <CTAButton href="/choose-role">Create your account</CTAButton>
              <CTAButton href="/how-it-works" variant="outline">See how it works</CTAButton>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}
