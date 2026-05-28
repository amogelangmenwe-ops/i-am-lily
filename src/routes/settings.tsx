import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, PageShell, ResponsibleAINotice } from "@/components/layout/PageHeader";
import { useState } from "react";

export const Route = createFileRoute("/settings")({
  head: () => ({ meta: [{ title: "Settings — Lilly" }] }),
  component: SettingsPage,
});

function Toggle({ label, hint, defaultOn = true }: { label: string; hint?: string; defaultOn?: boolean }) {
  const [on, setOn] = useState(defaultOn);
  return (
    <div className="flex items-center justify-between py-3 border-b border-border last:border-0">
      <div>
        <div className="text-sm font-medium">{label}</div>
        {hint && <div className="text-xs text-muted-foreground mt-0.5">{hint}</div>}
      </div>
      <button
        onClick={() => setOn((v) => !v)}
        className={`w-10 h-6 rounded-full transition-colors relative ${on ? "bg-primary" : "bg-secondary"}`}
        aria-pressed={on}
      >
        <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-card shadow transition-all ${on ? "left-[18px]" : "left-0.5"}`} />
      </button>
    </div>
  );
}

function SettingsPage() {
  return (
    <PageShell>
      <PageHeader title="Settings" subtitle="Configure Lilly to match your workflow." />
      <div className="grid gap-5 lg:grid-cols-2">
        <div className="rounded-2xl bg-card border border-border shadow-soft p-5">
          <h3 className="font-medium tracking-tight mb-2">Assistant</h3>
          <Toggle label="Voice responses" hint="Read replies aloud after generation." defaultOn={false} />
          <Toggle label="Smart suggestions" hint="Proactive nudges through the day." />
          <Toggle label="Email auto-draft" hint="Draft replies before you open the thread." defaultOn={false} />
        </div>
        <div className="rounded-2xl bg-card border border-border shadow-soft p-5">
          <h3 className="font-medium tracking-tight mb-2">Privacy</h3>
          <Toggle label="Store conversation history" />
          <Toggle label="Use my data to improve responses" defaultOn={false} />
          <Toggle label="Require confirmation before sending" />
        </div>
      </div>
      <div className="mt-5">
        <ResponsibleAINotice />
      </div>
    </PageShell>
  );
}