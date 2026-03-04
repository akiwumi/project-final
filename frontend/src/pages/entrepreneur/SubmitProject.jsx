import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "../../components/layout/Navbar";
import { Footer } from "../../components/layout/Footer";
import { EntrepreneurSidebar } from "../../components/entrepreneur/Sidebar";
import { Upload, FileText, X, ChevronDown, AlertCircle } from "lucide-react";

export const BUSINESS_CATEGORIES = [
  { value: "agritech", label: "Agriculture & AgriTech" },
  { value: "cleantech", label: "Clean Energy & CleanTech" },
  { value: "edtech", label: "Education & EdTech" },
  { value: "fintech", label: "Financial Services & FinTech" },
  { value: "healthtech", label: "Health & HealthTech" },
  { value: "logistics", label: "Logistics & Supply Chain" },
  { value: "manufacturing", label: "Manufacturing & Industry" },
  { value: "media", label: "Media & Entertainment" },
  { value: "proptech", label: "Property & PropTech" },
  { value: "retail", label: "Retail & E-commerce" },
  { value: "saas", label: "Software & SaaS" },
  { value: "telecom", label: "Telecommunications" },
  { value: "tourism", label: "Tourism & Hospitality" },
  { value: "transport", label: "Transport & Mobility" },
  { value: "water", label: "Water & Sanitation" },
  { value: "fashion", label: "Fashion & Lifestyle" },
  { value: "food", label: "Food & Beverage" },
  { value: "infrastructure", label: "Infrastructure & Construction" },
  { value: "mining", label: "Mining & Natural Resources" },
  { value: "ngo", label: "Social Enterprise & NGO" },
  { value: "other", label: "Other" },
];

const FUNDING_STAGES = [
  { value: "pre_seed", label: "Pre-Seed" },
  { value: "seed", label: "Seed" },
  { value: "series_a", label: "Series A" },
  { value: "series_b", label: "Series B" },
  { value: "growth", label: "Growth / Expansion" },
  { value: "bridge", label: "Bridge Round" },
];

const MAX_FILE_SIZE_MB = 50;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

const inputCls =
  "w-full px-4 py-2.5 rounded-xl border border-[var(--ds-border)] bg-white text-[var(--ds-text-primary)] placeholder:text-[var(--ds-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--ds-accent)] focus:border-transparent text-sm";

const selectCls =
  "w-full px-4 py-2.5 rounded-xl border border-[var(--ds-border)] bg-white text-[var(--ds-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--ds-accent)] focus:border-transparent text-sm appearance-none";

