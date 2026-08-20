import { Loader2 } from "lucide-react";

export default function Loader({ label = "Reading the ledger…" }) {
  return (
    <div className="flex items-center gap-3 text-ink-700/60 font-body text-sm py-10 justify-center">
      <Loader2 size={18} className="animate-spin text-accent-500" />
      {label}
    </div>
  );
}
