import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Mail, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { generateEmail } from "@/lib/ai.functions";
import { ResultPanel } from "@/components/app/ResultPanel";
import { Field, Panel, Segmented, inputCls } from "@/components/app/Field";
import { useStoredState } from "@/components/app/useStoredState";
import { useGenerate } from "@/components/app/useGenerate";

export const Route = createFileRoute("/email")({
  head: () => ({
    meta: [
      { title: "Smart Email Generator — Workplace Assistant" },
      { name: "description", content: "Draft personalised professional emails in a formal, friendly or persuasive tone." },
      { property: "og:title", content: "Smart Email Generator — Workplace Assistant" },
      { property: "og:description", content: "Draft personalised professional emails in a formal, friendly or persuasive tone." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: EmailPage,
});

const TONES = ["Formal", "Friendly", "Persuasive"] as const;
const LENGTHS = ["Short", "Medium", "Detailed"] as const;

function EmailPage() {
  const [form, setForm] = useStoredState("wa:email:form", {
    purpose: "", recipient: "", sender: "", keyPoints: "",
    tone: "Formal" as (typeof TONES)[number], length: "Medium" as (typeof LENGTHS)[number],
  });
  const [output, setOutput] = useStoredState("wa:email:output", "");
  const gen = useGenerate(useServerFn(generateEmail), setOutput);
  const set = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) => setForm({ ...form, [k]: v });
  const ready = form.purpose.trim().length >= 3;

  return (
    <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
      <Panel>
        <div className="flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-xl bg-rose-soft text-primary"><Mail className="size-5" strokeWidth={1.75} /></span>
          <div><p className="font-serif text-lg font-semibold">Compose with AI</p><p className="text-xs text-muted-foreground">Tell it what you need; it drafts the email.</p></div>
        </div>
        <Field label="What is this email about?">
          <textarea className={inputCls + " min-h-24"} value={form.purpose} onChange={(e) => set("purpose", e.target.value)} placeholder="e.g. Follow up with a client after our product demo and propose a pilot" />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Recipient"><input className={inputCls} value={form.recipient} onChange={(e) => set("recipient", e.target.value)} placeholder="Dana Lee, Head of Ops" /></Field>
          <Field label="Your name"><input className={inputCls} value={form.sender} onChange={(e) => set("sender", e.target.value)} placeholder="Sam Patel" /></Field>
        </div>
        <Field label="Key points (optional)" hint="One per line works best.">
          <textarea className={inputCls + " min-h-20"} value={form.keyPoints} onChange={(e) => set("keyPoints", e.target.value)} placeholder={"Pilot runs 4 weeks\nNo upfront cost"} />
        </Field>
        <Field label="Tone"><Segmented label="Tone" options={TONES} value={form.tone} onChange={(v) => set("tone", v)} /></Field>
        <Field label="Length"><Segmented label="Length" options={LENGTHS} value={form.length} onChange={(v) => set("length", v)} /></Field>
        <Button className="w-full" size="lg" disabled={!ready || gen.loading} onClick={() => gen.run(form)}>
          <Wand2 className="size-4" /> {gen.loading ? "Writing…" : "Generate email"}
        </Button>
      </Panel>
      <ResultPanel value={output} onChange={setOutput} loading={gen.loading} error={gen.error} onRegenerate={() => gen.run(form)} emptyHint="Your drafted email will appear here, ready to edit and copy." />
    </div>
  );
}
