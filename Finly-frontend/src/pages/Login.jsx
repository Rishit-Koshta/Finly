import { LogIn } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { extractErrorMessage } from "../utils/apiError";
import AuthShell from "../components/AuthShell";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const [form, setForm] = useState({ email: "", password: "" });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await login(form.email, form.password);
      toast.success("Ledger opened. Welcome back.");
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(extractErrorMessage(err, "Couldn't sign you in. Check your email and password."));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthShell
      eyebrow="Finly"
      title="Open your ledger"
      subtitle="Sign in to review this month's entries and budgets."
    >
      <form onSubmit={onSubmit} className="flex flex-col gap-5">
        <label className="flex flex-col gap-1.5">
          <span className="text-xs uppercase tracking-[0.15em] text-ink-700/55">Email</span>
          <input
            required
            type="email"
            name="email"
            autoComplete="email"
            value={form.email}
            onChange={onChange}
            placeholder="you@example.com"
            className="slip-input"
          />
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-xs uppercase tracking-[0.15em] text-ink-700/55">Password</span>
          <input
            required
            type="password"
            name="password"
            autoComplete="current-password"
            value={form.password}
            onChange={onChange}
            placeholder="••••••••"
            className="slip-input"
          />
        </label>

        {error && (
          <p className="text-sm text-wax-600 border border-wax-600/40 bg-wax-500/10 rounded-sm px-3 py-2">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="flex items-center justify-center gap-2 mt-2 font-display tracking-wide text-sm uppercase bg-accent-500 hover:bg-accent-600 disabled:opacity-60 text-canvas-50 rounded-sm py-3 transition-colors"
        >
          <LogIn size={16} strokeWidth={2.25} />
          {submitting ? "Opening…" : "Sign in"}
        </button>
      </form>

      <p className="text-sm text-ink-700/55 mt-7 text-center">
        New here?{" "}
        <Link to="/register" className="text-accent-600 hover:text-accent-700 underline underline-offset-4">
          Open an account
        </Link>
      </p>
    </AuthShell>
  );
}
