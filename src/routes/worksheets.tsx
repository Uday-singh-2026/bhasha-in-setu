import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Printer, RefreshCw, Volume2 } from "lucide-react";
import { LangPicker } from "@/components/LangPicker";
import { useLang } from "@/components/LangContext";
import { translate, translateWord } from "@/lib/translate";
import { speak } from "@/lib/speech";
import { recordEvent } from "@/lib/progress";
import { EMOJI_FOR, FLASHCARD_SETS, getLang, SAMPLE_LESSONS } from "@/data/lexicon";

export const Route = createFileRoute("/worksheets")({
  head: () => ({
    meta: [
      { title: "Bilingual Worksheets & Flashcards — NIPUN Bharat aligned | Bhasha Setu" },
      {
        name: "description",
        content:
          "Auto-generate printable bilingual worksheets and visual flashcard sets in Santhali, Ho or Mundari, aligned to NIPUN Bharat learning outcomes.",
      },
      { property: "og:title", content: "Bilingual Worksheets & Flashcards" },
      {
        property: "og:description",
        content: "Printable NIPUN Bharat aligned worksheets in the child's mother tongue.",
      },
    ],
  }),
  component: WorksheetPage,
});

// Deterministic shuffle (seeded) so SSR and client render identical output.
const shuffle = <T,>(a: T[], seed: number) => {
  const arr = [...a];
  let s = seed * 2654435761 + 1013904223;
  for (let i = arr.length - 1; i > 0; i--) {
    s = (s * 1664525 + 1013904223) >>> 0;
    const j = s % (i + 1);
    [arr[i], arr[j]] = [arr[j]!, arr[i]!];
  }
  return arr;
};

