import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Activity,
  BarChart3,
  Database,
  FolderKanban,
  LogOut,
  Mail,
  RefreshCcw,
  Shield,
  Trash2,
  Users,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { supabase } from "../../lib/supabase";
import {
  adminRequest,
  ADMIN_LOGIN_PATH,
} from "../../lib/adminApi";

const inputCls =
  "w-full px-4 py-2.5 rounded-xl border border-[var(--ds-border)] bg-white text-[var(--ds-text-primary)] placeholder:text-[var(--ds-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--ds-accent)] focus:border-transparent text-sm";

const textareaCls =
  "w-full px-4 py-3 rounded-xl border border-[var(--ds-border)] bg-white text-[var(--ds-text-primary)] placeholder:text-[var(--ds-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--ds-accent)] focus:border-transparent text-sm";

const statusCls =
  "px-2 py-1 rounded-full text-xs font-semibold bg-[var(--ds-accent)]/10 text-[var(--ds-accent)]";

function formatDate(value) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleString();
}

function StatCard({ label, value, icon: Icon }) {
  return (
    <div className="bg-white rounded-2xl border border-[var(--ds-border)] p-5">
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-[var(--ds-text-muted)]">
          {label}
        </p>
        <div className="p-2 rounded-lg bg-[var(--ds-accent)]/10">
          <Icon className="w-4 h-4 text-[var(--ds-accent)]" />
        </div>
      </div>
      <p className="text-2xl font-bold text-[var(--ds-text-primary)]">{value}</p>
    </div>
  );
}

function Section({ title, subtitle, children, actions }) {
  return (
    <section className="bg-white rounded-2xl border border-[var(--ds-border)] p-5">
      <div className="flex items-start justify-between gap-3 mb-4">
        <div>
          <h2 className="text-base font-semibold text-[var(--ds-text-primary)]">{title}</h2>
          {subtitle && <p className="text-xs text-[var(--ds-text-muted)] mt-1">{subtitle}</p>}
        </div>
        {actions}
      </div>
      {children}
    </section>
  );
}

