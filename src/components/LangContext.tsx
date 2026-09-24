import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { LANGUAGES, type LangCode } from "@/data/lexicon";

type Ctx = { lang: LangCode; setLang: (l: LangCode) => void };
const LangCtx = createContext<Ctx>({ lang: "sat", setLang: () => {} });

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<LangCode>("sat");

  useEffect(() => {
    const saved = window.localStorage.getItem("palash.lang") as LangCode | null;
    if (saved && LANGUAGES.some((l) => l.code === saved)) setLangState(saved);
  }, []);

  const setLang = (l: LangCode) => {
    setLangState(l);
    window.localStorage.setItem("palash.lang", l);
  };

  return <LangCtx.Provider value={{ lang, setLang }}>{children}</LangCtx.Provider>;
}

export const useLang = () => useContext(LangCtx);
