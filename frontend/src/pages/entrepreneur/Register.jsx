import { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
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

function validatePassword(password) {
  if (!password || password.length < 8) return "Password must be at least 8 characters";
  if (!/[A-Z]/.test(password)) return "Password must include at least one uppercase letter";
  if (!/[a-z]/.test(password)) return "Password must include at least one lowercase letter";
  if (!/[0-9]/.test(password)) return "Password must include at least one number";
  if (!/[^A-Za-z0-9]/.test(password)) return "Password must include at least one special character";
  return null;
}

function InputField({ label, inputId, required, error, errorId, children }) {
  const resolvedErrorId = errorId || (inputId ? `${inputId}-error` : undefined);
  return (
    <div className="flex flex-col gap-1.5">
      {inputId ? (
        <label htmlFor={inputId} className="text-sm font-medium text-[var(--ds-text-primary)]">
          {label}
          {required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
      ) : (
        <p className="text-sm font-medium text-[var(--ds-text-primary)]">
          {label}
          {required && <span className="text-red-500 ml-0.5">*</span>}
        </p>
      )}
      {children}
      {error && (
        <p id={resolvedErrorId} className="text-xs text-red-500">
          {error}
        </p>
      )}
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

const FIELD_IDS = {
  firstName: "register-first-name",
  lastName: "register-last-name",
  email: "register-email",
  phoneCode: "register-phone-code",
  phone: "register-phone",
  password: "register-password",
  confirmPassword: "register-confirm-password",
  companyName: "register-company-name",
  website: "register-company-website",
  yearsOperating: "register-years-operating",
  employees: "register-employees",
  companyAddress: "register-company-address",
  city: "register-city",
  country: "register-country",
  agreePrivacy: "register-agree-privacy",
};

export function EntrepreneurRegister() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [resending, setResending] = useState(false);
  const [resendMsg, setResendMsg] = useState("");

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
    const passwordError = validatePassword(form.password);
    if (passwordError) errs.password = passwordError;
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
    setSubmitError("");
    setResendMsg("");
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    setSubmitting(true);

    const emailRedirectTo =
      import.meta.env.VITE_EMAIL_REDIRECT_TO || `${window.location.origin}/welcome`;

    // 1. Create auth user — Supabase sends confirmation email automatically
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        emailRedirectTo,
      },
    });

    if (authError) {
      setSubmitting(false);
      setErrors({ email: authError.message });
      return;
    }

    const existingUserNoIdentity =
      Array.isArray(authData?.user?.identities) && authData.user.identities.length === 0;
    if (existingUserNoIdentity) {
      setSubmitting(false);
      setErrors({
        email:
          "This email is already registered. Please sign in instead, or reset your password if needed.",
      });
      return;
    }

    // Save form data to localStorage so Welcome.jsx can create the entrepreneurs
    // row once the session is established after email confirmation. The direct
    // INSERT below will succeed if email-confirm is disabled; if it is enabled
    // auth.uid() is null and RLS blocks it, so localStorage is the fallback.
    const entrepreneurData = {
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
    };
    localStorage.setItem("pendingEntrepreneur", JSON.stringify(entrepreneurData));

    // 2. Insert entrepreneur profile row (succeeds immediately when no email confirm)
    const { error: insertError } = await supabase
      .from("entrepreneurs")
      .insert(entrepreneurData);
    if (insertError) {
      console.warn("Profile insert deferred until confirmed session:", insertError.message);
    }

    const isEmailAlreadyConfirmed = Boolean(authData?.user?.email_confirmed_at);
    if (authData?.session || isEmailAlreadyConfirmed) {
      setSubmitting(false);
      navigate("/welcome");
      return;
    }

    setSubmitted(true);
    setSubmitting(false);
  }

  async function handleResend() {
    setResending(true);
    setResendMsg("");

    const emailRedirectTo =
      import.meta.env.VITE_EMAIL_REDIRECT_TO || `${window.location.origin}/welcome`;

    const { error } = await supabase.auth.resend({
      type: "signup",
      email: form.email,
      options: {
        emailRedirectTo,
      },
    });

    if (error) {
      setResendMsg(error.message);
      setResending(false);
      return;
    }

    setResendMsg("Confirmation email re-sent. Please check inbox and spam folders.");
    setResending(false);
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
                type="button"
                className="underline text-[var(--ds-accent)] hover:text-[var(--ds-accent-hover)]"
                onClick={() => setSubmitted(false)}
              >
                try again
              </button>
              .
            </p>
            <button
              type="button"
              onClick={handleResend}
              disabled={resending}
              className="mt-4 text-sm underline text-[var(--ds-accent)] hover:text-[var(--ds-accent-hover)] disabled:opacity-60"
            >
              {resending ? "Resending..." : "Resend confirmation email"}
            </button>
            {resendMsg && (
              <p role="status" aria-live="polite" className="mt-3 text-xs text-[var(--ds-text-secondary)]">
                {resendMsg}
              </p>
            )}
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
            <div
              id="register-errors-summary"
              role="alert"
              aria-live="assertive"
              className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-sm text-red-700"
            >
              Please fix the highlighted fields before continuing.
            </div>
          )}
          {submitError && (
            <div role="alert" aria-live="assertive" className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-sm text-red-700">
              {submitError}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="space-y-2" aria-describedby={Object.keys(errors).length > 0 ? "register-errors-summary" : undefined}>
            {/* Personal Details */}
            <SectionTitle>Personal Details</SectionTitle>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InputField label="First name" inputId={FIELD_IDS.firstName} required error={errors.firstName}>
                <input
                  id={FIELD_IDS.firstName}
                  type="text"
                  className={inputCls}
                  placeholder="Jane"
                  value={form.firstName}
                  onChange={set("firstName")}
                  required
                  autoComplete="given-name"
                  aria-invalid={Boolean(errors.firstName)}
                  aria-describedby={errors.firstName ? `${FIELD_IDS.firstName}-error` : undefined}
                />
              </InputField>
              <InputField label="Last name" inputId={FIELD_IDS.lastName} required error={errors.lastName}>
                <input
                  id={FIELD_IDS.lastName}
                  type="text"
                  className={inputCls}
                  placeholder="Doe"
                  value={form.lastName}
                  onChange={set("lastName")}
                  required
                  autoComplete="family-name"
                  aria-invalid={Boolean(errors.lastName)}
                  aria-describedby={errors.lastName ? `${FIELD_IDS.lastName}-error` : undefined}
                />
              </InputField>
            </div>

            <InputField label="Email address" inputId={FIELD_IDS.email} required error={errors.email}>
              <input
                id={FIELD_IDS.email}
                type="email"
                className={inputCls}
                placeholder="jane@company.com"
                value={form.email}
                onChange={set("email")}
                required
                autoComplete="email"
                aria-invalid={Boolean(errors.email)}
                aria-describedby={errors.email ? `${FIELD_IDS.email}-error` : undefined}
              />
            </InputField>

            <InputField label="Phone number" inputId={FIELD_IDS.phone} required error={errors.phone}>
              <div className="flex gap-2">
                <div className="relative">
                  <select
                    id={FIELD_IDS.phoneCode}
                    className={`${selectCls} w-32 pr-8`}
                    value={form.phoneCode}
                    onChange={set("phoneCode")}
                    aria-label="Country calling code"
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
                  id={FIELD_IDS.phone}
                  type="tel"
                  className={`${inputCls} flex-1`}
                  placeholder="712 345 6789"
                  value={form.phone}
                  onChange={set("phone")}
                  required
                  autoComplete="tel-national"
                  aria-invalid={Boolean(errors.phone)}
                  aria-describedby={errors.phone ? `${FIELD_IDS.phone}-error` : undefined}
                />
              </div>
            </InputField>

            <InputField label="Password" inputId={FIELD_IDS.password} required error={errors.password}>
              <div className="relative">
                <input
                  id={FIELD_IDS.password}
                  type={showPassword ? "text" : "password"}
                  className={`${inputCls} pr-10`}
                  placeholder="At least 8 characters"
                  value={form.password}
                  onChange={set("password")}
                  required
                  autoComplete="new-password"
                  aria-invalid={Boolean(errors.password)}
                  aria-describedby={[
                    errors.password ? `${FIELD_IDS.password}-error` : null,
                    form.password.length > 0 ? "register-password-rules" : null,
                  ]
                    .filter(Boolean)
                    .join(" ") || undefined}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--ds-text-muted)]"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  aria-pressed={showPassword}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {form.password.length > 0 && (
                <ul id="register-password-rules" className="mt-2 space-y-1">
                  {[
                    { label: "At least 8 characters", ok: form.password.length >= 8 },
                    { label: "One uppercase letter (A–Z)", ok: /[A-Z]/.test(form.password) },
                    { label: "One lowercase letter (a–z)", ok: /[a-z]/.test(form.password) },
                    { label: "One number (0–9)", ok: /[0-9]/.test(form.password) },
                    { label: "One special character (!@#$…)", ok: /[^A-Za-z0-9]/.test(form.password) },
                  ].map(({ label, ok }) => (
                    <li key={label} className={`flex items-center gap-1.5 text-xs ${ok ? "text-green-600" : "text-[var(--ds-text-muted)]"}`}>
                      <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[10px] font-bold ${ok ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-400"}`}>
                        {ok ? "✓" : "·"}
                      </span>
                      {label}
                    </li>
                  ))}
                </ul>
              )}
            </InputField>

            <InputField label="Confirm password" inputId={FIELD_IDS.confirmPassword} required error={errors.confirmPassword}>
              <div className="relative">
                <input
                  id={FIELD_IDS.confirmPassword}
                  type={showConfirm ? "text" : "password"}
                  className={`${inputCls} pr-10`}
                  placeholder="Repeat your password"
                  value={form.confirmPassword}
                  onChange={set("confirmPassword")}
                  required
                  autoComplete="new-password"
                  aria-invalid={Boolean(errors.confirmPassword)}
                  aria-describedby={errors.confirmPassword ? `${FIELD_IDS.confirmPassword}-error` : undefined}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--ds-text-muted)]"
                  onClick={() => setShowConfirm((v) => !v)}
                  aria-label={showConfirm ? "Hide confirm password" : "Show confirm password"}
                  aria-pressed={showConfirm}
                >
                  {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </InputField>

            {/* Company Details */}
            <SectionTitle>Company Details</SectionTitle>

            <InputField label="Company name" inputId={FIELD_IDS.companyName} required error={errors.companyName}>
              <input
                id={FIELD_IDS.companyName}
                type="text"
                className={inputCls}
                placeholder="Acme Ltd."
                value={form.companyName}
                onChange={set("companyName")}
                required
                aria-invalid={Boolean(errors.companyName)}
                aria-describedby={errors.companyName ? `${FIELD_IDS.companyName}-error` : undefined}
              />
            </InputField>

            <InputField label="Company website" inputId={FIELD_IDS.website} error={errors.website}>
              <input
                id={FIELD_IDS.website}
                type="url"
                className={inputCls}
                placeholder="https://www.yourcompany.com"
                value={form.website}
                onChange={set("website")}
                autoComplete="url"
                aria-invalid={Boolean(errors.website)}
                aria-describedby={errors.website ? `${FIELD_IDS.website}-error` : undefined}
              />
            </InputField>

            <fieldset className="flex flex-col gap-1.5" aria-invalid={Boolean(errors.companyType)}>
              <legend className="text-sm font-medium text-[var(--ds-text-primary)]">
                Company type
                <span className="text-red-500 ml-0.5">*</span>
              </legend>
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
              {errors.companyType && (
                <p id="register-company-type-error" className="text-xs text-red-500">
                  {errors.companyType}
                </p>
              )}
            </fieldset>

            {form.companyType === "ongoing" && (
              <InputField
                label="Years in operation"
                inputId={FIELD_IDS.yearsOperating}
                required
                error={errors.yearsOperating}
              >
                <input
                  id={FIELD_IDS.yearsOperating}
                  type="number"
                  min="1"
                  max="200"
                  className={inputCls}
                  placeholder="e.g. 5"
                  value={form.yearsOperating}
                  onChange={set("yearsOperating")}
                  required
                  inputMode="numeric"
                  aria-invalid={Boolean(errors.yearsOperating)}
                  aria-describedby={errors.yearsOperating ? `${FIELD_IDS.yearsOperating}-error` : undefined}
                />
              </InputField>
            )}

            <InputField label="Number of employees" inputId={FIELD_IDS.employees} required error={errors.employees}>
              <div className="relative">
                <select
                  id={FIELD_IDS.employees}
                  className={`${selectCls} pr-8`}
                  value={form.employees}
                  onChange={set("employees")}
                  required
                  aria-invalid={Boolean(errors.employees)}
                  aria-describedby={errors.employees ? `${FIELD_IDS.employees}-error` : undefined}
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

            <InputField label="Street address" inputId={FIELD_IDS.companyAddress} required error={errors.companyAddress}>
              <input
                id={FIELD_IDS.companyAddress}
                type="text"
                className={inputCls}
                placeholder="123 Main Street"
                value={form.companyAddress}
                onChange={set("companyAddress")}
                required
                autoComplete="street-address"
                aria-invalid={Boolean(errors.companyAddress)}
                aria-describedby={errors.companyAddress ? `${FIELD_IDS.companyAddress}-error` : undefined}
              />
            </InputField>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InputField label="City" inputId={FIELD_IDS.city} required error={errors.city}>
                <input
                  id={FIELD_IDS.city}
                  type="text"
                  className={inputCls}
                  placeholder="Nairobi"
                  value={form.city}
                  onChange={set("city")}
                  required
                  autoComplete="address-level2"
                  aria-invalid={Boolean(errors.city)}
                  aria-describedby={errors.city ? `${FIELD_IDS.city}-error` : undefined}
                />
              </InputField>
              <InputField label="Country" inputId={FIELD_IDS.country} required error={errors.country}>
                <input
                  id={FIELD_IDS.country}
                  type="text"
                  className={inputCls}
                  placeholder="Kenya"
                  value={form.country}
                  onChange={set("country")}
                  required
                  autoComplete="country-name"
                  aria-invalid={Boolean(errors.country)}
                  aria-describedby={errors.country ? `${FIELD_IDS.country}-error` : undefined}
                />
              </InputField>
            </div>

            {/* Privacy */}
            <div className="mt-6 pt-4 border-t border-[var(--ds-border)]">
              <div className="flex items-start gap-3">
                <input
                  id={FIELD_IDS.agreePrivacy}
                  type="checkbox"
                  className="mt-0.5 accent-[var(--ds-accent)] w-4 h-4 rounded"
                  checked={form.agreePrivacy}
                  onChange={set("agreePrivacy")}
                  aria-invalid={Boolean(errors.agreePrivacy)}
                  aria-describedby={errors.agreePrivacy ? `${FIELD_IDS.agreePrivacy}-error` : undefined}
                />
                <label htmlFor={FIELD_IDS.agreePrivacy} className="text-sm text-[var(--ds-text-secondary)] leading-relaxed">
                  I agree to the{" "}
                  <Link to="/terms" className="text-[var(--ds-accent)] underline hover:text-[var(--ds-accent-hover)]">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link to="/privacy" className="text-[var(--ds-accent)] underline hover:text-[var(--ds-accent-hover)]">
                    Privacy Policy
                  </Link>
                  . I understand a confirmation email will be sent before my account is activated.
                </label>
              </div>
              {errors.agreePrivacy && (
                <p id={`${FIELD_IDS.agreePrivacy}-error`} className="mt-1 text-xs text-red-500">{errors.agreePrivacy}</p>
              )}
            </div>

            <div className="pt-6">
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 rounded-xl bg-[var(--ds-accent)] text-[var(--ds-text-on-dark)] font-semibold text-sm hover:bg-[var(--ds-accent-hover)] transition"
              >
                {submitting ? "Creating account..." : "Create account & send confirmation email"}
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
