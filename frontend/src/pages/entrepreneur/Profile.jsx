import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import { Navbar } from "../../components/layout/Navbar";
import { Footer } from "../../components/layout/Footer";
import { EntrepreneurSidebar } from "../../components/entrepreneur/Sidebar";
import {
  Camera,
  Building2,
  Globe,
  MapPin,
  PenLine,
  Save,
  CheckCircle,
} from "lucide-react";

const inputCls =
  "w-full px-4 py-2.5 rounded-xl border border-[var(--ds-border)] bg-white text-[var(--ds-text-primary)] placeholder:text-[var(--ds-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--ds-accent)] focus:border-transparent text-sm";

export function EntrepreneurProfile() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [bio, setBio] = useState("");
  const [presentation, setPresentation] = useState("");
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    async function loadProfile() {
      const { data: { session } } = await supabase.auth.getSession();
      const user = session?.user;
      if (!user) {
        console.warn("Profile: no authenticated session found");
        return;
      }
      const { data, error } = await supabase
        .from("entrepreneurs")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();
      if (error) {
        console.error("Profile load error:", error);
        setSaveError(`Failed to load profile: ${error.message}`);
        return;
      }
      if (data) {
        setProfile(data);
        setBio(data.bio || "");
        setPresentation(data.presentation || "");
        setAvatarPreview(data.avatar_url || null);
      }
    }
    loadProfile();
  }, []);

  function handleAvatarChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    setAvatar(file);
    setAvatarPreview(URL.createObjectURL(file));
  }

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    setSaveError("");

    const { data: { session } } = await supabase.auth.getSession();
    const user = session?.user;
    if (!user) { setSaving(false); setSaveError("Not authenticated."); return; }
    let avatarUrl = profile?.avatar_url || null;

    if (avatar) {
      const ext = avatar.name.split(".").pop();
      const path = `${user.id}/avatar.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(path, avatar, { upsert: true });

      if (uploadError) {
        setSaveError(`Photo upload failed: ${uploadError.message}`);
        setSaving(false);
        return;
      }

      const { data: urlData } = supabase.storage
        .from("avatars")
        .getPublicUrl(path);
      avatarUrl = urlData.publicUrl;
    }

    const { error: updateError } = await supabase
      .from("entrepreneurs")
      .update({ bio, presentation, avatar_url: avatarUrl })
      .eq("id", user.id);

    setSaving(false);
    if (updateError) {
      setSaveError(`Save failed: ${updateError.message}`);
    } else {
      setSaved(true);
    }
  }

  const firstName = profile?.first_name || "";
  const lastName = profile?.last_name || "";
  const initials = firstName && lastName ? `${firstName[0]}${lastName[0]}` : "?";

  return (
    <div className="min-h-screen bg-[var(--ds-bg-light)]">
      <Navbar />
      <div className="flex pt-16">
        <EntrepreneurSidebar active="profile" />

        <main className="flex-1 p-6 lg:p-10 max-w-3xl">
          <div className="mb-8">
            <h1
              className="text-2xl font-bold text-[var(--ds-text-primary)] mb-1"
              style={{ fontFamily: "var(--ds-font-display)" }}
            >
              My Profile
            </h1>
            <p className="text-sm text-[var(--ds-text-secondary)]">
              Complete your profile to appear credible to investors.
            </p>
          </div>

          {saved && (
            <div className="mb-6 flex items-center gap-2 p-4 rounded-xl bg-green-50 border border-green-200 text-sm text-green-700">
              <CheckCircle className="w-4 h-4 shrink-0" />
              Profile saved successfully.
            </div>
          )}
          {saveError && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-sm text-red-700">
              {saveError}
            </div>
          )}

          <form onSubmit={handleSave} className="space-y-8">
            {/* Avatar */}
            <section className="bg-white rounded-2xl border border-[var(--ds-border)] p-6">
              <h2 className="text-base font-semibold text-[var(--ds-text-primary)] mb-5">
                Profile Photo
              </h2>
              <div className="flex items-center gap-6">
                <div className="relative">
                  {avatarPreview ? (
                    <img
                      src={avatarPreview}
                      alt="Profile"
                      className="w-24 h-24 rounded-full object-cover border-2 border-[var(--ds-accent)]"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-[var(--ds-accent)]/10 border-2 border-[var(--ds-accent)]/30 flex items-center justify-center text-2xl font-bold text-[var(--ds-accent)]">
                      {initials}
                    </div>
                  )}
                  <button
                    type="button"
                    className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-[var(--ds-accent)] flex items-center justify-center text-white shadow"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Camera className="w-3.5 h-3.5" />
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarChange}
                  />
                </div>
                <div>
                  <p className="text-sm font-medium text-[var(--ds-text-primary)] mb-1">
                    {firstName} {lastName}
                  </p>
                  <p className="text-xs text-[var(--ds-text-muted)] mb-3">
                    JPG, PNG or GIF — max 5 MB
                  </p>
                  <button
                    type="button"
                    className="text-xs font-medium text-[var(--ds-accent)] underline hover:text-[var(--ds-accent-hover)]"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    Upload photo
                  </button>
                </div>
              </div>
            </section>

            {/* About */}
            <section className="bg-white rounded-2xl border border-[var(--ds-border)] p-6">
              <h2 className="text-base font-semibold text-[var(--ds-text-primary)] mb-5 flex items-center gap-2">
                <PenLine className="w-4 h-4 text-[var(--ds-accent)]" />
                About You
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--ds-text-primary)] mb-1.5">
                    Personal bio
                  </label>
                  <textarea
                    rows={4}
                    className={`${inputCls} resize-none`}
                    placeholder="Tell investors a little about yourself — your background, expertise, and what drives you..."
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                  />
                  <p className="text-xs text-[var(--ds-text-muted)] mt-1 text-right">
                    {bio.length}/500
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--ds-text-primary)] mb-1.5">
                    Company presentation
                  </label>
                  <textarea
                    rows={5}
                    className={`${inputCls} resize-none`}
                    placeholder="Describe your company, its mission, what problem it solves, and why you are seeking investment..."
                    value={presentation}
                    onChange={(e) => setPresentation(e.target.value)}
                  />
                  <p className="text-xs text-[var(--ds-text-muted)] mt-1 text-right">
                    {presentation.length}/1000
                  </p>
                </div>
              </div>
            </section>

            {/* Registration details (read-only) */}
            <section className="bg-white rounded-2xl border border-[var(--ds-border)] p-6">
              <h2 className="text-base font-semibold text-[var(--ds-text-primary)] mb-5 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-[var(--ds-accent)]" />
                Registration Details
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { label: "First name", value: profile?.first_name },
                  { label: "Last name", value: profile?.last_name },
                  { label: "Email", value: profile?.email },
                  { label: "Phone", value: profile?.phone },
                  { label: "Company name", value: profile?.company_name },
                  {
                    label: "Company type",
                    value:
                      profile?.company_type === "startup"
                        ? "Startup"
                        : "Established company",
                  },
                  { label: "Employees", value: profile?.employees },
                  { label: "Website", value: profile?.website || "—" },
                ].map((field) => (
                  <div key={field.label}>
                    <p className="text-xs text-[var(--ds-text-muted)] mb-0.5">
                      {field.label}
                    </p>
                    <p className="text-sm font-medium text-[var(--ds-text-primary)]">
                      {field.value || "—"}
                    </p>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex items-center gap-2 text-xs text-[var(--ds-text-muted)]">
                <MapPin className="w-3.5 h-3.5" />
                {profile?.company_address || "—"}, {profile?.city || "—"}, {profile?.country || "—"}
              </div>
              {profile?.website && (
              <div className="mt-1 flex items-center gap-2 text-xs text-[var(--ds-text-muted)]">
                <Globe className="w-3.5 h-3.5" />
                <a
                  href={profile.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--ds-accent)] underline"
                >
                  {profile.website}
                </a>
              </div>
              )}
              <p className="text-xs text-[var(--ds-text-muted)] mt-3">
                To update registration details, contact{" "}
                <a
                  href="mailto:support@connectafrica.com"
                  className="text-[var(--ds-accent)] underline"
                >
                  support@connectafrica.com
                </a>
                .
              </p>
            </section>

            {/* Save button */}
            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={() => navigate("/entrepreneur/dashboard")}
                className="px-6 py-2.5 rounded-xl border border-[var(--ds-border)] text-sm font-medium text-[var(--ds-text-secondary)] hover:bg-[var(--ds-overlay)] transition"
              >
                Go to Dashboard
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2.5 rounded-xl bg-[var(--ds-accent)] text-[var(--ds-text-on-dark)] font-semibold text-sm hover:bg-[var(--ds-accent-hover)] transition flex items-center gap-2 disabled:opacity-70"
              >
                {saving ? (
                  "Saving…"
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Save profile
                  </>
                )}
              </button>
            </div>
          </form>
        </main>
      </div>
      <Footer />
    </div>
  );
}
