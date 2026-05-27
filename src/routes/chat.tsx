import { createFileRoute } from "@tanstack/react-router";
import { AssistantChat } from "@/components/assistant/AssistantChat";
import { PageHeader, PageShell, ResponsibleAINotice } from "@/components/layout/PageHeader";

export const Route = createFileRoute("/chat")({
  head: () => ({
    meta: [
      { title: "AI Assistant Chat — Ava" },
      { name: "description", content: "Talk to Ava by voice or text to draft emails, plan, and summarize." },
    ],
  }),
  component: ChatPage,
});

function ChatPage() {
  return (
    <PageShell>
      <PageHeader title="AI Assistant" subtitle="Type, dictate, or upload — Ava handles the rest." />
      <div className="h-[calc(100vh-220px)] min-h-[520px]">
        <AssistantChat />
      </div>
      <div className="mt-5">
        <ResponsibleAINotice />
      </div>
    </PageShell>
  );
}