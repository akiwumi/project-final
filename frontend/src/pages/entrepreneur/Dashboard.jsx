import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import { Navbar } from "../../components/layout/Navbar";
import { Footer } from "../../components/layout/Footer";
import { EntrepreneurSidebar } from "../../components/entrepreneur/Sidebar";
import {
  TrendingUp,
  Eye,
  Clock,
  CheckCircle,
  XCircle,
  MessageSquare,
  Send,
  FolderPlus,
  AlertCircle,
  ChevronRight,
} from "lucide-react";

// ──────────────────────────────────────────
// Mock data — replace with Supabase queries
// ──────────────────────────────────────────

const MOCK_SUBMISSIONS = [
  {
    id: "sub-001",
    title: "SolarGrid Africa — Rural Solar Micro-grids",
    category: "Clean Energy & CleanTech",
    stage: "Seed",
    amount: "€500,000",
    submittedAt: "2026-02-14",
    status: "under_review",
    views: 47,
    interests: 3,
  },
  {
    id: "sub-002",
    title: "AgriPay — Smallholder Farmer Payments",
    category: "Financial Services & FinTech",
    stage: "Pre-Seed",
    amount: "€150,000",
    submittedAt: "2026-01-30",
    status: "approved",
    views: 128,
    interests: 11,
  },
  {
    id: "sub-003",
    title: "HealthLink Kenya — Telemedicine Platform",
    category: "Health & HealthTech",
    stage: "Series A",
    amount: "€2,000,000",
    submittedAt: "2025-12-05",
    status: "failed_screening",
    views: 22,
    interests: 0,
  },
];

const MOCK_MESSAGES = [
  {
    id: 1,
    sender: "admin",
    name: "Connect Africa Team",
    text: "Welcome! Your submission SolarGrid Africa has been received and is currently under review. We'll notify you within 5 business days.",
    time: "10:32",
    date: "Today",
  },
  {
    id: 2,
    sender: "user",
    name: "Jane Doe",
    text: "Thank you! Is there any additional documentation I should prepare?",
    time: "10:45",
    date: "Today",
  },
  {
    id: 3,
    sender: "admin",
    name: "Connect Africa Team",
    text: "Your pitch deck looks great. We may request audited financials if the project advances to stage 2. We'll be in touch.",
    time: "11:02",
    date: "Today",
  },
];

const STATUS_CONFIG = {
  under_review: {
    label: "Under Review",
    color: "bg-amber-100 text-amber-700",
    icon: Clock,
  },
  approved: {
    label: "Approved",
    color: "bg-green-100 text-green-700",
    icon: CheckCircle,
  },
  failed_screening: {
    label: "Failed Screening",
    color: "bg-red-100 text-red-700",
    icon: XCircle,
  },
  pending_payment: {
    label: "Pending Payment",
    color: "bg-blue-100 text-blue-700",
    icon: AlertCircle,
  },
};

