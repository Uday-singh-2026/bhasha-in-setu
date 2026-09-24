import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useRef, useState } from "react";
import { Volume2, Square, Copy, Check, Sparkles, Camera, Loader2, Languages, ArrowRight } from "lucide-react";
import { LangPicker } from "@/components/LangPicker";
import { useLang } from "@/components/LangContext";
import { translate } from "@/lib/translate";
import { recordEvent } from "@/lib/progress";
import { speak, stopSpeaking } from "@/lib/speech";
import { getLang, SAMPLE_LESSONS } from "@/data/lexicon";
import { Spotlight } from "@/components/ui/spotlight";
import { ShimmerButton } from "@/components/ui/shimmer-button";

export const Route = createFileRoute("/translate")({
  head: () => ({
    meta: [
      { title: "Lesson Translation — 3D Hindi to Santhali, Ho & Mundari | Bhasha Setu" },
      {
        name: "description",
        content:
          "Translate Hindi FLN lesson scripts, activity instructions and assessment prompts into Santhali, Ho or Mundari text with on-device synthesised audio.",
      },
      { property: "og:title", content: "Lesson Translation — 3D Curriculum translation" },
      {
        property: "og:description",
        content: "Hindi FLN content into tribal-language text and audio, fully offline.",
      },
    ],
  }),
  component: TranslatePage,
});

