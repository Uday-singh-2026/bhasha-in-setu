import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Mic, MicOff, Volume2, Trash2, AlertTriangle, Gauge, Radio, Sparkles } from "lucide-react";
import { LangPicker } from "@/components/LangPicker";
import { useLang } from "@/components/LangContext";
import { translate } from "@/lib/translate";
import { recordEvent } from "@/lib/progress";
import { getRecognizer, speak, speechSupported } from "@/lib/speech";
import { EN_PHRASE_TO_HI, getLang, PHRASES } from "@/data/lexicon";
import { Spotlight } from "@/components/ui/spotlight";

export const Route = createFileRoute("/live")({
  head: () => ({
    meta: [
      { title: "Live Classroom Dialogue — 3D Real-time Voice | Bhasha Setu" },
      {
        name: "description",
        content:
          "Speak Hindi and let the class hear Santhali, Ho or Mundari with sub-3-second latency.",
      },
      { property: "og:title", content: "Live Classroom Dialogue — Real-time voice translation" },
      {
        property: "og:description",
        content: "Hindi-speaking teachers run interactive classroom dialogue in the mother tongue.",
      },
    ],
  }),
  component: LivePage,
});

type Turn = {
  id: number;
  hindi: string;
  roman: string;
  native: string;
  ms: number;
  unknown: string[];
};

