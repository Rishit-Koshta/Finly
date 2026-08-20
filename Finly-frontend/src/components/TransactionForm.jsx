import { Check } from "lucide-react";
import { useState, useEffect } from "react";
import { ALL_CATEGORIES, CATEGORY_LABEL } from "../utils/categories";
import { todayISODate } from "../utils/format";

const emptyForm = {
  title: "",
  amount: "",
  type: "EXPENSE",
  category: "FOOD",
  date: todayISODate(),
  note: "",
};

export default function TransactionForm({ initial, onSubmit, onCancel, submitting }) {
  const [form, setForm] = useState(initial ? mapToForm(initial) : emptyForm);

  useEffect(() => {
    setForm(initial ? mapToForm(initial) : emptyForm);
  }, [initial]);

  function mapToForm(tx) {
    return {
      title: tx.title,
      amount: String(tx.amount),
      type: tx.type,
      category: tx.category,
      date: tx.date,
      note: tx.note || "",
    };
  }

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const submit = (e) => {
    e.preventDefault();
    onSubmit({
      ...form,
      amount: Number(form.amount),
    });
  };

  return (
    <form onSubmit={submit} className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
      <label className="flex flex-col gap-1.5 sm:col-span-2">
        <span className="text-xs uppercase tracking-[0.15em] text-ink-700/55">Title</span>
        <input
          required
          name="title"
          value={form.title}
          onChange={onChange}
          placeholder="Groceries, freelance payment, rent…"
          className="slip-input"
        />
      </label>

      <label className="flex flex-col gap-1.5">
        <span className="text-xs uppercase tracking-[0.15em] text-ink-700/55">Amount (₹)</span>
        <input
          required
          type="number"
          step="0.01"
          min="0.01"
          name="amount"
          value={form.amount}
          onChange={onChange}
          placeholder="0.00"
          className="slip-input font-mono"
        />
      </label>

      <label className="flex flex-col gap-1.5">
        <span className="text-xs uppercase tracking-[0.15em] text-ink-700/55">Date</span>
        <input
          required
          type="date"
          name="date"
          value={form.date}
          onChange={onChange}
          className="slip-input"
        />
      </label>

      <label className="flex flex-col gap-1.5">
        <span className="text-xs uppercase tracking-[0.15em] text-ink-700/55">Type</span>
        <select name="type" value={form.type} onChange={onChange} className="slip-input slip-select">
          <option value="EXPENSE">Expense</option>
          <option value="INCOME">Income</option>
        </select>
      </label>

      <label className="flex flex-col gap-1.5">
        <span className="text-xs uppercase tracking-[0.15em] text-ink-700/55">Category</span>
        <select name="category" value={form.category} onChange={onChange} className="slip-input slip-select">
          {ALL_CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {CATEGORY_LABEL[c]}
            </option>
          ))}
        </select>
      </label>

      <label className="flex flex-col gap-1.5 sm:col-span-2">
        <span className="text-xs uppercase tracking-[0.15em] text-ink-700/55">Note (optional)</span>
        <input
          name="note"
          value={form.note}
          onChange={onChange}
          placeholder="Anything worth remembering about this entry"
          className="slip-input"
        />
      </label>

      <div className="sm:col-span-2 flex items-center gap-3 mt-2">
        <button
          type="submit"
          disabled={submitting}
          className="flex items-center gap-1.5 font-display text-sm uppercase tracking-wide bg-accent-500 hover:bg-accent-600 disabled:opacity-60 text-canvas-50 rounded-sm px-6 py-2.5 transition-colors"
        >
          <Check size={15} strokeWidth={2.5} />
          {submitting ? "Saving…" : initial ? "Save changes" : "Add entry"}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="text-sm text-ink-700/60 hover:text-ink-800 px-2"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
