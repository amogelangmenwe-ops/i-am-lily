export type Salutation = "Ma'am" | "Sir" | "first-name";

export interface Profile {
  name: string;
  salutation: Salutation;
  role: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  ts: number;
}

export interface PlanItem {
  id: string;
  time: string;
  task: string;
  done: boolean;
}

const PROFILE_KEY = "ava.profile";
const PLAN_KEY = "ava.plan";

export const defaultProfile: Profile = {
  name: "",
  salutation: "Ma'am",
  role: "Executive",
};

export function loadProfile(): Profile {
  if (typeof window === "undefined") return defaultProfile;
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    return raw ? { ...defaultProfile, ...JSON.parse(raw) } : defaultProfile;
  } catch {
    return defaultProfile;
  }
}

export function saveProfile(p: Profile) {
  localStorage.setItem(PROFILE_KEY, JSON.stringify(p));
}

export function loadPlan(): PlanItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(PLAN_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function savePlan(items: PlanItem[]) {
  localStorage.setItem(PLAN_KEY, JSON.stringify(items));
}

export function addressFor(p: Profile): string {
  if (p.salutation === "first-name" && p.name) return p.name.split(" ")[0];
  return p.salutation === "Sir" ? "Sir" : "Ma'am";
}

export function timeOfDayGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

// Rotating daily quotes for Lilly's greeting. One per day-of-year, with a
// small offset so users see a fresh one even if they revisit.
const DAILY_QUOTES: string[] = [
  "As much as your morning didn't start perfectly, you still have the power to change how the day ends. ✨",
  "Small progress is still progress 🌱",
  "One task at a time — you're doing better than you think.",
  "Your future self will thank you for starting today ✨",
  "Coffee first… productivity second ☕😂",
  "Even the busiest days can be organised one step at a time.",
  "A calm plan creates a better day.",
  "You survived 100% of your stressful meetings so far 😌",
  "Tiny wins count too 🎉",
  "Don't worry about perfect — focus on progress.",
  "Your schedule doesn't control you… Lilly helps with that 😄",
  "Deep breath. We've got today, together. 💛",
  "Done is better than perfect — let's ship it.",
  "Today is a fresh page. Let's write something good. 📖",
];

export function dailyQuote(): string {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now.getTime() - start.getTime();
  const dayOfYear = Math.floor(diff / 86_400_000);
  return DAILY_QUOTES[dayOfYear % DAILY_QUOTES.length];
}

export function uid(): string {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
export const CHAT_URL = `${SUPABASE_URL}/functions/v1/chat`;
export const CHAT_AUTH = `Bearer ${SUPABASE_KEY}`;

export async function streamChat({
  messages,
  profile,
  onDelta,
  onDone,
  onError,
  signal,
}: {
  messages: { role: "user" | "assistant"; content: string }[];
  profile: Profile;
  onDelta: (chunk: string) => void;
  onDone: () => void;
  onError: (msg: string) => void;
  signal?: AbortSignal;
}) {
  try {
    const resp = await fetch(CHAT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: CHAT_AUTH,
      },
      body: JSON.stringify({ messages, profile }),
      signal,
    });

    if (!resp.ok || !resp.body) {
      const errBody = await resp.text().catch(() => "");
      let msg = "Something went wrong.";
      if (resp.status === 429) msg = "Rate limit reached. Please pause a moment and try again.";
      else if (resp.status === 402) msg = "AI credits exhausted. Add credits in Lovable workspace settings.";
      else if (errBody) {
        try { msg = JSON.parse(errBody).error || msg; } catch {}
      }
      onError(msg);
      return;
    }

    const reader = resp.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";
    let done = false;

    while (!done) {
      const { done: d, value } = await reader.read();
      if (d) break;
      buffer += decoder.decode(value, { stream: true });
      let nl: number;
      while ((nl = buffer.indexOf("\n")) !== -1) {
        let line = buffer.slice(0, nl);
        buffer = buffer.slice(nl + 1);
        if (line.endsWith("\r")) line = line.slice(0, -1);
        if (!line || line.startsWith(":")) continue;
        if (!line.startsWith("data: ")) continue;
        const json = line.slice(6).trim();
        if (json === "[DONE]") { done = true; break; }
        try {
          const parsed = JSON.parse(json);
          const c = parsed.choices?.[0]?.delta?.content;
          if (c) onDelta(c);
        } catch {
          buffer = line + "\n" + buffer;
          break;
        }
      }
    }
    onDone();
  } catch (e) {
    if ((e as Error).name === "AbortError") { onDone(); return; }
    onError(e instanceof Error ? e.message : "Network error");
  }
}