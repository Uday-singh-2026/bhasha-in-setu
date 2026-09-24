// On-device usage tracker. Everything stays in localStorage so the whole
// progress system keeps working with zero connectivity.

export type ProgressKind = "translate" | "live" | "worksheet" | "photo";

export type ProgressEvent = {
  ts: number;
  kind: ProgressKind;
  lang: string;
  words: number;
  ms?: number;
};

const KEY = "palash.progress";
const MAX_EVENTS = 600;

export function recordEvent(e: Omit<ProgressEvent, "ts">) {
  if (typeof window === "undefined") return;
  try {
    const events = getEvents();
    events.push({ ...e, ts: Date.now() });
    window.localStorage.setItem(KEY, JSON.stringify(events.slice(-MAX_EVENTS)));
  } catch {
    /* storage full or unavailable — never break the teaching flow */
  }
}

export function getEvents(): ProgressEvent[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as ProgressEvent[]) : [];
  } catch {
    return [];
  }
}

export function clearEvents() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(KEY);
}

export type DayBucket = { label: string; count: number };

export function getStats(events: ProgressEvent[]) {
  const byKind = { translate: 0, live: 0, worksheet: 0, photo: 0 } as Record<ProgressKind, number>;
  const byLang: Record<string, number> = {};
  let words = 0;
  const latencies: number[] = [];

  for (const e of events) {
    byKind[e.kind] = (byKind[e.kind] ?? 0) + 1;
    byLang[e.lang] = (byLang[e.lang] ?? 0) + 1;
    words += e.words;
    if (typeof e.ms === "number") latencies.push(e.ms);
  }

  const days: DayBucket[] = [];
  const now = new Date();
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i);
    const next = new Date(d.getTime() + 86400000);
    const count = events.filter((e) => e.ts >= d.getTime() && e.ts < next.getTime()).length;
    days.push({ label: d.toLocaleDateString("en-IN", { weekday: "short" }), count });
  }

  return {
    total: events.length,
    byKind,
    byLang,
    words,
    avgLatency: latencies.length
      ? Math.round(latencies.reduce((a, b) => a + b, 0) / latencies.length)
      : 0,
    days,
  };
}
