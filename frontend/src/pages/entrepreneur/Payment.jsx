import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import { Navbar } from "../../components/layout/Navbar";
import { Footer } from "../../components/layout/Footer";
import { EntrepreneurSidebar } from "../../components/entrepreneur/Sidebar";
import {
  Calendar,
  Clock,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

function getWorkingDays(count = 14) {
  const days = [];
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + 1);
  while (days.length < count) {
    const dow = d.getDay();
    if (dow !== 0 && dow !== 6) {
      days.push(new Date(d));
    }
    d.setDate(d.getDate() + 1);
  }
  return days;
}

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

export function Payment() {
  const navigate = useNavigate();
  const location = useLocation();
  const project = location.state?.project;

  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [errors, setErrors] = useState({});
  const [processing, setProcessing] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  function validate() {
    const errs = {};
    if (!selectedDate) errs.date = "Please select a verification date";
    if (!selectedTime) errs.time = "Please select a time slot";
    return errs;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setProcessing(true);
    const { data: { user } } = await supabase.auth.getUser();

    const { error } = await supabase
      .from("projects")
      .update({
        status: "under_review",
        submitted_at: new Date().toISOString(),
        verification_date: selectedDate.toISOString().split("T")[0],
        verification_time: selectedTime,
      })
      .eq("id", project?.id)
      .eq("entrepreneur_id", user.id);

    setProcessing(false);

    if (error) {
      setErrors({ date: "Something went wrong. Please try again." });
      return;
    }

    setSubmitted(true);
  }

  if (submitted) {
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
                Your project has been submitted for review.
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
                Schedule Verification
              </h1>
              <p className="text-sm text-[var(--ds-text-secondary)]">
                Schedule your phone verification call to finalise your submission.
              </p>
            </div>

            {Object.keys(errors).length > 0 && (
              <div className="mb-6 flex items-start gap-3 p-4 rounded-xl bg-red-50 border border-red-200 text-sm text-red-700">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                Please fix the highlighted fields before continuing.
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate className="space-y-6">
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

              <button
                type="submit"
                disabled={processing}
                className="w-full py-3.5 rounded-xl bg-[var(--ds-accent)] text-[var(--ds-text-on-dark)] font-semibold text-sm hover:bg-[var(--ds-accent-hover)] transition disabled:opacity-70 flex items-center justify-center gap-2"
              >
                {processing ? "Submitting…" : "Submit Project"}
              </button>
            </form>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}
