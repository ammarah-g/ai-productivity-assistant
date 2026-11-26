import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, BookOpen, CalendarCheck, Mail, ShieldAlert } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — Workplace Assistant" },
      { name: "description", content: "AI email writer, task planner and research assistant in one calm dashboard." },
      { property: "og:title", content: "Dashboard — Workplace Assistant" },
      { property: "og:description", content: "AI email writer, task planner and research assistant in one calm dashboard." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Dashboard,
});

const TOOLS = [
  { to: "/email", title: "Smart Email Generator", desc: "Personalised emails in formal, friendly or persuasive tones.", icon: Mail, tint: "bg-rose-soft text-primary" },
  { to: "/planner", title: "AI Task Planner", desc: "Daily or weekly schedules organised by urgency and importance.", icon: CalendarCheck, tint: "bg-sage-soft text-sage" },
  { to: "/research", title: "AI Research Assistant", desc: "Summaries, key insights and recommendations from any topic or article.", icon: BookOpen, tint: "bg-rose-soft text-primary" },
] as const;

function Dashboard() {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <section className="rounded-3xl bg-hero p-8 shadow-soft sm:p-10">
        <p className="text-sm font-medium text-accent-foreground" suppressHydrationWarning>{greeting}</p>
        <h2 className="mt-2 max-w-xl font-serif text-3xl font-semibold leading-tight sm:text-4xl">What would you like to get done today?</h2>
        <p className="mt-3 max-w-lg text-sm text-muted-foreground">Three focused AI tools for writing, planning and thinking. Everything you generate stays editable and is saved on this device.</p>
      </section>
      <section className="grid gap-5 md:grid-cols-3">
        {TOOLS.map((t) => (
          <Link key={t.to} to={t.to} className="group flex flex-col rounded-3xl border border-border bg-card p-6 shadow-soft transition hover:-translate-y-0.5 hover:border-primary/40">
            <span className={`grid size-11 place-items-center rounded-2xl ${t.tint}`}><t.icon className="size-5" strokeWidth={1.75} /></span>
            <h3 className="mt-5 font-serif text-xl font-semibold">{t.title}</h3>
            <p className="mt-2 flex-1 text-sm text-muted-foreground">{t.desc}</p>
            <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-primary">Open tool <ArrowRight className="size-4 transition group-hover:translate-x-0.5" /></span>
          </Link>
        ))}
      </section>
      <section className="flex gap-4 rounded-3xl border border-border bg-card p-6 shadow-soft">
        <ShieldAlert className="size-5 shrink-0 text-sage" />
        <div className="text-sm">
          <p className="font-semibold">Using AI responsibly</p>
          <p className="mt-1 text-muted-foreground">These tools use generative AI. Outputs may contain mistakes, outdated information or bias, and are not professional advice. Always review, fact-check and edit before sending or acting on them, and avoid entering confidential or personal data.</p>
        </div>
      </section>
    </div>
  );
}
