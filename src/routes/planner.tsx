import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { CalendarCheck, Plus, Trash2, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { generatePlan } from "@/lib/ai.functions";
import { ResultPanel } from "@/components/app/ResultPanel";
import { Field, Panel, Segmented, inputCls } from "@/components/app/Field";
import { useStoredState } from "@/components/app/useStoredState";
import { useGenerate } from "@/components/app/useGenerate";

export const Route = createFileRoute("/planner")({
  head: () => ({
    meta: [
      { title: "AI Task Planner — Workplace Assistant" },
      { name: "description", content: "Turn tasks, deadlines and priorities into a daily or weekly schedule sorted by urgency and importance." },
      { property: "og:title", content: "AI Task Planner — Workplace Assistant" },
      { property: "og:description", content: "Turn tasks, deadlines and priorities into a daily or weekly schedule sorted by urgency and importance." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PlannerPage,
});

const MODES = ["Daily", "Weekly"] as const;
const PRIORITIES = ["High", "Medium", "Low"] as const;
type Task = { title: string; deadline: string; priority: (typeof PRIORITIES)[number]; estimate: string };
const blank = (): Task => ({ title: "", deadline: "", priority: "Medium", estimate: "" });

function PlannerPage() {
  const [form, setForm] = useStoredState("wa:planner:form", {
    mode: "Daily" as (typeof MODES)[number], startDate: "", workHours: "09:00–17:00", notes: "", tasks: [blank()] as Task[],
  });
  const [output, setOutput] = useStoredState("wa:planner:output", "");
  const gen = useGenerate(useServerFn(generatePlan), setOutput);
  const updateTask = (i: number, patch: Partial<Task>) => setForm({ ...form, tasks: form.tasks.map((t, j) => (j === i ? { ...t, ...patch } : t)) });
  const valid = form.tasks.filter((t) => t.title.trim());
  const submit = () => gen.run({ ...form, tasks: valid });

  return (
    <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
      <Panel>
        <div className="flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-xl bg-sage-soft text-sage"><CalendarCheck className="size-5" strokeWidth={1.75} /></span>
          <div><p className="font-serif text-lg font-semibold">Plan your time</p><p className="text-xs text-muted-foreground">Sorted by urgency and importance.</p></div>
        </div>
        <Field label="Schedule type"><Segmented label="Schedule type" options={MODES} value={form.mode} onChange={(v) => setForm({ ...form, mode: v })} /></Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Start date"><input type="date" className={inputCls} value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} /></Field>
          <Field label="Working hours"><input className={inputCls} value={form.workHours} onChange={(e) => setForm({ ...form, workHours: e.target.value })} /></Field>
        </div>
        <div className="space-y-3">
          <p className="text-sm font-medium">Tasks</p>
          {form.tasks.map((t, i) => (
            <div key={i} className="space-y-2 rounded-2xl border border-border bg-background p-3">
              <div className="flex gap-2">
                <input aria-label={`Task ${i + 1}`} className={inputCls} value={t.title} onChange={(e) => updateTask(i, { title: e.target.value })} placeholder="e.g. Finish Q3 budget report" />
                <button aria-label="Remove task" disabled={form.tasks.length === 1} onClick={() => setForm({ ...form, tasks: form.tasks.filter((_, j) => j !== i) })} className="shrink-0 rounded-lg p-2 text-muted-foreground hover:bg-muted disabled:opacity-30"><Trash2 className="size-4" /></button>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <input aria-label="Deadline" type="date" className={inputCls + " px-2"} value={t.deadline} onChange={(e) => updateTask(i, { deadline: e.target.value })} />
                <select aria-label="Priority" className={inputCls + " px-2"} value={t.priority} onChange={(e) => updateTask(i, { priority: e.target.value as Task["priority"] })}>
                  {PRIORITIES.map((p) => <option key={p}>{p}</option>)}
                </select>
                <input aria-label="Time estimate" className={inputCls + " px-2"} value={t.estimate} onChange={(e) => updateTask(i, { estimate: e.target.value })} placeholder="2h" />
              </div>
            </div>
          ))}
          <Button variant="outline" size="sm" onClick={() => setForm({ ...form, tasks: [...form.tasks, blank()] })} disabled={form.tasks.length >= 40}><Plus className="size-4" /> Add task</Button>
        </div>
        <Field label="Notes (optional)"><textarea className={inputCls + " min-h-16"} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Team standup daily at 10:00; prefer no meetings after 4pm" /></Field>
        <Button className="w-full" size="lg" disabled={!valid.length || gen.loading} onClick={submit}>
          <Wand2 className="size-4" /> {gen.loading ? "Planning…" : `Generate ${form.mode.toLowerCase()} plan`}
        </Button>
      </Panel>
      <ResultPanel value={output} onChange={setOutput} loading={gen.loading} error={gen.error} onRegenerate={submit} emptyHint="Add your tasks and get a prioritised, time-blocked schedule." />
    </div>
  );
}
