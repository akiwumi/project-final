import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "../../components/layout/Navbar";
import { CheckCircle, ChevronDown, ChevronUp, Shield } from "lucide-react";
import { supabase } from "../../lib/supabase";

const TC_SECTIONS = [
  {
    id: "platform",
    title: "1. Platform Use & Eligibility",
    body: `Connect Africa is an investment facilitation platform connecting verified entrepreneurs with global investors. By registering, you confirm that you are at least 18 years of age, that all information provided during registration is accurate and truthful, and that you have the legal authority to represent the company you have registered.`,
  },
  {
    id: "submission",
    title: "2. Project Submissions",
    body: `Each project submission requires a one-time, non-negotiable submission fee of €1,000 (one thousand euros). This fee is charged per submission. The submission fee covers the cost of administrative review, due diligence screening, and facilitation services provided by Connect Africa.`,
  },
  {
    id: "refund",
    title: "3. Refund Policy",
    body: `Should your submitted project fail to pass the initial screening and review process conducted by Connect Africa, 80% (eight hundred euros) of the submission fee will be refunded to your original payment method within 14 business days of notification. The remaining 20% (two hundred euros) is retained as a non-refundable administration and processing fee and will not be returned under any circumstances. Projects that pass screening but do not attract investor interest are not eligible for any refund.`,
  },
  {
    id: "verification",
    title: "4. Phone Verification",
    body: `All submissions require a mandatory phone verification call with a Connect Africa team member. You will be required to select an available time slot from the provided calendar during the submission process. Time slots are available Monday to Friday, between 09:00 and 16:00 GMT, in 30-minute blocks. Failure to attend your scheduled call without prior notice may result in forfeiture of your submission fee.`,
  },
  {
    id: "content",
    title: "5. Document & Content Standards",
    body: `All uploaded documents (pitch decks, business plans) must be in PDF format and must not exceed 50 MB per file. You must hold all intellectual property rights for any content you upload. Connect Africa reserves the right to remove submissions containing false, misleading, or illegal content without refund. Project summaries must be accurate representations of the submission and must correspond with the uploaded documents.`,
  },
  {
    id: "confidentiality",
    title: "6. Confidentiality & Data Use",
    body: `Connect Africa takes confidentiality seriously. Your submitted business documents will only be shared with vetted investors who have signed non-disclosure agreements within our platform. Your personal and company information will be stored securely and used solely for platform operations, investor matching, and regulatory compliance. We will never sell your data to third parties.`,
  },
  {
    id: "liability",
    title: "7. Limitation of Liability",
    body: `Connect Africa acts solely as a facilitation platform. We do not guarantee that any project will attract investment, nor do we guarantee the quality or suitability of any investor. Connect Africa shall not be liable for any loss of business, profits, or investment arising from the use of this platform. All investment decisions remain the independent responsibility of the parties involved.`,
  },
  {
    id: "conduct",
    title: "8. Code of Conduct",
    body: `You agree to engage with all platform users, including investors, administrators, and other entrepreneurs, in a professional and respectful manner. Any form of misrepresentation, harassment, fraud, or illegal activity will result in immediate account termination and, where applicable, referral to the relevant legal authorities.`,
  },
  {
    id: "updates",
    title: "9. Amendments",
    body: `Connect Africa reserves the right to update these Terms & Conditions at any time. You will be notified of material changes by email. Continued use of the platform after notification constitutes acceptance of the updated terms.`,
  },
];

function AccordionItem({ section, open, onToggle }) {
  return (
    <div className="border border-[var(--ds-border)] rounded-xl overflow-hidden">
      <button
        type="button"
        className="w-full flex items-center justify-between px-5 py-4 text-left bg-white hover:bg-[var(--ds-overlay)] transition"
        onClick={onToggle}
      >
        <span className="font-semibold text-sm text-[var(--ds-text-primary)]">
          {section.title}
        </span>
        {open ? (
          <ChevronUp className="w-4 h-4 text-[var(--ds-text-muted)] shrink-0" />
        ) : (
          <ChevronDown className="w-4 h-4 text-[var(--ds-text-muted)] shrink-0" />
        )}
      </button>
      {open && (
        <div className="px-5 pb-5 pt-2 bg-white text-sm text-[var(--ds-text-secondary)] leading-relaxed border-t border-[var(--ds-border)]">
          {section.body}
        </div>
      )}
    </div>
  );
}

