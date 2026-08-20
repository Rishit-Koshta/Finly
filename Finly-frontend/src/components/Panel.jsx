export default function Panel({ title, eyebrow, action, children, className = "" }) {
  return (
    <section className={`bg-canvas-50 border rule rounded-md shadow-[0_2px_10px_rgba(74,74,74,0.05)] ${className}`}>
      {(title || action) && (
        <div className="flex items-center justify-between gap-4 px-6 py-4 border-b rule">
          <div>
            {eyebrow && (
              <p className="text-[10px] uppercase tracking-[0.2em] text-accent-600 mb-0.5">{eyebrow}</p>
            )}
            {title && <h2 className="font-display font-semibold text-lg text-ink-800">{title}</h2>}
          </div>
          {action}
        </div>
      )}
      <div className="p-6">{children}</div>
    </section>
  );
}
