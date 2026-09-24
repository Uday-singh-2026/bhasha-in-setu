/** Browser speech helpers. All on-device — no network calls. */

export function speak(text: string, locale = "hi-IN", rate = 0.85) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return false;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = locale;
  u.rate = rate;
  u.pitch = 1;
  window.speechSynthesis.speak(u);
  return true;
}

export function stopSpeaking() {
  if (typeof window !== "undefined" && "speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }
}

type SR = {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  start: () => void;
  stop: () => void;
  onresult: ((e: any) => void) | null;
  onerror: ((e: any) => void) | null;
  onend: (() => void) | null;
};

export function getRecognizer(lang = "hi-IN"): SR | null {
  if (typeof window === "undefined") return null;
  const Ctor =
    (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
  if (!Ctor) return null;
  const r: SR = new Ctor();
  r.lang = lang;
  r.continuous = false;
  r.interimResults = true;
  return r;
}

export const speechSupported = () =>
  typeof window !== "undefined" &&
  !!((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition);
