import { useState } from "react";
import { Copy, RefreshCw, Pencil, Eye, Sparkles, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Markdown } from "./Markdown";

type Props = {
  value: string;
  onChange: (v: string) => void;
  loading: boolean;
  error: string | null;
  onRegenerate: () => void;
  emptyHint: string;
};

export function ResultPanel({ value, onChange, loading, error, onRegenerate, emptyHint }: Props) {
  const [editing, setEditing] = useState(false);
  const copy = async () => {
    await navigator.clipboard.writeText(value);
    toast.success("Copied to clipboard");
  };
  return (
    <section className="flex min-h-[420px] flex-col rounded-3xl border border-border bg-card shadow-soft">
      <div className="flex flex-wrap items-center gap-2 border-b border-border px-5 py-3">
        <p className="mr-auto text-sm font-semibold">Result</p>
        {value && !loading && (
          <>
            <Button variant="ghost" size="sm" onClick={() => setEditing((e) => !e)}>
              {editing ? <Eye className="size-4" /> : <Pencil className="size-4" />} {editing ? "Preview" : "Edit"}
            </Button>
            <Button variant="ghost" size="sm" onClick={copy}><Copy className="size-4" /> Copy</Button>
            <Button variant="outline" size="sm" onClick={onRegenerate}><RefreshCw className="size-4" /> Regenerate</Button>
          </>
        )}
      </div>
      <div className="flex flex-1 flex-col p-5">
        {error && (
          <p className="mb-4 flex items-start gap-2 rounded-xl bg-rose-soft p-3 text-sm text-accent-foreground">
            <AlertCircle className="mt-0.5 size-4 shrink-0" /> {error}
          </p>
        )}
        {loading ? (
          <div className="space-y-3" aria-live="polite">
            <p className="flex items-center gap-2 text-sm text-muted-foreground"><Sparkles className="size-4 animate-pulse text-primary" /> Thinking it through…</p>
            {[90, 75, 85, 60, 80].map((w, i) => <div key={i} className="h-3 animate-pulse rounded-full bg-muted" style={{ width: `${w}%` }} />)}
          </div>
        ) : value ? (
          editing ? (
            <textarea
              aria-label="Edit result"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              className="min-h-[360px] flex-1 resize-y rounded-xl border border-input bg-background p-4 text-sm leading-relaxed outline-hidden focus:ring-2 focus:ring-ring"
            />
          ) : (
            <div className="cursor-text" onDoubleClick={() => setEditing(true)}><Markdown text={value} /></div>
          )
        ) : (
          <div className="m-auto max-w-xs text-center text-sm text-muted-foreground">
            <span className="mx-auto mb-3 grid size-12 place-items-center rounded-2xl bg-sage-soft"><Sparkles className="size-5 text-sage" /></span>
            {emptyHint}
          </div>
        )}
      </div>
      <p className="border-t border-border px-5 py-2.5 text-[11px] text-muted-foreground">AI-generated content may be inaccurate. Review before use.</p>
    </section>
  );
}