function TranslatePage() {
  const { lang } = useLang();
  const meta = getLang(lang);
  const [text, setText] = useState("सब बच्चे बैठ जाओ\nध्यान से सुनो\nआज हम गिनती सीखेंगे");
  const [copied, setCopied] = useState(false);
  const [ocrBusy, setOcrBusy] = useState(false);
  const [ocrError, setOcrError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const onPhoto = async (file: File) => {
    setOcrBusy(true);
    setOcrError(null);
    try {
      const { createWorker } = await import("tesseract.js");
      const worker = await createWorker(["hin", "eng"]);
      const { data } = await worker.recognize(file);
      await worker.terminate();
      const txt = data.text
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean)
        .join("\n");
      if (!txt) {
        setOcrError("Could not read any text — try a clearer, well-lit photo of the page.");
      } else {
        setText(txt);
        recordEvent({ kind: "photo", lang, words: txt.split(/\s+/).length });
      }
    } catch {
      setOcrError(
        "The first photo scan downloads a small reading model — connect to the internet once, then it works offline.",
      );
    } finally {
      setOcrBusy(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const lines = useMemo(
    () =>
      text
        .split("\n")
        .map((l) => l.trim())
        .filter(Boolean)
        .map((l) => ({ src: l, out: translate(l, lang) })),
    [text, lang],
  );

  const coverage = lines.length
    ? Math.round((lines.reduce((a, l) => a + l.out.coverage, 0) / lines.length) * 100)
    : 0;
  const totalMs = lines.reduce((a, l) => a + l.out.ms, 0);

  const copy = () => {
    navigator.clipboard.writeText(lines.map((l) => l.out.roman).join("\n"));
    recordEvent({ kind: "translate", lang, words: text.split(/\s+/).filter(Boolean).length });
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const listenAll = () => {
    recordEvent({ kind: "translate", lang, words: text.split(/\s+/).filter(Boolean).length });
    speak(lines.map((l) => l.out.roman).join(". "), meta.ttsLocale);
  };

  return (
    <div className="relative mx-auto min-h-screen max-w-6xl px-4 py-10">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <Spotlight className="-top-36 left-10" fill="oklch(0.59 0.16 36)" />
        <Spotlight className="top-10 right-10" fill="oklch(0.43 0.09 153)" />
      </div>

      <header className="relative z-10 mb-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-primary">
          <Languages className="size-3.5" /> 3D Dual-Script Translation
        </div>
        <h1 className="mt-3 font-display text-4xl font-extrabold sm:text-5xl">Curriculum Translation</h1>
        <p className="mt-2 text-muted-foreground">
          Type or scan any Hindi textbook exercise, FLN story, or teacher script — rendered in native script and speech.
        </p>
        <div className="mt-5">
          <LangPicker />
        </div>
      </header>

      <div className="relative z-10 grid gap-6 lg:grid-cols-2">
        {/* Left Card: Hindi Source & OCR */}
        <div className="overflow-hidden rounded-3xl border border-white/20 bg-card/85 p-6 shadow-xl backdrop-blur-2xl transition-all duration-300 hover:border-primary/40">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-lg font-bold text-foreground">Hindi (Source Text)</h2>
            <span className="rounded-full bg-secondary/80 px-3 py-1 text-xs font-semibold text-muted-foreground border border-border">
              {lines.length} lines
            </span>
          </div>

          <textarea
            value={text}
            onChange={(ev) => setText(ev.target.value)}
            rows={9}
            className="w-full resize-y rounded-2xl border border-border/80 bg-background/90 p-4 font-sans text-base leading-relaxed outline-none focus:ring-2 focus:ring-primary shadow-inner"
            placeholder="Type Hindi lesson text here…"
          />

          {/* Camera OCR Card */}
          <div className="mt-4 rounded-2xl border border-dashed border-primary/40 bg-gradient-to-r from-primary/10 via-card to-accent/10 p-4 shadow-sm">
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => fileRef.current?.click()}
                disabled={ocrBusy}
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-primary-foreground shadow-md transition-transform hover:scale-105 active:scale-95 disabled:opacity-60"
              >
                {ocrBusy ? (
                  <>
                    <Loader2 className="size-4 animate-spin" /> Scanning…
                  </>
                ) : (
                  <>
                    <Camera className="size-4" /> Photo to Text (OCR)
                  </>
                )}
              </button>
              <p className="text-xs text-muted-foreground">
                Point tablet camera at blackboard or textbook page to scan.
              </p>
            </div>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) void onPhoto(f);
              }}
            />
            {ocrError && <p className="mt-2 text-xs font-semibold text-destructive">{ocrError}</p>}
          </div>

          {/* Sample Lessons */}
          <div className="mt-5">
            <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              Pre-loaded FLN Lessons
            </p>
            <div className="flex flex-wrap gap-2">
              {SAMPLE_LESSONS.map((l) => (
                <button
                  key={l.id}
                  onClick={() => setText(l.lines.join("\n"))}
                  className="rounded-xl border border-border/80 bg-secondary/80 px-3 py-1.5 text-xs font-semibold text-foreground transition-all hover:bg-primary hover:text-primary-foreground hover:scale-105"
                >
                  {l.titleEn}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Card: Native Translation Output */}
        <div className="overflow-hidden rounded-3xl border border-white/20 bg-card/85 shadow-xl backdrop-blur-2xl transition-all duration-300 hover:border-primary/40">
          <div className="sohrai-band h-1.5" />
          <div className="p-6">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-2 border-b border-border/60 pb-3">
              <div className="flex items-center gap-2">
                <span className="font-display text-lg font-bold text-foreground">{meta.name}</span>
                <span className="rounded-lg bg-secondary px-2.5 py-0.5 font-tribal text-sm font-bold text-primary">
                  {meta.nativeName}
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className="rounded-full border border-leaf/30 bg-leaf/10 px-3 py-1 font-bold text-leaf shadow-sm">
                  FLN Lexicon {coverage}%
                </span>
                <span className="rounded-full bg-secondary px-2.5 py-1 font-semibold text-muted-foreground">
                  {totalMs} ms
                </span>
              </div>
            </div>

            <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
              {lines.map((l, i) => (
                <div
                  key={i}
                  className="group rounded-2xl border border-border/60 bg-secondary/50 p-4 transition-all hover:bg-secondary/80 hover:border-primary/30"
                >
                  <p className="text-xs text-muted-foreground">{l.src}</p>
                  <p className="mt-1 font-tribal text-2xl font-bold leading-relaxed text-primary">
                    {l.out.native}
                  </p>
                  <p className="text-sm font-semibold text-foreground/80 italic">{l.out.roman}</p>
                  <div className="mt-2.5 flex items-center gap-2">
                    <button
                      onClick={() => speak(l.out.roman, meta.ttsLocale)}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1 text-xs font-bold text-primary-foreground shadow-sm transition-transform hover:scale-105 active:scale-95"
                    >
                      <Volume2 className="size-3.5" /> Speak
                    </button>
                    {l.out.matchedPhrase && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-leaf">
                        <Sparkles className="size-3" /> Idiomatic phrase match
                      </span>
                    )}
                  </div>
                </div>
              ))}
              {!lines.length && (
                <p className="py-12 text-center text-sm text-muted-foreground">
                  Enter Hindi text on the left to see instant tribal translations.
                </p>
              )}
            </div>

            <div className="mt-6 flex flex-wrap gap-2.5 pt-4 border-t border-border/60">
              <ShimmerButton
                onClick={listenAll}
                shimmerColor="rgba(255, 255, 255, 0.4)"
                borderRadius="12px"
                className="h-11 px-5 text-xs shadow-md"
              >
                <Volume2 className="mr-2 size-4" /> Broadcast Full Lesson
              </ShimmerButton>

              <button
                onClick={stopSpeaking}
                className="inline-flex items-center gap-2 rounded-xl border border-border/80 bg-card px-4 py-2.5 text-xs font-bold text-foreground transition-colors hover:bg-secondary"
              >
                <Square className="size-3.5" /> Stop
              </button>

              <button
                onClick={copy}
                className="inline-flex items-center gap-2 rounded-xl border border-border/80 bg-card px-4 py-2.5 text-xs font-bold text-foreground transition-colors hover:bg-secondary"
              >
                {copied ? <Check className="size-3.5 text-leaf" /> : <Copy className="size-3.5" />}
                {copied ? "Copied" : "Copy Roman"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Word-by-word Analysis Section */}
      <section className="relative z-10 mt-8 overflow-hidden rounded-3xl border border-white/20 bg-card/85 p-6 shadow-xl backdrop-blur-2xl">
        <h2 className="font-display text-lg font-bold text-foreground">Lexical Alignment &amp; Token Breakdown</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {lines
            .flatMap((l) => l.out.tokens)
            .map((t, i) => (
              <span
                key={i}
                className={
                  "rounded-xl border px-3 py-1.5 text-xs shadow-sm transition-transform hover:scale-105 " +
                  (t.known
                    ? "border-leaf/30 bg-leaf/10 text-foreground"
                    : "border-destructive/30 bg-destructive/10 text-foreground")
                }
              >
                <span className="text-muted-foreground">{t.source}</span>
                <span className="mx-1.5 text-muted-foreground font-bold">→</span>
                <span className="font-bold text-primary">{t.roman}</span>
              </span>
            ))}
        </div>
      </section>
    </div>
  );
}
