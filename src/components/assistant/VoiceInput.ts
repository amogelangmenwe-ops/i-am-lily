// Browser SpeechRecognition typing helper
export type SR = any;

export function getSpeechRecognition(): SR | null {
  if (typeof window === "undefined") return null;
  const w = window as any;
  return w.SpeechRecognition || w.webkitSpeechRecognition || null;
}

export function speak(text: string, opts?: { rate?: number; pitch?: number }) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  // Strip markdown/code fences for cleaner speech
  const clean = text
    .replace(/```[\s\S]*?```/g, " (code block omitted) ")
    .replace(/[#*_`>]/g, "")
    .replace(/\n+/g, ". ")
    .trim();
  if (!clean) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(clean);
  u.rate = opts?.rate ?? 1.02;
  u.pitch = opts?.pitch ?? 1.0;
  const voices = window.speechSynthesis.getVoices();
  const preferred = voices.find((v) =>
    /female|samantha|victoria|karen|serena|google uk english female/i.test(v.name),
  ) || voices.find((v) => v.lang?.startsWith("en"));
  if (preferred) u.voice = preferred;
  window.speechSynthesis.speak(u);
}

export function stopSpeaking() {
  if (typeof window !== "undefined" && "speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }
}