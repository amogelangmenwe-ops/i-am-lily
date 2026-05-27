// Browser SpeechRecognition typing helper
export type SR = any;

export function getSpeechRecognition(): SR | null {
  if (typeof window === "undefined") return null;
  const w = window as any;
  return w.SpeechRecognition || w.webkitSpeechRecognition || null;
}

// Prefer warm, professional **British English female** voices first
// (closest match to a friendly, modern Black British woman on Web Speech API).
// Order matters — first match wins.
const FEMALE_VOICE_PATTERNS: RegExp[] = [
  // British English neural / premium voices
  /Microsoft\s+(Sonia|Libby|Mia|Maisie|Hollie|Abbi|Bella)/i, // Windows / Edge en-GB neural
  /Google\s+UK\s+English\s+Female/i,
  /Serena.*\(Premium\)/i,                   // macOS Serena (en-GB)
  /Serena/i,
  /Kate/i,                                  // macOS en-GB
  /Stephanie/i,                             // macOS en-GB
  /Martha/i,                                // macOS en-GB
  /Daniel.*Female/i,
  // Other British / Commonwealth female voices
  /Moira/i,                                 // Irish English, warm tone
  /Tessa/i,                                 // South African English
  /Fiona/i,                                 // Scottish English
  /Karen/i,                                 // Australian English
  // Premium US fallbacks (still female, warm)
  /Samantha/i,
  /Ava\s*\(Premium\)/i,
  /\bAva\b/i,
  /Allison/i,
  /Victoria/i,
  /Microsoft\s+(Aria|Jenny|Michelle|Emma|Zira)/i,
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
  const enGB = voices.filter((v) => v.lang?.toLowerCase().startsWith("en-gb"));
  const enAny = voices.filter((v) => v.lang?.toLowerCase().startsWith("en"));
  // Try en-GB pool first (proper British accent), then any English voice.
  for (const pool of [enGB, enAny, voices]) {
    if (!pool.length) continue;
    for (const re of FEMALE_VOICE_PATTERNS) {
      const hit = pool.find(
        (v) => re.test(v.name) && !MALE_VOICE_PATTERNS.some((m) => m.test(v.name)),
      );
      if (hit) return hit;
    }
  }
  // Last resort: prefer any en-GB voice not obviously male, else any en voice.
  const safe = (pool: SpeechSynthesisVoice[]) =>
    pool.find((v) => !MALE_VOICE_PATTERNS.some((re) => re.test(v.name)));
  return safe(enGB) || safe(enAny) || enAny[0] || voices[0] || null;
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
  // Warm, friendly British female cadence — slightly slower, slightly brighter pitch.
  u.rate = opts?.rate ?? 0.96;
  u.pitch = opts?.pitch ?? 1.05;
  u.volume = 1;
  if (voice) {
    u.voice = voice;
    u.lang = voice.lang || "en-GB";
  } else {
    u.lang = "en-GB";
  }
  window.speechSynthesis.speak(u);
}

export function stopSpeaking() {
  if (typeof window !== "undefined" && "speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }
}