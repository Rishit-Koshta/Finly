// import { CheckCircle2, AlertTriangle, XCircle } from "lucide-react";

// // The signature element: a stamped ledger seal marking budget status.
// export default function Seal({ status, className = "" }) {
//   const config = {
//     ok: { text: "On track", cls: "seal-ok", Icon: CheckCircle2 },
//     warn: { text: "Near limit", cls: "seal-warn", Icon: AlertTriangle },
//     over: { text: "Over budget", cls: "seal-over", Icon: XCircle },
//   }[status];

//   const { Icon } = config;

//   return (
//     <span className={`seal ${config.cls} text-[10px] px-3 py-1.5 ${className}`}>
//       <Icon size={12} strokeWidth={2.5} />
//       {config.text}
//     </span>
//   );
// }


import { CheckCircle2, AlertTriangle, XCircle } from "lucide-react";

// Clean status indicator for budget health.
export default function Seal({ status, className = "" }) {
  const config = {
    ok: {
      text: "On track",
      cls: "text-emerald-700 bg-emerald-50 border-emerald-200",
      Icon: CheckCircle2,
    },
    warn: {
      text: "Near limit",
      cls: "text-amber-700 bg-amber-50 border-amber-200",
      Icon: AlertTriangle,
    },
    over: {
      text: "Over budget",
      cls: "text-red-700 bg-red-50 border-red-200",
      Icon: XCircle,
    },
  }[status];

  if (!config) return null;

  const { Icon } = config;

  return (
    <span
      className={`
        inline-flex items-center gap-1.5
        rounded-full
        border
        px-2.5 py-1
        text-[11px]
        font-medium
        leading-none
        ${config.cls}
        ${className}
      `}
    >
      <Icon size={12} strokeWidth={2.3} />
      <span>{config.text}</span>
    </span>
  );
}