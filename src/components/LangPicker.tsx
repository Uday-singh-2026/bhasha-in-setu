import { LANGUAGES } from "@/data/lexicon";
import { useLang } from "./LangContext";
import { cn } from "@/lib/utils";

export function LangPicker({ className }: { className?: string }) {
  const { lang, setLang } = useLang();
  return (
    <div className={cn("inline-flex flex-wrap gap-1.5 rounded-2xl bg-secondary p-1.5", className)}>
      {LANGUAGES.map((l) => (
        <button
          key={l.code}
          onClick={() => setLang(l.code)}
          aria-pressed={lang === l.code}
          className={cn(
            "rounded-xl px-4 py-2 text-sm font-semibold transition-colors",
            lang === l.code
              ? "bg-primary text-primary-foreground shadow-warm"
              : "text-secondary-foreground hover:bg-background/60",
          )}
        >
          {l.name}
          <span className="ml-1.5 font-tribal text-xs opacity-80">{l.nativeName}</span>
        </button>
      ))}
    </div>
  );
}
