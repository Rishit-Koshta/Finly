export default function ProgressRule({ percent, status }) {
  const clamped = Math.min(percent, 100);
  const color =
    status === "over" ? "bg-wax-500" : status === "warn" ? "bg-warn-500" : "bg-sage-500";

  return (
    <div className="h-1.5 w-full rounded-full bg-line-200 overflow-hidden">
      <div
        className={`h-full rounded-full ${color} transition-[width] duration-500`}
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}
