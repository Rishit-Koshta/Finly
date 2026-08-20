import { Send, TrendingUp, Gauge, Target, Sparkles } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { askFinanceAI, getTrendInsight, getPredictionInsight, getBudgetSuggestion } from "../api/insights";
import Panel from "../components/Panel";
import { BUDGETABLE_CATEGORIES, CATEGORY_LABEL } from "../utils/categories";
import { extractErrorMessage } from "../utils/apiError";

function ResultCard({ children }) {
  return (
    <p className="mt-4 flex items-start gap-2.5 text-sm leading-relaxed text-ink-700 bg-line-200/40 border rule rounded-sm px-4 py-3">
      <Sparkles size={15} strokeWidth={2} className="text-accent-500 shrink-0 mt-0.5" />
      <span>{children}</span>
    </p>
  );
}

export default function Insights() {
  const { userId } = useAuth();
  const toast = useToast();

  // Ask
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [asking, setAsking] = useState(false);

  // Trend
  const [trendCategory, setTrendCategory] = useState(BUDGETABLE_CATEGORIES[0]);
  const [trendResult, setTrendResult] = useState("");
  const [trendLoading, setTrendLoading] = useState(false);

  // Prediction
  const [prediction, setPrediction] = useState("");
  const [predictionLoading, setPredictionLoading] = useState(false);

  // Budget suggestion
  const [suggestionCategory, setSuggestionCategory] = useState(BUDGETABLE_CATEGORIES[0]);
  const [suggestion, setSuggestion] = useState("");
  const [suggestionLoading, setSuggestionLoading] = useState(false);

  const submitQuestion = async (e) => {
    e.preventDefault();
    if (!question.trim()) return;
    setAsking(true);
    setAnswer("");
    try {
      const res = await askFinanceAI(userId, question.trim());
      setAnswer(res.answer);
    } catch (err) {
      toast.error(extractErrorMessage(err, "The assistant couldn't answer that."));
    } finally {
      setAsking(false);
    }
  };

  const runTrend = async () => {
    setTrendLoading(true);
    setTrendResult("");
    try {
      const res = await getTrendInsight(userId, trendCategory);
      setTrendResult(res);
    } catch (err) {
      toast.error(extractErrorMessage(err, "Couldn't fetch that trend."));
    } finally {
      setTrendLoading(false);
    }
  };

  const runPrediction = async () => {
    setPredictionLoading(true);
    setPrediction("");
    try {
      const res = await getPredictionInsight(userId);
      setPrediction(res);
    } catch (err) {
      toast.error(extractErrorMessage(err, "Couldn't project this month."));
    } finally {
      setPredictionLoading(false);
    }
  };

  const runSuggestion = async () => {
    setSuggestionLoading(true);
    setSuggestion("");
    try {
      const res = await getBudgetSuggestion(userId, suggestionCategory);
      setSuggestion(res);
    } catch (err) {
      toast.error(extractErrorMessage(err, "Couldn't fetch a suggestion."));
    } finally {
      setSuggestionLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-[11px] uppercase tracking-[0.2em] text-accent-600">The assistant</p>
        <h1 className="font-display text-2xl text-ink-700 mt-1">AI insights</h1>
        <p className="text-sm text-ink-700/55 mt-1 max-w-xl">
          Ask about your spending directly, or pull a quick read on a category's trend,
          this month's projected total, or how a category budget is holding up.
        </p>
      </div>

      <Panel eyebrow="Ask anything" title="Ask about your finances">
        <form onSubmit={submitQuestion} className="flex flex-col sm:flex-row gap-3">
          <input
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="e.g. Where am I overspending this month?"
            className="slip-input flex-1"
          />
          <button
            type="submit"
            disabled={asking}
            className="flex items-center justify-center gap-1.5 font-display text-sm uppercase tracking-wide bg-accent-500 hover:bg-accent-600 disabled:opacity-60 text-canvas-50 rounded-sm px-6 py-2.5 transition-colors shrink-0"
          >
            <Send size={15} strokeWidth={2.25} />
            {asking ? "Thinking…" : "Ask"}
          </button>
        </form>
        {answer && <ResultCard>{answer}</ResultCard>}
      </Panel>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Panel eyebrow="Category trend" title="Compare to last month">
          <label className="flex flex-col gap-1.5">
            <span className="text-xs uppercase tracking-[0.15em] text-ink-700/55">Category</span>
            <select
              value={trendCategory}
              onChange={(e) => setTrendCategory(e.target.value)}
              className="slip-input slip-select"
            >
              {BUDGETABLE_CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {CATEGORY_LABEL[c]}
                </option>
              ))}
            </select>
          </label>
          <button
            onClick={runTrend}
            disabled={trendLoading}
            className="flex items-center justify-center gap-1.5 mt-4 w-full font-display text-sm uppercase tracking-wide border rule hover:border-accent-500 hover:text-accent-700 disabled:opacity-60 rounded-sm px-5 py-2.5 transition-colors"
          >
            <TrendingUp size={15} strokeWidth={2} />
            {trendLoading ? "Comparing…" : "Check trend"}
          </button>
          {trendResult && <ResultCard>{trendResult}</ResultCard>}
        </Panel>

        <Panel eyebrow="This month" title="Projected expense">
          <p className="text-sm text-ink-700/55">
            Projects your full-month total from what you've spent so far, at the current
            daily pace.
          </p>
          <button
            onClick={runPrediction}
            disabled={predictionLoading}
            className="flex items-center justify-center gap-1.5 mt-4 w-full font-display text-sm uppercase tracking-wide border rule hover:border-accent-500 hover:text-accent-700 disabled:opacity-60 rounded-sm px-5 py-2.5 transition-colors"
          >
            <Gauge size={15} strokeWidth={2} />
            {predictionLoading ? "Projecting…" : "Project this month"}
          </button>
          {prediction && <ResultCard>{prediction}</ResultCard>}
        </Panel>

        <Panel eyebrow="Budget check" title="Category budget suggestion">
          <label className="flex flex-col gap-1.5">
            <span className="text-xs uppercase tracking-[0.15em] text-ink-700/55">Category</span>
            <select
              value={suggestionCategory}
              onChange={(e) => setSuggestionCategory(e.target.value)}
              className="slip-input slip-select"
            >
              {BUDGETABLE_CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {CATEGORY_LABEL[c]}
                </option>
              ))}
            </select>
          </label>
          <button
            onClick={runSuggestion}
            disabled={suggestionLoading}
            className="flex items-center justify-center gap-1.5 mt-4 w-full font-display text-sm uppercase tracking-wide border rule hover:border-accent-500 hover:text-accent-700 disabled:opacity-60 rounded-sm px-5 py-2.5 transition-colors"
          >
            <Target size={15} strokeWidth={2} />
            {suggestionLoading ? "Checking…" : "Get suggestion"}
          </button>
          {suggestion && <ResultCard>{suggestion}</ResultCard>}
        </Panel>
      </div>
    </div>
  );
}
