import { Landmark } from "lucide-react";

// Shared paper-slip frame for the login and register pages.
export default function AuthShell({ eyebrow, title, subtitle, children }) {
  return (
    <div className="min-h-screen bg-canvas-200 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <span className="inline-flex items-center justify-center w-10 h-10 rounded-md bg-accent-500 text-canvas-50 mb-4">
            <Landmark size={19} strokeWidth={2.25} />
          </span>
          <p className="text-[11px] uppercase tracking-[0.3em] text-accent-600">{eyebrow}</p>
          <h1 className="font-display font-semibold text-3xl text-ink-800 mt-2">{title}</h1>
          {subtitle && <p className="text-sm text-ink-700/55 mt-2">{subtitle}</p>}
        </div>

        <div className="relative bg-canvas-50 border rule rounded-md px-7 py-8 shadow-[0_12px_28px_rgba(74,74,74,0.09)]">
          <div
            aria-hidden="true"
            className="absolute -top-2 left-6 right-6 h-2 bg-canvas-200"
            style={{
              maskImage:
                "radial-gradient(circle, transparent 3px, black 3.2px)",
              maskSize: "14px 8px",
              WebkitMaskImage:
                "radial-gradient(circle, transparent 3px, black 3.2px)",
              WebkitMaskSize: "14px 8px",
            }}
          />
          {children}
        </div>
      </div>
    </div>
  );
}
