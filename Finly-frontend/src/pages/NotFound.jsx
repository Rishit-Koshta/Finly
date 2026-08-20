import { Link } from "react-router-dom";
import { Compass, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-canvas-200 flex items-center justify-center px-6">
      <div className="text-center">
        <Compass size={40} strokeWidth={1.5} className="mx-auto text-accent-500 mb-4" />
        <p className="font-display text-6xl text-accent-600">404</p>
        <p className="font-display text-xl text-ink-700 mt-3">This page isn't in the ledger</p>
        <p className="text-sm text-ink-700/55 mt-2">
          The entry you're looking for doesn't exist.
        </p>
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 mt-6 font-display text-sm uppercase tracking-wide bg-accent-500 hover:bg-accent-600 text-canvas-50 rounded-sm px-6 py-2.5"
        >
          <ArrowLeft size={15} strokeWidth={2.25} />
          Back to dashboard
        </Link>
      </div>
    </div>
  );
}