function InputField({ label, required, hint, error, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-[var(--ds-text-primary)]">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {hint && <p className="text-xs text-[var(--ds-text-muted)] -mt-1">{hint}</p>}
      {children}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

function FileDrop({ file, onFile, onRemove, error }) {
  const inputRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);

  function handleDrop(e) {
    e.preventDefault();
    setDragOver(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped) onFile(dropped);
  }

  function handleChange(e) {
    const picked = e.target.files[0];
    if (picked) onFile(picked);
  }

  const fileSizeMB = file ? (file.size / 1024 / 1024).toFixed(1) : 0;
  const tooLarge = file && file.size > MAX_FILE_SIZE_BYTES;

  return (
    <div className="flex flex-col gap-1.5">
      {file ? (
        <div
          className={`flex items-center justify-between gap-3 p-4 rounded-xl border ${
            tooLarge ? "border-red-300 bg-red-50" : "border-[var(--ds-accent)]/40 bg-[var(--ds-accent)]/5"
          }`}
        >
          <div className="flex items-center gap-3 min-w-0">
            <FileText
              className={`w-5 h-5 shrink-0 ${tooLarge ? "text-red-500" : "text-[var(--ds-accent)]"}`}
            />
            <div className="min-w-0">
              <p className="text-sm font-medium text-[var(--ds-text-primary)] truncate">
                {file.name}
              </p>
              <p className={`text-xs ${tooLarge ? "text-red-500" : "text-[var(--ds-text-muted)]"}`}>
                {fileSizeMB} MB {tooLarge && `— exceeds ${MAX_FILE_SIZE_MB} MB limit`}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onRemove}
            className="p-1 rounded-lg text-[var(--ds-text-muted)] hover:text-red-500 transition shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition ${
            dragOver
              ? "border-[var(--ds-accent)] bg-[var(--ds-accent)]/5"
              : "border-[var(--ds-border)] hover:border-[var(--ds-accent)]/50"
          } ${error ? "border-red-300" : ""}`}
          onClick={() => inputRef.current?.click()}
        >
          <Upload className="w-6 h-6 mx-auto mb-2 text-[var(--ds-text-muted)]" />
          <p className="text-sm font-medium text-[var(--ds-text-primary)] mb-1">
            Drop your PDF here or{" "}
            <span className="text-[var(--ds-accent)] underline">browse</span>
          </p>
          <p className="text-xs text-[var(--ds-text-muted)]">PDF only — max {MAX_FILE_SIZE_MB} MB</p>
          <input
            ref={inputRef}
            type="file"
            accept=".pdf,application/pdf"
            className="hidden"
            onChange={handleChange}
          />
        </div>
      )}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

export function SubmitProject() {
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});

  const [form, setForm] = useState({
    title: "",
    category: "",
    stage: "",
    summary: "",
    amountSeeking: "",
    country: "",
    pitchFile: null,
    businessPlanFile: null,
  });

  function setField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  function validate() {
    const errs = {};
    if (!form.title.trim()) errs.title = "Project title is required";
    if (!form.category) errs.category = "Please select a category";
    if (!form.stage) errs.stage = "Please select a funding stage";
    if (!form.summary.trim() || form.summary.trim().length < 100)
      errs.summary = "Summary must be at least 100 characters";
    if (!form.amountSeeking.trim()) errs.amountSeeking = "Amount is required";
    if (!form.country.trim()) errs.country = "Country is required";
    if (!form.pitchFile) errs.pitchFile = "Pitch deck PDF is required";
    if (form.pitchFile && form.pitchFile.size > MAX_FILE_SIZE_BYTES)
      errs.pitchFile = `File exceeds ${MAX_FILE_SIZE_MB} MB limit`;
    if (form.businessPlanFile && form.businessPlanFile.size > MAX_FILE_SIZE_BYTES)
      errs.businessPlanFile = `File exceeds ${MAX_FILE_SIZE_MB} MB limit`;
    return errs;
  }

  function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    // Pass form data to payment page via state
    navigate("/entrepreneur/payment", { state: { project: form } });
  }

  return (
    <div className="min-h-screen bg-[var(--ds-bg-light)]">
      <Navbar />
      <div className="flex pt-16">
        <EntrepreneurSidebar active="submit" />

        <main className="flex-1 p-6 lg:p-10">
          <div className="max-w-2xl">
            <div className="mb-8">
              <h1
                className="text-2xl font-bold text-[var(--ds-text-primary)] mb-1"
                style={{ fontFamily: "var(--ds-font-display)" }}
              >
                Submit a Project
              </h1>
              <p className="text-sm text-[var(--ds-text-secondary)]">
                Fill in all required fields. You'll be taken to payment after submission.
                The submission fee is <strong>€1,000</strong>.
              </p>
            </div>

            {/* Notice banner */}
            <div className="mb-6 flex items-start gap-3 p-4 rounded-xl bg-amber-50 border border-amber-200 text-sm text-amber-800">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>
                All submissions are subject to a €1,000 fee. 80% is refunded if your project
                fails screening. 20% is non-refundable for administration.
              </span>
            </div>

            {Object.keys(errors).length > 0 && (
              <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-sm text-red-700">
                Please fix the highlighted fields before continuing.
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate className="space-y-5">

              <InputField label="Project / venture title" required error={errors.title}>
                <input
                  type="text"
                  className={inputCls}
                  placeholder="e.g. SolarGrid Africa — Rural Solar Micro-grids"
                  value={form.title}
                  onChange={(e) => setField("title", e.target.value)}
                />
              </InputField>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InputField label="Business / industry category" required error={errors.category}>
                  <div className="relative">
                    <select
                      className={`${selectCls} pr-8`}
                      value={form.category}
                      onChange={(e) => setField("category", e.target.value)}
                    >
                      <option value="">Select category</option>
                      {BUSINESS_CATEGORIES.map((c) => (
                        <option key={c.value} value={c.value}>
                          {c.label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--ds-text-muted)] pointer-events-none" />
                  </div>
                </InputField>

                <InputField label="Funding stage" required error={errors.stage}>
                  <div className="relative">
                    <select
                      className={`${selectCls} pr-8`}
                      value={form.stage}
                      onChange={(e) => setField("stage", e.target.value)}
                    >
                      <option value="">Select stage</option>
                      {FUNDING_STAGES.map((s) => (
                        <option key={s.value} value={s.value}>
                          {s.label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--ds-text-muted)] pointer-events-none" />
                  </div>
                </InputField>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InputField
                  label="Amount seeking (€)"
                  required
                  hint="Investment amount in euros"
                  error={errors.amountSeeking}
                >
                  <input
                    type="text"
                    className={inputCls}
                    placeholder="e.g. 500,000"
                    value={form.amountSeeking}
                    onChange={(e) => setField("amountSeeking", e.target.value)}
                  />
                </InputField>

                <InputField label="Country of operation" required error={errors.country}>
                  <input
                    type="text"
                    className={inputCls}
                    placeholder="e.g. Kenya"
                    value={form.country}
                    onChange={(e) => setField("country", e.target.value)}
                  />
                </InputField>
              </div>

              <InputField
                label="Project summary"
                required
                hint="Minimum 100 characters. Describe the problem, your solution, market, and traction."
                error={errors.summary}
              >
                <textarea
                  rows={6}
                  className={`${inputCls} resize-none`}
                  placeholder="We are building a solar micro-grid solution for off-grid communities in rural Kenya. The problem we solve is..."
                  value={form.summary}
                  onChange={(e) => setField("summary", e.target.value)}
                />
                <p className="text-xs text-[var(--ds-text-muted)] text-right -mt-1">
                  {form.summary.length} chars
                </p>
              </InputField>

              {/* File uploads */}
              <div className="pt-2 space-y-5">
                <div>
                  <h3 className="text-sm font-semibold text-[var(--ds-text-primary)] mb-2">
                    Pitch Deck <span className="text-red-500">*</span>
                  </h3>
                  <FileDrop
                    file={form.pitchFile}
                    onFile={(f) => setField("pitchFile", f)}
                    onRemove={() => setField("pitchFile", null)}
                    error={errors.pitchFile}
                  />
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-[var(--ds-text-primary)] mb-2">
                    Business Plan{" "}
                    <span className="text-[var(--ds-text-muted)] font-normal">(optional)</span>
                  </h3>
                  <FileDrop
                    file={form.businessPlanFile}
                    onFile={(f) => setField("businessPlanFile", f)}
                    onRemove={() => setField("businessPlanFile", null)}
                    error={errors.businessPlanFile}
                  />
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-[var(--ds-accent)] text-[var(--ds-text-on-dark)] font-semibold text-sm hover:bg-[var(--ds-accent-hover)] transition"
                >
                  Continue to Payment →
                </button>
                <p className="text-center text-xs text-[var(--ds-text-muted)] mt-3">
                  You will not be charged until the next step.
                </p>
              </div>
            </form>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}
