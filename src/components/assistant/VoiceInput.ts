// Browser SpeechRecognition typing helper
export type SR = any;

export function getSpeechRecognition(): SR | null {
  if (typeof window === "undefined") return null;
  const w = window as any;
  return w.SpeechRecognition || w.webkitSpeechRecognition || null;
}

// Prefer warm, professional female voices across platforms.
// Order matters — first match wins.
const FEMALE_VOICE_PATTERNS: RegExp[] = [
  /Samantha/i,                        // macOS / iOS — warm, natural
  /Ava\s*\(Premium\)/i,               // macOS Ava premium
  /\bAva\b/i,
  /Allison/i,
  /Serena/i,
  /Victoria/i,
  /Karen/i,
  /Moira/i,
  /Tessa/i,
  /Fiona/i,
  /Susan/i,
  /Microsoft\s+(Aria|Jenny|Michelle|Sonia|Libby|Emma|Zira)/i, // Windows / Edge neural
  /Google\s+UK\s+English\s+Female/i,
  /Google\s+US\s+English\b(?!.*Male)/i,
  /female/i,
];

// Names that are clearly masculine — never use even if "en" fallback matches.
const MALE_VOICE_PATTERNS: RegExp[] = [
  /\b(male|man)\b/i,
  /Daniel|Alex|Fred|Oliver|Aaron|Tom|Albert|Bruce|Ralph|Junior|Lee|Diego|Jorge|Rishi|Reed|Eddy/i,
  /Microsoft\s+(David|Mark|Guy|Ryan|Brandon)/i,
];

function pickFemaleVoice(): SpeechSynthesisVoice | null {
  const voices = window.speechSynthesis.getVoices();
  if (!voices.length) return null;
  const en = voices.filter((v) => v.lang?.toLowerCase().startsWith("en"));
  const pool = en.length ? en : voices;
  for (const re of FEMALE_VOICE_PATTERNS) {
    const hit = pool.find((v) => re.test(v.name));
    if (hit) return hit;
  }
  // Last resort: any en voice that isn't obviously male.
  return pool.find((v) => !MALE_VOICE_PATTERNS.some((re) => re.test(v.name))) || pool[0] || null;
}

let cachedVoice: SpeechSynthesisVoice | null = null;

function ensureVoiceReady(): Promise<SpeechSynthesisVoice | null> {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) {
    return Promise.resolve(null);
  }
  if (cachedVoice) return Promise.resolve(cachedVoice);
  const synth = window.speechSynthesis;
  const immediate = pickFemaleVoice();
  if (immediate) {
    cachedVoice = immediate;
    return Promise.resolve(immediate);
  }
  // Voices load async on Chrome / some browsers.
  return new Promise((resolve) => {
    const timeout = window.setTimeout(() => {
      cachedVoice = pickFemaleVoice();
      resolve(cachedVoice);
    }, 600);
    synth.addEventListener(
      "voiceschanged",
      () => {
        window.clearTimeout(timeout);
        cachedVoice = pickFemaleVoice();
        resolve(cachedVoice);
      },
      { once: true },
    );
  });
}

// Warm cache as soon as the module loads in the browser.
if (typeof window !== "undefined" && "speechSynthesis" in window) {
  void ensureVoiceReady();
}

export async function speak(text: string, opts?: { rate?: number; pitch?: number }) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  // Strip markdown/code fences for cleaner speech
  const clean = text
    .replace(/```[\s\S]*?```/g, " (code block omitted) ")
    .replace(/[#*_`>]/g, "")
    .replace(/\n+/g, ". ")
    .trim();
  if (!clean) return;
  const voice = await ensureVoiceReady();
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(clean);
  // Calm, warm, professional female cadence
  u.rate = opts?.rate ?? 0.98;
  u.pitch = opts?.pitch ?? 1.08;
  u.volume = 1;
  if (voice) {
    u.voice = voice;
    u.lang = voice.lang || "en-US";
  } else {
    u.lang = "en-US";
  }
  window.speechSynthesis.speak(u);
}

export function stopSpeaking() {
  if (typeof window !== "undefined" && "speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }
}