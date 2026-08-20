import { NavLink, useNavigate } from "react-router-dom";
import { LayoutDashboard, Receipt, Wallet, BarChart3, Sparkles, LogOut, Landmark } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

const NAV_ITEMS = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/transactions", label: "Transactions", icon: Receipt },
  { to: "/budgets", label: "Budgets", icon: Wallet },
  { to: "/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/insights", label: "AI Insights", icon: Sparkles },
];

export default function Layout({ children }) {
  const { profile, logout } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const handleLogout = async () => {
    await logout();
    toast.info("Signed out. Come back soon.");
    navigate("/login", { replace: true });
  };

  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-canvas-200">
      {/* Sidebar — styled like a passbook spine */}
      <aside className="md:w-64 shrink-0 border-b md:border-b-0 md:border-r rule bg-canvas-50/60">
        <div className="px-6 pt-7 pb-6 border-b rule">
          <div className="flex items-center gap-2.5">
            <span className="flex items-center justify-center w-8 h-8 rounded-md bg-accent-500 text-canvas-50 shrink-0">
              <Landmark size={16} strokeWidth={2.25} />
            </span>
            <p className="font-display font-semibold text-2xl tracking-tight text-ink-800">Finly</p>
          </div>
          <p className="text-[11px] uppercase tracking-[0.2em] text-accent-600 mt-2">
            Category ledger &amp; budgets
          </p>
        </div>

        <nav className="px-3 py-4 flex md:flex-col gap-1 overflow-x-auto md:overflow-visible">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-sm text-sm font-body whitespace-nowrap transition-colors ${
                  isActive
                    ? "bg-accent-500/10 text-accent-600 border-l-2 border-accent-500"
                    : "text-ink-700/70 hover:text-ink-800 hover:bg-canvas-100 border-l-2 border-transparent"
                }`
              }
            >
              <item.icon size={17} strokeWidth={2} className="shrink-0" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden md:block mt-auto px-6 py-5 border-t rule">
          <p className="text-xs text-ink-700/45 leading-relaxed">
            Every entry here is dated, ruled, and stamped — the way a passbook
            keeps its owner honest.
          </p>
        </div>
      </aside>

      {/* Main column */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="flex items-center justify-between gap-4 px-6 md:px-10 py-5 border-b rule">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-ink-700/45">{today}</p>
            <p className="font-display text-xl text-ink-700 mt-0.5">
              {profile ? `Welcome back, ${profile.name.split(" ")[0]}` : "Welcome back"}
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-xs uppercase tracking-[0.15em] border rule px-4 py-2.5 rounded-sm text-ink-700/70 hover:text-wax-600 hover:border-wax-500/60 transition-colors font-body"
          >
            <LogOut size={14} strokeWidth={2} />
            Sign out
          </button>
        </header>

        <main className="flex-1 px-6 md:px-10 py-8">{children}</main>
      </div>
    </div>
  );
}
