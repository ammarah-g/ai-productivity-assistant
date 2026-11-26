import type { ReactNode } from "react";
export const inputCls = "w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm outline-hidden transition focus:ring-2 focus:ring-ring";
export function Field({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return (
    <label className="block space-y-1.5">
      <span className="text-sm font-medium">{label}</span>
      {children}
      {hint && <span className="block text-xs text-muted-foreground">{hint}</span>}
    </label>
  );
}
export function Segmented<T extends string>({ options, value, onChange, label }: { options: readonly T[]; value: T; onChange: (v: T) => void; label: string }) {
  return (
    <div role="radiogroup" aria-label={label} className="inline-flex w-full rounded-xl bg-muted p-1">
      {options.map((o) => (
        <button key={o} type="button" role="radio" aria-checked={value === o} onClick={() => onChange(o)}
          className={`flex-1 rounded-lg px-3 py-1.5 text-sm font-medium transition ${value === o ? "bg-card text-accent-foreground shadow-soft" : "text-muted-foreground hover:text-foreground"}`}>
          {o}
        </button>
      ))}
    </div>
  );
}
export function Panel({ children }: { children: ReactNode }) {
  return <section className="space-y-5 rounded-3xl border border-border bg-card p-6 shadow-soft">{children}</section>;
}
