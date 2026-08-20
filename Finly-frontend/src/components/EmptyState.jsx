import { Inbox } from "lucide-react";

export default function EmptyState({ title, hint, action, icon: Icon = Inbox }) {
  return (
    <div className="border border-dashed rule rounded-md py-14 px-6 text-center">
      <Icon size={26} strokeWidth={1.5} className="mx-auto text-ink-500 mb-3" />
      <p className="font-display text-lg text-ink-700">{title}</p>
      {hint && <p className="text-sm text-ink-700/55 mt-2 max-w-sm mx-auto">{hint}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
