import { useState, useEffect } from "react";
import { Navbar } from "../components/layout/Navbar";
import { supabase } from "../lib/supabase";
import { Footer } from "../components/layout/Footer";
import { Search, SlidersHorizontal, Eye, MessageSquare, TrendingUp, X } from "lucide-react";
import { BUSINESS_CATEGORIES } from "./entrepreneur/SubmitProject";

const STAGES = [
  "All Stages",
  "Pre-Seed",
  "Seed",
  "Series A",
  "Series B",
  "Growth / Expansion",
  "Bridge Round",
];

function CategoryPill({ label, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition ${
        active
          ? "bg-[var(--ds-accent)] text-white"
          : "bg-white border border-[var(--ds-border)] text-[var(--ds-text-secondary)] hover:border-[var(--ds-accent)]/50 hover:text-[var(--ds-text-primary)]"
      }`}
    >
      {label}
    </button>
  );
}

function ProjectCard({ project }) {
  const [interested, setInterested] = useState(false);

  async function handleInterest(projectId) {
    const { data: { user } } = await supabase.auth.getUser();

    await supabase.from("project_interests").upsert(
      { project_id: projectId, user_id: user.id },
      { onConflict: "project_id,user_id" }
    );

    await supabase.rpc("increment_project_interests", { pid: projectId });
    setInterested(true);
  }

  const catLabel =
    BUSINESS_CATEGORIES.find((c) => c.value === project.category)?.label || project.category;

  return (
    <article className="bg-white rounded-2xl border border-[var(--ds-border)] p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start gap-4 mb-4">
        {/* Company logo placeholder */}
        <div className="w-12 h-12 rounded-xl bg-[var(--ds-accent)]/10 flex items-center justify-center shrink-0 text-[var(--ds-accent)] font-bold text-lg">
          {project.company[0]}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h2 className="font-bold text-[var(--ds-text-primary)] text-sm leading-snug mb-0.5">
                {project.title}
              </h2>
              <p className="text-xs text-[var(--ds-text-muted)]">
                {project.company} · {project.country}
              </p>
            </div>
            <span className="text-xs font-medium px-2 py-1 rounded-full bg-[var(--ds-accent-green)]/10 text-[var(--ds-accent-green)] shrink-0">
              {project.stage}
            </span>
          </div>
        </div>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-3">
        <span className="text-xs px-2.5 py-1 rounded-full bg-[var(--ds-bg-light)] border border-[var(--ds-border)] text-[var(--ds-text-muted)]">
          {catLabel}
        </span>
        <span className="text-xs px-2.5 py-1 rounded-full bg-[var(--ds-bg-light)] border border-[var(--ds-border)] text-[var(--ds-text-muted)]">
          Seeking {project.amountSeeking}
        </span>
      </div>

      {/* Summary */}
      <p className="text-sm text-[var(--ds-text-secondary)] leading-relaxed line-clamp-3 mb-4">
        {project.summary}
      </p>

      {/* Footer */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 text-xs text-[var(--ds-text-muted)]">
          <span className="flex items-center gap-1">
            <Eye className="w-3.5 h-3.5" />
            {project.views}
          </span>
          <span className="flex items-center gap-1">
            <MessageSquare className="w-3.5 h-3.5" />
            {project.interests}
          </span>
          <span>{project.postedAt}</span>
        </div>
        <button
          type="button"
          onClick={() => handleInterest(project.id)}
          disabled={interested}
          className={`flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-semibold transition ${
            interested
              ? "bg-[var(--ds-accent-green)]/10 text-[var(--ds-accent-green)] border border-[var(--ds-accent-green)]/30"
              : "bg-[var(--ds-accent)] text-white hover:bg-[var(--ds-accent-hover)]"
          }`}
        >
          <TrendingUp className="w-3.5 h-3.5" />
          {interested ? "Interested ✓" : "Express Interest"}
        </button>
      </div>
    </article>
  );
}

export function ProjectFeed() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [activeStage, setActiveStage] = useState("All Stages");
  const [showFilters, setShowFilters] = useState(false);
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    async function loadProjects() {
      const { data } = await supabase
        .from("projects")
        .select(`
          id, title, category, stage, amount_seeking, country,
          summary, views, interests, submitted_at,
          entrepreneurs ( company_name, avatar_url )
        `)
        .eq("status", "approved")
        .order("submitted_at", { ascending: false });

      if (data) setProjects(data);
    }
    loadProjects();
  }, []);

  const filtered = projects.filter((p) => {
    const matchSearch =
      !search ||
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.company.toLowerCase().includes(search.toLowerCase()) ||
      p.country.toLowerCase().includes(search.toLowerCase()) ||
      p.summary.toLowerCase().includes(search.toLowerCase());
    const matchCat = activeCategory === "all" || p.category === activeCategory;
    const matchStage = activeStage === "All Stages" || p.stage === activeStage;
    return matchSearch && matchCat && matchStage;
  });

  return (
    <div className="min-h-screen bg-[var(--ds-bg-light)]">
      <Navbar />
      <main className="pt-20 pb-20 px-4">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1
              className="text-3xl font-bold text-[var(--ds-text-primary)] mb-2"
              style={{ fontFamily: "var(--ds-font-display)" }}
            >
              Project Discovery
            </h1>
            <p className="text-sm text-[var(--ds-text-secondary)]">
              Explore live project submissions from African entrepreneurs. Filter by sector,
              stage, and investment size.
            </p>
          </div>

          {/* Search + filter toggle */}
          <div className="flex gap-3 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--ds-text-muted)]" />
              <input
                type="search"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[var(--ds-border)] bg-white text-sm text-[var(--ds-text-primary)] placeholder:text-[var(--ds-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--ds-accent)] focus:border-transparent"
                placeholder="Search projects, companies, countries…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              {search && (
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--ds-text-muted)] hover:text-[var(--ds-text-primary)]"
                  onClick={() => setSearch("")}
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            <button
              type="button"
              onClick={() => setShowFilters((v) => !v)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition ${
                showFilters
                  ? "border-[var(--ds-accent)] bg-[var(--ds-accent)]/10 text-[var(--ds-accent)]"
                  : "border-[var(--ds-border)] bg-white text-[var(--ds-text-secondary)] hover:border-[var(--ds-accent)]/50"
              }`}
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters
            </button>
          </div>

          {/* Filters panel */}
          {showFilters && (
            <div className="bg-white rounded-2xl border border-[var(--ds-border)] p-5 mb-5 space-y-4">
              <div>
                <p className="text-xs font-semibold text-[var(--ds-text-muted)] uppercase tracking-wide mb-2">
                  Funding Stage
                </p>
                <div className="flex flex-wrap gap-2">
                  {STAGES.map((s) => (
                    <CategoryPill
                      key={s}
                      label={s}
                      active={activeStage === s}
                      onClick={() => setActiveStage(s)}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Category pills */}
          <div className="flex gap-2 overflow-x-auto pb-2 mb-6 -mx-4 px-4 scrollbar-hide">
            <CategoryPill
              label="All Categories"
              active={activeCategory === "all"}
              onClick={() => setActiveCategory("all")}
            />
            {BUSINESS_CATEGORIES.map((c) => (
              <CategoryPill
                key={c.value}
                label={c.label}
                active={activeCategory === c.value}
                onClick={() => setActiveCategory(c.value)}
              />
            ))}
          </div>

          {/* Results count */}
          <p className="text-xs text-[var(--ds-text-muted)] mb-4">
            {filtered.length} project{filtered.length !== 1 ? "s" : ""} found
          </p>

          {/* Cards */}
          {filtered.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-[var(--ds-text-muted)] text-sm">
                No projects match your filters. Try broadening your search.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {filtered.map((p) => (
                <ProjectCard key={p.id} project={p} />
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
