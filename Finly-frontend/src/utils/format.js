const rupeeFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 2,
});

export const formatCurrency = (value) => rupeeFormatter.format(Number(value) || 0);

export const formatDate = (isoDate) => {
  if (!isoDate) return "—";
  const date = new Date(isoDate);
  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

export const monthLabel = (year, month) =>
  new Date(year, month - 1, 1).toLocaleDateString("en-IN", {
    month: "long",
    year: "numeric",
  });

export const todayISODate = () => new Date().toISOString().slice(0, 10);
