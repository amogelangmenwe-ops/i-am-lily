import type { ChatMessage } from "@/lib/assistant";
import { Volume2 } from "lucide-react";
import { speak } from "./VoiceInput";

export function MessageBubble({ msg }: { msg: ChatMessage }) {
  const isUser = msg.role === "user";
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} group`}>
      <div
        className={`max-w-[85%] rounded-2xl px-4 py-3 text-[15px] leading-relaxed whitespace-pre-wrap shadow-soft ${
          isUser ? "bg-user rounded-br-md" : "bg-assistant text-foreground rounded-bl-md"
        }`}
      >
        {msg.content || (
          <span className="inline-flex gap-1 items-center text-muted-foreground">
            <span className="w-1.5 h-1.5 rounded-full bg-current animate-dot" style={{ animationDelay: "0s" }} />
            <span className="w-1.5 h-1.5 rounded-full bg-current animate-dot" style={{ animationDelay: "0.15s" }} />
            <span className="w-1.5 h-1.5 rounded-full bg-current animate-dot" style={{ animationDelay: "0.3s" }} />
          </span>
        )}
        {!isUser && msg.content && (
          <button
            onClick={() => speak(msg.content)}
            className="mt-2 inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors opacity-0 group-hover:opacity-100"
            aria-label="Read aloud"
          >
            <Volume2 className="w-3.5 h-3.5" /> Read aloud
          </button>
        )}
      </div>
    </div>
  );
}