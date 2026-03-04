import {
  LayoutDashboard,
  User,
  FolderPlus,
  Newspaper,
  MessageSquare,
  LogOut,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const NAV = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, href: "/entrepreneur/dashboard" },
  { id: "profile", label: "My Profile", icon: User, href: "/entrepreneur/profile" },
  { id: "submit", label: "Submit Project", icon: FolderPlus, href: "/entrepreneur/submit" },
  { id: "feed", label: "Project Feed", icon: Newspaper, href: "/feed" },
  { id: "messages", label: "Messages", icon: MessageSquare, href: "/entrepreneur/dashboard#chat" },
];

export function EntrepreneurSidebar({ active }) {
  const navigate = useNavigate();

  return (
    <aside className="hidden lg:flex flex-col w-60 min-h-screen bg-[var(--ds-bg-dark)] text-[var(--ds-text-on-dark)] pt-6 pb-10 px-4 shrink-0">
      <div
        className="mb-8 px-2 text-xl tracking-tight"
        style={{ fontFamily: "var(--ds-font-display)", fontStyle: "italic" }}
      >
        <span className="font-bold">Connect</span>
        <span className="font-bold text-[var(--ds-accent)]">Africa</span>
      </div>

      <nav className="flex flex-col gap-1 flex-1">
        {NAV.map((item) => {
          const isActive = active === item.id;
          return (
            <a
              key={item.id}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition ${
                isActive
                  ? "bg-[var(--ds-accent)]/20 text-[var(--ds-accent)]"
                  : "text-[var(--ds-text-on-dark)]/60 hover:bg-white/5 hover:text-[var(--ds-text-on-dark)]"
              }`}
            >
              <item.icon className="w-4 h-4 shrink-0" />
              {item.label}
            </a>
          );
        })}
      </nav>

      <button
        type="button"
        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-[var(--ds-text-on-dark)]/50 hover:text-red-400 hover:bg-white/5 transition"
        onClick={() => navigate("/")}
      >
        <LogOut className="w-4 h-4 shrink-0" />
        Sign out
      </button>
    </aside>
  );
}
