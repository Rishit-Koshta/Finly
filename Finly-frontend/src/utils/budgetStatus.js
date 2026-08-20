export function budgetStatus(spent, limit) {
  if (!limit || limit <= 0) return "ok";
  const ratio = spent / limit;
  if (ratio > 1) return "over";
  if (ratio >= 0.9) return "warn";
  return "ok";
}
