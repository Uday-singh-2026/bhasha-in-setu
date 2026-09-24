import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Check, Download, HardDriveDownload, Volume2, Trash2 } from "lucide-react";
import { LangPicker } from "@/components/LangPicker";
import { useLang } from "@/components/LangContext";
import { translate } from "@/lib/translate";
import { speak } from "@/lib/speech";
import { getLang, LEXICON, PHRASES, SAMPLE_LESSONS } from "@/data/lexicon";

export const Route = createFileRoute("/library")({
  head: () => ({
    meta: [
      { title: "Offline Lesson Library — Lesson packs | Bhasha Setu" },
      {
        name: "description",
        content:
          "Sync FLN lesson packs once, then teach for the whole term with no internet — designed for 2 GB RAM Android 9+ tablets.",
      },
      { property: "og:title", content: "Offline Lesson Library" },
      {
        property: "og:description",
        content: "One-time content sync, then full offline operation on low-cost tablets.",
      },
    ],
  }),
  component: LibraryPage,
});

const PACK_KEY = "palash.packs";

function LibraryPage() {
  const { lang } = useLang();
  const meta = getLang(lang);
  const [synced, setSynced] = useState<string[]>([]);
  const [busy, setBusy] = useState<string | null>(null);
  const [open, setOpen] = useState<string | null>(SAMPLE_LESSONS[0]!.id);

  useEffect(() => {
    const raw = window.localStorage.getItem(PACK_KEY);
    setSynced(raw ? JSON.parse(raw) : []);
  }, []);

  const persist = (next: string[]) => {
    setSynced(next);
    window.localStorage.setItem(PACK_KEY, JSON.stringify(next));
  };

  const sync = (id: string) => {
    setBusy(id);
    setTimeout(() => {
      persist(Array.from(new Set([...synced, id])));
      setBusy(null);
    }, 900);
  };

  const wordCount = Object.keys(LEXICON).length;
  const phraseCount = Object.keys(PHRASES).length;

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <header className="mb-6">
        <h1 className="text-3xl font-extrabold">Offline Lesson Library</h1>
        <p className="mt-1 text-muted-foreground">
          Download once — then teach for the whole term with no internet. Everything is stored on
          the device itself.
        </p>
        <div className="mt-4">
          <LangPicker />
        </div>
      </header>

      <div className="card-warm mb-6 grid gap-4 p-5 sm:grid-cols-4">
        <Stat value={`${wordCount}`} label="dictionary entries" />
        <Stat value={`${phraseCount}`} label="sentence memory" />
        <Stat value={`${synced.length}/${SAMPLE_LESSONS.length}`} label="lessons synced" />
        <Stat value="~6 MB" label="size on device" />
      </div>

      <div className="space-y-4">
        {SAMPLE_LESSONS.map((l) => {
          const done = synced.includes(l.id);
          return (
            <div key={l.id} className="card-warm overflow-hidden">
              <div className="flex flex-wrap items-center gap-3 p-5">
                <div className="min-w-0 flex-1">
                  <h2 className="text-xl font-bold">{l.titleEn}</h2>
                  <p className="text-xs font-semibold text-primary">{l.outcomeEn}</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {l.lines.length} lines • {meta.name} ({meta.script})
                  </p>
                </div>
                <button
                  onClick={() => setOpen(open === l.id ? null : l.id)}
                  className="rounded-xl border border-border px-4 py-2.5 text-sm font-bold"
                >
                  {open === l.id ? "Close" : "View lesson"}
                </button>
                {done ? (
                  <span className="inline-flex items-center gap-2 rounded-xl bg-leaf/15 px-4 py-2.5 text-sm font-bold text-leaf">
                    <Check className="size-4" /> Available offline
                  </span>
                ) : (
                  <button
                    onClick={() => sync(l.id)}
                    disabled={busy === l.id}
                    className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground shadow-warm disabled:opacity-60"
                  >
                    {busy === l.id ? (
                      <>
                        <HardDriveDownload className="size-4 animate-bounce" /> Syncing…
                      </>
                    ) : (
                      <>
                        <Download className="size-4" /> Download
                      </>
                    )}
                  </button>
                )}
              </div>
              {open === l.id && (
                <div className="space-y-2 border-t border-border bg-sand p-5">
                  {l.lines.map((line) => {
                    const out = translate(line, lang);
                    return (
                      <div
                        key={line}
                        className="flex items-center gap-3 rounded-xl bg-card p-3"
                      >
                        <div className="min-w-0 flex-1">
                          <p className="text-sm text-muted-foreground">{line}</p>
                          <p className="font-tribal text-lg text-indigo-deep">{out.native}</p>
                          <p className="text-sm font-semibold italic">{out.roman}</p>
                        </div>
                        <button
                          onClick={() => speak(out.roman, meta.ttsLocale)}
                          className="rounded-lg bg-primary p-2 text-primary-foreground"
                          aria-label="Listen"
                        >
                          <Volume2 className="size-4" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {synced.length > 0 && (
        <button
          onClick={() => persist([])}
          className="mt-6 inline-flex items-center gap-2 rounded-xl border border-border px-4 py-2.5 text-sm font-bold"
        >
          <Trash2 className="size-4" /> Clear device storage
        </button>
      )}

      <section className="card-warm mt-8 p-5">
        <h2 className="text-lg font-bold">Deployment notes</h2>
        <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
          <li>• The translation engine, dictionary and sentence memory run entirely on the device.</li>
          <li>• Large touch targets and a low-memory layout for 2 GB RAM, Android 9+ tablets.</li>
          <li>• Content stays in browser storage; block-level sync means no repeat downloads.</li>
          <li>• Speech recognition and speech synthesis use the device's own engines — no server calls.</li>
        </ul>
      </section>
    </div>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-xl bg-sand p-4 text-center">
      <p className="font-display text-2xl font-extrabold text-primary">{value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  );
}
