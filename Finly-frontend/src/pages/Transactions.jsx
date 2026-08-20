import { Plus, Pencil, Trash2, Receipt } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import {
  getTransactionsByUser,
  createTransaction,
  updateTransaction,
  deleteTransaction,
} from "../api/transactions";
import Panel from "../components/Panel";
import Amount from "../components/Amount";
import Loader from "../components/Loader";
import EmptyState from "../components/EmptyState";
import TransactionForm from "../components/TransactionForm";
import { ALL_CATEGORIES, CATEGORY_LABEL } from "../utils/categories";
import { formatDate } from "../utils/format";
import { extractErrorMessage } from "../utils/apiError";

export default function Transactions() {
  const { userId } = useAuth();
  const toast = useToast();

  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [typeFilter, setTypeFilter] = useState("ALL");
  const [categoryFilter, setCategoryFilter] = useState("ALL");

  const load = async () => {
    setLoading(true);
    try {
      const data = await getTransactionsByUser(userId);
      setTransactions([...data].sort((a, b) => new Date(b.date) - new Date(a.date)));
    } catch (err) {
      toast.error(extractErrorMessage(err, "Couldn't load transactions."));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const filtered = useMemo(
    () =>
      transactions.filter(
        (t) =>
          (typeFilter === "ALL" || t.type === typeFilter) &&
          (categoryFilter === "ALL" || t.category === categoryFilter)
      ),
    [transactions, typeFilter, categoryFilter]
  );

  const openCreate = () => {
    setEditing(null);
    setFormOpen(true);
  };

  const openEdit = (tx) => {
    setEditing(tx);
    setFormOpen(true);
  };

  const closeForm = () => {
    setFormOpen(false);
    setEditing(null);
  };

  const submit = async (payload) => {
    setSubmitting(true);
    try {
      if (editing) {
        await updateTransaction(editing.id, { ...payload, userId });
        toast.success("Entry updated.");
      } else {
        await createTransaction({ ...payload, userId });
        toast.success("Entry added to the ledger.");
      }
      closeForm();
      load();
    } catch (err) {
      toast.error(extractErrorMessage(err, "Couldn't save that entry."));
    } finally {
      setSubmitting(false);
    }
  };

  const remove = async (tx) => {
    if (!window.confirm(`Delete "${tx.title}"? This can't be undone.`)) return;
    try {
      await deleteTransaction(tx.id);
      toast.success("Entry deleted.");
      setTransactions((prev) => prev.filter((t) => t.id !== tx.id));
    } catch (err) {
      toast.error(extractErrorMessage(err, "Couldn't delete that entry."));
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[11px] uppercase tracking-[0.2em] text-accent-600">Full history</p>
          <h1 className="font-display text-2xl text-ink-700 mt-1">Transactions</h1>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-1.5 font-display text-sm uppercase tracking-wide bg-accent-500 hover:bg-accent-600 text-canvas-50 rounded-sm px-5 py-2.5 transition-colors"
        >
          <Plus size={15} strokeWidth={2.5} />
          Add entry
        </button>
      </div>

      {formOpen && (
        <Panel eyebrow={editing ? "Editing entry" : "New entry"} title={editing ? editing.title : "Add a transaction"}>
          <TransactionForm
            initial={editing}
            submitting={submitting}
            onSubmit={submit}
            onCancel={closeForm}
          />
        </Panel>
      )}

      <div className="flex flex-wrap gap-4">
        <label className="flex items-center gap-2 text-xs uppercase tracking-[0.15em] text-ink-700/55">
          Type
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="slip-input slip-select normal-case tracking-normal text-sm py-1"
          >
            <option value="ALL">All</option>
            <option value="INCOME">Income</option>
            <option value="EXPENSE">Expense</option>
          </select>
        </label>

        <label className="flex items-center gap-2 text-xs uppercase tracking-[0.15em] text-ink-700/55">
          Category
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="slip-input slip-select normal-case tracking-normal text-sm py-1"
          >
            <option value="ALL">All</option>
            {ALL_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {CATEGORY_LABEL[c]}
              </option>
            ))}
          </select>
        </label>
      </div>

      <Panel>
        {loading ? (
          <Loader />
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={Receipt}
            title="No entries match"
            hint={
              transactions.length === 0
                ? "Nothing recorded yet — add your first transaction above."
                : "Try a different filter."
            }
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[11px] uppercase tracking-[0.12em] text-ink-700/45 border-b rule-strong">
                  <th className="py-2.5 pr-4 font-normal">Date</th>
                  <th className="py-2.5 pr-4 font-normal">Title</th>
                  <th className="py-2.5 pr-4 font-normal">Category</th>
                  <th className="py-2.5 pr-4 font-normal text-right">Amount</th>
                  <th className="py-2.5 pl-4 font-normal text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((t) => (
                  <tr key={t.id} className="border-b rule last:border-0 hover:bg-canvas-100/40">
                    <td className="py-3 pr-4 text-ink-700/70 font-mono whitespace-nowrap">
                      {formatDate(t.date)}
                    </td>
                    <td className="py-3 pr-4 text-ink-700 max-w-[16rem] truncate">
                      {t.title}
                      {t.note && <span className="block text-xs text-ink-700/40">{t.note}</span>}
                    </td>
                    <td className="py-3 pr-4 text-ink-700/70 whitespace-nowrap">
                      {CATEGORY_LABEL[t.category] || t.category}
                    </td>
                    <td className="py-3 pr-4 text-right whitespace-nowrap">
                      <Amount value={t.amount} sign={t.type === "INCOME" ? "positive" : "negative"} />
                    </td>
                    <td className="py-3 pl-4 text-right whitespace-nowrap">
                      <button
                        onClick={() => openEdit(t)}
                        className="inline-flex items-center gap-1 text-xs uppercase tracking-[0.1em] text-accent-600 hover:text-accent-700 mr-4"
                      >
                        <Pencil size={13} strokeWidth={2} />
                        Edit
                      </button>
                      <button
                        onClick={() => remove(t)}
                        className="inline-flex items-center gap-1 text-xs uppercase tracking-[0.1em] text-wax-500 hover:text-wax-600"
                      >
                        <Trash2 size={13} strokeWidth={2} />
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Panel>
    </div>
  );
}
