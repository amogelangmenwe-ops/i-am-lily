import { useEffect, useMemo, useRef, useState } from "react";
import { Mic, MicOff, Send, Sparkles, Mail, CalendarClock, FileText, Settings, Square } from "lucide-react";
import {
  loadProfile,
  uid,
  streamChat,
  addressFor,
  timeOfDayGreeting,
  type ChatMessage,
  type Profile,
} from "@/lib/assistant";
import { MessageBubble } from "./MessageBubble";
import { getSpeechRecognition, speak, stopSpeaking } from "./VoiceInput";
import { ProfileDialog } from "./ProfileDialog";

const QUICK_PROMPTS = [
  { icon: Mail, label: "Draft an email", prompt: "Help me draft a professional email. Ask me who the recipient is, the relationship (client / manager / team), the purpose, and the tone you should use." },
  { icon: CalendarClock, label: "Plan my day", prompt: "Build a balanced plan for my workday with time blocks (9am–5pm). Ask me about my top 3 priorities and any meetings, then produce a clean numbered schedule." },
  { icon: FileText, label: "Summarize text", prompt: "I'll paste some text and you'll summarize it crisply in 3–5 bullets with any action items called out." },
  { icon: Sparkles, label: "Follow-up message", prompt: "Help me write a polite follow-up message. Ask who it's to, what we discussed last, and how firm the nudge should be." },
];

