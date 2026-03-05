import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Navbar } from "../../components/layout/Navbar";
import { Footer } from "../../components/layout/Footer";
import { ChevronDown, Eye, EyeOff, Rocket } from "lucide-react";
import { supabase } from "../../lib/supabase";


const COUNTRY_CODES = [
  { code: "+1", label: "🇺🇸 +1" },
  { code: "+44", label: "🇬🇧 +44" },
  { code: "+33", label: "🇫🇷 +33" },
  { code: "+49", label: "🇩🇪 +49" },
  { code: "+27", label: "🇿🇦 +27" },
  { code: "+234", label: "🇳🇬 +234" },
  { code: "+254", label: "🇰🇪 +254" },
  { code: "+233", label: "🇬🇭 +233" },
  { code: "+251", label: "🇪🇹 +251" },
  { code: "+255", label: "🇹🇿 +255" },
  { code: "+225", label: "🇨🇮 +225" },
  { code: "+221", label: "🇸🇳 +221" },
  { code: "+212", label: "🇲🇦 +212" },
  { code: "+20", label: "🇪🇬 +20" },
  { code: "+243", label: "🇨🇩 +243" },
];

const EMPLOYEE_RANGES = [
  "1–5",
  "6–10",
  "11–25",
  "26–50",
  "51–100",
  "101–250",
  "251–500",
  "500+",
];