export function AdminPanel() {
  const navigate = useNavigate();
  const { user, isLoading: isAuthLoading } = useAuth();

  const [bootLoading, setBootLoading] = useState(true);
  const [error, setError] = useState("");
  const [adminProfile, setAdminProfile] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");

  const [dashboard, setDashboard] = useState(null);

  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [selectedUserDetails, setSelectedUserDetails] = useState(null);
  const [userDetailsLoading, setUserDetailsLoading] = useState(false);
  const [userActionMessage, setUserActionMessage] = useState("");
  const [contactMessage, setContactMessage] = useState("");
  const [contactSending, setContactSending] = useState(false);

  const [projects, setProjects] = useState([]);
  const [projectsLoading, setProjectsLoading] = useState(false);
  const [projectActionMessage, setProjectActionMessage] = useState("");
  const [projectSubmitting, setProjectSubmitting] = useState(false);
  const [projectForm, setProjectForm] = useState({
    entrepreneur_id: "",
    title: "",
    category: "",
    stage: "",
    amount_seeking: "",
    country: "",
    summary: "",
    status: "under_review",
  });

  const [messages, setMessages] = useState([]);
  const [messagesLoading, setMessagesLoading] = useState(false);

  const [tables, setTables] = useState([]);
  const [tablesLoading, setTablesLoading] = useState(false);
  const [selectedTable, setSelectedTable] = useState("");
  const [tableRows, setTableRows] = useState([]);
  const [tableRowsLoading, setTableRowsLoading] = useState(false);
  const [tableRowId, setTableRowId] = useState("");
  const [tablePayload, setTablePayload] = useState("{\n  \n}");
  const [tableActionMessage, setTableActionMessage] = useState("");

  const tabs = useMemo(
    () => [
      { id: "overview", label: "Overview", icon: Activity },
      { id: "users", label: "Users CRM", icon: Users },
      { id: "projects", label: "Posts / Projects", icon: FolderKanban },
      { id: "messages", label: "Messages", icon: Mail },
      { id: "database", label: "Database Control", icon: Database },
    ],
    []
  );

  const selectedUser = useMemo(
    () => users.find((entry) => entry.id === selectedUserId) || null,
    [selectedUserId, users]
  );

  const loadDashboard = useCallback(async () => {
    const response = await adminRequest("/api/admin/dashboard");
    setDashboard(response);
  }, []);

  const loadUsers = useCallback(async () => {
    setUsersLoading(true);
    try {
      const response = await adminRequest("/api/admin/users");
      const nextUsers = response?.users || [];
      setUsers(nextUsers);
      setSelectedUserId((previous) => {
        if (previous && nextUsers.some((entry) => entry.id === previous)) {
          return previous;
        }
        return nextUsers[0]?.id || null;
      });
    } finally {
      setUsersLoading(false);
    }
  }, []);

  const loadUserDetails = useCallback(async (uid) => {
    if (!uid) {
      setSelectedUserDetails(null);
      return;
    }

    setUserDetailsLoading(true);
    try {
      const response = await adminRequest(`/api/admin/users/${uid}`);
      setSelectedUserDetails(response);
    } finally {
      setUserDetailsLoading(false);
    }
  }, []);

  const loadProjects = useCallback(async () => {
    setProjectsLoading(true);
    try {
      const response = await adminRequest("/api/admin/projects");
      setProjects(response?.projects || []);
    } finally {
      setProjectsLoading(false);
    }
  }, []);

  const loadMessages = useCallback(async () => {
    setMessagesLoading(true);
    try {
      const response = await adminRequest("/api/admin/messages?limit=300");
      setMessages(response?.messages || []);
    } finally {
      setMessagesLoading(false);
    }
  }, []);

  const loadTables = useCallback(async () => {
    setTablesLoading(true);
    try {
      const response = await adminRequest("/api/admin/tables");
      const nextTables = response?.tables || [];
      setTables(nextTables);
      setSelectedTable((previous) => {
        if (previous && nextTables.some((entry) => entry.table_name === previous)) {
          return previous;
        }
        return nextTables[0]?.table_name || "";
      });
    } finally {
      setTablesLoading(false);
    }
  }, []);

  const loadTableRows = useCallback(async (tableName) => {
    if (!tableName) {
      setTableRows([]);
      return;
    }

    setTableRowsLoading(true);
    try {
      const response = await adminRequest(
        `/api/admin/tables/${encodeURIComponent(tableName)}/rows?limit=100`
      );
      setTableRows(response?.rows || []);
    } finally {
      setTableRowsLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;

    async function bootstrap() {
      if (isAuthLoading) return;

      if (!user) {
        navigate(ADMIN_LOGIN_PATH, { replace: true });
        return;
      }

      setBootLoading(true);
      setError("");

      try {
        const me = await adminRequest("/api/admin/me");
        if (!active) return;

        setAdminProfile(me.user || null);

        await Promise.all([
          loadDashboard(),
          loadUsers(),
          loadProjects(),
          loadMessages(),
          loadTables(),
        ]);
      } catch (bootError) {
        if (!active) return;
        setError(bootError.message || "Failed to load admin panel.");
        await supabase.auth.signOut();
        navigate(ADMIN_LOGIN_PATH, { replace: true });
      } finally {
        if (active) {
          setBootLoading(false);
        }
      }
    }

    bootstrap();

    return () => {
      active = false;
    };
  }, [
    isAuthLoading,
    loadDashboard,
    loadMessages,
    loadProjects,
    loadTables,
    loadUsers,
    navigate,
    user,
  ]);

  useEffect(() => {
    loadUserDetails(selectedUserId);
  }, [loadUserDetails, selectedUserId]);

  useEffect(() => {
    loadTableRows(selectedTable);
  }, [loadTableRows, selectedTable]);

  async function handleSignOut() {
    await supabase.auth.signOut();
    navigate(ADMIN_LOGIN_PATH, { replace: true });
  }

  async function handleRefreshAll() {
    setError("");
    try {
      await Promise.all([
        loadDashboard(),
        loadUsers(),
        loadProjects(),
        loadMessages(),
        loadTables(),
      ]);
      setUserActionMessage("Data refreshed.");
      setProjectActionMessage("Data refreshed.");
      setTableActionMessage("Metadata refreshed.");
    } catch (refreshError) {
      setError(refreshError.message || "Refresh failed.");
    }
  }

  async function handleDeleteUser(uid) {
    if (!uid) return;

    const proceed = window.confirm(
      "Delete this user from auth and all linked data (projects/messages/payments)?"
    );
    if (!proceed) return;

    setUserActionMessage("");

    try {
      await adminRequest(`/api/admin/users/${uid}`, { method: "DELETE" });
      setUserActionMessage("User deleted successfully.");
      await Promise.all([loadUsers(), loadProjects(), loadMessages(), loadDashboard(), loadTables()]);
    } catch (deleteError) {
      setUserActionMessage(deleteError.message || "Failed to delete user.");
    }
  }

  async function handleSendMessage() {
    if (!selectedUserId || !contactMessage.trim()) return;

    setContactSending(true);
    setUserActionMessage("");

    try {
      await adminRequest(`/api/admin/users/${selectedUserId}/contact`, {
        method: "POST",
        body: {
          text: contactMessage.trim(),
        },
      });
      setContactMessage("");
      setUserActionMessage("Message sent to user.");
      await Promise.all([loadUserDetails(selectedUserId), loadMessages(), loadDashboard()]);
    } catch (messageError) {
      setUserActionMessage(messageError.message || "Failed to send message.");
    } finally {
      setContactSending(false);
    }
  }

  function setProjectField(field, value) {
    setProjectForm((previous) => ({ ...previous, [field]: value }));
  }

  async function handleCreateProject(event) {
    event.preventDefault();
    setProjectActionMessage("");

    if (!projectForm.entrepreneur_id) {
      setProjectActionMessage("Select a user to own the new project.");
      return;
    }

    setProjectSubmitting(true);

    try {
      await adminRequest("/api/admin/projects", {
        method: "POST",
        body: projectForm,
      });

      setProjectActionMessage("Project created.");
      setProjectForm((previous) => ({
        ...previous,
        title: "",
        category: "",
        stage: "",
        amount_seeking: "",
        country: "",
        summary: "",
      }));

      await Promise.all([loadProjects(), loadDashboard(), loadUsers(), loadUserDetails(selectedUserId)]);
    } catch (createError) {
      setProjectActionMessage(createError.message || "Failed to create project.");
    } finally {
      setProjectSubmitting(false);
    }
  }

  async function handleUpdateProjectStatus(projectId, status) {
    try {
      await adminRequest(`/api/admin/projects/${projectId}`, {
        method: "PATCH",
        body: { status },
      });
      setProjectActionMessage("Project status updated.");
      await Promise.all([loadProjects(), loadDashboard(), loadUsers(), loadUserDetails(selectedUserId)]);
    } catch (updateError) {
      setProjectActionMessage(updateError.message || "Failed to update project status.");
    }
  }

  async function handleDeleteProject(projectId) {
    const proceed = window.confirm("Delete this project permanently?");
    if (!proceed) return;

    try {
      await adminRequest(`/api/admin/projects/${projectId}`, {
        method: "DELETE",
      });
      setProjectActionMessage("Project deleted.");
      await Promise.all([loadProjects(), loadDashboard(), loadUsers(), loadUserDetails(selectedUserId), loadTables()]);
    } catch (deleteError) {
      setProjectActionMessage(deleteError.message || "Failed to delete project.");
    }
  }

  function parseTablePayload() {
    try {
      return JSON.parse(tablePayload);
    } catch {
      throw new Error("JSON payload is invalid.");
    }
  }

  async function handleTableCreate() {
    if (!selectedTable) return;

    setTableActionMessage("");
    try {
      const payload = parseTablePayload();
      await adminRequest(`/api/admin/tables/${encodeURIComponent(selectedTable)}/rows`, {
        method: "POST",
        body: payload,
      });
      setTableActionMessage("Row created.");
      await Promise.all([loadTableRows(selectedTable), loadTables(), loadDashboard(), loadUsers(), loadProjects()]);
    } catch (actionError) {
      setTableActionMessage(actionError.message || "Failed to create row.");
    }
  }

  async function handleTableUpdate() {
    if (!selectedTable || !tableRowId.trim()) {
      setTableActionMessage("Provide a row id before updating.");
      return;
    }

    setTableActionMessage("");
    try {
      const payload = parseTablePayload();
      await adminRequest(
        `/api/admin/tables/${encodeURIComponent(selectedTable)}/rows/${encodeURIComponent(
          tableRowId.trim()
        )}`,
        {
          method: "PATCH",
          body: payload,
        }
      );
      setTableActionMessage("Row updated.");
      await Promise.all([loadTableRows(selectedTable), loadTables(), loadDashboard(), loadUsers(), loadProjects()]);
    } catch (actionError) {
      setTableActionMessage(actionError.message || "Failed to update row.");
    }
  }

  async function handleTableDelete() {
    if (!selectedTable || !tableRowId.trim()) {
      setTableActionMessage("Provide a row id before deleting.");
      return;
    }

    const proceed = window.confirm(
      `Delete row ${tableRowId.trim()} from ${selectedTable}? This action cannot be undone.`
    );
    if (!proceed) return;

    setTableActionMessage("");

    try {
      await adminRequest(
        `/api/admin/tables/${encodeURIComponent(selectedTable)}/rows/${encodeURIComponent(
          tableRowId.trim()
        )}`,
        {
          method: "DELETE",
        }
      );
      setTableActionMessage("Row deleted.");
      await Promise.all([loadTableRows(selectedTable), loadTables(), loadDashboard(), loadUsers(), loadProjects()]);
    } catch (actionError) {
      setTableActionMessage(actionError.message || "Failed to delete row.");
    }
  }

  if (bootLoading) {
    return (
      <div className="min-h-screen bg-[var(--ds-bg-light)] flex items-center justify-center px-6">
        <p className="text-sm text-[var(--ds-text-secondary)]">Loading secure admin console...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--ds-bg-light)]">
      <header className="border-b border-[var(--ds-border)] bg-white sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-wide text-[var(--ds-text-muted)]">Restricted</p>
            <h1
              className="text-xl font-bold text-[var(--ds-text-primary)] flex items-center gap-2"
              style={{ fontFamily: "var(--ds-font-display)" }}
            >
              <Shield className="w-5 h-5 text-[var(--ds-accent)]" />
              Admin Control Center
            </h1>
            <p className="text-xs text-[var(--ds-text-muted)] mt-1">
              Signed in as {adminProfile?.full_name || adminProfile?.email || user?.email}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleRefreshAll}
              className="px-3 py-2 rounded-lg border border-[var(--ds-border)] text-sm font-medium text-[var(--ds-text-secondary)] hover:border-[var(--ds-accent)]/50 hover:text-[var(--ds-text-primary)] flex items-center gap-2"
            >
              <RefreshCcw className="w-4 h-4" />
              Refresh
            </button>
            <button
              type="button"
              onClick={handleSignOut}
              className="px-3 py-2 rounded-lg border border-red-200 text-sm font-medium text-red-600 hover:bg-red-50 flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Sign out
            </button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 pb-4 flex flex-wrap gap-2">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            const Icon = tab.icon;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition ${
                  isActive
                    ? "bg-[var(--ds-accent)] text-[var(--ds-text-on-dark)]"
                    : "bg-[var(--ds-bg-light)] text-[var(--ds-text-secondary)] hover:text-[var(--ds-text-primary)]"
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {error && (
          <div className="p-3 rounded-xl border text-sm bg-red-50 border-red-200 text-red-700">
            {error}
          </div>
        )}

        {activeTab === "overview" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                label="Total Users"
                value={dashboard?.stats?.total_users ?? 0}
                icon={Users}
              />
              <StatCard
                label="Total Projects"
                value={dashboard?.stats?.total_projects ?? 0}
                icon={FolderKanban}
              />
              <StatCard
                label="Total Messages"
                value={dashboard?.stats?.total_messages ?? 0}
                icon={Mail}
              />
              <StatCard
                label="Total Payments"
                value={dashboard?.stats?.total_payments ?? 0}
                icon={BarChart3}
              />
            </div>

            <Section
              title="Project Status Breakdown"
              subtitle="Global post/project state across the platform"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {Object.entries(dashboard?.project_status_breakdown || {}).map(([key, value]) => (
                  <div
                    key={key}
                    className="rounded-xl border border-[var(--ds-border)] p-4 bg-[var(--ds-bg-light)]"
                  >
                    <p className="text-xs uppercase tracking-wide text-[var(--ds-text-muted)] mb-1">
                      {key.replace(/_/g, " ")}
                    </p>
                    <p className="text-xl font-bold text-[var(--ds-text-primary)]">{value}</p>
                  </div>
                ))}
              </div>
              <p className="text-xs text-[var(--ds-text-muted)] mt-3">
                Last generated: {formatDate(dashboard?.generated_at)}
              </p>
            </Section>
          </div>
        )}

        {activeTab === "users" && (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 items-start">
            <Section
              title="Users"
              subtitle="Full entrepreneur records and account control"
              actions={
                <button
                  type="button"
                  onClick={loadUsers}
                  className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-[var(--ds-border)] text-[var(--ds-text-secondary)] hover:text-[var(--ds-text-primary)]"
                >
                  Reload
                </button>
              }
            >
              {usersLoading ? (
                <p className="text-sm text-[var(--ds-text-muted)]">Loading users...</p>
              ) : users.length === 0 ? (
                <p className="text-sm text-[var(--ds-text-muted)]">No users found.</p>
              ) : (
                <div className="space-y-2 max-h-[70vh] overflow-y-auto pr-1">
                  {users.map((entry) => {
                    const isActive = selectedUserId === entry.id;
                    return (
                      <button
                        key={entry.id}
                        type="button"
                        onClick={() => setSelectedUserId(entry.id)}
                        className={`w-full text-left rounded-xl border p-3 transition ${
                          isActive
                            ? "border-[var(--ds-accent)] bg-[var(--ds-accent)]/5"
                            : "border-[var(--ds-border)] hover:border-[var(--ds-accent)]/40"
                        }`}
                      >
                        <p className="text-sm font-semibold text-[var(--ds-text-primary)]">
                          {entry.company_name || `${entry.first_name || ""} ${entry.last_name || ""}`}
                        </p>
                        <p className="text-xs text-[var(--ds-text-muted)] mt-0.5">{entry.email}</p>
                        <p className="text-xs text-[var(--ds-text-muted)] mt-1">
                          {entry.project_summary?.total_projects || 0} projects · {entry.message_summary?.total_messages || 0} messages
                        </p>
                      </button>
                    );
                  })}
                </div>
              )}
            </Section>

            <div className="xl:col-span-2 space-y-4">
              <Section
                title="User Details"
                subtitle={selectedUser ? `ID: ${selectedUser.id}` : "Select a user from the list"}
                actions={
                  selectedUserId ? (
                    <button
                      type="button"
                      onClick={() => handleDeleteUser(selectedUserId)}
                      className="px-3 py-1.5 rounded-lg border border-red-200 text-red-600 text-xs font-semibold hover:bg-red-50 flex items-center gap-1.5"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Delete user
                    </button>
                  ) : null
                }
              >
                {userDetailsLoading ? (
                  <p className="text-sm text-[var(--ds-text-muted)]">Loading user details...</p>
                ) : !selectedUserDetails ? (
                  <p className="text-sm text-[var(--ds-text-muted)]">No user selected.</p>
                ) : (
                  <div className="space-y-4">
                    {userActionMessage && (
                      <div className="p-2.5 rounded-lg border border-[var(--ds-border)] text-sm text-[var(--ds-text-secondary)] bg-[var(--ds-bg-light)]">
                        {userActionMessage}
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                      <div className="rounded-xl border border-[var(--ds-border)] p-3">
                        <p className="text-xs uppercase tracking-wide text-[var(--ds-text-muted)] mb-1">Name</p>
                        <p className="text-[var(--ds-text-primary)]">
                          {selectedUserDetails?.user?.first_name || ""} {selectedUserDetails?.user?.last_name || ""}
                        </p>
                      </div>
                      <div className="rounded-xl border border-[var(--ds-border)] p-3">
                        <p className="text-xs uppercase tracking-wide text-[var(--ds-text-muted)] mb-1">Email</p>
                        <p className="text-[var(--ds-text-primary)] break-all">
                          {selectedUserDetails?.user?.email || selectedUserDetails?.auth_user?.email || "-"}
                        </p>
                      </div>
                      <div className="rounded-xl border border-[var(--ds-border)] p-3">
                        <p className="text-xs uppercase tracking-wide text-[var(--ds-text-muted)] mb-1">Company</p>
                        <p className="text-[var(--ds-text-primary)]">{selectedUserDetails?.user?.company_name || "-"}</p>
                      </div>
                      <div className="rounded-xl border border-[var(--ds-border)] p-3">
                        <p className="text-xs uppercase tracking-wide text-[var(--ds-text-muted)] mb-1">Location</p>
                        <p className="text-[var(--ds-text-primary)]">
                          {[selectedUserDetails?.user?.city, selectedUserDetails?.user?.country]
                            .filter(Boolean)
                            .join(", ") || "-"}
                        </p>
                      </div>
                      <div className="rounded-xl border border-[var(--ds-border)] p-3 md:col-span-2">
                        <p className="text-xs uppercase tracking-wide text-[var(--ds-text-muted)] mb-1">Joined</p>
                        <p className="text-[var(--ds-text-primary)]">
                          {formatDate(selectedUserDetails?.user?.created_at || selectedUserDetails?.auth_user?.created_at)}
                        </p>
                      </div>
                    </div>

                    <div className="rounded-xl border border-[var(--ds-border)] p-3">
                      <p className="text-sm font-semibold text-[var(--ds-text-primary)] mb-2">
                        Contact user
                      </p>
                      <textarea
                        rows={3}
                        className={textareaCls}
                        placeholder="Write a message that will appear in the user's dashboard chat."
                        value={contactMessage}
                        onChange={(event) => setContactMessage(event.target.value)}
                      />
                      <div className="mt-2 flex justify-end">
                        <button
                          type="button"
                          onClick={handleSendMessage}
                          disabled={contactSending || !contactMessage.trim()}
                          className="px-4 py-2 rounded-lg bg-[var(--ds-accent)] text-[var(--ds-text-on-dark)] text-sm font-semibold disabled:opacity-60"
                        >
                          {contactSending ? "Sending..." : "Send message"}
                        </button>
                      </div>
                    </div>

                    <div className="rounded-xl border border-[var(--ds-border)] p-3">
                      <p className="text-sm font-semibold text-[var(--ds-text-primary)] mb-2">
                        Project history ({selectedUserDetails?.projects?.length || 0})
                      </p>
                      <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                        {(selectedUserDetails?.projects || []).map((project) => (
                          <div
                            key={project.id}
                            className="rounded-lg border border-[var(--ds-border)] p-2.5 text-sm"
                          >
                            <p className="font-semibold text-[var(--ds-text-primary)]">{project.title}</p>
                            <p className="text-xs text-[var(--ds-text-muted)] mt-0.5">
                              {project.category} · {project.stage} · {project.amount_seeking}
                            </p>
                            <p className="text-xs text-[var(--ds-text-muted)] mt-0.5">
                              {project.status} · {formatDate(project.created_at)}
                            </p>
                          </div>
                        ))}
                        {(selectedUserDetails?.projects || []).length === 0 && (
                          <p className="text-xs text-[var(--ds-text-muted)]">No projects yet.</p>
                        )}
                      </div>
                    </div>

                    <div className="rounded-xl border border-[var(--ds-border)] p-3">
                      <p className="text-sm font-semibold text-[var(--ds-text-primary)] mb-2">
                        Payment history ({selectedUserDetails?.payments?.length || 0})
                      </p>
                      <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                        {(selectedUserDetails?.payments || []).map((payment) => (
                          <div
                            key={payment.id}
                            className="rounded-lg border border-[var(--ds-border)] p-2.5 text-sm"
                          >
                            <p className="font-semibold text-[var(--ds-text-primary)]">
                              {(payment.currency || "EUR").toUpperCase()} {payment.amount_cents ? (payment.amount_cents / 100).toFixed(2) : "-"}
                            </p>
                            <p className="text-xs text-[var(--ds-text-muted)] mt-0.5">
                              Status: {payment.status || "-"}
                            </p>
                            <p className="text-xs text-[var(--ds-text-muted)] mt-0.5">
                              Created: {formatDate(payment.created_at)}
                            </p>
                          </div>
                        ))}
                        {(selectedUserDetails?.payments || []).length === 0 && (
                          <p className="text-xs text-[var(--ds-text-muted)]">No payments yet.</p>
                        )}
                      </div>
                    </div>

                    <div className="rounded-xl border border-[var(--ds-border)] p-3">
                      <p className="text-sm font-semibold text-[var(--ds-text-primary)] mb-2">
                        Message thread ({selectedUserDetails?.messages?.length || 0})
                      </p>
                      <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                        {(selectedUserDetails?.messages || []).slice(0, 30).map((message) => (
                          <div
                            key={message.id}
                            className="rounded-lg border border-[var(--ds-border)] p-2.5 text-sm"
                          >
                            <p className="font-semibold text-[var(--ds-text-primary)]">
                              {message.sender_name || "Unknown"} ({message.sender})
                            </p>
                            <p className="text-xs text-[var(--ds-text-muted)] mt-0.5">
                              {formatDate(message.created_at)}
                            </p>
                            <p className="text-sm text-[var(--ds-text-secondary)] mt-1 whitespace-pre-wrap">
                              {message.text}
                            </p>
                          </div>
                        ))}
                        {(selectedUserDetails?.messages || []).length === 0 && (
                          <p className="text-xs text-[var(--ds-text-muted)]">No messages yet.</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </Section>
            </div>
          </div>
        )}

        {activeTab === "projects" && (
          <div className="space-y-4">
            <Section title="Add New Post / Project" subtitle="Create posts on behalf of users">
              <form onSubmit={handleCreateProject} className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold uppercase tracking-wide text-[var(--ds-text-muted)] mb-1">
                    Owner User
                  </label>
                  <select
                    className={inputCls}
                    value={projectForm.entrepreneur_id}
                    onChange={(event) => setProjectField("entrepreneur_id", event.target.value)}
                  >
                    <option value="">Select user</option>
                    {users.map((entry) => (
                      <option key={entry.id} value={entry.id}>
                        {entry.company_name || `${entry.first_name || ""} ${entry.last_name || ""}`} ({entry.email})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wide text-[var(--ds-text-muted)] mb-1">
                    Title
                  </label>
                  <input
                    className={inputCls}
                    value={projectForm.title}
                    onChange={(event) => setProjectField("title", event.target.value)}
                    placeholder="Project title"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wide text-[var(--ds-text-muted)] mb-1">
                    Category
                  </label>
                  <input
                    className={inputCls}
                    value={projectForm.category}
                    onChange={(event) => setProjectField("category", event.target.value)}
                    placeholder="fintech"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wide text-[var(--ds-text-muted)] mb-1">
                    Stage
                  </label>
                  <input
                    className={inputCls}
                    value={projectForm.stage}
                    onChange={(event) => setProjectField("stage", event.target.value)}
                    placeholder="seed"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wide text-[var(--ds-text-muted)] mb-1">
                    Amount Seeking
                  </label>
                  <input
                    className={inputCls}
                    value={projectForm.amount_seeking}
                    onChange={(event) => setProjectField("amount_seeking", event.target.value)}
                    placeholder="500,000"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wide text-[var(--ds-text-muted)] mb-1">
                    Country
                  </label>
                  <input
                    className={inputCls}
                    value={projectForm.country}
                    onChange={(event) => setProjectField("country", event.target.value)}
                    placeholder="Kenya"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wide text-[var(--ds-text-muted)] mb-1">
                    Status
                  </label>
                  <select
                    className={inputCls}
                    value={projectForm.status}
                    onChange={(event) => setProjectField("status", event.target.value)}
                  >
                    <option value="pending_verification">pending_verification</option>
                    <option value="under_review">under_review</option>
                    <option value="approved">approved</option>
                    <option value="failed_screening">failed_screening</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold uppercase tracking-wide text-[var(--ds-text-muted)] mb-1">
                    Summary
                  </label>
                  <textarea
                    rows={4}
                    className={textareaCls}
                    value={projectForm.summary}
                    onChange={(event) => setProjectField("summary", event.target.value)}
                    placeholder="Project summary"
                  />
                </div>

                <div className="md:col-span-2 flex justify-end">
                  <button
                    type="submit"
                    disabled={projectSubmitting}
                    className="px-4 py-2 rounded-lg bg-[var(--ds-accent)] text-[var(--ds-text-on-dark)] text-sm font-semibold disabled:opacity-60"
                  >
                    {projectSubmitting ? "Creating..." : "Create post"}
                  </button>
                </div>
              </form>

              {projectActionMessage && (
                <p className="mt-3 text-sm text-[var(--ds-text-secondary)]">{projectActionMessage}</p>
              )}
            </Section>

            <Section
              title="All Posts / Projects"
              subtitle="Update status, moderate, and remove posts"
              actions={
                <button
                  type="button"
                  onClick={loadProjects}
                  className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-[var(--ds-border)] text-[var(--ds-text-secondary)] hover:text-[var(--ds-text-primary)]"
                >
                  Reload
                </button>
              }
            >
              {projectsLoading ? (
                <p className="text-sm text-[var(--ds-text-muted)]">Loading projects...</p>
              ) : (
                <div className="space-y-2 max-h-[68vh] overflow-y-auto pr-1">
                  {projects.map((project) => (
                    <div
                      key={project.id}
                      className="rounded-xl border border-[var(--ds-border)] p-3 flex flex-col gap-2"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="text-sm font-semibold text-[var(--ds-text-primary)]">
                            {project.title}
                          </p>
                          <p className="text-xs text-[var(--ds-text-muted)]">
                            Owner: {project?.entrepreneurs?.company_name || project?.entrepreneurs?.email || project.entrepreneur_id}
                          </p>
                        </div>
                        <span className={statusCls}>{project.status}</span>
                      </div>

                      <p className="text-xs text-[var(--ds-text-muted)]">
                        {project.category} · {project.stage} · {project.amount_seeking} · {project.country}
                      </p>

                      <p className="text-sm text-[var(--ds-text-secondary)] line-clamp-2">{project.summary}</p>

                      <div className="flex flex-wrap items-center gap-2 pt-1">
                        <select
                          className="px-2.5 py-1.5 rounded-lg border border-[var(--ds-border)] text-xs"
                          value={project.status}
                          onChange={(event) =>
                            handleUpdateProjectStatus(project.id, event.target.value)
                          }
                        >
                          <option value="pending_verification">pending_verification</option>
                          <option value="under_review">under_review</option>
                          <option value="approved">approved</option>
                          <option value="failed_screening">failed_screening</option>
                        </select>

                        <button
                          type="button"
                          onClick={() => handleDeleteProject(project.id)}
                          className="px-2.5 py-1.5 rounded-lg border border-red-200 text-red-600 text-xs font-semibold hover:bg-red-50"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                  {projects.length === 0 && (
                    <p className="text-sm text-[var(--ds-text-muted)]">No projects found.</p>
                  )}
                </div>
              )}
            </Section>
          </div>
        )}

        {activeTab === "messages" && (
          <Section
            title="Platform Message Log"
            subtitle="Latest entrepreneur/admin communications"
            actions={
              <button
                type="button"
                onClick={loadMessages}
                className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-[var(--ds-border)] text-[var(--ds-text-secondary)] hover:text-[var(--ds-text-primary)]"
              >
                Reload
              </button>
            }
          >
            {messagesLoading ? (
              <p className="text-sm text-[var(--ds-text-muted)]">Loading messages...</p>
            ) : (
              <div className="space-y-2 max-h-[72vh] overflow-y-auto pr-1">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className="rounded-xl border border-[var(--ds-border)] p-3 bg-[var(--ds-bg-light)]"
                  >
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <p className="text-sm font-semibold text-[var(--ds-text-primary)]">
                        {message.sender_name || "Unknown"} ({message.sender})
                      </p>
                      <p className="text-xs text-[var(--ds-text-muted)]">{formatDate(message.created_at)}</p>
                    </div>
                    <p className="text-xs text-[var(--ds-text-muted)] mb-2">
                      {message?.entrepreneurs?.company_name || message?.entrepreneurs?.email || message.entrepreneur_id}
                    </p>
                    <p className="text-sm text-[var(--ds-text-secondary)] whitespace-pre-wrap">{message.text}</p>
                  </div>
                ))}
                {messages.length === 0 && (
                  <p className="text-sm text-[var(--ds-text-muted)]">No messages found.</p>
                )}
              </div>
            )}
          </Section>
        )}

        {activeTab === "database" && (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 items-start">
            <Section
              title="Tables"
              subtitle="Auto-discovered from public schema"
              actions={
                <button
                  type="button"
                  onClick={loadTables}
                  className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-[var(--ds-border)] text-[var(--ds-text-secondary)] hover:text-[var(--ds-text-primary)]"
                >
                  Reload
                </button>
              }
            >
              {tablesLoading ? (
                <p className="text-sm text-[var(--ds-text-muted)]">Loading tables...</p>
              ) : (
                <div className="space-y-2 max-h-[72vh] overflow-y-auto pr-1">
                  {tables.map((table) => {
                    const isActive = selectedTable === table.table_name;
                    return (
                      <button
                        key={table.table_name}
                        type="button"
                        onClick={() => setSelectedTable(table.table_name)}
                        className={`w-full text-left rounded-xl border p-3 transition ${
                          isActive
                            ? "border-[var(--ds-accent)] bg-[var(--ds-accent)]/5"
                            : "border-[var(--ds-border)] hover:border-[var(--ds-accent)]/40"
                        }`}
                      >
                        <p className="text-sm font-semibold text-[var(--ds-text-primary)]">
                          {table.table_name}
                        </p>
                        <p className="text-xs text-[var(--ds-text-muted)] mt-1">
                          {table.row_count} rows · {table.columns?.length || 0} columns
                        </p>
                      </button>
                    );
                  })}
                  {tables.length === 0 && (
                    <p className="text-sm text-[var(--ds-text-muted)]">No tables available.</p>
                  )}
                </div>
              )}
            </Section>

            <div className="xl:col-span-2 space-y-4">
              <Section
                title={selectedTable ? `Rows: ${selectedTable}` : "Rows"}
                subtitle="Read and inspect live table records"
                actions={
                  selectedTable ? (
                    <button
                      type="button"
                      onClick={() => loadTableRows(selectedTable)}
                      className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-[var(--ds-border)] text-[var(--ds-text-secondary)] hover:text-[var(--ds-text-primary)]"
                    >
                      Reload rows
                    </button>
                  ) : null
                }
              >
                {tableRowsLoading ? (
                  <p className="text-sm text-[var(--ds-text-muted)]">Loading rows...</p>
                ) : (
                  <div className="rounded-xl border border-[var(--ds-border)] overflow-hidden">
                    <pre className="text-xs leading-relaxed text-[var(--ds-text-secondary)] p-3 max-h-[38vh] overflow-auto bg-[var(--ds-bg-light)]">
                      {JSON.stringify(tableRows, null, 2)}
                    </pre>
                  </div>
                )}
              </Section>

              <Section
                title="Direct Row Operations"
                subtitle="Use JSON payloads for create/update/delete. This updates as new tables are added."
              >
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wide text-[var(--ds-text-muted)] mb-1">
                      Row ID (for update/delete)
                    </label>
                    <input
                      className={inputCls}
                      value={tableRowId}
                      onChange={(event) => setTableRowId(event.target.value)}
                      placeholder="id"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wide text-[var(--ds-text-muted)] mb-1">
                      JSON Payload
                    </label>
                    <textarea
                      rows={8}
                      className={`${textareaCls} font-mono text-xs`}
                      value={tablePayload}
                      onChange={(event) => setTablePayload(event.target.value)}
                    />
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={handleTableCreate}
                      className="px-3 py-2 rounded-lg bg-[var(--ds-accent)] text-[var(--ds-text-on-dark)] text-xs font-semibold"
                    >
                      Create Row
                    </button>
                    <button
                      type="button"
                      onClick={handleTableUpdate}
                      className="px-3 py-2 rounded-lg border border-[var(--ds-border)] text-xs font-semibold text-[var(--ds-text-secondary)]"
                    >
                      Update Row
                    </button>
                    <button
                      type="button"
                      onClick={handleTableDelete}
                      className="px-3 py-2 rounded-lg border border-red-200 text-red-600 text-xs font-semibold"
                    >
                      Delete Row
                    </button>
                  </div>

                  {tableActionMessage && (
                    <p className="text-sm text-[var(--ds-text-secondary)]">{tableActionMessage}</p>
                  )}
                </div>
              </Section>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
