import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  BookMarked,
  FileText,
  Gauge,
  Languages,
  Mic,
  Trash2,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { LANGUAGES, type LangCode } from "@/data/lexicon";
import { clearEvents, getEvents, getStats, type ProgressEvent } from "@/lib/progress";

export const Route = createFileRoute("/progress")({
  head: () => ({
    meta: [
      { title: "Teacher Progress — Usage & activity | Bhasha Setu" },
      {
        name: "description",
        content:
          "On-device progress tracking: translations, live classroom turns, worksheets generated and weekly teaching activity — all stored offline.",
      },
      { property: "og:title", content: "Teacher Progress" },
      {
        property: "og:description",
        content: "Track mother-tongue teaching activity on the device, fully offline.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ProgressPage,
});

const PACK_KEY = "palash.packs";
const DAY_MS = 86400000;

function ProgressPage() {
  const [events, setEvents] = useState<ProgressEvent[]>([]);
  const [synced, setSynced] = useState<string[]>([]);

  useEffect(() => {
    setEvents(getEvents());
    const raw = window.localStorage.getItem(PACK_KEY);
    setSynced(raw ? JSON.parse(raw) : []);
  }, []);

  const stats = useMemo(() => getStats(events), [events]);
  const weekTotal = stats.days.reduce((a, d) => a + d.count, 0);
  const maxDay = Math.max(1, ...stats.days.map((d) => d.count));
  const langEntries = Object.entries(stats.byLang).sort((a, b) => b[1] - a[1]);
  const maxLang = Math.max(1, ...langEntries.map(([, n]) => n));
  const recent = events.slice(-8).reverse();

  const langName = (code: string) =>
    LANGUAGES.find((l: { code: LangCode; name: string }) => l.code === code)?.name ?? code;

  const reset = () => {
    clearEvents();
    setEvents([]);
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <header className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl font-extrabold">Teacher Progress</h1>
          <p className="mt-1 text-muted-foreground">
            Every translation, live turn and worksheet is counted on this device — no internet
            needed.
          </p>
        </div>
        {events.length > 0 && (
          <button
            onClick={reset}
            className="inline-flex items-center gap-2 rounded-xl border border-border px-4 py-2.5 text-sm font-bold"
          >
            <Trash2 className="size-4" /> Reset progress
          </button>
        )}
      </header>

      <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard
          icon={Languages}
          value={stats.byKind.translate + stats.byKind.photo}
          label="lessons translated"
        />
        <StatCard icon={Mic} value={stats.byKind.live} label="live class turns" />
        <StatCard icon={FileText} value={stats.byKind.worksheet} label="worksheets printed" />
        <StatCard
          icon={Gauge}
          value={stats.avgLatency ? `${stats.avgLatency} ms` : "—"}
          label="avg. voice latency"
          good={stats.avgLatency > 0 && stats.avgLatency < 3000}
        />
      </div>

      <div className="grid gap-5 lg:grid-cols-[1.2fr_.8fr]">
        {/* Weekly activity */}
        <section className="card-warm overflow-hidden">
          <div className="sohrai-band h-2" />
          <div className="p-5">
            <div className="flex items-center justify-between">
              <h2 className="flex items-center gap-2 font-bold">
                <Activity className="size-5 text-primary" /> Last 7 days
              </h2>
              <span className="rounded-full bg-secondary px-3 py-1 text-xs font-bold">
                {weekTotal} activities this week
              </span>
            </div>
            <div className="mt-6 flex h-44 items-end gap-2 sm:gap-3">
              {stats.days.map((d, i) => (
                <div key={i} className="flex flex-1 flex-col items-center gap-2">
                  <span className="text-xs font-bold text-primary">{d.count || ""}</span>
                  <div
                    className="w-full rounded-t-lg bg-primary/85 transition-all"
                    style={{ height: `${Math.max(d.count ? 8 : 2, (d.count / maxDay) * 130)}px` }}
                  />
                  <span className="text-[11px] font-semibold text-muted-foreground">{d.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Language + library */}
        <div className="space-y-5">
          <section className="card-warm p-5">
            <h2 className="flex items-center gap-2 font-bold">
              <TrendingUp className="size-5 text-accent" /> Teaching by language
            </h2>
            <div className="mt-4 space-y-3">
              {langEntries.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  No activity yet — translate a lesson or run a live class to begin.
                </p>
              )}
              {langEntries.map(([code, n]) => (
                <div key={code}>
                  <div className="flex justify-between text-sm font-semibold">
                    <span>{langName(code)}</span>
                    <span className="text-muted-foreground">{n}</span>
                  </div>
                  <div className="mt-1 h-2.5 overflow-hidden rounded-full bg-secondary">
                    <div
                      className="h-full rounded-full bg-accent"
                      style={{ width: `${(n / maxLang) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="card-warm p-5">
            <h2 className="flex items-center gap-2 font-bold">
              <BookMarked className="size-5 text-leaf" /> Offline lesson packs
            </h2>
            <p className="mt-2 text-3xl font-extrabold text-primary">{synced.length}</p>
            <p className="text-xs text-muted-foreground">lesson packs stored on this device</p>
            <Button asChild variant="outline" size="sm" className="mt-3 rounded-lg">
              <Link to="/library">Manage library</Link>
            </Button>
          </section>
        </div>
      </div>

      {/* Recent activity */}
      <section className="card-warm mt-6 p-5">
        <h2 className="font-bold">Recent activity</h2>
        <div className="mt-3 space-y-2">
          {recent.length === 0 && (
            <p className="py-6 text-center text-sm text-muted-foreground">
              Nothing recorded yet. Your teaching activity will appear here automatically.
            </p>
          )}
          {recent.map((e, i) => (
            <div key={i} className="flex items-center gap-3 rounded-xl bg-sand px-4 py-3 text-sm">
              <KindIcon kind={e.kind} />
              <span className="font-semibold">{kindLabel(e.kind)}</span>
              <span className="text-muted-foreground">in {langName(e.lang)}</span>
              {typeof e.ms === "number" && (
                <span className="rounded-full bg-leaf/15 px-2 py-0.5 text-[11px] font-bold text-leaf">
                  {e.ms} ms
                </span>
              )}
              <span className="ml-auto text-xs text-muted-foreground">
                {formatWhen(e.ts)}
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function StatCard({
  icon: Icon,
  value,
  label,
  good,
}: {
  icon: typeof Mic;
  value: number | string;
  label: string;
  good?: boolean;
}) {
  return (
    <div className="card-warm p-5">
      <Icon className="size-5 text-primary" />
      <p className="mt-3 font-display text-3xl font-extrabold">
        {value}
        {good && <span className="ml-1 text-sm font-bold text-leaf">✓</span>}
      </p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  );
}

function KindIcon({ kind }: { kind: ProgressEvent["kind"] }) {
  const cls = "size-4 text-primary";
  if (kind === "live") return <Mic className={cls} />;
  if (kind === "worksheet") return <FileText className={cls} />;
  return <Languages className={cls} />;
}

function kindLabel(kind: ProgressEvent["kind"]) {
  switch (kind) {
    case "live":
      return "Live class turn";
    case "worksheet":
      return "Worksheet printed";
    case "photo":
      return "Photo translated";
    default:
      return "Lesson translated";
  }
}

function formatWhen(ts: number) {
  const diff = Date.now() - ts;
  if (diff < 60_000) return "just now";
  if (diff < 3_600_000) return `${Math.round(diff / 60_000)} min ago`;
  if (diff < DAY_MS) return `${Math.round(diff / 3_600_000)} h ago`;
  return new Date(ts).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}
