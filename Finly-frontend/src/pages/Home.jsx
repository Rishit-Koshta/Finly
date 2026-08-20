import { Link } from "react-router-dom";
import {
  Landmark,
  Wallet,
  Mail,
  BarChart3,
  Sparkles,
  Receipt,
  ShieldCheck,
  ArrowRight,
  UtensilsCrossed,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import Seal from "../components/Seal";
import ProgressRule from "../components/ProgressRule";
import Amount from "../components/Amount";

const FEATURES = [
  {
    icon: Wallet,
    title: "Category-wise budgets",
    body: "Set a monthly limit for each spending category instead of one lump number — Food, Rent, Shopping, Travel, all tracked on their own.",
  },
  {
    icon: Mail,
    title: "Overspend alerts by email",
    body: "Cross a category's limit and Finly emails you the moment it happens — naming the exact category, not just a vague balance warning.",
  },
  {
    icon: Receipt,
    title: "Full transaction ledger",
    body: "Log income and expenses with notes and dates, then filter, edit, or delete any entry from a clean running history.",
  },
  {
    icon: BarChart3,
    title: "Real analytics",
    body: "Monthly summaries, category breakdowns, and daily spending trends — charted, not buried in a spreadsheet.",
  },
  {
    icon: Sparkles,
    title: "AI financial insights",
    body: "Ask plain-language questions about your spending, check category trends, or get a projection for the month ahead.",
  },
  {
    icon: ShieldCheck,
    title: "Secure by default",
    body: "JWT-based auth with automatic token refresh keeps your session alive safely without repeated logins.",
  },
];

export default function Home() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-canvas-200">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-canvas-200/90 backdrop-blur-sm border-b rule">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="flex items-center justify-center w-8 h-8 rounded-md bg-accent-500 text-canvas-50 shrink-0">
              <Landmark size={16} strokeWidth={2.25} />
            </span>
            <span className="font-display font-semibold text-xl tracking-tight text-ink-800">Finly</span>
          </div>

          {isAuthenticated ? (
            <Link
              to="/dashboard"
              className="flex items-center gap-1.5 font-display text-sm uppercase tracking-wide bg-accent-500 hover:bg-accent-600 text-canvas-50 rounded-sm px-5 py-2.5 transition-colors"
            >
              Dashboard <ArrowRight size={15} strokeWidth={2.5} />
            </Link>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="text-sm font-body text-ink-700/70 hover:text-ink-800 px-3 py-2"
              >
                Sign in
              </Link>
              <Link
                to="/register"
                className="font-display text-sm uppercase tracking-wide bg-accent-500 hover:bg-accent-600 text-canvas-50 rounded-sm px-5 py-2.5 transition-colors"
              >
                Get started
              </Link>
            </div>
          )}
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 pt-16 pb-20 grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
        <div>
          <p className="text-[11px] uppercase tracking-[0.25em] text-accent-600 mb-4">
            Category budgeting, done properly
          </p>
          <h1 className="font-display font-semibold text-4xl sm:text-5xl leading-[1.1] text-ink-900">
            Know exactly where every rupee is going —{" "}
            <span className="text-accent-500">before it's gone.</span>
          </h1>
          <p className="text-base text-ink-700/70 mt-6 max-w-lg leading-relaxed">
            Finly tracks income and expenses by category, flags the moment any one of
            them goes over budget, and emails you about it — so you find out from your
            inbox, not your bank statement.
          </p>
          <div className="flex flex-wrap items-center gap-4 mt-8">
            <Link
              to={isAuthenticated ? "/dashboard" : "/register"}
              className="flex items-center gap-2 font-display text-sm uppercase tracking-wide bg-accent-500 hover:bg-accent-600 text-canvas-50 rounded-sm px-6 py-3.5 transition-colors"
            >
              {isAuthenticated ? "Go to dashboard" : "Start tracking, free"}
              <ArrowRight size={16} strokeWidth={2.5} />
            </Link>
            {!isAuthenticated && (
              <Link
                to="/login"
                className="text-sm font-body text-ink-700/70 hover:text-ink-800 underline underline-offset-4"
              >
                Already have an account?
              </Link>
            )}
          </div>
        </div>

        {/* Live-styled preview card */}
        <div className="relative">
          <div className="bg-canvas-50 border rule rounded-md shadow-[0_20px_45px_rgba(74,74,74,0.10)] p-6 max-w-sm ml-auto">
            <p className="text-[10px] uppercase tracking-[0.2em] text-accent-600 mb-4">
              This month · Food budget
            </p>
            <div className="flex items-center justify-between mb-3">
              <span className="flex items-center gap-2 text-sm text-ink-700">
                <UtensilsCrossed size={15} strokeWidth={2} className="text-accent-500" />
                Food
              </span>
              <Seal status="warn" />
            </div>
            <ProgressRule percent={88} status="warn" />
            <div className="flex items-center justify-between mt-2">
              <span className="text-xs font-mono text-ink-700/55">88% used</span>
              <span className="text-xs font-mono">
                <Amount value={5280} className="text-xs" /> / <Amount value={6000} className="text-xs" />
              </span>
            </div>

            <div className="mt-6 pt-5 border-t rule flex items-center gap-3 text-xs text-ink-700/60">
              <Mail size={14} strokeWidth={2} className="text-accent-500 shrink-0" />
              You'll get an email the moment this crosses ₹6,000.
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-6 pb-20">
        <div className="text-center mb-12">
          <p className="text-[11px] uppercase tracking-[0.25em] text-accent-600 mb-3">What it does</p>
          <h2 className="font-display font-semibold text-3xl text-ink-900">
            Everything a personal ledger should have
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="bg-canvas-50 border rule rounded-md p-6 shadow-[0_2px_10px_rgba(74,74,74,0.05)]"
            >
              <span className="flex items-center justify-center w-10 h-10 rounded-md bg-accent-100 text-accent-600 mb-4">
                <f.icon size={19} strokeWidth={2} />
              </span>
              <h3 className="font-display font-semibold text-base text-ink-800 mb-1.5">{f.title}</h3>
              <p className="text-sm text-ink-700/60 leading-relaxed">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA band */}
      <section className="border-y rule bg-canvas-50">
        <div className="max-w-6xl mx-auto px-6 py-14 text-center">
          <h2 className="font-display font-semibold text-2xl sm:text-3xl text-ink-900">
            Set your first category budget in under a minute.
          </h2>
          <p className="text-sm text-ink-700/60 mt-3 max-w-md mx-auto">
            No spreadsheets, no manual math — just entries, limits, and an alert when
            something needs your attention.
          </p>
          <Link
            to={isAuthenticated ? "/dashboard" : "/register"}
            className="inline-flex items-center gap-2 mt-7 font-display text-sm uppercase tracking-wide bg-accent-500 hover:bg-accent-600 text-canvas-50 rounded-sm px-7 py-3.5 transition-colors"
          >
            {isAuthenticated ? "Go to dashboard" : "Create your account"}
            <ArrowRight size={16} strokeWidth={2.5} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="max-w-6xl mx-auto px-6 py-10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="flex items-center justify-center w-6 h-6 rounded bg-accent-500 text-canvas-50">
            <Landmark size={12} strokeWidth={2.25} />
          </span>
          <span className="font-display font-semibold text-sm text-ink-800">Finly</span>
        </div>
        <p className="text-xs text-ink-700/45">Every entry dated, ruled, and stamped.</p>
      </footer>
    </div>
  );
}
