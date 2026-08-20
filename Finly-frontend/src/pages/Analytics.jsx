import { PieChart as PieChartIcon, ListOrdered, LineChart as LineChartIcon } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
  LineChart,
  Line,
} from "recharts";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { getMonthlySummary, getCategoryExpense, getDailyExpenseTrend } from "../api/analytics";
import Panel from "../components/Panel";
import Amount from "../components/Amount";
import Loader from "../components/Loader";
import EmptyState from "../components/EmptyState";
import { CATEGORY_LABEL } from "../utils/categories";
import { formatCurrency, monthLabel } from "../utils/format";
import { extractErrorMessage } from "../utils/apiError";

const PALETTE = ["#6d8196", "#3f7a54", "#a63b28", "#d9a94d", "#4a4a4a", "#9fb0be", "#8f6620"];

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-canvas-50 border rule px-3 py-2 rounded-sm text-xs font-mono text-ink-700">
      {label && <p className="text-ink-700/60 mb-1 font-body">{label}</p>}
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color || p.fill }}>
          {p.name}: {formatCurrency(p.value)}
        </p>
      ))}
    </div>
  );
}

export default function Analytics() {
  const { userId } = useAuth();
  const toast = useToast();
  const now = useMemo(() => new Date(), []);

  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState(null);
  const [categoryData, setCategoryData] = useState([]);
  const [dailyData, setDailyData] = useState([]);

  useEffect(() => {
    if (!userId) return;
    let alive = true;
    (async () => {
      setLoading(true);
      try {
        const [summaryRes, categoryRes, dailyRes] = await Promise.all([
          getMonthlySummary(userId, year, month),
          getCategoryExpense(userId, year, month),
          getDailyExpenseTrend(userId, year, month),
        ]);
        if (!alive) return;
        setSummary(summaryRes);
        setCategoryData(
          categoryRes.map((c) => ({
            name: CATEGORY_LABEL[c.category] || c.category,
            value: Number(c.amount) || 0,
          }))
        );
        setDailyData(
          dailyRes.map((d) => ({
            date: new Date(d.date).getDate(),
            amount: Number(d.amount) || 0,
          }))
        );
      } catch (err) {
        toast.error(extractErrorMessage(err, "Couldn't load analytics."));
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, year, month]);

  const years = Array.from({ length: 6 }, (_, i) => now.getFullYear() - 4 + i);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[11px] uppercase tracking-[0.2em] text-accent-600">Ledger analytics</p>
          <h1 className="font-display text-2xl text-ink-700 mt-1">{monthLabel(year, month)}</h1>
        </div>
        <div className="flex gap-3">
          <select
            value={month}
            onChange={(e) => setMonth(Number(e.target.value))}
            className="slip-input slip-select text-sm py-1.5"
          >
            {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
              <option key={m} value={m}>
                {new Date(2000, m - 1, 1).toLocaleDateString("en-IN", { month: "long" })}
              </option>
            ))}
          </select>
          <select
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            className="slip-input slip-select text-sm py-1.5"
          >
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <Loader label="Totalling the columns…" />
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-3 border rule rounded-md overflow-hidden bg-canvas-50 shadow-[0_2px_10px_rgba(74,74,74,0.05)]">
            <div className="px-6 py-5 border-b sm:border-b-0 sm:border-r rule">
              <p className="text-[11px] uppercase tracking-[0.15em] text-ink-700/50">Income</p>
              <Amount value={summary?.income} sign="positive" className="text-2xl block mt-1.5" />
            </div>
            <div className="px-6 py-5 border-b sm:border-b-0 sm:border-r rule">
              <p className="text-[11px] uppercase tracking-[0.15em] text-ink-700/50">Expense</p>
              <Amount value={summary?.expense} sign="negative" className="text-2xl block mt-1.5" />
            </div>
            <div className="px-6 py-5">
              <p className="text-[11px] uppercase tracking-[0.15em] text-ink-700/50">Balance</p>
              <Amount
                value={summary?.balance}
                sign={Number(summary?.balance) >= 0 ? "positive" : "negative"}
                className="text-2xl block mt-1.5"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Panel eyebrow="By category" title="Where it went">
              {categoryData.length === 0 ? (
                <EmptyState icon={PieChartIcon} title="No expenses this month" hint="Nothing spent yet in this period." />
              ) : (
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryData}
                        dataKey="value"
                        nameKey="name"
                        innerRadius={58}
                        outerRadius={92}
                        paddingAngle={2}
                        stroke="#ffffff"
                        strokeWidth={2}
                      >
                        {categoryData.map((_, i) => (
                          <Cell key={i} fill={PALETTE[i % PALETTE.length]} />
                        ))}
                      </Pie>
                      <Tooltip content={<ChartTooltip />} />
                      <Legend
                        wrapperStyle={{ fontSize: 12, fontFamily: "Roboto", color: "#4a4a4a" }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              )}
            </Panel>

            <Panel eyebrow="By category" title="Category totals">
              {categoryData.length === 0 ? (
                <EmptyState icon={ListOrdered} title="No expenses this month" hint="Nothing spent yet in this period." />
              ) : (
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={categoryData} layout="vertical" margin={{ left: 8, right: 16 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e7e7e0" horizontal={false} />
                      <XAxis type="number" tick={{ fill: "#4a4a4a", fontSize: 11 }} tickFormatter={(v) => `₹${v}`} />
                      <YAxis
                        type="category"
                        dataKey="name"
                        tick={{ fill: "#4a4a4a", fontSize: 12 }}
                        width={90}
                      />
                      <Tooltip content={<ChartTooltip />} cursor={{ fill: "rgba(109,129,150,0.08)" }} />
                      <Bar dataKey="value" radius={[0, 3, 3, 0]}>
                        {categoryData.map((_, i) => (
                          <Cell key={i} fill={PALETTE[i % PALETTE.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </Panel>
          </div>

          <Panel eyebrow="Day by day" title="Daily expense trend">
            {dailyData.length === 0 ? (
              <EmptyState icon={LineChartIcon} title="No daily data yet" hint="Log a few expenses to see the trend line." />
            ) : (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={dailyData} margin={{ left: 8, right: 16 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e7e7e0" />
                    <XAxis dataKey="date" tick={{ fill: "#4a4a4a", fontSize: 11 }} />
                    <YAxis tick={{ fill: "#4a4a4a", fontSize: 11 }} tickFormatter={(v) => `₹${v}`} />
                    <Tooltip content={<ChartTooltip />} />
                    <Line
                      type="monotone"
                      dataKey="amount"
                      stroke="#6d8196"
                      strokeWidth={2}
                      dot={{ fill: "#6d8196", r: 3 }}
                      activeDot={{ r: 5 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </Panel>
        </>
      )}
    </div>
  );
}
