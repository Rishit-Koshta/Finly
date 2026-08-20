import { Plus, Pencil, Trash2, Wallet, Check } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { getBudgets, saveBudget, deleteBudget } from "../api/budgets";
import { getCategoryExpense } from "../api/analytics";
import Panel from "../components/Panel";
import Amount from "../components/Amount";
import Seal from "../components/Seal";
import ProgressRule from "../components/ProgressRule";
import Loader from "../components/Loader";
import EmptyState from "../components/EmptyState";
import { BUDGETABLE_CATEGORIES, CATEGORY_LABEL, CATEGORY_ICON } from "../utils/categories";
import { monthLabel } from "../utils/format";
import { budgetStatus } from "../utils/budgetStatus";
import { extractErrorMessage } from "../utils/apiError";

export default function Budgets() {
  const { userId } = useAuth();
  const toast = useToast();
  const now = useMemo(() => new Date(), []);
  const year = now.getFullYear();
  const month = now.getMonth() + 1;

  const [budgets, setBudgets] = useState([]);
  const [spendByCategory, setSpendByCategory] = useState({});
  const [loading, setLoading] = useState(true);

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [category, setCategory] = useState(BUDGETABLE_CATEGORIES[0]);
  const [limit, setLimit] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const [budgetsRes, spendRes] = await Promise.all([
        getBudgets(userId),
        getCategoryExpense(userId, year, month),
      ]);
      setBudgets(budgetsRes);
      const map = {};
      spendRes.forEach((c) => (map[c.category] = Number(c.amount) || 0));
      setSpendByCategory(map);
    } catch (err) {
      toast.error(extractErrorMessage(err, "Couldn't load budgets."));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const budgetedCategories = useMemo(() => new Set(budgets.map((b) => b.category)), [budgets]);
  const availableForNew = BUDGETABLE_CATEGORIES.filter((c) => !budgetedCategories.has(c));

  const openCreate = () => {
    setEditing(null);
    setCategory(availableForNew[0] || BUDGETABLE_CATEGORIES[0]);
    setLimit("");
    setFormOpen(true);
  };

  const openEdit = (budget) => {
    setEditing(budget);
    setCategory(budget.category);
    setLimit(String(budget.monthlyLimit));
    setFormOpen(true);
  };

  const closeForm = () => {
    setFormOpen(false);
    setEditing(null);
  };

  const submit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await saveBudget({ userId, category, monthlyLimit: Number(limit) });
      toast.success(editing ? "Budget updated." : "Budget set for this category.");
      closeForm();
      load();
    } catch (err) {
      toast.error(extractErrorMessage(err, "Couldn't save that budget."));
    } finally {
      setSubmitting(false);
    }
  };

  const remove = async (budget) => {
    if (!window.confirm(`Remove the ${CATEGORY_LABEL[budget.category]} budget?`)) return;
    try {
      await deleteBudget(userId, budget.category);
      toast.success("Budget removed.");
      setBudgets((prev) => prev.filter((b) => b.id !== budget.id));
    } catch (err) {
      toast.error(extractErrorMessage(err, "Couldn't remove that budget."));
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[11px] uppercase tracking-[0.2em] text-accent-600">{monthLabel(year, month)}</p>
          <h1 className="font-display text-2xl text-ink-700 mt-1">Category budgets</h1>
          <p className="text-sm text-ink-700/55 mt-1 max-w-lg">
            Set a monthly limit per category. Cross it, and Finly emails you an
            overspending alert for that category — not the whole account.
          </p>
        </div>
        {availableForNew.length > 0 && (
          <button
            onClick={openCreate}
            className="flex items-center gap-1.5 font-display text-sm uppercase tracking-wide bg-accent-500 hover:bg-accent-600 text-canvas-50 rounded-sm px-5 py-2.5 transition-colors shrink-0"
          >
            <Plus size={15} strokeWidth={2.5} />
            Set a budget
          </button>
        )}
      </div>

      {formOpen && (
        <Panel eyebrow={editing ? "Editing budget" : "New budget"} title={editing ? CATEGORY_LABEL[editing.category] : "Set a category budget"}>
          <form onSubmit={submit} className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
            <label className="flex flex-col gap-1.5">
              <span className="text-xs uppercase tracking-[0.15em] text-ink-700/55">Category</span>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                disabled={Boolean(editing)}
                className="slip-input slip-select disabled:opacity-60"
              >
                {(editing ? [editing.category] : availableForNew).map((c) => (
                  <option key={c} value={c}>
                    {CATEGORY_LABEL[c]}
                  </option>
                ))}
              </select>
            </label>

            <label className="flex flex-col gap-1.5">
              <span className="text-xs uppercase tracking-[0.15em] text-ink-700/55">
                Monthly limit (₹)
              </span>
              <input
                required
                type="number"
                min="1"
                step="0.01"
                value={limit}
                onChange={(e) => setLimit(e.target.value)}
                placeholder="e.g. 6000"
                className="slip-input font-mono"
              />
            </label>

            <div className="sm:col-span-2 flex items-center gap-3 mt-2">
              <button
                type="submit"
                disabled={submitting}
                className="flex items-center gap-1.5 font-display text-sm uppercase tracking-wide bg-accent-500 hover:bg-accent-600 disabled:opacity-60 text-canvas-50 rounded-sm px-6 py-2.5 transition-colors"
              >
                <Check size={15} strokeWidth={2.5} />
                {submitting ? "Saving…" : "Save budget"}
              </button>
              <button
                type="button"
                onClick={closeForm}
                className="text-sm text-ink-700/60 hover:text-ink-800 px-2"
              >
                Cancel
              </button>
            </div>
          </form>
        </Panel>
      )}

      {loading ? (
        <Loader />
      ) : budgets.length === 0 ? (
        <EmptyState
          icon={Wallet}
          title="No category budgets yet"
          hint="Pick a category and a monthly limit — Finly tracks spend against it automatically."
          action={
            !formOpen && (
              <button
                onClick={openCreate}
                className="inline-flex items-center gap-1.5 font-display text-sm uppercase tracking-wide bg-accent-500 hover:bg-accent-600 text-canvas-50 rounded-sm px-5 py-2.5"
              >
                <Plus size={15} strokeWidth={2.5} />
                Set your first budget
              </button>
            )
          }
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {budgets.map((b) => {
            const spent = spendByCategory[b.category] || 0;
            const status = budgetStatus(spent, b.monthlyLimit);
            const percent = b.monthlyLimit ? (spent / b.monthlyLimit) * 100 : 0;
            const Icon = CATEGORY_ICON[b.category];
            return (
              <Panel key={b.id} className="relative">
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div>
                    <span className="flex items-center justify-center w-9 h-9 rounded-md bg-accent-100 text-accent-600">
                      {Icon && <Icon size={17} strokeWidth={2} />}
                    </span>
                    <p className="font-display text-lg text-ink-700 mt-2">
                      {CATEGORY_LABEL[b.category] || b.category}
                    </p>
                  </div>
                  <Seal status={status} />
                </div>

                <ProgressRule percent={percent} status={status} />

                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs font-mono text-ink-700/55">{percent.toFixed(0)}% used</span>
                  <span className="text-xs font-mono">
                    <Amount value={spent} className="text-xs" /> / <Amount value={b.monthlyLimit} className="text-xs" />
                  </span>
                </div>

                <div className="flex items-center gap-4 mt-5 pt-4 border-t rule">
                  <button
                    onClick={() => openEdit(b)}
                    className="flex items-center gap-1.5 text-xs uppercase tracking-[0.1em] text-accent-600 hover:text-accent-700"
                  >
                    <Pencil size={13} strokeWidth={2} />
                    Edit limit
                  </button>
                  <button
                    onClick={() => remove(b)}
                    className="flex items-center gap-1.5 text-xs uppercase tracking-[0.1em] text-wax-500 hover:text-wax-600"
                  >
                    <Trash2 size={13} strokeWidth={2} />
                    Remove
                  </button>
                </div>
              </Panel>
            );
          })}
        </div>
      )}
    </div>
  );
}
