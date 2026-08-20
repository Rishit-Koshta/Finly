import { Plus, Wallet, Receipt, ArrowRight } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getMonthlySummary, getCategoryExpense } from "../api/analytics";
import { getBudgets } from "../api/budgets";
import { getTransactionsByUser } from "../api/transactions";
import Panel from "../components/Panel";
import Amount from "../components/Amount";
import Seal from "../components/Seal";
import ProgressRule from "../components/ProgressRule";
import Loader from "../components/Loader";
import EmptyState from "../components/EmptyState";
import { CATEGORY_LABEL, CATEGORY_ICON } from "../utils/categories";
import { formatDate, monthLabel } from "../utils/format";
import { budgetStatus } from "../utils/budgetStatus";

export default function Dashboard() {
  const { userId } = useAuth();
  const now = useMemo(() => new Date(), []);
  const year = now.getFullYear();
  const month = now.getMonth() + 1;

  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState(null);
  const [budgets, setBudgets] = useState([]);
  const [categorySpend, setCategorySpend] = useState([]);
  const [recent, setRecent] = useState([]);

  useEffect(() => {
    if (!userId) return;
    let alive = true;

    (async () => {
      setLoading(true);
      try {
        const [summaryRes, budgetsRes, categoryRes, txRes] = await Promise.all([
          getMonthlySummary(userId, year, month),
          getBudgets(userId),
          getCategoryExpense(userId, year, month),
          getTransactionsByUser(userId),
        ]);
        if (!alive) return;
        setSummary(summaryRes);
        setBudgets(budgetsRes);
        setCategorySpend(categoryRes);
        setRecent(
          [...txRes]
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, 6)
        );
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [userId, year, month]);

  const spendByCategory = useMemo(() => {
    const map = {};
    categorySpend.forEach((c) => {
      map[c.category] = Number(c.amount) || 0;
    });
    return map;
  }, [categorySpend]);

  if (loading) return <Loader label="Balancing this month's ledger…" />;

  const income = Number(summary?.income) || 0;
  const expense = Number(summary?.expense) || 0;
  const balance = Number(summary?.balance) || 0;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-[11px] uppercase tracking-[0.2em] text-accent-600">
          {monthLabel(year, month)}
        </p>
        <h1 className="font-display text-2xl text-ink-700 mt-1">This month's ledger</h1>
      </div>

      {/* Ledger strip: income / expense / balance */}
      <div className="grid grid-cols-1 sm:grid-cols-3 border rule rounded-md overflow-hidden bg-canvas-50 shadow-[0_2px_10px_rgba(74,74,74,0.05)]">
        <div className="px-6 py-5 border-b sm:border-b-0 sm:border-r rule">
          <p className="text-[11px] uppercase tracking-[0.15em] text-ink-700/50">Income</p>
          <Amount value={income} sign="positive" className="text-2xl block mt-1.5" />
        </div>
        <div className="px-6 py-5 border-b sm:border-b-0 sm:border-r rule">
          <p className="text-[11px] uppercase tracking-[0.15em] text-ink-700/50">Expense</p>
          <Amount value={expense} sign="negative" className="text-2xl block mt-1.5" />
        </div>
        <div className="px-6 py-5">
          <p className="text-[11px] uppercase tracking-[0.15em] text-ink-700/50">Balance</p>
          <Amount
            value={balance}
            sign={balance >= 0 ? "positive" : "negative"}
            className="text-2xl block mt-1.5"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Category budgets with seals */}
        <Panel
          eyebrow="Category budgets"
          title="Where the limits stand"
          action={
            <Link
              to="/budgets"
              className="flex items-center gap-1 text-xs uppercase tracking-[0.15em] text-accent-600 hover:text-accent-700"
            >
              Manage <ArrowRight size={13} strokeWidth={2.5} />
            </Link>
          }
          className="lg:col-span-3"
        >
          {budgets.length === 0 ? (
            <EmptyState
              icon={Wallet}
              title="No category budgets set"
              hint="Set a monthly limit per category so overspending gets flagged automatically — and emailed to you."
              action={
                <Link
                  to="/budgets"
                  className="inline-flex items-center gap-1.5 font-display text-sm uppercase tracking-wide bg-accent-500 hover:bg-accent-600 text-canvas-50 rounded-sm px-5 py-2.5"
                >
                  <Plus size={15} strokeWidth={2.5} />
                  Set a budget
                </Link>
              }
            />
          ) : (
            <ul className="flex flex-col gap-5">
              {budgets.map((b) => {
                const spent = spendByCategory[b.category] || 0;
                const status = budgetStatus(spent, b.monthlyLimit);
                const percent = b.monthlyLimit ? (spent / b.monthlyLimit) * 100 : 0;
                return (
                  <li key={b.id}>
                    <div className="flex items-center justify-between gap-3 mb-1.5">
                      <span className="font-body text-sm text-ink-700 flex items-center gap-2">
                        {(() => {
                          const Icon = CATEGORY_ICON[b.category];
                          return Icon ? <Icon size={15} strokeWidth={2} className="text-accent-500" /> : null;
                        })()}
                        {CATEGORY_LABEL[b.category] || b.category}
                      </span>
                      <Seal status={status} />
                    </div>
                    <ProgressRule percent={percent} status={status} />
                    <div className="flex items-center justify-between mt-1.5">
                      <span className="text-xs font-mono text-ink-700/60">
                        {percent.toFixed(0)}% used
                      </span>
                      <span className="text-xs font-mono text-ink-700/70">
                        <Amount value={spent} className="text-xs" /> / <Amount value={b.monthlyLimit} className="text-xs" />
                      </span>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </Panel>

        {/* Recent transactions */}
        <Panel
          eyebrow="Latest entries"
          title="Recent transactions"
          action={
            <Link
              to="/transactions"
              className="flex items-center gap-1 text-xs uppercase tracking-[0.15em] text-accent-600 hover:text-accent-700"
            >
              View all <ArrowRight size={13} strokeWidth={2.5} />
            </Link>
          }
          className="lg:col-span-2"
        >
          {recent.length === 0 ? (
            <EmptyState
              icon={Receipt}
              title="No entries yet"
              hint="Add your first transaction to start building this month's ledger."
              action={
                <Link
                  to="/transactions"
                  className="inline-flex items-center gap-1.5 font-display text-sm uppercase tracking-wide bg-accent-500 hover:bg-accent-600 text-canvas-50 rounded-sm px-5 py-2.5"
                >
                  <Plus size={15} strokeWidth={2.5} />
                  Add a transaction
                </Link>
              }
            />
          ) : (
            <ul className="flex flex-col divide-y divide-line-200">
              {recent.map((t) => (
                <li key={t.id} className="py-3 first:pt-0 last:pb-0 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm text-ink-700 truncate">{t.title}</p>
                    <p className="text-xs text-ink-700/45 mt-0.5">
                      {CATEGORY_LABEL[t.category] || t.category} · {formatDate(t.date)}
                    </p>
                  </div>
                  <Amount
                    value={t.amount}
                    sign={t.type === "INCOME" ? "positive" : "negative"}
                    className="shrink-0 text-sm"
                  />
                </li>
              ))}
            </ul>
          )}
        </Panel>
      </div>
    </div>
  );
}