export function Welcome() {
  const navigate = useNavigate();
  const [openSection, setOpenSection] = useState(null);
  const [accepted, setAccepted] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/register");
      }
    });
  }, []);

  function toggle(id) {
    setOpenSection((prev) => (prev === id ? null : id));
  }

  async function handleAccept() {
    if (!accepted) return;

    const { data: { user } } = await supabase.auth.getUser();

    const { error } = await supabase
      .from("entrepreneurs")
      .update({
        terms_accepted: true,
        terms_accepted_at: new Date().toISOString(),
      })
      .eq("id", user.id);

    if (error) {
      console.error("T&C update error:", error);
      return;
    }

    navigate("/entrepreneur/profile");
  }

  return (
    <div className="min-h-screen bg-[var(--ds-bg-light)]">
      <Navbar />
      <main className="pt-24 pb-20 px-4">
        <div className="max-w-2xl mx-auto">
          {/* Hero */}
          <div className="text-center mb-10">
            <div className="w-16 h-16 rounded-full bg-[var(--ds-accent-green)]/10 flex items-center justify-center mx-auto mb-5">
              <CheckCircle className="w-8 h-8 text-[var(--ds-accent-green)]" />
            </div>
            <h1
              className="text-3xl font-bold text-[var(--ds-text-primary)] mb-3"
              style={{ fontFamily: "var(--ds-font-display)" }}
            >
              Welcome to Connect Africa
            </h1>
            <p className="text-[var(--ds-text-secondary)] text-sm leading-relaxed max-w-md mx-auto">
              Your email has been confirmed. Before you continue, please read and accept our
              Terms & Conditions. You must accept these terms to access your profile and
              begin submitting projects.
            </p>
          </div>

          {/* T&C Accordion */}
          <div className="flex items-center gap-2 mb-4">
            <Shield className="w-4 h-4 text-[var(--ds-accent)]" />
            <span className="text-sm font-semibold text-[var(--ds-text-primary)]">
              Terms & Conditions
            </span>
          </div>

          <div className="space-y-2 mb-8">
            {TC_SECTIONS.map((s) => (
              <AccordionItem
                key={s.id}
                section={s}
                open={openSection === s.id}
                onToggle={() => toggle(s.id)}
              />
            ))}
          </div>

          {/* Acceptance */}
          <div className="bg-white rounded-2xl border border-[var(--ds-border)] p-6">
            <label className="flex items-start gap-3 cursor-pointer mb-5">
              <input
                type="checkbox"
                className="mt-0.5 accent-[var(--ds-accent)] w-4 h-4"
                checked={accepted}
                onChange={(e) => setAccepted(e.target.checked)}
              />
              <span className="text-sm text-[var(--ds-text-secondary)] leading-relaxed">
                I have read and I accept the Connect Africa Terms & Conditions, including the
                submission fee policy (€1,000 per submission, with an 80% refund if the project
                fails screening), the phone verification requirement, and the content standards.
              </span>
            </label>
            <button
              type="button"
              disabled={!accepted}
              onClick={handleAccept}
              className={`w-full py-3.5 rounded-xl font-semibold text-sm transition ${
                accepted
                  ? "bg-[var(--ds-accent)] text-[var(--ds-text-on-dark)] hover:bg-[var(--ds-accent-hover)]"
                  : "bg-[var(--ds-border)] text-[var(--ds-text-muted)] cursor-not-allowed"
              }`}
            >
              Accept & Continue to My Profile
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