function WorksheetPage() {
  const { lang } = useLang();
  const meta = getLang(lang);
  const [setId, setSetId] = useState(FLASHCARD_SETS[0]!.id);
  const [lessonId, setLessonId] = useState(SAMPLE_LESSONS[0]!.id);
  const [seed, setSeed] = useState(0);

  const set = FLASHCARD_SETS.find((s) => s.id === setId)!;
  const lesson = SAMPLE_LESSONS.find((l) => l.id === lessonId)!;

  const matchPairs = useMemo(() => {
    void seed;
    const words = set.words.slice(0, 6);
    return { words, jumbled: shuffle(words, seed) };
  }, [set, seed]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <header className="no-print mb-6">
        <h1 className="text-3xl font-extrabold">Bilingual Worksheets & Flashcards</h1>
        <p className="mt-1 text-muted-foreground">
          Pick a topic — the worksheet is generated automatically and ready to print.
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <LangPicker />
          <select
            value={setId}
            onChange={(e) => setSetId(e.target.value)}
            className="rounded-xl border border-input bg-card px-4 py-2.5 text-sm font-semibold"
          >
            {FLASHCARD_SETS.map((s) => (
              <option key={s.id} value={s.id}>
                Topic: {s.labelEn} ({s.label})
              </option>
            ))}
          </select>
          <select
            value={lessonId}
            onChange={(e) => setLessonId(e.target.value)}
            className="rounded-xl border border-input bg-card px-4 py-2.5 text-sm font-semibold"
          >
            {SAMPLE_LESSONS.map((l) => (
              <option key={l.id} value={l.id}>
                {l.titleEn}
              </option>
            ))}
          </select>
          <button
            onClick={() => setSeed((s) => s + 1)}
            className="inline-flex items-center gap-2 rounded-xl border border-border px-4 py-2.5 text-sm font-bold"
          >
            <RefreshCw className="size-4" /> New set
          </button>
          <button
            onClick={() => {
              recordEvent({ kind: "worksheet", lang, words: set.words.length });
              window.print();
            }}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground shadow-warm hover:scale-105 transition-transform"
          >
            <Printer className="size-4" /> Print
          </button>
        </div>

        {/* Quick Lesson Selector Pills (10 Lessons) */}
        <div className="mt-4 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <span className="text-xs font-bold text-muted-foreground shrink-0 uppercase tracking-wider">
            10 NIPUN Lessons:
          </span>
          {SAMPLE_LESSONS.map((l, idx) => (
            <button
              key={l.id}
              onClick={() => setLessonId(l.id)}
              className={`shrink-0 rounded-xl border px-3 py-1.5 text-xs font-bold transition-all shadow-xs ${
                lessonId === l.id
                  ? "border-primary bg-primary text-primary-foreground shadow-sm scale-105"
                  : "border-border bg-card text-foreground hover:bg-secondary"
              }`}
            >
              L{idx + 1}: {l.title.replace(/^पाठ \d+ — /, "")}
            </button>
          ))}
        </div>
      </header>

      {/* Flashcards */}
      <section className="print-sheet card-warm mb-6 overflow-hidden">
        <div className="sohrai-band h-2" />
        <div className="p-5">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h2 className="text-xl font-bold">
              Picture flashcards — {set.labelEn} ({set.label})
            </h2>
            <p className="text-xs font-semibold text-muted-foreground">
              NIPUN Bharat • Vocabulary & reading readiness
            </p>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {set.words.map((w) => {
              const g = translateWord(w, lang);
              return (
                <div key={w} className="rounded-2xl border border-border bg-sand p-4 text-center">
                  <div className="text-5xl">{EMOJI_FOR[w] ?? "🔤"}</div>
                  <p className="mt-2 text-lg font-bold">{w}</p>
                  <p className="font-tribal text-lg text-indigo-deep">{g.native}</p>
                  <p className="text-xs font-semibold italic">{g.roman}</p>
                  <button
                    onClick={() => speak(g.roman, meta.ttsLocale)}
                    className="no-print mx-auto mt-2 inline-flex items-center gap-1 rounded-lg bg-primary px-2.5 py-1 text-xs font-bold text-primary-foreground hover:scale-105 transition-transform"
                  >
                    <Volume2 className="size-3" /> Listen
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Worksheet */}
      <section className="print-sheet card-warm overflow-hidden">
        <div className="sohrai-band h-2" />
        <div className="p-6">
          <div className="flex flex-wrap items-start justify-between gap-3 border-b border-border pb-4">
            <div>
              <h2 className="text-2xl font-extrabold">
                Worksheet — {set.labelEn} ({set.label})
              </h2>
              <p className="text-sm text-muted-foreground">
                Languages: Hindi + {meta.name} ({meta.script}) • {lesson.titleEn}
              </p>
            </div>
            <div className="text-right text-sm">
              <p>Name: ______________________</p>
              <p className="mt-1">Class: ________ Date: __________</p>
            </div>
          </div>
          <p className="mt-3 text-xs font-bold text-primary bg-primary/10 border border-primary/20 px-3 py-1.5 rounded-lg inline-block">{lesson.outcomeEn}</p>

          <Block n="1" title="Match — join each Hindi word to its mother-tongue word">
            <div className="grid grid-cols-2 gap-8">
              <ul className="space-y-3">
                {matchPairs.words.map((w) => (
                  <li key={w} className="flex items-center gap-2 text-lg">
                    <span className="text-2xl">{EMOJI_FOR[w] ?? "•"}</span> {w}
                    <span className="ml-auto text-muted-foreground">○</span>
                  </li>
                ))}
              </ul>
              <ul className="space-y-3">
                {matchPairs.jumbled.map((w) => {
                  const g = translateWord(w, lang);
                  return (
                    <li key={w} className="flex items-center gap-2 text-lg">
                      <span className="text-muted-foreground">○</span>
                      <span className="font-tribal text-indigo-deep">{g.native}</span>
                      <span className="text-sm italic">({g.roman})</span>
                    </li>
                  );
                })}
              </ul>
            </div>
          </Block>

          <Block n="2" title="Fill in the blanks — write the mother-tongue word">
            <ol className="space-y-4">
              {set.words.slice(0, 5).map((w, i) => (
                <li key={w} className="text-lg">
                  {i + 1}. {w} = <span className="ml-2 inline-block w-56 border-b-2 border-dashed border-border" />
                </li>
              ))}
            </ol>
          </Block>

          <Block n="3" title="Read and say — lesson sentences">
            <ol className="space-y-3">
              {lesson.lines.map((line) => {
                const out = translate(line, lang);
                return (
                  <li key={line} className="rounded-xl bg-sand p-3 flex items-center justify-between gap-3">
                    <div>
                      <p className="text-base font-bold text-foreground">{line}</p>
                      <p className="font-tribal text-lg text-indigo-deep">{out.native}</p>
                      <p className="text-sm italic text-muted-foreground">{out.roman}</p>
                    </div>
                    <button
                      onClick={() => speak(out.roman, meta.ttsLocale)}
                      className="no-print inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-primary/15 text-primary hover:bg-primary hover:text-white px-3 py-1.5 text-xs font-bold transition-all shadow-xs"
                    >
                      <Volume2 className="size-3.5" /> Speak
                    </button>
                  </li>
                );
              })}
            </ol>
          </Block>

          <Block n="4" title="Draw — make a picture for the word below">
            <div className="grid grid-cols-2 gap-4">
              {set.words.slice(0, 2).map((w) => {
                const g = translateWord(w, lang);
                return (
                  <div key={w} className="rounded-xl border-2 border-dashed border-border p-4">
                    <p className="text-center font-bold">
                      {w} / <span className="font-tribal text-indigo-deep">{g.native}</span>
                    </p>
                    <div className="h-28" />
                  </div>
                );
              })}
            </div>
          </Block>

          <p className="mt-6 border-t border-border pt-3 text-xs text-muted-foreground">
            Auto-generated by Bhasha Setu • PALASH MTB-MLE • Please have the local language
            committee verify before classroom use.
          </p>
        </div>
      </section>
    </div>
  );
}

function Block({ n, title, children }: { n: string; title: string; children: React.ReactNode }) {
  return (
    <div className="mt-6">
      <h3 className="mb-3 flex items-center gap-2 font-bold">
        <span className="flex size-7 items-center justify-center rounded-lg bg-primary text-sm text-primary-foreground">
          {n}
        </span>
        {title}
      </h3>
      {children}
    </div>
  );
}