export function AssistantChat() {
  const [profile, setProfile] = useState<Profile>(() => loadProfile());
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [listening, setListening] = useState(false);
  const [voiceReply, setVoiceReply] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const recogRef = useRef<any>(null);
  const finalTranscriptRef = useRef<string>("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const greeting = useMemo(() => {
    const addr = addressFor(profile);
    return `${timeOfDayGreeting()}, ${addr}. I'm Ava, your workplace assistant. How can I help you today — draft an email, plan your day, summarize something, or prepare for a meeting?`;
  }, [profile]);

  useEffect(() => {
    setMessages([{ id: uid(), role: "assistant", content: greeting, ts: Date.now() }]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  async function send(prompt?: string) {
    const text = (prompt ?? input).trim();
    if (!text || streaming) return;
    setInput("");

    const userMsg: ChatMessage = { id: uid(), role: "user", content: text, ts: Date.now() };
    const assistantMsg: ChatMessage = { id: uid(), role: "assistant", content: "", ts: Date.now() };
    setMessages((prev) => [...prev, userMsg, assistantMsg]);
    setStreaming(true);

    const ctrl = new AbortController();
    abortRef.current = ctrl;

    const history = [...messages, userMsg].map((m) => ({ role: m.role, content: m.content }));
    let acc = "";

    await streamChat({
      messages: history,
      profile,
      signal: ctrl.signal,
      onDelta: (c) => {
        acc += c;
        setMessages((prev) => prev.map((m) => (m.id === assistantMsg.id ? { ...m, content: acc } : m)));
      },
      onDone: () => {
        setStreaming(false);
        if (voiceReply && acc) speak(acc);
      },
      onError: (err) => {
        setStreaming(false);
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantMsg.id ? { ...m, content: `⚠️ ${err}` } : m,
          ),
        );
      },
    });
  }

  function stop() {
    abortRef.current?.abort();
    stopSpeaking();
    setStreaming(false);
  }

  function toggleListening() {
    const SR = getSpeechRecognition();
    if (!SR) {
      alert("Voice input isn't supported in this browser. Try Chrome or Edge.");
      return;
    }
    if (listening) {
      recogRef.current?.stop();
      return;
    }
    const r = new SR();
    r.lang = "en-US";
    r.interimResults = true;
    r.continuous = false;
    finalTranscriptRef.current = "";
    r.onresult = (e: any) => {
      let txt = "";
      for (let i = e.resultIndex; i < e.results.length; i++) txt += e.results[i][0].transcript;
      finalTranscriptRef.current = txt;
      setInput(txt);
    };
    r.onend = () => {
      setListening(false);
      const captured = finalTranscriptRef.current.trim();
      finalTranscriptRef.current = "";
      if (captured) send(captured);
    };
    r.onerror = () => setListening(false);
    recogRef.current = r;
    setListening(true);
    r.start();
  }

  return (
    <div className="flex flex-col h-full min-h-0 bg-card rounded-2xl border border-border shadow-soft overflow-hidden">
      {/* Header */}
      <header className="shrink-0 flex items-center gap-3 px-4 sm:px-5 py-3 sm:py-4 border-b border-border bg-gradient-hero">
        <div className="w-9 h-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-medium tracking-tight">
          A
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="text-base font-medium tracking-tight leading-tight">Ava</h1>
          <p className="text-xs text-muted-foreground">Your workplace assistant · {streaming ? "thinking…" : "online"}</p>
        </div>
        <button
          onClick={() => setVoiceReply((v) => !v)}
          className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
            voiceReply ? "bg-primary text-primary-foreground border-primary" : "bg-background border-border text-muted-foreground hover:text-foreground"
          }`}
          title="Speak responses aloud"
        >
          {voiceReply ? "Voice on" : "Voice off"}
        </button>
        <button
          onClick={() => setShowProfile(true)}
          className="text-muted-foreground hover:text-foreground p-2"
          aria-label="Profile"
        >
          <Settings className="w-4 h-4" />
        </button>
      </header>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 min-h-0 overflow-y-auto overscroll-contain px-4 sm:px-5 py-4 sm:py-6 space-y-4">
        {messages.map((m) => (
          <MessageBubble key={m.id} msg={m} />
        ))}
      </div>

      {/* Quick actions */}
      {messages.length <= 1 && (
        <div className="shrink-0 px-4 sm:px-5 pb-3 grid grid-cols-2 sm:grid-cols-4 gap-2">
          {QUICK_PROMPTS.map((q) => (
            <button
              key={q.label}
              onClick={() => send(q.prompt)}
              disabled={streaming}
              className="flex items-center gap-2 text-left text-sm rounded-xl border border-border bg-background hover:bg-secondary hover:border-primary/40 transition-all px-3 py-2.5 disabled:opacity-50"
            >
              <q.icon className="w-4 h-4 text-primary shrink-0" />
              <span className="truncate">{q.label}</span>
            </button>
          ))}
        </div>
      )}

      {/* Composer */}
      <div className="shrink-0 border-t border-border p-3 bg-background/60 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        <div className="flex items-end gap-2 bg-card rounded-2xl border border-border p-2 focus-within:ring-2 focus-within:ring-ring transition-all">
          <button
            onClick={toggleListening}
            className={`shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
              listening
                ? "bg-destructive text-destructive-foreground animate-pulse-mic"
                : "bg-secondary text-foreground hover:bg-accent"
            }`}
            aria-label={listening ? "Stop recording" : "Start voice input"}
          >
            {listening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </button>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                send();
              }
            }}
            placeholder={listening ? "Listening…" : "Message Ava — try ‘Draft a follow-up to John about the proposal’"}
            rows={1}
            className="flex-1 bg-transparent resize-none outline-none text-[15px] py-2 px-2 max-h-40"
          />
          {streaming ? (
            <button
              onClick={stop}
              className="shrink-0 w-10 h-10 rounded-xl bg-secondary text-foreground hover:bg-accent flex items-center justify-center"
              aria-label="Stop"
            >
              <Square className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={() => send()}
              disabled={!input.trim()}
              className="shrink-0 w-10 h-10 rounded-xl bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-40 flex items-center justify-center transition-opacity"
              aria-label="Send"
            >
              <Send className="w-4 h-4" />
            </button>
          )}
        </div>
        <p className="text-[11px] text-muted-foreground mt-2 px-2">
          Tip: ask for tones like “rewrite this in an executive tone”. Press Enter to send, Shift+Enter for a new line.
        </p>
      </div>

      {showProfile && (
        <ProfileDialog
          initial={profile}
          onClose={() => setShowProfile(false)}
          onSaved={(p) => {
            setProfile(p);
            setMessages((prev) => [
              ...prev,
              {
                id: uid(),
                role: "assistant",
                content: `Noted, ${addressFor(p)}. I'll address you accordingly from now on.`,
                ts: Date.now(),
              },
            ]);
          }}
        />
      )}
    </div>
  );
}