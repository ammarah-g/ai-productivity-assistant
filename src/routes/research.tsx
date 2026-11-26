import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { BookOpen, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { generateResearch } from "@/lib/ai.functions";
import { ResultPanel } from "@/components/app/ResultPanel";
import { Field, Panel, Segmented, inputCls } from "@/components/app/Field";
import { useStoredState } from "@/components/app/useStoredState";
import { useGenerate } from "@/components/app/useGenerate";

export const Route = createFileRoute("/research")({
  head: () => ({
    meta: [
      { title: "AI Research Assistant — Workplace Assistant" },
      { name: "description", content: "Summarise topics or articles into key insights and practical recommendations." },
      { property: "og:title", content: "AI Research Assistant — Workplace Assistant" },
      { property: "og:description", content: "Summarise topics or articles into key insights and practical recommendations." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ResearchPage,
});

const DEPTHS = ["Brief", "Standard", "In-depth"] as const;

function ResearchPage() {
  const [form, setForm] = useStoredState("wa:research:form", { topic: "", goal: "", depth: "Standard" as (typeof DEPTHS)[number] });
  const [output, setOutput] = useStoredState("wa:research:output", "");
  const gen = useGenerate(useServerFn(generateResearch), setOutput);
  const ready = form.topic.trim().length >= 3;
  return (
    <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
      <Panel>
        <div className="flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-xl bg-rose-soft text-primary"><BookOpen className="size-5" strokeWidth={1.75} /></span>
          <div><p className="font-serif text-lg font-semibold">Research & summarise</p><p className="text-xs text-muted-foreground">Enter a topic or paste an article.</p></div>
        </div>
        <Field label="Topic or article text" hint={`${form.topic.length.toLocaleString()} / 20,000 characters`}>
          <textarea className={inputCls + " min-h-48"} maxLength={20000} value={form.topic} onChange={(e) => setForm({ ...form, topic: e.target.value })} placeholder="e.g. The impact of a four-day work week on productivity — or paste an article here" />
        </Field>
        <Field label="Your goal (optional)"><input className={inputCls} value={form.goal} onChange={(e) => setForm({ ...form, goal: e.target.value })} placeholder="Brief my leadership team on whether to pilot it" /></Field>
        <Field label="Depth"><Segmented label="Depth" options={DEPTHS} value={form.depth} onChange={(v) => setForm({ ...form, depth: v })} /></Field>
        <Button className="w-full" size="lg" disabled={!ready || gen.loading} onClick={() => gen.run(form)}>
          <Wand2 className="size-4" /> {gen.loading ? "Analysing…" : "Generate insights"}
        </Button>
      </Panel>
      <ResultPanel value={output} onChange={setOutput} loading={gen.loading} error={gen.error} onRegenerate={() => gen.run(form)} emptyHint="Get a summary, key insights, recommendations and open questions." />
    </div>
  );
}
