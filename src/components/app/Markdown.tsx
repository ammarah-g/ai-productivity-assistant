import type { ReactNode } from "react";

function inline(text: string): ReactNode[] {
  return text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g).map((part, i) =>
    part.startsWith("**") && part.endsWith("**") ? <strong key={i}>{part.slice(2, -2)}</strong>
    : part.startsWith("`") && part.endsWith("`") ? <code key={i} className="rounded bg-muted px-1">{part.slice(1, -1)}</code>
    : part,
  );
}

export function Markdown({ text }: { text: string }) {
  return (
    <div className="space-y-2 text-sm leading-relaxed">
      {text.split("\n").map((line, i) => {
        const t = line.trim();
        if (!t) return <div key={i} className="h-1" />;
        if (t.startsWith("### ")) return <h4 key={i} className="pt-2 font-semibold">{inline(t.slice(4))}</h4>;
        if (t.startsWith("## ")) return <h3 key={i} className="pt-3 font-serif text-lg font-semibold text-accent-foreground">{inline(t.slice(3))}</h3>;
        if (t.startsWith("# ")) return <h2 key={i} className="font-serif text-xl font-semibold">{inline(t.slice(2))}</h2>;
        const bullet = /^[-*] (.*)/.exec(t);
        if (bullet) return <p key={i} className="flex gap-2 pl-1"><span className="mt-2 size-1.5 shrink-0 rounded-full bg-sage" /><span>{inline(bullet[1] ?? "")}</span></p>;
        const num = /^(\d+)\. (.*)/.exec(t);
        if (num) return <p key={i} className="flex gap-2"><span className="font-semibold text-primary">{num[1]}.</span><span>{inline(num[2] ?? "")}</span></p>;
        return <p key={i}>{inline(t)}</p>;
      })}
    </div>
  );
}
