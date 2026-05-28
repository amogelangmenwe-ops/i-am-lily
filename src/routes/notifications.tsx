import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, PageShell, ResponsibleAINotice } from "@/components/layout/PageHeader";
import { Bell, Mail, CalendarDays, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/notifications")({
  head: () => ({ meta: [{ title: "Notifications — Lilly" }] }),
  component: NotificationsPage,
});

const ITEMS = [
  { icon: Mail, text: "Sarah replied to your proposal email.", time: "5m ago" },
  { icon: CalendarDays, text: "Reminder: Product sync at 11:00.", time: "30m ago" },
  { icon: CheckCircle2, text: "Lilly drafted 2 follow-up emails for review.", time: "1h ago" },
  { icon: Bell, text: "Weekly report ready to share.", time: "Yesterday" },
];

function NotificationsPage() {
  return (
    <PageShell>
      <PageHeader title="Notifications" subtitle="Smart, quiet — only what matters." />
      <div className="rounded-2xl bg-card border border-border shadow-soft divide-y divide-border overflow-hidden">
        {ITEMS.map((n, i) => (
          <div key={i} className="flex items-center gap-3 px-5 py-4">
            <div className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center text-primary">
              <n.icon className="w-4 h-4" />
            </div>
            <p className="text-sm flex-1">{n.text}</p>
            <span className="text-[11px] text-muted-foreground">{n.time}</span>
          </div>
        ))}
      </div>
      <div className="mt-5">
        <ResponsibleAINotice />
      </div>
    </PageShell>
  );
}