function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.under_review;
  const Icon = cfg.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${cfg.color}`}>
      <Icon className="w-3 h-3" />
      {cfg.label}
    </span>
  );
}

function StatCard({ label, value, sub, icon: Icon, accent }) {
  return (
    <div className="bg-white rounded-2xl border border-[var(--ds-border)] p-5">
      <div className="flex items-start justify-between mb-3">
        <p className="text-xs text-[var(--ds-text-muted)] font-medium uppercase tracking-wide">
          {label}
        </p>
        <div className={`p-2 rounded-xl ${accent || "bg-[var(--ds-accent)]/10"}`}>
          <Icon className={`w-4 h-4 text-[var(--ds-accent)]`} />
        </div>
      </div>
      <p className="text-2xl font-bold text-[var(--ds-text-primary)]">{value}</p>
      {sub && <p className="text-xs text-[var(--ds-text-muted)] mt-0.5">{sub}</p>}
    </div>
  );
}

export function EntrepreneurDashboard() {
  const navigate = useNavigate();
  const chatEndRef = useRef(null);
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState("");
  const [submissions, setSubmissions] = useState([]);

  const totalViews = submissions.reduce((s, sub) => s + (sub.views || 0), 0);
  const totalInterests = submissions.reduce((s, sub) => s + (sub.interests || 0), 0);
  const activeCount = submissions.filter((s) => s.status !== "failed_screening").length;

  useEffect(() => {
    async function loadData() {
      const { data: { user } } = await supabase.auth.getUser();

      const { data: subs } = await supabase
        .from("projects")
        .select("*")
        .eq("entrepreneur_id", user.id)
        .order("created_at", { ascending: false });

      if (subs) setSubmissions(subs);
    }
    loadData();
  }, []);

  useEffect(() => {
    async function loadMessages() {
      const { data: { user } } = await supabase.auth.getUser();

      const { data } = await supabase
        .from("messages")
        .select("*")
        .eq("entrepreneur_id", user.id)
        .order("created_at", { ascending: true });

      if (data) setMessages(data);

      const channel = supabase
        .channel("messages")
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "messages",
            filter: `entrepreneur_id=eq.${user.id}`,
          },
          (payload) => {
            setMessages((prev) => [...prev, payload.new]);
          }
        )
        .subscribe();

      return () => supabase.removeChannel(channel);
    }

    loadMessages();
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function sendMessage() {
    if (!newMsg.trim()) return;
    const { data: { user } } = await supabase.auth.getUser();

    await supabase.from("messages").insert({
      entrepreneur_id: user.id,
      sender: "user",
      sender_name: "Jane Doe",
      text: newMsg.trim(),
    });

    setNewMsg("");
  }

  return (
    <div className="min-h-screen bg-[var(--ds-bg-light)]">
      <Navbar />
      <div className="flex pt-16">
        <EntrepreneurSidebar active="dashboard" />

        <main className="flex-1 p-6 lg:p-10 space-y-8 min-w-0">
          {/* Header */}
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1
                className="text-2xl font-bold text-[var(--ds-text-primary)] mb-1"
                style={{ fontFamily: "var(--ds-font-display)" }}
              >
                Dashboard
              </h1>
              <p className="text-sm text-[var(--ds-text-secondary)]">
                Welcome back, Jane. Here's how your submissions are performing.
              </p>
            </div>
            <button
              type="button"
              onClick={() => navigate("/entrepreneur/submit")}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[var(--ds-accent)] text-[var(--ds-text-on-dark)] font-semibold text-sm hover:bg-[var(--ds-accent-hover)] transition"
            >
              <FolderPlus className="w-4 h-4" />
              New Submission
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StatCard
              label="Active Submissions"
              value={activeCount}
              sub={`of ${MOCK_SUBMISSIONS.length} total`}
              icon={TrendingUp}
            />
            <StatCard
              label="Profile Views"
              value={totalViews}
              sub="across all projects"
              icon={Eye}
            />
            <StatCard
              label="Investor Interests"
              value={totalInterests}
              sub="confirmed expressions"
              icon={MessageSquare}
            />
          </div>

          {/* Submissions table */}
          <section>
            <h2 className="text-base font-semibold text-[var(--ds-text-primary)] mb-4">
              My Submissions
            </h2>
            <div className="space-y-3">
              {MOCK_SUBMISSIONS.map((sub) => (
                <div
                  key={sub.id}
                  className="bg-white rounded-2xl border border-[var(--ds-border)] p-5 flex flex-col sm:flex-row sm:items-center gap-4"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start gap-3 mb-2">
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm text-[var(--ds-text-primary)] truncate">
                          {sub.title}
                        </p>
                        <p className="text-xs text-[var(--ds-text-muted)] mt-0.5">
                          {sub.category} · {sub.stage} · {sub.amount}
                        </p>
                      </div>
                      <StatusBadge status={sub.status} />
                    </div>
                    <div className="flex items-center gap-5 text-xs text-[var(--ds-text-muted)]">
                      <span className="flex items-center gap-1">
                        <Eye className="w-3.5 h-3.5" />
                        {sub.views} views
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageSquare className="w-3.5 h-3.5" />
                        {sub.interests} interests
                      </span>
                      <span>Submitted {sub.submittedAt}</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="flex items-center gap-1 text-xs font-medium text-[var(--ds-accent)] hover:text-[var(--ds-accent-hover)] shrink-0"
                  >
                    View details
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* Admin Chat */}
          <section id="chat">
            <h2 className="text-base font-semibold text-[var(--ds-text-primary)] mb-4 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-[var(--ds-accent)]" />
              Messages with Connect Africa Team
            </h2>
            <div className="bg-white rounded-2xl border border-[var(--ds-border)] overflow-hidden flex flex-col" style={{ height: 400 }}>
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-5 space-y-4">
                {messages.map((msg, i) => {
                  const isUser = msg.sender === "user";
                  const showDateDivider =
                    i === 0 || messages[i - 1].date !== msg.date;
                  return (
                    <div key={msg.id}>
                      {showDateDivider && (
                        <div className="flex items-center gap-3 my-2">
                          <div className="flex-1 h-px bg-[var(--ds-border)]" />
                          <span className="text-xs text-[var(--ds-text-muted)]">{msg.date}</span>
                          <div className="flex-1 h-px bg-[var(--ds-border)]" />
                        </div>
                      )}
                      <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
                        <div
                          className={`max-w-xs lg:max-w-sm px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                            isUser
                              ? "bg-[var(--ds-accent)] text-white rounded-br-sm"
                              : "bg-[var(--ds-bg-light)] text-[var(--ds-text-primary)] rounded-bl-sm border border-[var(--ds-border)]"
                          }`}
                        >
                          {!isUser && (
                            <p className="text-xs font-semibold text-[var(--ds-accent)] mb-1">
                              {msg.name}
                            </p>
                          )}
                          {msg.text}
                          <p
                            className={`text-xs mt-1 ${
                              isUser ? "text-white/70 text-right" : "text-[var(--ds-text-muted)]"
                            }`}
                          >
                            {msg.time}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={chatEndRef} />
              </div>

              {/* Input */}
              <div className="border-t border-[var(--ds-border)] p-4 flex gap-3">
                <input
                  type="text"
                  className="flex-1 px-4 py-2.5 rounded-xl border border-[var(--ds-border)] bg-[var(--ds-bg-light)] text-sm text-[var(--ds-text-primary)] placeholder:text-[var(--ds-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--ds-accent)] focus:border-transparent"
                  placeholder="Type a message…"
                  value={newMsg}
                  onChange={(e) => setNewMsg(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                />
                <button
                  type="button"
                  onClick={sendMessage}
                  disabled={!newMsg.trim()}
                  className="p-2.5 rounded-xl bg-[var(--ds-accent)] text-white hover:bg-[var(--ds-accent-hover)] disabled:opacity-50 transition"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </section>
        </main>
      </div>
      <Footer />
    </div>
  );
}
