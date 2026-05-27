import { createFileRoute } from "@tanstack/react-router";
import { PlanPanel } from "@/components/assistant/PlanPanel";
import { PageHeader, PageShell, ResponsibleAINotice } from "@/components/layout/PageHeader";

export const Route = createFileRoute("/tasks")({
  head: () => ({
    meta: [{ title: "Task Planner — Ava" }],
  }),
  component: TasksPage,
});

function TasksPage() {
  return (
    <PageShell>
      <PageHeader title="Task Planner" subtitle="Organize your day in focused blocks." />
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-5">
        <div className="min-h-[520px]">
          <PlanPanel />
        </div>
        <aside className="space-y-4">
          <div className="rounded-2xl bg-card border border-border shadow-soft p-5">
            <h3 className="font-medium tracking-tight mb-2">Ava's suggestion</h3>
            <p className="text-sm text-muted-foreground">
              Group similar tasks together and protect a 90-minute deep-work block in the morning.
            </p>
          </div>
          <ResponsibleAINotice />
        </aside>
      </div>
    </PageShell>
  );
}