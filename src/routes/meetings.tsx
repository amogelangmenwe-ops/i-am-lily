import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, PageShell, ResponsibleAINotice } from "@/components/layout/PageHeader";
import { Users, Clock } from "lucide-react";

export const Route = createFileRoute("/meetings")({
  head: () => ({ meta: [{ title: "Meetings — Lilly" }] }),
  component: MeetingsPage,
});

const MEETINGS = [
  { title: "Product sync", time: "11:00 – 11:30", attendees: ["You", "Design", "Eng"], notes: "Discuss Q4 roadmap blockers." },
  { title: "1:1 with Alex", time: "15:00 – 15:30", attendees: ["You", "Alex"], notes: "Career check-in." },
  { title: "Client review — Sarah", time: "Tomorrow 10:00", attendees: ["You", "Sarah"], notes: "Walk through proposal v2." },
];

function MeetingsPage() {
  return (
    <PageShell>
      <PageHeader title="Meetings" subtitle="Prep notes and summaries — handled by Lilly." />
      <div className="grid gap-4">
        {MEETINGS.map((m, i) => (
          <div key={i} className="rounded-2xl bg-card border border-border shadow-soft p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="font-medium tracking-tight">{m.title}</h3>
                <p className="text-xs text-muted-foreground mt-1 inline-flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {m.time}
                </p>
              </div>
              <div className="text-xs text-muted-foreground inline-flex items-center gap-1">
                <Users className="w-3 h-3" /> {m.attendees.length}
              </div>
            </div>
            <p className="text-sm text-muted-foreground mt-3">{m.notes}</p>
            <div className="mt-3 flex gap-2">
              <button className="text-xs bg-secondary hover:bg-accent rounded-lg px-3 py-1.5">Summarize</button>
              <button className="text-xs bg-primary text-primary-foreground rounded-lg px-3 py-1.5 hover:opacity-90">Prep agenda</button>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-5">
        <ResponsibleAINotice />
      </div>
    </PageShell>
  );
}