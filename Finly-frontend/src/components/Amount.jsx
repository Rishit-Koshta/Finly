import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { formatCurrency } from "../utils/format";

export default function Amount({ value, sign = "neutral", className = "" }) {
  const color =
    sign === "positive" ? "text-sage-600" : sign === "negative" ? "text-wax-600" : "text-ink-700";

  const Icon = sign === "positive" ? ArrowUpRight : sign === "negative" ? ArrowDownRight : null;

  return (
    <span className={`font-sans tabular-nums inline-flex items-center gap-0.5 ${color} ${className}`}>
      {Icon && <Icon size="1em" strokeWidth={2.5} />}
      {formatCurrency(Math.abs(value))}
    </span>
  );
}
