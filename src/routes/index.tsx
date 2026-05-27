import { createFileRoute } from "@tanstack/react-router";
import { AssistantChat } from "@/components/assistant/AssistantChat";
import { PlanPanel } from "@/components/assistant/PlanPanel";

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
    <div className="min-h-screen bg-gradient-hero">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 lg:py-8 h-screen flex flex-col">
        <header className="mb-5 flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground">
              Ava <span className="text-muted-foreground font-normal">— workplace assistant</span>
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Draft. Plan. Summarize. Communicate.
            </p>
          </div>
        </header>
        <main className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6 flex-1 min-h-0">
          <AssistantChat />
          <aside className="hidden lg:block min-h-0">
            <PlanPanel />
          </aside>
        </main>
      </div>
    </div>
  );
}