function InputField({ label, required, error, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-[var(--ds-text-primary)]">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

function SectionTitle({ children }) {
  return (
    <h3 className="text-lg font-bold text-[var(--ds-text-primary)] pb-2 border-b border-[var(--ds-border)] mb-4 mt-8">
      {children}
    </h3>
  );
}

const inputCls =
  "w-full px-4 py-2.5 rounded-xl border border-[var(--ds-border)] bg-white text-[var(--ds-text-primary)] placeholder:text-[var(--ds-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--ds-accent)] focus:border-transparent text-sm";

const selectCls =
  "w-full px-4 py-2.5 rounded-xl border border-[var(--ds-border)] bg-white text-[var(--ds-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--ds-accent)] focus:border-transparent text-sm appearance-none";

export function EntrepreneurRegister() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});

  const [form, setForm] = useState({
    // Personal
    firstName: "",
    lastName: "",
    email: "",
    phoneCode: "+1",
    phone: "",
    password: "",
    confirmPassword: "",

    // Company
    companyName: "",
    companyType: "startup",
    yearsOperating: "",
    employees: "",
    website: "",
    companyAddress: "",
    country: "",
    city: "",

    // Agree
    agreePrivacy: false,
  });

  const set = (field) => (e) => {
    const val = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setForm((prev) => ({ ...prev, [field]: val }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  function validate() {
    const errs = {};
    if (!form.firstName.trim()) errs.firstName = "First name is required";
    if (!form.lastName.trim()) errs.lastName = "Last name is required";
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) errs.email = "Valid email is required";
    if (!form.phone.trim()) errs.phone = "Phone number is required";
    if (!form.password || form.password.length < 8) errs.password = "Password must be at least 8 characters";
    if (form.password !== form.confirmPassword) errs.confirmPassword = "Passwords do not match";
    if (!form.companyName.trim()) errs.companyName = "Company name is required";
    if (!form.employees) errs.employees = "Please select a range";
    if (form.companyType === "ongoing" && !form.yearsOperating)
      errs.yearsOperating = "Please enter years operating";
    if (!form.companyAddress.trim()) errs.companyAddress = "Address is required";
    if (!form.country.trim()) errs.country = "Country is required";
    if (!form.city.trim()) errs.city = "City is required";
    if (!form.agreePrivacy) errs.agreePrivacy = "You must agree to the privacy policy";
    return errs;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    // 1. Create auth user — Supabase sends confirmation email automatically
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        emailRedirectTo: `${window.location.origin}/welcome`,
      },
    });

    if (authError) {
      setErrors({ email: authError.message });
      return;
    }

    // 2. Insert entrepreneur profile row
    const { error: profileError } = await supabase.from("entrepreneurs").insert({
      id: authData.user.id,
      first_name: form.firstName,
      last_name: form.lastName,
      email: form.email,
      phone: `${form.phoneCode} ${form.phone}`,
      company_name: form.companyName,
      company_type: form.companyType,
      years_operating: form.yearsOperating ? parseInt(form.yearsOperating) : null,
      employees: form.employees,
      website: form.website || null,
      company_address: form.companyAddress,
      city: form.city,
      country: form.country,
    });

    if (profileError) {
      console.error("Profile insert error:", profileError);
      // Auth user was created — don't block UX, show confirmation anyway
    }

    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-[var(--ds-bg-light)]">
        <Navbar />
        <main className="pt-24 pb-20 flex items-center justify-center px-4">
          <div className="max-w-md w-full bg-white rounded-2xl border border-[var(--ds-border)] shadow-sm p-10 text-center">
            <div className="w-16 h-16 rounded-full bg-[var(--ds-accent)]/10 flex items-center justify-center mx-auto mb-6">
              <Rocket className="w-8 h-8 text-[var(--ds-accent)]" />
            </div>
            <h2 className="text-2xl font-bold text-[var(--ds-text-primary)] mb-3">
              Check your inbox
            </h2>
            <p className="text-[var(--ds-text-secondary)] text-sm leading-relaxed mb-6">
              We've sent a confirmation email to{" "}
              <strong className="text-[var(--ds-text-primary)]">{form.email}</strong>.
              Click the link inside to activate your account and continue to your welcome page.
            </p>
            <p className="text-xs text-[var(--ds-text-muted)]">
              Didn't receive it? Check your spam folder or{" "}
              <button
                className="underline text-[var(--ds-accent)] hover:text-[var(--ds-accent-hover)]"
                onClick={() => setSubmitted(false)}
              >
                try again
              </button>
              .
            </p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--ds-bg-light)]">
      <Navbar />
      <main className="pt-24 pb-20 px-4">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-2 rounded-lg bg-[var(--ds-accent)]/10">
                <Rocket className="w-5 h-5 text-[var(--ds-accent)]" />
              </div>
              <span className="text-sm font-medium text-[var(--ds-accent)] uppercase tracking-wider">
                Entrepreneur Registration
              </span>
            </div>
            <h1
              className="text-3xl font-bold text-[var(--ds-text-primary)] mb-2"
              style={{ fontFamily: "var(--ds-font-display)" }}
            >
              Create your entrepreneur account
            </h1>
            <p className="text-[var(--ds-text-secondary)] text-sm">
              Fields marked with <span className="text-red-500">*</span> are required.
            </p>
          </div>

          {Object.keys(errors).length > 0 && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-sm text-red-700">
              Please fix the highlighted fields before continuing.
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="space-y-2">
            {/* Personal Details */}
            <SectionTitle>Personal Details</SectionTitle>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InputField label="First name" required error={errors.firstName}>
                <input
                  type="text"
                  className={inputCls}
                  placeholder="Jane"
                  value={form.firstName}
                  onChange={set("firstName")}
                />
              </InputField>
              <InputField label="Last name" required error={errors.lastName}>
                <input
                  type="text"
                  className={inputCls}
                  placeholder="Doe"
                  value={form.lastName}
                  onChange={set("lastName")}
                />
              </InputField>
            </div>

            <InputField label="Email address" required error={errors.email}>
              <input
                type="email"
                className={inputCls}
                placeholder="jane@company.com"
                value={form.email}
                onChange={set("email")}
              />
            </InputField>

            <InputField label="Phone number" required error={errors.phone}>
              <div className="flex gap-2">
                <div className="relative">
                  <select
                    className={`${selectCls} w-32 pr-8`}
                    value={form.phoneCode}
                    onChange={set("phoneCode")}
                  >
                    {COUNTRY_CODES.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--ds-text-muted)] pointer-events-none" />
                </div>
                <input
                  type="tel"
                  className={`${inputCls} flex-1`}
                  placeholder="712 345 6789"
                  value={form.phone}
                  onChange={set("phone")}
                />
              </div>
            </InputField>

            <InputField label="Password" required error={errors.password}>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  className={`${inputCls} pr-10`}
                  placeholder="At least 8 characters"
                  value={form.password}
                  onChange={set("password")}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--ds-text-muted)]"
                  onClick={() => setShowPassword((v) => !v)}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </InputField>

            <InputField label="Confirm password" required error={errors.confirmPassword}>
              <div className="relative">
                <input
                  type={showConfirm ? "text" : "password"}
                  className={`${inputCls} pr-10`}
                  placeholder="Repeat your password"
                  value={form.confirmPassword}
                  onChange={set("confirmPassword")}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--ds-text-muted)]"
                  onClick={() => setShowConfirm((v) => !v)}
                >
                  {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </InputField>

            {/* Company Details */}
            <SectionTitle>Company Details</SectionTitle>

            <InputField label="Company name" required error={errors.companyName}>
              <input
                type="text"
                className={inputCls}
                placeholder="Acme Ltd."
                value={form.companyName}
                onChange={set("companyName")}
              />
            </InputField>

            <InputField label="Company website" error={errors.website}>
              <input
                type="url"
                className={inputCls}
                placeholder="https://www.yourcompany.com"
                value={form.website}
                onChange={set("website")}
              />
            </InputField>

            <InputField label="Company type" required error={errors.companyType}>
              <div className="flex gap-3">
                {[
                  { value: "startup", label: "Startup" },
                  { value: "ongoing", label: "Established company" },
                ].map((opt) => (
                  <label
                    key={opt.value}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border cursor-pointer text-sm font-medium transition ${
                      form.companyType === opt.value
                        ? "border-[var(--ds-accent)] bg-[var(--ds-accent)]/10 text-[var(--ds-accent)]"
                        : "border-[var(--ds-border)] text-[var(--ds-text-secondary)] hover:border-[var(--ds-accent)]/50"
                    }`}
                  >
                    <input
                      type="radio"
                      name="companyType"
                      value={opt.value}
                      checked={form.companyType === opt.value}
                      onChange={set("companyType")}
                      className="sr-only"
                    />
                    {opt.label}
                  </label>
                ))}
              </div>
            </InputField>

            {form.companyType === "ongoing" && (
              <InputField
                label="Years in operation"
                required
                error={errors.yearsOperating}
              >
                <input
                  type="number"
                  min="1"
                  max="200"
                  className={inputCls}
                  placeholder="e.g. 5"
                  value={form.yearsOperating}
                  onChange={set("yearsOperating")}
                />
              </InputField>
            )}

            <InputField label="Number of employees" required error={errors.employees}>
              <div className="relative">
                <select
                  className={`${selectCls} pr-8`}
                  value={form.employees}
                  onChange={set("employees")}
                >
                  <option value="">Select range</option>
                  {EMPLOYEE_RANGES.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--ds-text-muted)] pointer-events-none" />
              </div>
            </InputField>

            {/* Address */}
            <SectionTitle>Location</SectionTitle>

            <InputField label="Street address" required error={errors.companyAddress}>
              <input
                type="text"
                className={inputCls}
                placeholder="123 Main Street"
                value={form.companyAddress}
                onChange={set("companyAddress")}
              />
            </InputField>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InputField label="City" required error={errors.city}>
                <input
                  type="text"
                  className={inputCls}
                  placeholder="Nairobi"
                  value={form.city}
                  onChange={set("city")}
                />
              </InputField>
              <InputField label="Country" required error={errors.country}>
                <input
                  type="text"
                  className={inputCls}
                  placeholder="Kenya"
                  value={form.country}
                  onChange={set("country")}
                />
              </InputField>
            </div>

            {/* Privacy */}
            <div className="mt-6 pt-4 border-t border-[var(--ds-border)]">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  className="mt-0.5 accent-[var(--ds-accent)] w-4 h-4 rounded"
                  checked={form.agreePrivacy}
                  onChange={set("agreePrivacy")}
                />
                <span className="text-sm text-[var(--ds-text-secondary)] leading-relaxed">
                  I agree to the{" "}
                  <a href="/terms" className="text-[var(--ds-accent)] underline hover:text-[var(--ds-accent-hover)]">
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a href="/privacy" className="text-[var(--ds-accent)] underline hover:text-[var(--ds-accent-hover)]">
                    Privacy Policy
                  </a>
                  . I understand a confirmation email will be sent before my account is activated.
                </span>
              </label>
              {errors.agreePrivacy && (
                <p className="mt-1 text-xs text-red-500">{errors.agreePrivacy}</p>
              )}
            </div>

            <div className="pt-6">
              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-[var(--ds-accent)] text-[var(--ds-text-on-dark)] font-semibold text-sm hover:bg-[var(--ds-accent-hover)] transition"
              >
                Create account & send confirmation email
              </button>
              <p className="text-center text-xs text-[var(--ds-text-muted)] mt-3">
                Already have an account?{" "}
                <Link to="/login" className="text-[var(--ds-accent)] underline hover:text-[var(--ds-accent-hover)]">
                  Sign in
                </Link>
              </p>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}
