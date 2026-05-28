import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader, PageShell, ResponsibleAINotice } from "@/components/layout/PageHeader";
import { Mail, Sparkles } from "lucide-react";

export const Route = createFileRoute("/emails")({
  head: () => ({ meta: [{ title: "Emails — Lilly" }] }),
  component: EmailsPage,
});

const EMAILS = [
  { from: "Sarah (Client)", subj: "Re: Proposal review", preview: "Thanks for sending the deck — a few thoughts inline…", time: "9:14 AM", urgent: true },
  { from: "Alex (Manager)", subj: "Q4 planning notes", preview: "Sharing the rough draft for tomorrow's session.", time: "8:42 AM" },
  { from: "HR", subj: "Policy update — November", preview: "Please review the updated leave policy and acknowledge.", time: "Yesterday" },
  { from: "Vendor Support", subj: "Invoice #20381", preview: "Your invoice is ready for review.", time: "Mon" },
];

function EmailsPage() {
  return (
    <PageShell>
      <PageHeader
        title="Emails"
        subtitle="Lilly can draft replies, summarize threads, and follow-up for you."
        actions={
          <Link to="/chat" className="inline-flex items-center gap-2 bg-primary text-primary-foreground rounded-xl px-4 py-2 text-sm font-medium hover:opacity-90">
            <Sparkles className="w-4 h-4" /> Draft with Lilly
          </Link>
        }
      />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 rounded-2xl bg-card border border-border shadow-soft divide-y divide-border overflow-hidden">
          {EMAILS.map((e, i) => (
            <div key={i} className="p-4 hover:bg-secondary/60 transition-colors">
              <div className="flex items-center justify-between mb-1">
                <span className="font-medium text-sm">{e.from}</span>
                <span className="text-[11px] text-muted-foreground">{e.time}</span>
              </div>
              <div className="text-sm">{e.subj}</div>
              <div className="text-xs text-muted-foreground truncate">{e.preview}</div>
              {e.urgent && (
                <span className="inline-block mt-2 text-[10px] uppercase tracking-wider text-destructive">Needs reply</span>
              )}
            </div>
          ))}
        </div>
        <aside className="space-y-4">
          <div className="rounded-2xl bg-card border border-border shadow-soft p-5">
            <h3 className="font-medium tracking-tight mb-3 flex items-center gap-2">
              <Mail className="w-4 h-4 text-primary" /> Inbox summary
            </h3>
            <ul className="text-sm space-y-2 text-muted-foreground">
              <li>• 3 emails need your reply today</li>
              <li>• 2 long threads to skim</li>
              <li>• 1 invoice awaiting review</li>
            </ul>
          </div>
          <ResponsibleAINotice />
        </aside>
      </div>
    </PageShell>
  );
}