import { createFileRoute } from "@tanstack/react-router";
import { Fragment } from "react";
import { PageHeader, PageShell, ResponsibleAINotice } from "@/components/layout/PageHeader";

export const Route = createFileRoute("/schedule")({
  head: () => ({ meta: [{ title: "Schedule — Ava" }] }),
  component: SchedulePage,
});

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri"];
const HOURS = ["9", "10", "11", "12", "13", "14", "15", "16", "17"];
const EVENTS: Record<string, { hour: string; title: string; tag: string }[]> = {
  Mon: [{ hour: "10", title: "Standup", tag: "Meeting" }, { hour: "14", title: "Deep work", tag: "Focus" }],
  Tue: [{ hour: "11", title: "Client call", tag: "Meeting" }],
  Wed: [{ hour: "9", title: "Planning", tag: "Focus" }, { hour: "15", title: "1:1 with Alex", tag: "Meeting" }],
  Thu: [{ hour: "13", title: "Review session", tag: "Meeting" }],
  Fri: [{ hour: "16", title: "Weekly wrap", tag: "Wrap" }],
};

function SchedulePage() {
  return (
    <PageShell>
      <PageHeader title="Schedule" subtitle="Your week, balanced for focus and meetings." />
      <div className="rounded-2xl bg-card border border-border shadow-soft p-4 overflow-x-auto">
        <div className="grid grid-cols-[60px_repeat(5,minmax(120px,1fr))] gap-2 min-w-[680px]">
          <div />
          {DAYS.map((d) => (
            <div key={d} className="text-xs font-medium text-center text-muted-foreground py-2">{d}</div>
          ))}
          {HOURS.map((h) => (
            <Fragment key={h}>
              <div className="text-[11px] text-muted-foreground text-right pr-2 py-3 font-mono">{h}:00</div>
              {DAYS.map((d) => {
                const ev = EVENTS[d]?.find((e) => e.hour === h);
                return (
                  <div key={`${d}-${h}`} className="min-h-[48px] rounded-lg bg-background/50 border border-border p-1.5">
                    {ev && (
                      <div className="rounded-md bg-primary text-primary-foreground px-2 py-1 text-[11px]">
                        <div className="font-medium truncate">{ev.title}</div>
                        <div className="opacity-75">{ev.tag}</div>
                      </div>
                    )}
                  </div>
                );
              })}
            </Fragment>
          ))}
        </div>
      </div>
      <div className="mt-5">
        <ResponsibleAINotice />
      </div>
    </PageShell>
  );
}