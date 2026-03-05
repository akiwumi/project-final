import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import { Navbar } from "../../components/layout/Navbar";
import { Footer } from "../../components/layout/Footer";
import { EntrepreneurSidebar } from "../../components/entrepreneur/Sidebar";
import {
  CreditCard,
  Calendar,
  Clock,
  Shield,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

// Generate available days (next 14 working days from today)
function getWorkingDays(count = 14) {
  const days = [];
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + 1); // start from tomorrow
  while (days.length < count) {
    const dow = d.getDay();
    if (dow !== 0 && dow !== 6) {
      days.push(new Date(d));
    }
    d.setDate(d.getDate() + 1);
  }
  return days;
}

// Generate 30-min slots 09:00–16:00 GMT (last slot starts at 15:30)
function generateSlots() {
  const slots = [];
  for (let h = 9; h < 16; h++) {
    slots.push(`${String(h).padStart(2, "0")}:00`);
    slots.push(`${String(h).padStart(2, "0")}:30`);
  }
  return slots;
}

const WORKING_DAYS = getWorkingDays(14);
const TIME_SLOTS = generateSlots();

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const DAYS_SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function formatDate(d) {
  return d.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function isSameDay(a, b) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function isWorkingDay(date) {
  return WORKING_DAYS.some((d) => isSameDay(d, date));
}

function MiniCalendar({ selectedDate, onSelect }) {
  const today = new Date();
  const [viewDate, setViewDate] = useState(() => {
    const d = new Date();
    d.setDate(1);
    return d;
  });

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));

  function prevMonth() {
    setViewDate((v) => new Date(v.getFullYear(), v.getMonth() - 1, 1));
  }
  function nextMonth() {
    setViewDate((v) => new Date(v.getFullYear(), v.getMonth() + 1, 1));
  }

  return (
    <div className="bg-white rounded-xl border border-[var(--ds-border)] p-4 select-none">
      <div className="flex items-center justify-between mb-3">
        <button
          type="button"
          onClick={prevMonth}
          className="p-1.5 rounded-lg hover:bg-[var(--ds-overlay)] text-[var(--ds-text-muted)]"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <span className="text-sm font-semibold text-[var(--ds-text-primary)]">
          {MONTHS[month]} {year}
        </span>
        <button
          type="button"
          onClick={nextMonth}
          className="p-1.5 rounded-lg hover:bg-[var(--ds-overlay)] text-[var(--ds-text-muted)]"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-7 mb-1">
        {DAYS_SHORT.map((d) => (
          <div key={d} className="text-center text-xs text-[var(--ds-text-muted)] py-1 font-medium">
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-0.5">
        {cells.map((date, i) => {
          if (!date) return <div key={i} />;
          const past = date < today;
          const working = isWorkingDay(date);
          const selected = selectedDate && isSameDay(date, selectedDate);

          return (
            <button
              key={i}
              type="button"
              disabled={past || !working}
              onClick={() => onSelect(date)}
              className={`w-8 h-8 mx-auto rounded-full text-xs font-medium transition flex items-center justify-center ${
                selected
                  ? "bg-[var(--ds-accent)] text-white"
                  : working && !past
                  ? "text-[var(--ds-text-primary)] hover:bg-[var(--ds-accent)]/10 hover:text-[var(--ds-accent)] cursor-pointer"
                  : "text-[var(--ds-text-muted)] opacity-40 cursor-not-allowed"
              }`}
            >
              {date.getDate()}
            </button>
          );
        })}
      </div>
      <p className="text-xs text-[var(--ds-text-muted)] mt-3 text-center">
        Available Mon–Fri only. All times GMT.
      </p>
    </div>
  );
}

const inputCls =
  "w-full px-4 py-2.5 rounded-xl border border-[var(--ds-border)] bg-white text-[var(--ds-text-primary)] placeholder:text-[var(--ds-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--ds-accent)] focus:border-transparent text-sm";

export function Payment() {
  const navigate = useNavigate();
  const location = useLocation();
  const project = location.state?.project;

  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [errors, setErrors] = useState({});
  const [processing, setProcessing] = useState(false);
  const [paid, setPaid] = useState(false);

  function formatCard(val) {
    return val.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
  }
  function formatExpiry(val) {
    const digits = val.replace(/\D/g, "").slice(0, 4);
    if (digits.length >= 3) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
    return digits;
  }

  function validate() {
    const errs = {};
    if (!selectedDate) errs.date = "Please select a verification date";
    if (!selectedTime) errs.time = "Please select a time slot";
    if (!cardName.trim()) errs.cardName = "Cardholder name is required";
    const rawCard = cardNumber.replace(/\s/g, "");
    if (rawCard.length !== 16) errs.cardNumber = "Enter a valid 16-digit card number";
    if (!expiry.match(/^\d{2}\/\d{2}$/)) errs.expiry = "Enter expiry as MM/YY";
    if (!cvv.match(/^\d{3,4}$/)) errs.cvv = "Enter a valid CVV";
    if (!agreed) errs.agreed = "You must accept the payment terms";
    return errs;
  }

  async function handlePay(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    setProcessing(true);
    const { data: { user } } = await supabase.auth.getUser();

    // 1. Create Stripe payment intent via backend
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/payments/create-intent`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        projectId: project?.id,
        entrepreneurId: user.id,
      }),
    });
    const { clientSecret, error } = await res.json();

    if (error) {
      setErrors({ cardNumber: error });
      setProcessing(false);
      return;
    }

    // 2. Confirm card payment with Stripe.js
    const { loadStripe } = await import("@stripe/stripe-js");
    const stripeJs = await loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

    const { error: stripeError } = await stripeJs.confirmCardPayment(clientSecret, {
      payment_method: {
        card: {
          number: cardNumber.replace(/\s/g, ""),
          exp_month: parseInt(expiry.split("/")[0]),
          exp_year: parseInt("20" + expiry.split("/")[1]),
          cvc: cvv,
        },
        billing_details: { name: cardName },
      },
    });

    if (stripeError) {
      setErrors({ cardNumber: stripeError.message });
      setProcessing(false);
      return;
    }

    // 3. Save verification date & time
    await supabase
      .from("payments")
      .update({
        verification_date: selectedDate.toISOString().split("T")[0],
        verification_time: selectedTime,
      })
      .eq("project_id", project?.id)
      .eq("entrepreneur_id", user.id);

    setProcessing(false);
    setPaid(true);
  }

  if (paid) {
    return (
      <div className="min-h-screen bg-[var(--ds-bg-light)]">
        <Navbar />
        <div className="flex pt-16">
          <EntrepreneurSidebar active="submit" />
          <main className="flex-1 p-6 lg:p-10 flex items-center justify-center">
            <div className="max-w-md w-full text-center">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-5">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h1
                className="text-2xl font-bold text-[var(--ds-text-primary)] mb-3"
                style={{ fontFamily: "var(--ds-font-display)" }}
              >
                Submission received!
              </h1>
              <p className="text-sm text-[var(--ds-text-secondary)] leading-relaxed mb-2">
                Payment of <strong>€1,000</strong> processed successfully.
              </p>
              <p className="text-sm text-[var(--ds-text-secondary)] leading-relaxed mb-6">
                Your phone verification is scheduled for{" "}
                <strong>{selectedDate && formatDate(selectedDate)}</strong> at{" "}
                <strong>{selectedTime} GMT</strong>. You will receive a confirmation email
                with your call details.
              </p>
              <button
                type="button"
                onClick={() => navigate("/entrepreneur/dashboard")}
                className="px-8 py-3 rounded-xl bg-[var(--ds-accent)] text-[var(--ds-text-on-dark)] font-semibold text-sm hover:bg-[var(--ds-accent-hover)] transition"
              >
                Go to Dashboard
              </button>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--ds-bg-light)]">
      <Navbar />
      <div className="flex pt-16">
        <EntrepreneurSidebar active="submit" />

        <main className="flex-1 p-6 lg:p-10">
          <div className="max-w-3xl">
            <div className="mb-8">
              <h1
                className="text-2xl font-bold text-[var(--ds-text-primary)] mb-1"
                style={{ fontFamily: "var(--ds-font-display)" }}
              >
                Payment & Verification
              </h1>
              <p className="text-sm text-[var(--ds-text-secondary)]">
                Complete payment and schedule your phone verification call to finalise your
                submission.
              </p>
            </div>

            {Object.keys(errors).length > 0 && (
              <div className="mb-6 flex items-start gap-3 p-4 rounded-xl bg-red-50 border border-red-200 text-sm text-red-700">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                Please fix the highlighted fields before continuing.
              </div>
            )}

            <form onSubmit={handlePay} noValidate className="space-y-6">
              {/* Order summary */}
              <section className="bg-white rounded-2xl border border-[var(--ds-border)] p-6">
                <h2 className="text-base font-semibold text-[var(--ds-text-primary)] mb-4">
                  Order Summary
                </h2>
                <div className="flex items-center justify-between py-3 border-b border-[var(--ds-border)]">
                  <div>
                    <p className="text-sm font-medium text-[var(--ds-text-primary)]">
                      {project?.title || "Project Submission"}
                    </p>
                    <p className="text-xs text-[var(--ds-text-muted)] mt-0.5">
                      One-time submission fee
                    </p>
                  </div>
                  <span className="text-sm font-bold text-[var(--ds-text-primary)]">€1,000.00</span>
                </div>
                <div className="flex items-center justify-between pt-3">
                  <span className="text-sm font-semibold text-[var(--ds-text-primary)]">Total</span>
                  <span className="text-lg font-bold text-[var(--ds-text-primary)]">€1,000.00</span>
                </div>

                {/* Refund notice */}
                <div className="mt-4 p-3 rounded-xl bg-[var(--ds-accent)]/5 border border-[var(--ds-accent)]/20 text-xs text-[var(--ds-text-secondary)] leading-relaxed">
                  <strong className="text-[var(--ds-text-primary)]">Refund policy:</strong>{" "}
                  If your project fails the initial screening, €800 (80%) will be refunded
                  within 14 business days. The remaining €200 (20%) is retained as a
                  non-refundable administration fee.
                </div>
              </section>

              {/* Phone verification scheduling */}
              <section className="bg-white rounded-2xl border border-[var(--ds-border)] p-6">
                <h2 className="text-base font-semibold text-[var(--ds-text-primary)] mb-1 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[var(--ds-accent)]" />
                  Schedule Phone Verification
                </h2>
                <p className="text-xs text-[var(--ds-text-muted)] mb-5">
                  Choose a date and 30-minute call window. All times are in GMT.
                  Available Mon–Fri, 09:00–16:00.
                </p>

                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Calendar */}
                  <div className="flex-1">
                    <MiniCalendar
                      selectedDate={selectedDate}
                      onSelect={(d) => {
                        setSelectedDate(d);
                        setSelectedTime(null);
                        setErrors((p) => ({ ...p, date: undefined, time: undefined }));
                      }}
                    />
                    {errors.date && (
                      <p className="text-xs text-red-500 mt-1">{errors.date}</p>
                    )}
                  </div>

                  {/* Time slots */}
                  <div className="flex-1">
                    {selectedDate ? (
                      <div>
                        <p className="text-sm font-medium text-[var(--ds-text-primary)] mb-3 flex items-center gap-2">
                          <Clock className="w-4 h-4 text-[var(--ds-accent)]" />
                          {formatDate(selectedDate)}
                        </p>
                        <div className="grid grid-cols-3 gap-2">
                          {TIME_SLOTS.map((slot) => (
                            <button
                              key={slot}
                              type="button"
                              onClick={() => {
                                setSelectedTime(slot);
                                setErrors((p) => ({ ...p, time: undefined }));
                              }}
                              className={`py-2 px-3 rounded-lg border text-xs font-medium transition ${
                                selectedTime === slot
                                  ? "bg-[var(--ds-accent)] border-[var(--ds-accent)] text-white"
                                  : "border-[var(--ds-border)] text-[var(--ds-text-primary)] hover:border-[var(--ds-accent)]/50 hover:bg-[var(--ds-accent)]/5"
                              }`}
                            >
                              {slot}
                            </button>
                          ))}
                        </div>
                        {errors.time && (
                          <p className="text-xs text-red-500 mt-1">{errors.time}</p>
                        )}
                      </div>
                    ) : (
                      <div className="h-full flex items-center justify-center border-2 border-dashed border-[var(--ds-border)] rounded-xl p-8 text-center">
                        <p className="text-sm text-[var(--ds-text-muted)]">
                          Select a date on the calendar to see available time slots
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {selectedDate && selectedTime && (
                  <div className="mt-4 p-3 rounded-xl bg-green-50 border border-green-200 text-sm text-green-700 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 shrink-0" />
                    Call booked for {formatDate(selectedDate)} at {selectedTime} GMT
                  </div>
                )}
              </section>

              {/* Card payment */}
              <section className="bg-white rounded-2xl border border-[var(--ds-border)] p-6">
                <h2 className="text-base font-semibold text-[var(--ds-text-primary)] mb-1 flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-[var(--ds-accent)]" />
                  Payment Details
                </h2>
                <p className="text-xs text-[var(--ds-text-muted)] mb-5 flex items-center gap-1">
                  <Shield className="w-3.5 h-3.5" />
                  Secured by 256-bit SSL encryption
                </p>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-[var(--ds-text-primary)] mb-1.5">
                      Cardholder name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      className={inputCls}
                      placeholder="Jane Doe"
                      value={cardName}
                      onChange={(e) => {
                        setCardName(e.target.value);
                        setErrors((p) => ({ ...p, cardName: undefined }));
                      }}
                    />
                    {errors.cardName && (
                      <p className="text-xs text-red-500 mt-1">{errors.cardName}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[var(--ds-text-primary)] mb-1.5">
                      Card number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      className={inputCls}
                      placeholder="1234 5678 9012 3456"
                      value={cardNumber}
                      onChange={(e) => {
                        setCardNumber(formatCard(e.target.value));
                        setErrors((p) => ({ ...p, cardNumber: undefined }));
                      }}
                      inputMode="numeric"
                    />
                    {errors.cardNumber && (
                      <p className="text-xs text-red-500 mt-1">{errors.cardNumber}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-[var(--ds-text-primary)] mb-1.5">
                        Expiry (MM/YY) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        className={inputCls}
                        placeholder="12/27"
                        value={expiry}
                        onChange={(e) => {
                          setExpiry(formatExpiry(e.target.value));
                          setErrors((p) => ({ ...p, expiry: undefined }));
                        }}
                        inputMode="numeric"
                      />
                      {errors.expiry && (
                        <p className="text-xs text-red-500 mt-1">{errors.expiry}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[var(--ds-text-primary)] mb-1.5">
                        CVV <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        className={inputCls}
                        placeholder="123"
                        value={cvv}
                        onChange={(e) => {
                          setCvv(e.target.value.replace(/\D/g, "").slice(0, 4));
                          setErrors((p) => ({ ...p, cvv: undefined }));
                        }}
                        inputMode="numeric"
                      />
                      {errors.cvv && (
                        <p className="text-xs text-red-500 mt-1">{errors.cvv}</p>
                      )}
                    </div>
                  </div>
                </div>
              </section>

              {/* Agreement */}
              <div className="bg-white rounded-2xl border border-[var(--ds-border)] p-6">
                <label className="flex items-start gap-3 cursor-pointer mb-1">
                  <input
                    type="checkbox"
                    className="mt-0.5 accent-[var(--ds-accent)] w-4 h-4"
                    checked={agreed}
                    onChange={(e) => {
                      setAgreed(e.target.checked);
                      setErrors((p) => ({ ...p, agreed: undefined }));
                    }}
                  />
                  <span className="text-sm text-[var(--ds-text-secondary)] leading-relaxed">
                    I understand that the €1,000 submission fee will be charged immediately. I
                    accept the refund policy: 80% refunded if the project fails screening, 20%
                    retained as an administration fee. I confirm that I will attend the scheduled
                    phone verification call.
                  </span>
                </label>
                {errors.agreed && (
                  <p className="text-xs text-red-500 mt-1 ml-7">{errors.agreed}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={processing}
                className="w-full py-3.5 rounded-xl bg-[var(--ds-accent)] text-[var(--ds-text-on-dark)] font-semibold text-sm hover:bg-[var(--ds-accent-hover)] transition disabled:opacity-70 flex items-center justify-center gap-2"
              >
                {processing ? (
                  "Processing payment…"
                ) : (
                  <>
                    <Shield className="w-4 h-4" />
                    Pay €1,000 & Submit Project
                  </>
                )}
              </button>
            </form>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}
