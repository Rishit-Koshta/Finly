export function extractErrorMessage(error, fallback = "Something went wrong. Please try again.") {
  const data = error?.response?.data;
  if (typeof data === "string") return data;
  if (data?.message) return data.message;
  if (Array.isArray(data?.errors) && data.errors.length) {
    return data.errors.map((e) => e.defaultMessage || e.message || e).join(", ");
  }
  if (data && typeof data === "object") {
    const firstVal = Object.values(data)[0];
    if (typeof firstVal === "string") return firstVal;
  }
  return error?.message || fallback;
}