function LivePage() {
  const { lang } = useLang();
  const meta = getLang(lang);
  const [listening, setListening] = useState(false);
  const [interim, setInterim] = useState("");
  const [turns, setTurns] = useState<Turn[]>([]);
  const [supported, setSupported] = useState(true);
  const [autoSpeak, setAutoSpeak] = useState(true);
  const [inputLang, setInputLang] = useState<"hi-IN" | "en-IN">("hi-IN");
  const recRef = useRef<ReturnType<typeof getRecognizer>>(null);
  const startedAt = useRef(0);
  const langRef = useRef(lang);
  langRef.current = lang;
  const autoRef = useRef(autoSpeak);
  autoRef.current = autoSpeak;

  useEffect(() => {
    setSupported(speechSupported());
  }, []);

  const push = (hindi: string, t0: number) => {
    const out = translate(hindi, langRef.current);
    const ms = Math.max(out.ms, Math.round(performance.now() - t0));
    setTurns((prev) => [
      {
        id: Date.now() + Math.random(),
        hindi,
        roman: out.roman,
        native: out.native,
        ms,
        unknown: out.tokens.filter((t) => !t.known).map((t) => t.source),
      },
      ...prev,
    ]);
    recordEvent({
      kind: "live",
      lang: langRef.current,
      words: hindi.split(/\s+/).filter(Boolean).length,
      ms,
    });
    if (autoRef.current) speak(out.roman, getLang(langRef.current).ttsLocale);
  };

  const start = () => {
    const rec = getRecognizer(inputLang);
    if (!rec) {
      setSupported(false);
      return;
    }
    recRef.current = rec;
    startedAt.current = performance.now();
    rec.onresult = (ev: any) => {
      let final = "";
      let temp = "";
      for (let i = ev.resultIndex; i < ev.results.length; i++) {
        const r = ev.results[i];
        if (r.isFinal) final += r[0].transcript;
        else temp += r[0].transcript;
      }
      setInterim(temp);
      if (final.trim()) {
        push(final.trim(), startedAt.current);
        setInterim("");
        startedAt.current = performance.now();
      }
    };
    rec.onerror = () => setListening(false);
    rec.onend = () => {
      setListening(false);
      setInterim("");
    };
    rec.start();
    setListening(true);
  };

  const stop = () => {
    recRef.current?.stop();
    setListening(false);
  };

  const avg = turns.length ? Math.round(turns.reduce((a, t) => a + t.ms, 0) / turns.length) : 0;

  return (
    <div className="relative mx-auto min-h-screen max-w-5xl px-4 py-10">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <Spotlight className="-top-36 left-20" fill="oklch(0.59 0.16 36)" />
      </div>

      <header className="relative z-10 mb-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-primary">
          <Radio className="size-3.5 animate-pulse" /> 3D Acoustic Classroom Bridge
        </div>
        <h1 className="mt-3 font-display text-4xl font-extrabold sm:text-5xl">Live Classroom Dialogue</h1>
        <p className="mt-2 text-muted-foreground">
          Speak in {inputLang === "hi-IN" ? "Hindi" : "English"} — the tablet synthesizes{" "}
          <strong className="text-foreground">{meta.name} ({meta.nativeName})</strong> audio in real-time.
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <LangPicker />

          <div className="inline-flex overflow-hidden rounded-2xl border border-border/80 bg-card p-1 text-xs font-semibold shadow-sm">
            {(["hi-IN", "en-IN"] as const).map((code) => (
              <button
                key={code}
                onClick={() => setInputLang(code)}
                className={
                  "rounded-xl px-3.5 py-1.5 transition-all " +
                  (inputLang === code
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary")
                }
              >
                Teacher speaks {code === "hi-IN" ? "Hindi" : "English"}
              </button>
            ))}
          </div>

          <label className="inline-flex cursor-pointer items-center gap-2 rounded-2xl border border-border/80 bg-card px-3.5 py-2 text-xs font-semibold shadow-sm">
            <input
              type="checkbox"
              checked={autoSpeak}
              onChange={(e) => setAutoSpeak(e.target.checked)}
              className="size-4 accent-primary"
            />
            Auto-broadcast voice
          </label>
        </div>
      </header>

      {!supported && (
        <div className="relative z-10 mb-6 flex items-start gap-3 rounded-2xl border border-destructive/30 bg-destructive/10 p-4 text-sm backdrop-blur-md">
          <AlertTriangle className="mt-0.5 size-5 shrink-0 text-destructive" />
          <p>
            Browser microphone speech-to-text is not available. You can test live interaction using the sample
            classroom prompts below.
          </p>
        </div>
      )}

      {/* 3D Mic Stage with Concentric Glowing Radar Rings */}
      <div className="relative z-10 overflow-hidden rounded-3xl border border-white/20 bg-gradient-to-b from-card/90 via-card/70 to-card/50 p-8 shadow-2xl backdrop-blur-2xl">
        <div className="sohrai-band h-1.5 -mx-8 -mt-8 mb-8" />

        <div className="relative flex flex-col items-center justify-center py-6">
          {/* Concentric 3D Acoustic Rings */}
          <div className="relative flex items-center justify-center">
            {listening && (
              <>
                <div className="absolute size-56 animate-ping rounded-full border border-primary/30 bg-primary/5" />
                <div className="absolute size-44 animate-pulse rounded-full border border-primary/40 bg-primary/10" />
                <div className="absolute size-36 rounded-full border border-accent/40" />
              </>
            )}

            <button
              onClick={listening ? stop : start}
              className={
                "relative z-20 flex size-32 items-center justify-center rounded-3xl text-white shadow-2xl transition-all duration-300 active:scale-95 " +
                (listening
                  ? "bg-destructive shadow-[0_0_40px_rgba(239,68,68,0.5)] scale-105"
                  : "bg-gradient-to-br from-primary via-leaf to-emerald-800 shadow-[0_10px_35px_rgba(0,0,0,0.25)] hover:scale-105 hover:-translate-y-1")
              }
              aria-label={listening ? "Stop listening" : "Start speaking"}
            >
              {listening ? <MicOff className="size-14 animate-pulse" /> : <Mic className="size-14" />}
            </button>
          </div>

          <p className="mt-6 font-display text-xl font-bold text-foreground">
            {listening
              ? `Listening… speak now in ${inputLang === "hi-IN" ? "Hindi" : "English"}`
              : "Tap Microphone to Speak"}
          </p>

          <p className="min-h-6 text-sm text-accent font-medium italic mt-1">
            {interim ? `“${interim}”` : "Speak classroom instructions or pick a fast prompt below"}
          </p>

          {/* Quick Classroom Prompts */}
          <div className="mt-6 flex flex-wrap justify-center gap-2 max-w-2xl">
            {(inputLang === "hi-IN"
              ? Object.keys(PHRASES)
              : Object.keys(EN_PHRASE_TO_HI).filter((k) => !k.includes("'") && !k.startsWith("whats"))
            ).map((p) => (
              <button
                key={p}
                onClick={() => push(p, performance.now())}
                className="rounded-xl border border-border/70 bg-secondary/70 px-3.5 py-1.5 text-xs font-semibold text-foreground transition-all hover:bg-primary hover:text-primary-foreground hover:scale-105"
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Latency & History Bar */}
      <div className="relative z-10 mt-6 flex flex-wrap items-center justify-between gap-3">
        <div className="inline-flex items-center gap-2 rounded-2xl border border-leaf/30 bg-leaf/10 px-4 py-2 text-xs font-bold text-leaf shadow-sm">
          <Gauge className="size-4" /> Avg Turnaround: {avg} ms {avg > 0 && avg < 3000 ? "✓ (< 3s target)" : ""}
        </div>
        {turns.length > 0 && (
          <button
            onClick={() => setTurns([])}
            className="inline-flex items-center gap-2 rounded-2xl border border-border bg-card px-4 py-2 text-xs font-bold text-muted-foreground transition-colors hover:text-destructive hover:bg-destructive/10"
          >
            <Trash2 className="size-3.5" /> Clear Session
          </button>
        )}
      </div>

      {/* Dialogue Stream */}
      <div className="relative z-10 mt-6 space-y-4">
        {turns.map((t) => (
          <div
            key={t.id}
            className="group relative overflow-hidden rounded-2xl border border-white/20 bg-card/85 p-5 shadow-lg backdrop-blur-xl transition-all duration-300 hover:border-primary/40 hover:-translate-y-0.5"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-secondary px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    Teacher • Hindi
                  </span>
                  <span className="text-xs text-muted-foreground">{new Date(t.id).toLocaleTimeString()}</span>
                </div>
                <p className="mt-2 text-lg font-semibold text-foreground">{t.hindi}</p>

                <div className="mt-3.5 rounded-xl border border-primary/20 bg-gradient-to-r from-primary/10 via-secondary to-accent/10 p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-primary">
                      Class Heard • {meta.name}
                    </span>
                    <span className="font-tribal text-xs text-muted-foreground">{meta.nativeName}</span>
                  </div>
                  <p className="mt-1 font-tribal text-2xl font-bold text-primary">{t.native}</p>
                  <p className="mt-1 text-sm font-semibold italic text-foreground/85">"{t.roman}"</p>
                </div>
              </div>

              <div className="flex flex-col items-end gap-2.5">
                <span
                  className={
                    "rounded-full px-2.5 py-1 text-[11px] font-bold " +
                    (t.ms < 3000 ? "bg-leaf/15 text-leaf" : "bg-destructive/15 text-destructive")
                  }
                >
                  {t.ms} ms
                </span>
                <button
                  onClick={() => speak(t.roman, meta.ttsLocale)}
                  className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-md transition-transform hover:scale-110 active:scale-95"
                  aria-label="Replay audio"
                >
                  <Volume2 className="size-4" />
                </button>
              </div>
            </div>
          </div>
        ))}

        {!turns.length && (
          <div className="rounded-2xl border border-dashed border-border/80 p-12 text-center text-sm text-muted-foreground">
            No live turns yet. Click the mic button or pick any sample prompt above to experience live 2-way synthesis.
          </div>
        )}
      </div>
    </div>
  );
}
