import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { PlanPanel } from "@/components/assistant/PlanPanel";
import { PageHeader, PageShell, ResponsibleAINotice } from "@/components/layout/PageHeader";
import {
  Mail,
  CalendarDays,
  Bell,
  TrendingUp,
  MessageSquare,
  Sparkles,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Ava — AI Workplace Assistant" },
      {
        name: "description",
        content:
          "Ava is an executive-grade AI assistant: draft emails, plan your day, summarize, and stay on top of work — by voice or text.",
      },
      { property: "og:title", content: "Ava — AI Workplace Assistant" },
      {
        property: "og:description",
        content:
          "Draft emails, plan your day, and stay on top of work with a voice-enabled AI executive assistant.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <PageShell>
      <PageHeader
        title="Good day."
        subtitle="Here's your workplace at a glance."
        actions={
          <Link
            to="/chat"
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground rounded-xl px-4 py-2.5 text-sm font-medium shadow-soft hover:opacity-90 transition"
          >
            <Sparkles className="w-4 h-4" /> Ask Ava
          </Link>
        }
      />

      {/* Stats */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {[
          { label: "Unread emails", value: 12, icon: Mail, hint: "3 priority" },
          { label: "Meetings today", value: 4, icon: CalendarDays, hint: "Next at 11:00" },
          { label: "Open tasks", value: 7, icon: CheckCircle2, hint: "2 due today" },
          { label: "Focus score", value: "82%", icon: TrendingUp, hint: "+6% vs yday" },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl bg-card border border-border shadow-soft p-4">
            <div className="flex items-center justify-between">
              <s.icon className="w-4 h-4 text-primary" />
              <span className="text-[11px] text-muted-foreground">{s.hint}</span>
            </div>
            <div className="mt-3 text-2xl font-semibold tracking-tight">{s.value}</div>
            <div className="text-xs text-muted-foreground">{s.label}</div>
          </div>
        ))}
      </section>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Daily overview */}
        <div className="lg:col-span-2 rounded-2xl bg-card border border-border shadow-soft p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-medium tracking-tight">Daily overview</h2>
            <Link to="/schedule" className="text-xs text-primary hover:underline inline-flex items-center gap-1">
              Schedule <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <ul className="space-y-3">
            {[
              { time: "09:00", title: "Review inbox & priorities", tag: "Focus" },
              { time: "11:00", title: "Product sync with design team", tag: "Meeting" },
              { time: "13:00", title: "Lunch + short walk", tag: "Break" },
              { time: "15:00", title: "Deep work — proposal draft", tag: "Focus" },
              { time: "17:00", title: "Daily wrap-up & follow-ups", tag: "Wrap" },
            ].map((it) => (
              <li
                key={it.time}
                className="flex items-center gap-4 rounded-xl px-3 py-2.5 bg-background/50 border border-border"
              >
                <span className="text-xs font-mono text-muted-foreground tabular-nums w-12">{it.time}</span>
                <span className="text-sm flex-1">{it.title}</span>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-secondary text-foreground/80">{it.tag}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Email summary */}
        <div className="rounded-2xl bg-card border border-border shadow-soft p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-medium tracking-tight flex items-center gap-2">
              <Mail className="w-4 h-4 text-primary" /> Email summary
            </h2>
            <Link to="/emails" className="text-xs text-primary hover:underline">Open</Link>
          </div>
          <ul className="space-y-3">
            {[
              { from: "Sarah (Client)", subj: "Re: Proposal review", time: "9:14 AM", urgent: true },
              { from: "Alex (Manager)", subj: "Q4 planning notes", time: "8:42 AM" },
              { from: "HR", subj: "Policy update — Nov", time: "Yesterday" },
            ].map((e, i) => (
              <li key={i} className="rounded-xl border border-border bg-background/50 p-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{e.from}</span>
                  <span className="text-[11px] text-muted-foreground">{e.time}</span>
                </div>
                <div className="text-sm text-muted-foreground truncate">{e.subj}</div>
                {e.urgent && (
                  <span className="inline-block mt-1.5 text-[10px] uppercase tracking-wider text-destructive">
                    Needs reply
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* Task planner */}
        <div className="lg:col-span-2 min-h-[420px]">
          <PlanPanel />
        </div>

        {/* Reminders + insights */}
        <div className="space-y-5">
          <div className="rounded-2xl bg-card border border-border shadow-soft p-5">
            <h2 className="font-medium tracking-tight flex items-center gap-2 mb-3">
              <Bell className="w-4 h-4 text-primary" /> Reminders
            </h2>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-primary mt-2" /> Send follow-up to Sarah by 2 PM</li>
              <li className="flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-primary mt-2" /> Prep slides for Thursday review</li>
              <li className="flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-primary mt-2" /> Submit expense report</li>
            </ul>
          </div>
          <div className="rounded-2xl bg-card border border-border shadow-soft p-5">
            <h2 className="font-medium tracking-tight flex items-center gap-2 mb-3">
              <TrendingUp className="w-4 h-4 text-primary" /> Productivity insights
            </h2>
            <p className="text-sm text-muted-foreground">
              You've completed <strong className="text-foreground">68%</strong> of planned tasks this week.
              Mornings are your most productive window — Ava suggests blocking
              9–11 AM for deep work.
            </p>
          </div>
        </div>
      </div>

      {/* AI assistant CTA */}
      <Link
        to="/chat"
        className="mt-6 block rounded-2xl border border-border bg-card shadow-soft p-5 hover:shadow-glow transition"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <h3 className="font-medium tracking-tight">Chat with Ava</h3>
            <p className="text-sm text-muted-foreground">
              Draft an email, plan your day, or summarize a document — by text or voice.
            </p>
          </div>
          <ArrowRight className="w-4 h-4 text-muted-foreground" />
        </div>
      </Link>

      <div className="mt-6">
        <ResponsibleAINotice />
      </div>
    </PageShell>
  );
}