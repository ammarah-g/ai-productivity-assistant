import { Link, useRouterState } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import { LayoutGrid, Mail, CalendarCheck, BookOpen, Menu, X, Sparkles, ShieldAlert } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/", label: "Dashboard", icon: LayoutGrid },
  { to: "/email", label: "Email Generator", icon: Mail },
  { to: "/planner", label: "Task Planner", icon: CalendarCheck },
  { to: "/research", label: "Research Assistant", icon: BookOpen },
] as const;

function Brand() {
  return (
    <div className="flex items-center gap-2.5 px-2">
      <span className="grid size-9 place-items-center rounded-xl bg-primary text-primary-foreground shadow-soft">
        <Sparkles className="size-4" />
      </span>
      <div className="leading-tight">
        <p className="font-serif text-lg font-semibold">Workplace</p>
        <p className="text-xs text-muted-foreground">AI Productivity Assistant</p>
      </div>
    </div>
  );
}

function NavList({ onNavigate }: { onNavigate?: () => void }) {
  const path = useRouterState({ select: (r) => r.location.pathname });
  return (
    <nav className="mt-8 flex flex-col gap-1">
      {NAV.map((item) => {
        const active = path === item.to;
        return (
          <Link
            key={item.to}
            to={item.to}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
              active ? "bg-sidebar-accent text-sidebar-accent-foreground" : "text-sidebar-foreground/75 hover:bg-sidebar-accent/60",
            )}
          >
            <item.icon className="size-4" strokeWidth={1.75} />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

function Disclaimer() {
  return (
    <div className="rounded-2xl border border-sidebar-border bg-card p-4 text-xs leading-relaxed text-muted-foreground">
      <p className="mb-1 flex items-center gap-1.5 font-semibold text-foreground">
        <ShieldAlert className="size-3.5 text-sage" /> Responsible AI
      </p>
      AI outputs can contain errors, outdated facts or bias. Review and edit everything before you send or rely on it.
    </div>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const path = useRouterState({ select: (r) => r.location.pathname });
  const title = NAV.find((n) => n.to === path)?.label ?? "Workplace";
  return (
    <div className="flex min-h-screen w-full bg-background">
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-sidebar-border bg-sidebar p-5 lg:flex">
        <Brand />
        <NavList />
        <div className="mt-auto"><Disclaimer /></div>
      </aside>

      {open && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button aria-label="Close menu" className="absolute inset-0 bg-foreground/20" onClick={() => setOpen(false)} />
          <aside className="relative flex h-full w-72 flex-col bg-sidebar p-5 shadow-soft">
            <div className="flex items-center justify-between">
              <Brand />
              <button aria-label="Close menu" onClick={() => setOpen(false)} className="rounded-lg p-2 hover:bg-sidebar-accent"><X className="size-4" /></button>
            </div>
            <NavList onNavigate={() => setOpen(false)} />
            <div className="mt-auto"><Disclaimer /></div>
          </aside>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-background/85 px-4 backdrop-blur sm:px-8">
          <button aria-label="Open menu" onClick={() => setOpen(true)} className="rounded-lg p-2 hover:bg-muted lg:hidden"><Menu className="size-5" /></button>
          <h1 className="truncate font-serif text-xl font-semibold">{title}</h1>
          <span className="ml-auto hidden items-center gap-2 rounded-full bg-sage-soft px-3 py-1 text-xs font-medium text-secondary-foreground sm:inline-flex">
            <span className="size-1.5 rounded-full bg-sage" /> AI connected
          </span>
        </header>
        <main className="flex-1 px-4 py-6 sm:px-8 sm:py-8">{children}</main>
      </div>
    </div>
  );
}
