import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";
import {
  ArrowRight,
  BookMarked,
  Camera,
  CloudDownload,
  FileText,
  Languages,
  Mic,
  Printer,
  ShieldCheck,
  Sparkles,
  Tablet,
  Volume2,
  Zap,
  CheckCircle2,
  Activity,
  Layers,
  GraduationCap,
  Compass,
  Trophy,
  Cpu,
  Radio,
  Send,
  Play,
  RefreshCw,
} from "lucide-react";
import { LangPicker } from "@/components/LangPicker";
import { useLang } from "@/components/LangContext";
import { LANGUAGES, getLang } from "@/data/lexicon";
import { speak } from "@/lib/speech";
import classroomImage from "@/assets/jharkhand-classroom.jpg";
import { CardContainer, CardBody, CardItem } from "@/components/ui/3d-card";
import { PinContainer } from "@/components/ui/3d-pin";
import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid";
import { Spotlight } from "@/components/ui/spotlight";
import { SparklesCore } from "@/components/ui/sparkles";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import { MovingBorderButton } from "@/components/ui/moving-border";
import { AnimatedBeam } from "@/components/ui/animated-beam";
import { BorderBeam } from "@/components/ui/border-beam";
import { InfiniteMarquee } from "@/components/ui/infinite-marquee";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Bhasha Setu | Hackathon Winner 3D MTB-MLE AI Suite" },
      {
        name: "description",
        content:
          "Hackathon-winning offline Hindi-to-Santhali, Ho and Mundari real-time acoustic bridge and NIPUN Bharat FLN teaching suite.",
      },
      { property: "og:title", content: "Bhasha Setu | 3D Mother-Tongue Language Bridge" },
      {
        property: "og:description",
        content: "A futuristic, offline teaching bridge for Jharkhand's multilingual primary classrooms.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const DEMO_TRANSLATIONS = {
  sat: {
    hindi: "सब बच्चे बैठ जाओ, आज हम कहानी सुनेंगे",
    native: "ᱡᱚᱛᱚ ᱜᱤᱫᱽᱨᱟᱹ ᱫᱩᱲᱩᱵ ᱯᱮ, ᱛᱮᱦᱮᱧ ᱟᱵᱚ ᱠᱟᱹᱦᱱᱤ ᱵᱚ ᱟᱸᱡᱚᱢᱟ",
    roman: "Joto gidra durup pe, teheñ abo kahni bo añjoma",
    script: "Ol Chiki",
    symbol: "ᱥ",
    accentGlow: "rgba(16, 185, 129, 0.4)",
  },
  hoc: {
    hindi: "सब बच्चे बैठ जाओ, आज हम कहानी सुनेंगे",
    native: "ᱥᱟᱵᱤᱱ ᱦᱚᱸ ᱫᱩᱵᱽ ᱞᱮᱯᱮ, ᱛᱤᱥᱤᱝ ᱟᱵᱩ ᱠᱟᱹᱦᱱᱤ ᱟᱸᱭᱩᱢᱮᱭᱟ",
    roman: "Sabin hon dub lepe, tising abu kahni aayumeya",
    script: "Warang Citi",
    symbol: "𑢹",
    accentGlow: "rgba(245, 158, 11, 0.4)",
  },
  unr: {
    hindi: "सब बच्चे बैठ जाओ, आज हम कहानी सुनेंगे",
    native: "सबेन गिदरा दुड़ुब पे, तिशिंग आबु कहनी आयुमेया",
    roman: "Saben gidra durub pe, tishing abu kahni aayumeya",
    script: "Devanagari",
    symbol: "म",
    accentGlow: "rgba(99, 102, 241, 0.4)",
  },
};

type CulturalGlyph = {
  char: string;
  roman: string;
  meaning: string;
  hindi: string;
  script: string;
  lang: "sat" | "hoc" | "unr";
  category: "Letter" | "Word" | "Action" | "Greeting";
  audio: string;
};

const MARQUEE_GLYPHS: CulturalGlyph[] = [
  {
    char: "ᱫᱟᱠᱟ",
    roman: "Daka",
    meaning: "Rice / Food",
    hindi: "भात / खाना",
    script: "Ol Chiki",
    lang: "sat",
    category: "Word",
    audio: "daka",
  },
  {
    char: "ᱞᱮᱠᱷᱟ",
    roman: "Lekha",
    meaning: "Count / Numeracy",
    hindi: "गिनती",
    script: "Ol Chiki",
    lang: "sat",
    category: "Action",
    audio: "lekha",
  },
  {
    char: "ᱡᱚᱦᱟᱨ",
    roman: "Johar",
    meaning: "Traditional Greeting",
    hindi: "नमस्ते",
    script: "Ol Chiki",
    lang: "sat",
    category: "Greeting",
    audio: "johar",
  },
  {
    char: "ᱛᱤᱥᱤᱝ",
    roman: "Tising",
    meaning: "Today (Present Day)",
    hindi: "आज",
    script: "Warang Citi",
    lang: "hoc",
    category: "Word",
    audio: "tisin",
  },
  {
    char: "आबु",
    roman: "Abu",
    meaning: "We / All of Us",
    hindi: "हम / हम सब",
    script: "Devanagari",
    lang: "unr",
    category: "Word",
    audio: "abu",
  },
  {
    char: "ᱥ",
    roman: "Is",
    meaning: "Santhali S Glyph",
    hindi: "स अक्षर",
    script: "Ol Chiki",
    lang: "sat",
    category: "Letter",
    audio: "is",
  },
  {
    char: "ᱚ",
    roman: "La",
    meaning: "Primary Ol Chiki Vowel",
    hindi: "अ / ओ स्वर",
    script: "Ol Chiki",
    lang: "sat",
    category: "Letter",
    audio: "la",
  },
  {
    char: "𑢹",
    roman: "Ho H",
    meaning: "Warang Citi Sacred Glyph",
    hindi: "हो लिपि 'ह'",
    script: "Warang Citi",
    lang: "hoc",
    category: "Letter",
    audio: "ho",
  },
  {
    char: "𑣉",
    roman: "Ho O",
    meaning: "Warang Citi Primary Vowel",
    hindi: "हो लिपि 'ओ'",
    script: "Warang Citi",
    lang: "hoc",
    category: "Letter",
    audio: "o",
  },
  {
    char: "ᱡᱚᱢᱮᱢ",
    roman: "Jomem",
    meaning: "Eat Food",
    hindi: "खाना खाओ",
    script: "Ho",
    lang: "hoc",
    category: "Action",
    audio: "jom",
  },
  {
    char: "𑢠𑣉𑣁𑣜",
    roman: "Johar",
    meaning: "Ho Heritage Greeting",
    hindi: "जोहार",
    script: "Warang Citi",
    lang: "hoc",
    category: "Greeting",
    audio: "johar",
  },
  {
    char: "गिदरा",
    roman: "Gidra",
    meaning: "Child / Learner",
    hindi: "बच्चा",
    script: "Devanagari",
    lang: "unr",
    category: "Word",
    audio: "gidra",
  },
  {
    char: "बुगिन",
    roman: "Bugin",
    meaning: "Good / Well Done",
    hindi: "बहुत अच्छा",
    script: "Devanagari",
    lang: "unr",
    category: "Greeting",
    audio: "bugin",
  },
  {
    char: "दुब मे",
    roman: "Dub me",
    meaning: "Sit Down",
    hindi: "बैठ जाओ",
    script: "Devanagari",
    lang: "unr",
    category: "Action",
    audio: "dub me",
  },
  {
    char: "ᱥᱟᱱᱛᱟᱲᱤ",
    roman: "Santali",
    meaning: "Santhali Language",
    hindi: "संताली भाषा",
    script: "Ol Chiki",
    lang: "sat",
    category: "Word",
    audio: "santali",
  },
];

const PIPELINE_PROMPTS = [
  {
    hindi: "सब बच्चे ध्यान से सुनो",
    sat: "ᱡᱚᱛᱚ ᱜᱤᱫᱽᱨᱟᱹ ᱫᱷᱮᱭᱟᱱ ᱛᱮ ᱟᱸᱡᱚᱢ ᱯᱮ",
    satRoman: "Joto gidra dhiyan te añjom pe",
    hoc: "ᱥᱟᱵᱤᱱ ᱦᱚᱸ ᱫᱷᱮᱭᱟᱱ ᱛᱮ ᱟᱸᱭᱩᱢᱮᱯᱮ",
    hocRoman: "Sabin hon dhiyan te aayumepe",
    unr: "सबेन गिदरा धियान ते आयुम पे",
    unrRoman: "Saben gidra dhiyan te aayum pe",
  },
  {
    hindi: "आज हम गिनती सीखेंगे",
    sat: "ᱛᱮᱦᱮᱧ ᱟᱵᱚ ᱞᱮᱠᱷᱟ ᱵᱚ ᱪᱮᱫᱚᱜᱼᱟ",
    satRoman: "Teheñ abo lekha bo chedog-a",
    hoc: "ᱛᱤᱥᱤᱝ ᱟᱵᱩ ᱞᱮᱠᱷᱟ ᱟᱵᱩ ᱪᱮᱫᱚᱜᱼᱟ",
    hocRoman: "Tising abu lekha abu chedog-a",
    unr: "तिशिंग आबु लेखा आबु चेदोआ",
    unrRoman: "Tishing abu lekha abu chedoa",
  },
  {
    hindi: "किताब खोलो और पढ़ो",
    sat: "ᱯᱩᱛᱷᱤ ᱡᱷᱤᱡᱽ ᱢᱮ ᱟᱨ ᱯᱟᱲᱦᱟᱣ ᱢᱮ",
    satRoman: "Puthi jhij me ar parhaw me",
    hoc: "ᱯᱩᱛᱷᱤ ᱠᱩᱞᱟᱭᱮᱢ ᱟᱱᱫᱚ ᱯᱟᱲᱦᱟᱣᱮᱢ",
    hocRoman: "Puthi kulayem ando parhawem",
    unr: "पुथी कुलई मे अड़ो पढ़ई मे",
    unrRoman: "Puthi kulai me ado parhai me",
  },
];

const HERO_LESSONS = [
  {
    id: "story",
    tag: "📖 कहानी (FLN Story)",
    hindi: "सब बच्चे बैठ जाओ, आज हम कहानी सुनेंगे",
    translations: {
      sat: {
        native: "ᱡᱚᱛᱚ ᱜᱤᱫᱽᱨᱟᱹ ᱫᱩᱲᱩᱵ ᱯᱮ, ᱛᱮᱦᱮᱧ ᱟᱵᱚ ᱠᱟᱹᱦᱱᱤ ᱵᱚ ᱟᱸᱡᱚᱢᱟ",
        roman: "Joto gidra durup pe, teheñ abo kahni bo añjoma",
      },
      hoc: {
        native: "ᱥᱟᱵᱤᱱ ᱦᱚᱸ ᱫᱩᱵᱽ ᱞᱮᱯᱮ, ᱛᱤᱥᱤᱝ ᱟᱵᱩ ᱠᱟᱹᱦᱱᱤ ᱟᱸᱭᱩᱢᱮᱭᱟ",
        roman: "Sabin hon dub lepe, tising abu kahni aayumeya",
      },
      unr: {
        native: "सबेन गिदरा दुड़ुब पे, तिशिंग आबु कहनी आयुमेया",
        roman: "Saben gidra durub pe, tishing abu kahni aayumeya",
      },
    },
  },
  {
    id: "count",
    tag: "🔢 गिनती (Numeracy)",
    hindi: "एक, दो, तीन, सब मिलकर गिनती करो",
    translations: {
      sat: {
        native: "ᱢᱤᱫ, ᱵᱟᱨ, ᱯᱮ, ᱡᱚᱛᱚ ᱢᱮᱥᱟ ᱠᱟᱛᱮ ᱞᱮᱠᱷᱟᱭ ᱯᱮ",
        roman: "Mid, bar, pe, joto mesa kate lekhai pe",
      },
      hoc: {
        native: "ᱢᱤᱭᱟᱫᱽ, ᱵᱟᱨᱤᱭᱟ, ᱯᱮᱭᱟ, ᱥᱟᱵᱤᱱ ᱢᱮᱥᱟ ᱞᱮᱠᱷᱟᱭᱮᱯᱮ",
        roman: "Miyad, bariya, peya, sabin mesa lekhayepe",
      },
      unr: {
        native: "मियद, बरिया, पेया, सबेन मिसा लेखाये पे",
        roman: "Miyad, bariya, peya, saben misa lekhaye pe",
      },
    },
  },
  {
    id: "rhyme",
    tag: "☀️ कविता (Rhyme)",
    hindi: "सूरज निकला, चिड़िया बोली, सवेरा हुआ",
    translations: {
      sat: {
        native: "ᱵᱮᱲᱟ ᱨᱟᱠᱟᱵ ᱮᱱᱟ, ᱪᱮᱬᱮ ᱠᱚ ᱨᱟᱜ ᱠᱮᱫᱟ, ᱥᱮᱛᱟᱜ ᱮᱱᱟ",
        roman: "Bera rakab ena, cheñe ko rag keda, setag ena",
      },
      hoc: {
        native: "ᱥᱤᱝᱜᱤ ᱛᱩᱨ ᱮᱱᱟ, ᱪᱮᱬᱮ ᱠᱚ ᱠᱟᱠᱚᱣᱟ, ᱥᱮᱛᱟᱜ ᱮᱱᱟ",
        roman: "Singi tur ena, cheñe ko kakowa, setag ena",
      },
      unr: {
        native: "सिंगी तुरेना, चेड़े को काकोवा, सेतायेना",
        roman: "Singi turena, chede ko kakowa, setayena",
      },
    },
  },
];

function Index() {
  const { lang, setLang } = useLang();
  const currentMeta = getLang(lang);
  const activeDemo = DEMO_TRANSLATIONS[lang] || DEMO_TRANSLATIONS.sat;
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [heroLessonIdx, setHeroLessonIdx] = useState(0);
  const currentHeroLesson = HERO_LESSONS[heroLessonIdx];
  const activeTranslation =
    currentHeroLesson.translations[lang] || currentHeroLesson.translations.sat;

  // 5-Second Automatic Language Rotation
  const [autoRotate, setAutoRotate] = useState(true);
  const [timerProgress, setTimerProgress] = useState(0);
  const langRef = useRef(lang);
  langRef.current = lang;

  useEffect(() => {
    if (!autoRotate) return;
    const languages: ("sat" | "hoc" | "unr")[] = ["sat", "hoc", "unr"];
    const intervalMs = 5000;
    const tickMs = 100;

    const timer = setInterval(() => {
      setTimerProgress((prev) => {
        if (prev >= 100) {
          const currentIdx = languages.indexOf(langRef.current);
          const nextLang = languages[(currentIdx + 1) % languages.length];
          setLang(nextLang);
          setSelectedPromptIdx((p) => (p + 1) % PIPELINE_PROMPTS.length);
          return 0;
        }
        return prev + (tickMs / intervalMs) * 100;
      });
    }, tickMs);

    return () => clearInterval(timer);
  }, [autoRotate, setLang]);

  // Animated Bridge Beam Refs
  const bridgeContainerRef = useRef<HTMLDivElement>(null);
  const teacherInputRef = useRef<HTMLDivElement>(null);
  const neuralCoreRef = useRef<HTMLDivElement>(null);
  const satTargetRef = useRef<HTMLDivElement>(null);
  const hocTargetRef = useRef<HTMLDivElement>(null);
  const unrTargetRef = useRef<HTMLDivElement>(null);

  // Active Pipeline State
  const [selectedPromptIdx, setSelectedPromptIdx] = useState(0);
  const [isTranslatingStream, setIsTranslatingStream] = useState(false);
  const currentPrompt = PIPELINE_PROMPTS[selectedPromptIdx];

  const handleTestSpeech = (text: string) => {
    setIsPlayingAudio(true);
    speak(text, currentMeta.ttsLocale);
    setTimeout(() => setIsPlayingAudio(false), 2600);
  };

  const triggerBeamFlow = (idx: number) => {
    setSelectedPromptIdx(idx);
    setIsTranslatingStream(true);
    const chosen = PIPELINE_PROMPTS[idx];
    const targetText =
      lang === "sat"
        ? chosen.satRoman
        : lang === "hoc"
          ? chosen.hocRoman
          : chosen.unrRoman;
    speak(targetText, currentMeta.ttsLocale);
    setTimeout(() => setIsTranslatingStream(false), 2800);
  };

  return (
    <div className="relative w-full bg-background selection:bg-primary/20 selection:text-primary">
      {/* Background Visual Lighting Container (strictly clipped, zero scrollbar interference) */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Subtle Matrix Dot Grid */}
        <div className="absolute inset-0 bg-dot-grid text-foreground/[0.04] [mask-image:radial-gradient(ellipse_at_center,transparent_10%,black)]" />

        {/* Dual Aceternity Conical Spotlights */}
        <Spotlight className="-top-40 left-0 md:-top-20 md:left-40" fill="oklch(0.59 0.16 36)" />
        <Spotlight className="top-10 right-0 md:top-0 md:right-28" fill="oklch(0.43 0.09 153)" />

        {/* Ambient Particle Starfield */}
        <SparklesCore
          id="hero-sparkles"
          background="transparent"
          minSize={0.4}
          maxSize={1.8}
          particleDensity={40}
          className="h-[850px] w-full opacity-45"
          particleColor="oklch(0.43 0.09 153)"
        />
      </div>

      {/* Hero Section */}
      <section className="relative z-10 mx-auto grid max-w-7xl items-center gap-12 px-5 pt-10 pb-16 lg:grid-cols-[1.05fr_.95fr] lg:px-8 lg:pt-14 lg:pb-24">
        <div className="rise-in relative z-20">
          {/* Hackathon Winner Glowing Trophy Badge */}
          <div className="mb-5 inline-flex items-center gap-2.5 rounded-full border border-amber-500/40 bg-gradient-to-r from-amber-500/15 via-primary/10 to-accent/15 px-4 py-2 text-xs font-bold uppercase tracking-wider text-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.2)] backdrop-blur-xl">
            <Trophy className="size-4 animate-bounce text-amber-500" />
            <span>Smart Education Hackathon Winner Prototype</span>
          </div>

          <h1 className="max-w-2xl font-display text-5xl leading-[1.04] font-extrabold tracking-tight sm:text-6xl lg:text-7xl">
            A learning bridge for every{" "}
            <span className="relative inline-block bg-gradient-to-r from-accent via-ochre to-leaf bg-clip-text text-transparent drop-shadow-sm">
              mother tongue.
            </span>
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
            Watch spoken Hindi transform into{" "}
            <span
              className={cn(
                "inline-flex items-center gap-1 rounded-lg px-2.5 py-0.5 text-base font-bold transition-all duration-500",
                lang === "sat"
                  ? "bg-emerald-500/20 text-emerald-900 dark:text-emerald-300 ring-2 ring-emerald-500 scale-110 shadow-sm"
                  : "text-foreground font-semibold"
              )}
            >
              <span className="font-tribal text-sm font-bold">ᱥ</span> Santhali
            </span>
            ,{" "}
            <span
              className={cn(
                "inline-flex items-center gap-1 rounded-lg px-2.5 py-0.5 text-base font-bold transition-all duration-500",
                lang === "hoc"
                  ? "bg-amber-500/20 text-amber-950 dark:text-amber-300 ring-2 ring-amber-500 scale-110 shadow-sm"
                  : "text-foreground font-semibold"
              )}
            >
              <span className="font-tribal text-sm font-bold">𑢹</span> Ho
            </span>
            , and{" "}
            <span
              className={cn(
                "inline-flex items-center gap-1 rounded-lg px-2.5 py-0.5 text-base font-bold transition-all duration-500",
                lang === "unr"
                  ? "bg-indigo-500/20 text-indigo-950 dark:text-indigo-300 ring-2 ring-indigo-500 scale-110 shadow-sm"
                  : "text-foreground font-semibold"
              )}
            >
              <span className="font-bold text-sm">म</span> Mundari
            </span>{" "}
            with live animated beam synthesis, sub-3-second speech turnaround, and zero internet.
          </p>

          {/* Aceternity 3D Action Buttons */}
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link to="/live">
              <ShimmerButton
                shimmerColor="rgba(255, 255, 255, 0.45)"
                shimmerDuration="2.2s"
                borderRadius="16px"
                className="h-14 px-8 text-base shadow-[0_12px_32px_rgba(0,0,0,0.25)] hover:scale-105 transition-transform"
              >
                <Mic className="mr-2.5 size-5 animate-pulse" /> Launch Live Voice Room
              </ShimmerButton>
            </Link>

            <Link to="/translate">
              <MovingBorderButton
                borderRadius="16px"
                duration={3200}
                className="h-14 px-7 text-base font-semibold shadow-[0_8px_24px_rgba(0,0,0,0.15)]"
              >
                Translate Lesson <ArrowRight className="ml-2.5 size-4 transition-transform group-hover:translate-x-1" />
              </MovingBorderButton>
            </Link>
          </div>

          {/* Active Dialect Card with Live Telemetry Pulse & 5s Auto-Rotation */}
          <div className="mt-9 rounded-3xl border border-white/20 bg-card/75 p-5 shadow-lg backdrop-blur-2xl">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                <Radio className="size-3.5 text-primary animate-pulse" /> Active Classroom Dialect
              </p>
              <span className="flex items-center gap-1.5 text-xs font-bold text-primary bg-primary/10 border border-primary/20 px-2.5 py-0.5 rounded-full">
                <CheckCircle2 className="size-3.5" /> 100% On-Device Neural Model
              </span>
            </div>
            <div className="mt-3">
              <LangPicker />
            </div>

            {/* 5-Second Animated Language Rotation Controller */}
            <div className="mt-4 flex items-center justify-between gap-3 rounded-2xl border border-primary/30 bg-primary/10 px-4 py-2.5 shadow-sm backdrop-blur-md">
              <div className="flex items-center gap-2 text-xs font-bold text-foreground">
                <RefreshCw
                  className={cn("size-3.5 text-primary", autoRotate && "animate-spin")}
                  style={{ animationDuration: "4s" }}
                />
                <span>5s Cycle:</span>
                <span
                  className={cn(
                    "rounded-md px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-white shadow-xs transition-all",
                    lang === "sat" && "bg-emerald-700",
                    lang === "hoc" && "bg-amber-700",
                    lang === "unr" && "bg-indigo-700"
                  )}
                >
                  {currentMeta.name} ({activeDemo.script})
                </span>
              </div>

              <div className="flex items-center gap-2.5">
                {/* Visual 5-Second Progress Countdown Bar */}
                <div className="h-2 w-20 sm:w-28 overflow-hidden rounded-full bg-secondary border border-border/80">
                  <div
                    className={cn(
                      "h-full transition-all duration-100 ease-linear rounded-full",
                      lang === "sat" && "bg-emerald-600",
                      lang === "hoc" && "bg-amber-600",
                      lang === "unr" && "bg-indigo-600"
                    )}
                    style={{ width: `${timerProgress}%` }}
                  />
                </div>

                {/* Pause / Resume Toggle */}
                <button
                  onClick={() => setAutoRotate(!autoRotate)}
                  className="rounded-lg border border-border bg-card px-2 py-0.5 text-[10px] font-bold text-foreground hover:bg-secondary transition-all cursor-pointer"
                >
                  {autoRotate ? "⏸ Pause" : "▶ Resume"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Hero 3D Card with Traveling Perimeter Laser Beam */}
        <div className="relative z-20 flex flex-col items-center justify-center">
          <div className="mb-2 flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1 text-[11px] font-bold text-primary shadow-sm backdrop-blur-md">
            <Sparkles className="size-3.5 animate-spin" /> Interactive 3D Card • Move cursor to tilt
          </div>

          <CardContainer className="inter-var w-full max-w-lg" containerClassName="py-0">
            <CardBody className="group/card relative h-auto w-full rounded-3xl border border-white/25 bg-gradient-to-b from-card/90 via-card/80 to-card/60 p-6 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.35)] backdrop-blur-3xl transition duration-200 hover:border-primary/50 overflow-hidden">
              {/* Aceternity Border Beam: Continuous Traveling Laser Light */}
              <BorderBeam size={220} duration={9} delay={0} colorFrom="#10b981" colorTo="#f59e0b" />

              {/* 3D Top Header Layer (translateZ=50) */}
              <CardItem
                translateZ="50"
                className="flex w-full items-center justify-between border-b border-border/50 pb-3"
              >
                <div className="flex items-center gap-2">
                  <span className="size-2.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_#10b981]" />
                  <span className="text-xs font-bold uppercase tracking-wider text-foreground">
                    FLN Multilingual Tablet Engine
                  </span>
                </div>
                <span className="rounded-full bg-primary/15 border border-primary/30 px-3 py-0.5 text-[11px] font-bold text-primary">
                  0.8ms Synthesis
                </span>
              </CardItem>

              {/* 3D Photo Canvas Layer (translateZ=40) */}
              <CardItem translateZ="40" className="mt-4 relative w-full overflow-hidden rounded-2xl border-4 border-card/80 shadow-2xl">
                <div className="relative aspect-[4/3] w-full overflow-hidden">
                  <img
                    src={classroomImage}
                    alt="Jharkhand classroom tablet teaching"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover/card:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  
                  {/* Floating Tribal Script Seal at Top-Right of photo (Dynamic color shift per language) */}
                  <div
                    className={cn(
                      "absolute top-3 right-3 flex size-12 items-center justify-center rounded-2xl border-2 border-white/60 font-tribal text-2xl font-extrabold text-white shadow-xl backdrop-blur-md transition-all duration-500",
                      lang === "sat" && "bg-gradient-to-br from-emerald-600 to-emerald-950 scale-105 shadow-emerald-500/40",
                      lang === "hoc" && "bg-gradient-to-br from-amber-600 to-amber-950 scale-105 shadow-amber-500/40",
                      lang === "unr" && "bg-gradient-to-br from-indigo-600 to-indigo-950 scale-105 shadow-indigo-500/40"
                    )}
                  >
                    {activeDemo.symbol}
                  </div>

                  <div className="absolute bottom-3 left-4 right-4 text-white">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-accent drop-shadow-sm">
                      Dumka District Primary School
                    </p>
                    <p className="text-sm font-extrabold text-white drop-shadow-md">
                      Mother-Tongue Classroom Instruction
                    </p>
                  </div>
                </div>
              </CardItem>

              {/* CARD ITEM 1: WHAT TEACHER IS TEACHING IN HINDI (translateZ=70) */}
              <CardItem translateZ="70" className="mt-4 w-full">
                <div className="rounded-2xl border border-white/30 bg-card/95 p-3.5 shadow-lg backdrop-blur-xl">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-accent">
                      <Mic className="size-3.5 text-accent animate-pulse" /> Teacher Teaches in Class (Hindi):
                    </span>
                    <span className="rounded-full bg-accent/15 border border-accent/30 px-2.5 py-0.5 text-[10px] font-bold text-accent">
                      Teacher's Speech
                    </span>
                  </div>
                  <p className="mt-1.5 text-base font-extrabold text-foreground">
                    "{currentHeroLesson.hindi}"
                  </p>
                </div>
              </CardItem>

              {/* CARD ITEM 2: ANIMATED REAL-TIME TRANSLATION BRIDGE (translateZ=80) */}
              <CardItem translateZ="80" className="my-2.5 w-full">
                <div className="flex items-center justify-center gap-2">
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent via-primary/50 to-primary" />
                  <span className="flex items-center gap-1.5 rounded-full border border-primary/40 bg-primary/20 px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary shadow-sm backdrop-blur-md">
                    <Zap className="size-3 text-amber-400 animate-bounce" /> Real-Time Tablet Translation
                  </span>
                  <div className="h-px flex-1 bg-gradient-to-r from-primary via-primary/50 to-transparent" />
                </div>
              </CardItem>

              {/* CARD ITEM 3: REAL TRANSLATION IN LOCAL MOTHER TONGUE (translateZ=90) */}
              <CardItem
                translateZ="90"
                className={cn(
                  "w-full rounded-2xl border p-4 text-white shadow-2xl transition-all duration-700",
                  lang === "sat" && "border-emerald-400/40 bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-800 shadow-[0_15px_30px_rgba(16,185,129,0.3)]",
                  lang === "hoc" && "border-amber-400/40 bg-gradient-to-r from-amber-800 via-amber-700 to-orange-800 shadow-[0_15px_30px_rgba(245,158,11,0.3)]",
                  lang === "unr" && "border-indigo-400/40 bg-gradient-to-r from-indigo-800 via-indigo-700 to-purple-800 shadow-[0_15px_30px_rgba(99,102,241,0.3)]"
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="rounded-full bg-black/35 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider backdrop-blur-sm border border-white/20">
                        {currentMeta.name} ({activeDemo.script})
                      </span>
                      <span className="text-[10px] opacity-90 font-bold">Classroom Audio Output</span>
                    </div>
                    <p className="mt-2 font-tribal text-xl font-extrabold leading-snug drop-shadow-sm">
                      "{activeTranslation.native}"
                    </p>
                    <p className="mt-1 text-xs opacity-95 italic font-medium">
                      "{activeTranslation.roman}"
                    </p>
                  </div>
                  <button
                    onClick={() => handleTestSpeech(activeTranslation.roman)}
                    aria-label="Listen to audio"
                    className="flex size-11 flex-none items-center justify-center rounded-xl bg-white/25 text-white backdrop-blur-md shadow-lg transition-all duration-200 hover:scale-110 active:scale-95 border border-white/40"
                  >
                    <Volume2 className={`size-5 ${isPlayingAudio ? "animate-bounce text-white" : ""}`} />
                  </button>
                </div>

                {/* Animated Audio Equalizer Bars */}
                <div className="mt-3 flex items-end gap-1.5 pt-2 border-t border-white/20">
                  <span className="text-[10px] uppercase font-bold tracking-wider opacity-85 mr-2">Audio Synth:</span>
                  {[35, 80, 50, 95, 65, 100, 45, 85, 55, 90, 35].map((h, i) => (
                    <span
                      key={i}
                      style={{
                        height: isPlayingAudio ? `${h}%` : "35%",
                        animationDuration: `${0.35 + (i % 4) * 0.15}s`,
                      }}
                      className={`w-1 rounded-full bg-white transition-all ${
                        isPlayingAudio ? "animate-pulse" : "h-2 opacity-60"
                      }`}
                    />
                  ))}
                  <span className="ml-auto text-[11px] font-bold text-white drop-shadow-sm">
                    {isPlayingAudio ? "Synthesizing Speech..." : "Tap audio to listen"}
                  </span>
                </div>
              </CardItem>

              {/* CARD ITEM 4: QUICK LESSON SELECTOR TABS (translateZ=65) */}
              <CardItem translateZ="65" className="mt-3 w-full">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mr-1">
                    Lesson:
                  </span>
                  {HERO_LESSONS.map((l, idx) => (
                    <button
                      key={l.id}
                      onClick={() => {
                        setHeroLessonIdx(idx);
                        const t = l.translations[lang]?.roman || l.translations.sat.roman;
                        speak(t, currentMeta.ttsLocale);
                      }}
                      className={`rounded-xl border px-2.5 py-1 text-[11px] font-bold transition-all ${
                        heroLessonIdx === idx
                          ? "border-primary bg-primary text-primary-foreground shadow-sm scale-105"
                          : "border-border/80 bg-secondary/80 text-foreground hover:bg-secondary"
                      }`}
                    >
                      {l.tag}
                    </button>
                  ))}
                </div>
              </CardItem>
            </CardBody>
          </CardContainer>
        </div>
      </section>

      {/* Aceternity Continuous Moving Marquee: Cultural Glyphs & Scripts */}
      <section className="relative z-10 border-y border-border/70 bg-gradient-to-r from-card/30 via-card/75 to-card/30 py-6 backdrop-blur-2xl">
        <div className="mx-auto mb-4 max-w-7xl px-5 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-[11px] font-bold uppercase tracking-wider text-primary shadow-sm backdrop-blur-md">
            <Sparkles className="size-3.5 text-accent animate-pulse" />
            <span>Living Indigenous Lexicon • Hover to Pause • Click Any Card to Hear Classroom Speech</span>
          </div>
        </div>

        <InfiniteMarquee
          speed="normal"
          pauseOnHover={true}
          items={MARQUEE_GLYPHS.map((g, i) => (
            <div
              key={i}
              onClick={() => speak(g.audio, "hi-IN")}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  speak(g.audio, "hi-IN");
                }
              }}
              className={cn(
                "group/glyph relative flex cursor-pointer select-none items-center gap-3.5 rounded-2xl border px-4 py-3 shadow-md backdrop-blur-xl transition-all duration-300 hover:scale-105 hover:-translate-y-1 active:scale-95 bg-card/95 hover:shadow-xl",
                g.lang === "sat" &&
                  "border-emerald-500/30 hover:border-emerald-500 hover:shadow-[0_8px_25px_rgba(16,185,129,0.2)]",
                g.lang === "hoc" &&
                  "border-amber-500/30 hover:border-amber-500 hover:shadow-[0_8px_25px_rgba(217,119,6,0.2)]",
                g.lang === "unr" &&
                  "border-indigo-500/30 hover:border-indigo-500 hover:shadow-[0_8px_25px_rgba(99,102,241,0.2)]"
              )}
            >
              {/* 3D Illuminated Native Script Emblem */}
              <div
                className={cn(
                  "relative flex size-12 shrink-0 items-center justify-center rounded-xl border shadow-md transition-transform duration-300 group-hover/glyph:scale-110",
                  g.lang === "sat" &&
                    "border-emerald-600 bg-gradient-to-br from-emerald-600 to-emerald-800 text-white font-tribal text-2xl font-bold shadow-emerald-700/20",
                  g.lang === "hoc" &&
                    "border-amber-600 bg-gradient-to-br from-amber-600 via-amber-700 to-amber-800 text-white font-tribal text-2xl font-bold shadow-amber-700/20",
                  g.lang === "unr" &&
                    "border-indigo-600 bg-gradient-to-br from-indigo-600 to-indigo-800 text-white text-xl font-extrabold shadow-indigo-700/20"
                )}
              >
                {g.char}
                <div className="pointer-events-none absolute inset-0 rounded-xl bg-white/10 opacity-0 transition-opacity group-hover/glyph:opacity-100" />
              </div>

              {/* Informative Linguistics & Metadata */}
              <div className="flex flex-col text-left">
                {/* Header: Roman Name & Audio Indicator */}
                <div className="flex items-center gap-1.5">
                  <span className="font-display text-sm font-bold tracking-tight text-foreground transition-colors group-hover/glyph:text-primary">
                    {g.roman}
                  </span>
                  <Volume2 className="size-3 text-muted-foreground transition-all duration-300 group-hover/glyph:scale-125 group-hover/glyph:text-primary" />
                </div>

                {/* Meaning: Bilingual English + Hindi */}
                <p className="mt-0.5 max-w-[170px] truncate text-[11px] font-medium text-foreground/80 leading-tight">
                  {g.meaning} <span className="text-muted-foreground">({g.hindi})</span>
                </p>

                {/* Badges: Script & Lexicon Category */}
                <div className="mt-1.5 flex items-center gap-1.5">
                  <span
                    className={cn(
                      "rounded-md px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider",
                      g.lang === "sat" && "bg-emerald-100 text-emerald-900 border border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-500/40",
                      g.lang === "hoc" && "bg-amber-100 text-amber-950 border border-amber-300 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-500/40",
                      g.lang === "unr" && "bg-indigo-100 text-indigo-950 border border-indigo-300 dark:bg-indigo-950/60 dark:text-indigo-300 dark:border-indigo-500/40"
                    )}
                  >
                    {g.script}
                  </span>
                  <span className="rounded-md border border-border/80 bg-secondary px-1.5 py-0.5 text-[9px] font-bold text-foreground/70">
                    {g.category}
                  </span>
                </div>
              </div>
            </div>
          ))}
        />
      </section>

      {/* SHOWSTOPPER: THE LIVING NEURAL LANGUAGE BRIDGE (Animated Data Flow) */}
      <section className="relative z-10 py-24 px-5 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <span className="rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-primary shadow-sm">
              Live Animated Data Stream
            </span>
            <h2 className="mt-4 font-display text-3xl font-extrabold sm:text-5xl">
              The Living Neural Bridge in Action
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-muted-foreground text-sm sm:text-base">
              Click any classroom command below — watch the photon beam travel from the teacher's voice through the neural core into all three mother tongues!
            </p>

            {/* Quick Command Selector */}
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              {PIPELINE_PROMPTS.map((p, i) => (
                <button
                  key={i}
                  onClick={() => triggerBeamFlow(i)}
                  className={`flex items-center gap-2 rounded-2xl border px-4 py-2.5 text-xs font-bold transition-all shadow-sm ${
                    selectedPromptIdx === i
                      ? "border-primary bg-primary text-primary-foreground scale-105 shadow-[0_0_20px_rgba(var(--primary),0.35)]"
                      : "border-border/80 bg-card/80 text-foreground hover:bg-secondary"
                  }`}
                >
                  <Play className={`size-3 ${selectedPromptIdx === i ? "animate-ping" : ""}`} />
                  "{p.hindi}"
                </button>
              ))}
            </div>
          </div>

          {/* Animated Beam Interactive Canvas */}
          <div
            ref={bridgeContainerRef}
            className="relative mt-16 flex min-h-[380px] w-full flex-col items-center justify-between rounded-3xl border border-white/20 bg-gradient-to-b from-card/90 via-card/75 to-card/50 p-8 shadow-2xl backdrop-blur-2xl md:flex-row md:items-center overflow-hidden"
          >
            {/* Ambient Pulse Core */}
            <div className="absolute inset-0 bg-radial-gradient from-primary/10 via-transparent to-transparent pointer-events-none" />

            {/* NODE 1: TEACHER VOICE INPUT (Left) */}
            <div
              ref={teacherInputRef}
              className="relative z-20 flex flex-col items-center text-center p-4 rounded-3xl border border-white/20 bg-card/90 shadow-xl backdrop-blur-md max-w-xs transition-transform duration-300 hover:scale-105"
            >
              <div className="relative flex size-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-emerald-800 text-white shadow-lg">
                <Mic className="size-8 animate-pulse" />
                <span className="absolute -top-1 -right-1 size-3 rounded-full bg-emerald-400 animate-ping" />
              </div>
              <p className="mt-3 text-xs font-bold uppercase tracking-wider text-primary">
                Teacher Input (Hindi)
              </p>
              <p className="mt-1 font-display text-lg font-extrabold text-foreground">
                "{currentPrompt.hindi}"
              </p>
              <span className="mt-2 text-[10px] font-semibold text-muted-foreground">
                Acoustic Microphone Stream
              </span>
            </div>

            {/* NODE 2: CENTRAL NEURAL BRIDGE ENGINE CORE (Center) */}
            <div
              ref={neuralCoreRef}
              className="relative z-20 my-8 flex flex-col items-center text-center p-6 rounded-3xl border border-amber-500/30 bg-card/95 shadow-[0_0_35px_rgba(245,158,11,0.25)] backdrop-blur-md md:my-0"
            >
              <div className="relative flex size-20 items-center justify-center rounded-3xl bg-gradient-to-br from-amber-500 via-ochre to-orange-700 text-white shadow-2xl">
                <Cpu className="size-10 animate-spin" style={{ animationDuration: "12s" }} />
                <span className="absolute inset-0 rounded-3xl border border-white/40 animate-pulse" />
              </div>
              <p className="mt-3 text-xs font-extrabold uppercase tracking-wider text-amber-500">
                Bhasha Setu Neural Core
              </p>
              <p className="mt-1 text-sm font-bold text-foreground">
                FLN Lexical Phoneme Matrix
              </p>
              <div className="mt-2 flex items-center gap-1.5 text-[11px] font-bold text-primary">
                <Zap className="size-3.5" /> 0.8ms • Zero Cloud
              </div>
            </div>

            {/* NODE 3: THREE CLASSROOM TARGET TERMINALS (Right Stack) */}
            <div className="relative z-20 flex flex-col gap-4 w-full md:w-auto md:min-w-[280px]">
              {/* Santhali Terminal */}
              <div
                ref={satTargetRef}
                onClick={() => speak(currentPrompt.satRoman, "hi-IN")}
                className="group/term cursor-pointer rounded-2xl border border-primary/30 bg-card/90 p-3.5 shadow-md backdrop-blur-md transition-all hover:scale-105 hover:border-primary"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
                    Santhali (Ol Chiki)
                  </span>
                  <Volume2 className="size-3.5 text-primary group-hover/term:animate-bounce" />
                </div>
                <p className="mt-1 font-tribal text-base font-bold text-foreground">
                  {currentPrompt.sat}
                </p>
                <p className="text-[11px] text-muted-foreground italic">"{currentPrompt.satRoman}"</p>
              </div>

              {/* Ho Terminal */}
              <div
                ref={hocTargetRef}
                onClick={() => speak(currentPrompt.hocRoman, "hi-IN")}
                className="group/term cursor-pointer rounded-2xl border border-accent/30 bg-card/90 p-3.5 shadow-md backdrop-blur-md transition-all hover:scale-105 hover:border-accent"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-accent">
                    Ho (Warang Citi)
                  </span>
                  <Volume2 className="size-3.5 text-accent group-hover/term:animate-bounce" />
                </div>
                <p className="mt-1 font-bold text-foreground">
                  {currentPrompt.hoc}
                </p>
                <p className="text-[11px] text-muted-foreground italic">"{currentPrompt.hocRoman}"</p>
              </div>

              {/* Mundari Terminal */}
              <div
                ref={unrTargetRef}
                onClick={() => speak(currentPrompt.unrRoman, "hi-IN")}
                className="group/term cursor-pointer rounded-2xl border border-ochre/30 bg-card/90 p-3.5 shadow-md backdrop-blur-md transition-all hover:scale-105 hover:border-ochre"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-ochre">
                    Mundari (Devanagari)
                  </span>
                  <Volume2 className="size-3.5 text-ochre group-hover/term:animate-bounce" />
                </div>
                <p className="mt-1 font-bold text-foreground">
                  {currentPrompt.unr}
                </p>
                <p className="text-[11px] text-muted-foreground italic">"{currentPrompt.unrRoman}"</p>
              </div>
            </div>

            {/* Continuous Traveling Animated Beams */}
            <AnimatedBeam
              containerRef={bridgeContainerRef}
              fromRef={teacherInputRef}
              toRef={neuralCoreRef}
              duration={3.5}
              pathColor="rgba(16, 185, 129, 0.2)"
              gradientStartColor="#10b981"
              gradientStopColor="#f59e0b"
            />
            <AnimatedBeam
              containerRef={bridgeContainerRef}
              fromRef={neuralCoreRef}
              toRef={satTargetRef}
              duration={3}
              pathColor="rgba(16, 185, 129, 0.2)"
              gradientStartColor="#f59e0b"
              gradientStopColor="#10b981"
            />
            <AnimatedBeam
              containerRef={bridgeContainerRef}
              fromRef={neuralCoreRef}
              toRef={hocTargetRef}
              duration={3.2}
              delay={0.4}
              pathColor="rgba(245, 158, 11, 0.2)"
              gradientStartColor="#f59e0b"
              gradientStopColor="#f97316"
            />
            <AnimatedBeam
              containerRef={bridgeContainerRef}
              fromRef={neuralCoreRef}
              toRef={unrTargetRef}
              duration={3.4}
              delay={0.8}
              pathColor="rgba(99, 102, 241, 0.2)"
              gradientStartColor="#f59e0b"
              gradientStopColor="#6366f1"
            />
          </div>
        </div>
      </section>

      {/* 3D Pin Showcase: The 3 Mother Tongues of Jharkhand */}
      <section className="relative z-10 border-y border-border/80 bg-gradient-to-b from-card/40 via-background to-card/30 py-24">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="text-center">
            <span className="rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-primary shadow-sm">
              Aceternity 3D Acoustic Holograms
            </span>
            <h2 className="mt-4 font-display text-3xl font-extrabold sm:text-5xl">
              Live Voice Transformation Holograms
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-muted-foreground text-base">
              Hover over each language terminal to tilt into 3D space and watch the acoustic voice waveform transform from Hindi into the mother tongue.
            </p>
          </div>

          <div className="mt-16 grid gap-12 md:grid-cols-3">
            {/* Santhali 3D Pin */}
            <div className="flex justify-center">
              <PinContainer
                title={
                  <div className="flex items-center gap-2 text-xs font-bold">
                    <span className="text-slate-200">🎙️ हिंदी "खाना खाओ"</span>
                    <span className="text-emerald-400 font-extrabold">➔</span>
                    <span className="text-emerald-300 font-tribal">🔊 ᱫᱟᱠᱟ ᱡᱚᱢ ᱢᱮ</span>
                  </div>
                }
                href="/translate"
                className="w-full max-w-sm p-6"
              >
                {/* Header: Script Emblem & Details */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-600 via-emerald-700 to-emerald-900 font-tribal text-3xl font-bold text-white shadow-lg border border-emerald-500/50">
                      ᱥ
                    </div>
                    <div>
                      <h3 className="font-display text-xl font-bold text-foreground">Santhali</h3>
                      <p className="text-xs text-muted-foreground font-semibold">Ol Chiki • ~7.4M speakers</p>
                    </div>
                  </div>
                  <span className="rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-500/40 px-2.5 py-0.5 text-[10px] font-bold">
                    Live Channel
                  </span>
                </div>

                {/* THE ACOUSTIC VOICE TRANSFORMATION CHAMBER */}
                <div className="mt-5 rounded-2xl border border-emerald-500/30 bg-gradient-to-b from-emerald-50/70 via-card to-card p-4 shadow-sm dark:from-emerald-950/25 dark:via-card dark:to-card">
                  <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider pb-2 border-b border-border/60">
                    <span className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 font-bold">
                      <Mic className="size-3 text-slate-500 animate-pulse" /> Source Voice
                    </span>
                    <span className="text-emerald-700 dark:text-emerald-400 font-mono font-bold flex items-center gap-1">
                      <Zap className="size-3" /> Voice Shift
                    </span>
                    <span className="flex items-center gap-1 text-emerald-900 dark:text-emerald-300 font-bold">
                      <Volume2 className="size-3 text-emerald-600 dark:text-emerald-400" /> Target Speech
                    </span>
                  </div>

                  <div className="mt-3 flex items-center justify-between gap-2">
                    {/* Left: Hindi Input Voice */}
                    <div className="flex-1 rounded-xl border border-slate-200 bg-slate-50/90 dark:border-slate-800 dark:bg-slate-900/60 p-2.5 text-center shadow-xs">
                      <span className="text-[9px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">Teacher Voice</span>
                      <p className="mt-0.5 font-bold text-xs text-slate-900 dark:text-white truncate">"खाना खाओ"</p>
                      <p className="text-[9px] text-slate-500 italic">"Khana khao"</p>
                    </div>

                    {/* Middle: Traveling Soundwave Beam */}
                    <div className="flex flex-col items-center justify-center px-1">
                      <div className="flex items-end gap-0.5 h-4 mb-1">
                        <span className="w-0.5 h-2 bg-emerald-600 dark:bg-emerald-400 animate-pulse" />
                        <span className="w-0.5 h-4 bg-emerald-600 dark:bg-emerald-400 animate-pulse delay-75" />
                        <span className="w-0.5 h-1.5 bg-emerald-600 dark:bg-emerald-400 animate-pulse delay-150" />
                      </div>
                      <ArrowRight className="size-4 text-emerald-600 dark:text-emerald-400 animate-bounce" />
                    </div>

                    {/* Right: Tribal Synthesized Voice */}
                    <div className="flex-1 rounded-xl border border-emerald-300 bg-emerald-100/70 dark:border-emerald-500/40 dark:bg-emerald-950/50 p-2.5 text-center shadow-xs">
                      <span className="text-[9px] font-bold uppercase tracking-wider text-emerald-900 dark:text-emerald-300">Synthesized</span>
                      <p className="mt-0.5 font-tribal font-bold text-xs text-emerald-950 dark:text-emerald-100 truncate">ᱫᱟᱠᱟ ᱡᱚᱢ ᱢᱮ</p>
                      <p className="text-[9px] text-emerald-800 dark:text-emerald-300 font-bold italic truncate">"Daka jom me"</p>
                    </div>
                  </div>

                  {/* Interactive Audio Play Button */}
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      speak("daka jom me", "hi-IN");
                    }}
                    className="mt-3.5 flex items-center justify-between rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white px-3.5 py-2.5 text-xs font-bold transition-all shadow-md shadow-emerald-700/25 cursor-pointer group/btn active:scale-95"
                  >
                    <div className="flex items-center gap-1.5">
                      <Volume2 className="size-3.5 text-emerald-200 group-hover/btn:scale-125 transition-transform" />
                      <span>Hear Ol Chiki Pronunciation</span>
                    </div>
                    <span className="rounded-md bg-emerald-900/80 px-2 py-0.5 text-[10px] font-mono font-extrabold uppercase tracking-wider text-emerald-200">▶ Play</span>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between text-xs font-bold text-emerald-800 dark:text-emerald-400">
                  <span>Santhal Pargana &amp; Kolhan</span>
                  <ArrowRight className="size-4 transition-transform group-hover/pin:translate-x-1" />
                </div>
              </PinContainer>
            </div>

            {/* Ho 3D Pin */}
            <div className="flex justify-center">
              <PinContainer
                title={
                  <div className="flex items-center gap-2 text-xs font-bold">
                    <span className="text-slate-200">🎙️ हिंदी "खाना खाओ"</span>
                    <span className="text-amber-400 font-extrabold">➔</span>
                    <span className="text-amber-300 font-tribal">🔊 ᱢᱟᱱᱰᱤ ᱡᱚᱢᱮᱢ</span>
                  </div>
                }
                href="/translate"
                className="w-full max-w-sm p-6"
              >
                {/* Header: Script Emblem & Details */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-600 via-amber-700 to-amber-900 font-tribal text-3xl font-bold text-white shadow-lg border border-amber-500/50">
                      𑢹
                    </div>
                    <div>
                      <h3 className="font-display text-xl font-bold text-foreground">Ho</h3>
                      <p className="text-xs text-muted-foreground font-semibold">Warang Citi • ~1.4M speakers</p>
                    </div>
                  </div>
                  <span className="rounded-full bg-amber-100 text-amber-950 border border-amber-300 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-500/40 px-2.5 py-0.5 text-[10px] font-bold">
                    Live Channel
                  </span>
                </div>

                {/* THE ACOUSTIC VOICE TRANSFORMATION CHAMBER */}
                <div className="mt-5 rounded-2xl border border-amber-500/30 bg-gradient-to-b from-amber-50/70 via-card to-card p-4 shadow-sm dark:from-amber-950/25 dark:via-card dark:to-card">
                  <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider pb-2 border-b border-border/60">
                    <span className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 font-bold">
                      <Mic className="size-3 text-slate-500 animate-pulse" /> Source Voice
                    </span>
                    <span className="text-amber-700 dark:text-amber-400 font-mono font-bold flex items-center gap-1">
                      <Zap className="size-3" /> Voice Shift
                    </span>
                    <span className="flex items-center gap-1 text-amber-950 dark:text-amber-300 font-bold">
                      <Volume2 className="size-3 text-amber-600 dark:text-amber-400" /> Target Speech
                    </span>
                  </div>

                  <div className="mt-3 flex items-center justify-between gap-2">
                    {/* Left: Hindi Input Voice */}
                    <div className="flex-1 rounded-xl border border-slate-200 bg-slate-50/90 dark:border-slate-800 dark:bg-slate-900/60 p-2.5 text-center shadow-xs">
                      <span className="text-[9px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">Teacher Voice</span>
                      <p className="mt-0.5 font-bold text-xs text-slate-900 dark:text-white truncate">"खाना खाओ"</p>
                      <p className="text-[9px] text-slate-500 italic">"Khana khao"</p>
                    </div>

                    {/* Middle: Traveling Soundwave Beam */}
                    <div className="flex flex-col items-center justify-center px-1">
                      <div className="flex items-end gap-0.5 h-4 mb-1">
                        <span className="w-0.5 h-2 bg-amber-600 dark:bg-amber-400 animate-pulse" />
                        <span className="w-0.5 h-4 bg-amber-600 dark:bg-amber-400 animate-pulse delay-75" />
                        <span className="w-0.5 h-1.5 bg-amber-600 dark:bg-amber-400 animate-pulse delay-150" />
                      </div>
                      <ArrowRight className="size-4 text-amber-600 dark:text-amber-400 animate-bounce" />
                    </div>

                    {/* Right: Tribal Synthesized Voice */}
                    <div className="flex-1 rounded-xl border border-amber-300 bg-amber-100/70 dark:border-amber-500/40 dark:bg-amber-950/50 p-2.5 text-center shadow-xs">
                      <span className="text-[9px] font-bold uppercase tracking-wider text-amber-950 dark:text-amber-300">Synthesized</span>
                      <p className="mt-0.5 font-tribal font-bold text-xs text-amber-950 dark:text-amber-100 truncate">ᱢᱟᱱᱰᱤ ᱡᱚᱢᱮᱢ</p>
                      <p className="text-[9px] text-amber-900 dark:text-amber-300 font-bold italic truncate">"Mandi jomem"</p>
                    </div>
                  </div>

                  {/* Interactive Audio Play Button */}
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      speak("mandi jomem", "hi-IN");
                    }}
                    className="mt-3.5 flex items-center justify-between rounded-xl bg-amber-700 hover:bg-amber-800 text-white px-3.5 py-2.5 text-xs font-bold transition-all shadow-md shadow-amber-700/25 cursor-pointer group/btn active:scale-95"
                  >
                    <div className="flex items-center gap-1.5">
                      <Volume2 className="size-3.5 text-amber-200 group-hover/btn:scale-125 transition-transform" />
                      <span>Hear Ho Pronunciation</span>
                    </div>
                    <span className="rounded-md bg-amber-900/80 px-2 py-0.5 text-[10px] font-mono font-extrabold uppercase tracking-wider text-amber-200">▶ Play</span>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between text-xs font-bold text-amber-900 dark:text-amber-400">
                  <span>West Singhbhum &amp; Kolhan</span>
                  <ArrowRight className="size-4 transition-transform group-hover/pin:translate-x-1" />
                </div>
              </PinContainer>
            </div>

            {/* Mundari 3D Pin */}
            <div className="flex justify-center">
              <PinContainer
                title={
                  <div className="flex items-center gap-2 text-xs font-bold">
                    <span className="text-slate-200">🎙️ हिंदी "खाना खाओ"</span>
                    <span className="text-indigo-400 font-extrabold">➔</span>
                    <span className="text-indigo-300">🔊 मंडी जोम मे</span>
                  </div>
                }
                href="/translate"
                className="w-full max-w-sm p-6"
              >
                {/* Header: Script Emblem & Details */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 via-indigo-700 to-indigo-900 font-display text-3xl font-bold text-white shadow-lg border border-indigo-500/50">
                      म
                    </div>
                    <div>
                      <h3 className="font-display text-xl font-bold text-foreground">Mundari</h3>
                      <p className="text-xs text-muted-foreground font-semibold">Devanagari • ~1.1M speakers</p>
                    </div>
                  </div>
                  <span className="rounded-full bg-indigo-100 text-indigo-950 border border-indigo-300 dark:bg-indigo-950/60 dark:text-indigo-300 dark:border-indigo-500/40 px-2.5 py-0.5 text-[10px] font-bold">
                    Live Channel
                  </span>
                </div>

                {/* THE ACOUSTIC VOICE TRANSFORMATION CHAMBER */}
                <div className="mt-5 rounded-2xl border border-indigo-500/30 bg-gradient-to-b from-indigo-50/70 via-card to-card p-4 shadow-sm dark:from-indigo-950/25 dark:via-card dark:to-card">
                  <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider pb-2 border-b border-border/60">
                    <span className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 font-bold">
                      <Mic className="size-3 text-slate-500 animate-pulse" /> Source Voice
                    </span>
                    <span className="text-indigo-700 dark:text-indigo-400 font-mono font-bold flex items-center gap-1">
                      <Zap className="size-3" /> Voice Shift
                    </span>
                    <span className="flex items-center gap-1 text-indigo-950 dark:text-indigo-300 font-bold">
                      <Volume2 className="size-3 text-indigo-600 dark:text-indigo-400" /> Target Speech
                    </span>
                  </div>

                  <div className="mt-3 flex items-center justify-between gap-2">
                    {/* Left: Hindi Input Voice */}
                    <div className="flex-1 rounded-xl border border-slate-200 bg-slate-50/90 dark:border-slate-800 dark:bg-slate-900/60 p-2.5 text-center shadow-xs">
                      <span className="text-[9px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">Teacher Voice</span>
                      <p className="mt-0.5 font-bold text-xs text-slate-900 dark:text-white truncate">"खाना खाओ"</p>
                      <p className="text-[9px] text-slate-500 italic">"Khana khao"</p>
                    </div>

                    {/* Middle: Traveling Soundwave Beam */}
                    <div className="flex flex-col items-center justify-center px-1">
                      <div className="flex items-end gap-0.5 h-4 mb-1">
                        <span className="w-0.5 h-2 bg-indigo-600 dark:bg-indigo-400 animate-pulse" />
                        <span className="w-0.5 h-4 bg-indigo-600 dark:bg-indigo-400 animate-pulse delay-75" />
                        <span className="w-0.5 h-1.5 bg-indigo-600 dark:bg-indigo-400 animate-pulse delay-150" />
                      </div>
                      <ArrowRight className="size-4 text-indigo-600 dark:text-indigo-400 animate-bounce" />
                    </div>

                    {/* Right: Tribal Synthesized Voice */}
                    <div className="flex-1 rounded-xl border border-indigo-300 bg-indigo-100/70 dark:border-indigo-500/40 dark:bg-indigo-950/50 p-2.5 text-center shadow-xs">
                      <span className="text-[9px] font-bold uppercase tracking-wider text-indigo-950 dark:text-indigo-300">Synthesized</span>
                      <p className="mt-0.5 font-bold text-xs text-indigo-950 dark:text-indigo-100 truncate">मंडी जोम मे</p>
                      <p className="text-[9px] text-indigo-900 dark:text-indigo-300 font-bold italic truncate">"Mandi jom me"</p>
                    </div>
                  </div>

                  {/* Interactive Audio Play Button */}
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      speak("mandi jom me", "hi-IN");
                    }}
                    className="mt-3.5 flex items-center justify-between rounded-xl bg-indigo-700 hover:bg-indigo-800 text-white px-3.5 py-2.5 text-xs font-bold transition-all shadow-md shadow-indigo-700/25 cursor-pointer group/btn active:scale-95"
                  >
                    <div className="flex items-center gap-1.5">
                      <Volume2 className="size-3.5 text-indigo-200 group-hover/btn:scale-125 transition-transform" />
                      <span>Hear Mundari Pronunciation</span>
                    </div>
                    <span className="rounded-md bg-indigo-900/80 px-2 py-0.5 text-[10px] font-mono font-extrabold uppercase tracking-wider text-indigo-200">▶ Play</span>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between text-xs font-bold text-indigo-800 dark:text-indigo-400">
                  <span>Khunti, Ranchi &amp; Gumla</span>
                  <ArrowRight className="size-4 transition-transform group-hover/pin:translate-x-1" />
                </div>
              </PinContainer>
            </div>
          </div>
        </div>
      </section>

      {/* Aceternity Bento Grid: Modern Tool Suite with 3D Depth */}
      <section className="relative z-10 py-28">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="mb-14 flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
            <div>
              <span className="rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-primary shadow-sm">
                Aceternity 3D Bento System
              </span>
              <h2 className="mt-4 font-display text-4xl font-extrabold sm:text-5xl">
                The Complete Teaching Suite
              </h2>
            </div>
            <p className="max-w-md text-sm text-muted-foreground leading-relaxed">
              Every tool tilts in 3D perspective with mouse movement, featuring on-device OCR, voice-to-voice audio, and printable sheets.
            </p>
          </div>

          <BentoGrid>
            {/* Bento Item 1: Curriculum Translation & Camera OCR (Col Span 2) */}
            <BentoGridItem
              className="md:col-span-2"
              badge="Optical OCR & Neural Translation"
              icon={<Languages className="size-5 text-primary" />}
              title="Curriculum Translation & Camera OCR"
              description="Point tablet camera at blackboard or textbook page. The offline vision engine converts Hindi lesson scripts into Santhali, Ho, or Mundari in sub-millisecond speeds."
              header={
                <div className="relative flex h-52 w-full flex-col justify-between overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-950/30 via-card/90 to-card/70 p-4 border border-emerald-500/25 shadow-xl">
                  {/* Animated OCR Laser Scanning Beam */}
                  <div className="pointer-events-none absolute left-3 right-3 h-0.5 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_12px_#10b981] animate-scan-line z-30" />

                  {/* Top Bar: Camera & Offline Status */}
                  <div className="relative z-20 flex items-center justify-between border-b border-border/50 pb-2 text-xs">
                    <div className="flex items-center gap-2">
                      <div className="flex size-6 items-center justify-center rounded-lg bg-primary/20 text-primary">
                        <Camera className="size-3.5" />
                      </div>
                      <span className="font-bold text-foreground">Blackboard OCR Viewfinder</span>
                    </div>
                    <div className="flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-[10px] font-bold text-emerald-400 border border-emerald-500/30">
                      <span className="size-1.5 rounded-full bg-emerald-400 animate-ping" />
                      <span>Live 100% Offline Engine</span>
                    </div>
                  </div>

                  {/* Main Flow: Scanned Hindi Source -> Instant Tribal Output */}
                  <div className="relative z-20 my-2 grid grid-cols-1 md:grid-cols-2 gap-3 items-center">
                    {/* Hindi Source */}
                    <div className="rounded-xl border border-border/70 bg-background/90 p-3 shadow-inner">
                      <div className="flex items-center justify-between text-[10px] text-muted-foreground font-bold uppercase tracking-wider">
                        <span>Hindi Textbook Input</span>
                        <span className="text-emerald-400 font-mono">99.4% Optical Match</span>
                      </div>
                      <p className="mt-1 font-semibold text-sm text-foreground">
                        "सब बच्चे बैठ जाओ और सुनो"
                      </p>
                      <div className="mt-1 flex items-center gap-1 text-[10px] text-muted-foreground font-medium">
                        <span>Chapter 2 • FLN Oral Language</span>
                      </div>
                    </div>

                    {/* Tribal Output */}
                    <div className="rounded-xl border border-primary/30 bg-primary/10 p-3 shadow-inner">
                      <div className="flex items-center justify-between text-[10px] text-primary font-bold uppercase tracking-wider">
                        <span>Santhali (Ol Chiki)</span>
                        <span className="text-amber-400 font-mono font-bold">⚡ 0.8ms</span>
                      </div>
                      <p className="mt-1 font-tribal text-base font-bold text-primary truncate">
                        ᱡᱚᱛᱚ ᱜᱤᱫᱽᱨᱟᱹ ᱫᱩᱨᱩᱯ ᱯᱮ ᱟᱨ ᱟᱸᱡᱚᱢ ᱯᱮ
                      </p>
                      <p className="mt-1 text-[10px] text-muted-foreground italic truncate">
                        "Joto gidra durup pe ar anjom pe"
                      </p>
                    </div>
                  </div>

                  {/* Bottom Stats & Mode */}
                  <div className="relative z-20 flex items-center justify-between text-[10px] text-muted-foreground pt-1 border-t border-border/40">
                    <span className="font-semibold text-foreground/80">Input: Camera OCR, Photo Upload or Direct Typing</span>
                    <span className="font-mono text-primary font-bold">Zero Telemetry • No Internet Needed</span>
                  </div>
                </div>
              }
              action={
                <Link to="/translate" className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline">
                  Launch Translation Studio <ArrowRight className="size-3.5 transition-transform group-hover/bento:translate-x-1" />
                </Link>
              }
            />

            {/* Bento Item 2: Live Classroom Mode (Col Span 1) */}
            <BentoGridItem
              badge="Live Voice-to-Voice"
              icon={<Mic className="size-5 text-accent" />}
              title="Live Classroom Dialogue"
              description="Teacher speaks Hindi naturally; the tablet speaker synthesizes Santhali, Ho, or Mundari in sub-3 seconds."
              header={
                <div className="relative flex h-52 w-full flex-col justify-between overflow-hidden rounded-2xl bg-gradient-to-br from-accent/15 via-card/90 to-card/70 p-3.5 border border-accent/25 shadow-xl">
                  {/* Top Dialogue Bubble: Teacher Speaks */}
                  <div className="flex items-center gap-2.5 rounded-xl border border-primary/20 bg-background/90 p-2.5 shadow-sm">
                    <div className="relative flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/20 text-primary">
                      <Mic className="size-4 animate-pulse" />
                      <span className="absolute -top-0.5 -right-0.5 size-2 rounded-full bg-emerald-400 animate-ping" />
                    </div>
                    <div className="overflow-hidden">
                      <span className="text-[9px] font-bold uppercase tracking-wider text-primary">Teacher (Hindi)</span>
                      <p className="text-xs font-bold text-foreground truncate">"आज हम गिनती सीखेंगे"</p>
                    </div>
                  </div>

                  {/* Middle: Live Audio Equalizer Waveform */}
                  <div className="my-1 flex items-center justify-center gap-2 rounded-lg bg-secondary/40 py-1.5 px-3">
                    <span className="text-[9px] font-mono text-muted-foreground font-bold">ACOUSTIC STREAM</span>
                    <div className="flex items-end gap-1 h-5 px-1">
                      <span className="w-1 rounded-full bg-primary animate-eq" style={{ animationDelay: "0s" }} />
                      <span className="w-1 rounded-full bg-accent animate-eq" style={{ animationDelay: "0.2s" }} />
                      <span className="w-1 rounded-full bg-emerald-400 animate-eq" style={{ animationDelay: "0.4s" }} />
                      <span className="w-1 rounded-full bg-amber-400 animate-eq" style={{ animationDelay: "0.1s" }} />
                      <span className="w-1 rounded-full bg-primary animate-eq" style={{ animationDelay: "0.3s" }} />
                    </div>
                    <span className="text-[9px] font-mono font-bold text-accent">&lt; 3s Turnaround</span>
                  </div>

                  {/* Bottom Dialogue Bubble: Students Hear */}
                  <div className="flex items-center gap-2.5 rounded-xl border border-accent/30 bg-accent/10 p-2.5 shadow-sm">
                    <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-accent/20 text-accent">
                      <Volume2 className="size-4 animate-bounce" />
                    </div>
                    <div className="overflow-hidden">
                      <span className="text-[9px] font-bold uppercase tracking-wider text-accent">Classroom Speaker</span>
                      <p className="font-tribal text-xs font-bold text-foreground truncate">ᱛᱮᱦᱮᱸ ᱟᱵᱩ ᱞᱮᱠᱷᱟ ᱵᱚ ᱛᱚᱞᱟᱣᱟ</p>
                      <p className="text-[10px] text-muted-foreground italic truncate">"Tehen abo lekha bo tolaa"</p>
                    </div>
                  </div>
                </div>
              }
              action={
                <Link to="/live" className="inline-flex items-center gap-1.5 text-xs font-bold text-accent hover:underline">
                  Open Voice Dialogue <ArrowRight className="size-3.5 transition-transform group-hover/bento:translate-x-1" />
                </Link>
              }
            />

            {/* Bento Item 3: Bilingual Worksheets (Col Span 1) */}
            <BentoGridItem
              badge="Printable FLN Activity"
              icon={<FileText className="size-5 text-ochre" />}
              title="Bilingual Worksheets"
              description="One-click printable handwriting tracing sheets and picture flashcards for primary numeracy and vocabulary."
              header={
                <div className="relative flex h-52 w-full flex-col justify-between overflow-hidden rounded-2xl bg-gradient-to-br from-ochre/15 via-card/90 to-card/70 p-3.5 border border-ochre/25 shadow-xl">
                  {/* Worksheet Header */}
                  <div className="flex items-center justify-between border-b border-border/50 pb-2">
                    <div className="flex items-center gap-1.5">
                      <Printer className="size-3.5 text-ochre" />
                      <span className="text-xs font-bold text-foreground">FLN Activity Sheet</span>
                    </div>
                    <span className="rounded-md bg-ochre/20 px-1.5 py-0.5 text-[9px] font-bold text-ochre border border-ochre/30">
                      Print Ready
                    </span>
                  </div>

                  {/* Tracing Rows with Animated Pencil */}
                  <div className="space-y-2 py-1">
                    <div className="relative flex items-center justify-between rounded-lg border border-border/60 bg-background/80 px-2.5 py-1.5 text-xs">
                      <span className="font-semibold text-foreground">🍎 सेब (Apple)</span>
                      <div className="relative flex items-center gap-1">
                        <span className="font-tribal font-bold text-primary">ᱥᱮᱣ (Sew)</span>
                        <span className="text-xs animate-pencil">✏️</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between rounded-lg border border-border/60 bg-background/80 px-2.5 py-1.5 text-xs">
                      <span className="font-semibold text-foreground">☀️ सूरज (Sun)</span>
                      <span className="font-tribal font-bold text-primary">ᱵᱮᱲᱟ (Bera)</span>
                    </div>
                  </div>

                  {/* Direct USB / Thermal Printer Tag */}
                  <div className="flex items-center justify-between pt-1 border-t border-border/40 text-[10px] text-muted-foreground">
                    <span className="font-medium">Direct A4 / Thermal Print</span>
                    <span className="font-bold text-ochre">NIPUN Bharat</span>
                  </div>
                </div>
              }
              action={
                <Link to="/worksheets" className="inline-flex items-center gap-1.5 text-xs font-bold text-ochre hover:underline">
                  Generate Worksheets <ArrowRight className="size-3.5 transition-transform group-hover/bento:translate-x-1" />
                </Link>
              }
            />

            {/* Bento Item 4: Offline Lesson Library (Col Span 1) */}
            <BentoGridItem
              badge="100% Offline Storage"
              icon={<BookMarked className="size-5 text-leaf" />}
              title="Offline Lesson Library"
              description="Pre-packaged FLN lessons for mathematics, science, and oral stories stored on device without internet."
              header={
                <div className="relative flex h-52 w-full flex-col justify-between overflow-hidden rounded-2xl bg-gradient-to-br from-leaf/15 via-card/90 to-card/70 p-3.5 border border-leaf/25 shadow-xl">
                  {/* Status Tag */}
                  <div className="flex items-center justify-between border-b border-border/50 pb-2">
                    <div className="flex items-center gap-1.5">
                      <span className="size-2 rounded-full bg-leaf animate-pulse" />
                      <span className="text-xs font-bold text-foreground">IndexedDB Cache</span>
                    </div>
                    <span className="rounded-md bg-leaf/20 px-1.5 py-0.5 text-[9px] font-bold text-leaf border border-leaf/30">
                      Sync Once
                    </span>
                  </div>

                  {/* Active Lesson Showcase */}
                  <div className="rounded-xl border border-leaf/30 bg-leaf/10 p-3">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-leaf">Unit 2 • Oral Language</p>
                    <p className="mt-0.5 font-bold text-sm text-foreground">हमारे आस-पास के जानवर</p>
                    <div className="mt-2 flex gap-1.5">
                      <span className="rounded-md bg-secondary/90 px-1.5 py-0.5 text-[9px] font-bold">ᱥ Santhali</span>
                      <span className="rounded-md bg-secondary/90 px-1.5 py-0.5 text-[9px] font-bold">𑢹 Ho</span>
                      <span className="rounded-md bg-secondary/90 px-1.5 py-0.5 text-[9px] font-bold">म Mundari</span>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-1 border-t border-border/40 text-[10px] text-muted-foreground">
                    <span>12 FLN Modules Cached</span>
                    <span className="font-bold text-leaf">Zero 4G Needed</span>
                  </div>
                </div>
              }
              action={
                <Link to="/library" className="inline-flex items-center gap-1.5 text-xs font-bold text-leaf hover:underline">
                  Browse Lesson Library <ArrowRight className="size-3.5 transition-transform group-hover/bento:translate-x-1" />
                </Link>
              }
            />

            {/* Bento Item 5: Real-Time Classroom Progress (Col Span 1) */}
            <BentoGridItem
              badge="Zero Cloud Telemetry"
              icon={<Activity className="size-5 text-indigo-deep" />}
              title="On-Device Analytics"
              description="Track classroom fluency, vocabulary spoken, and lessons covered with 100% on-device privacy guarantee."
              header={
                <div className="relative flex h-52 w-full flex-col justify-between overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-500/15 via-card/90 to-card/70 p-3.5 border border-indigo-500/25 shadow-xl">
                  {/* Privacy Badge */}
                  <div className="flex items-center justify-between border-b border-border/50 pb-2">
                    <div className="flex items-center gap-1.5">
                      <ShieldCheck className="size-4 text-emerald-400" />
                      <span className="text-xs font-bold text-foreground">100% Local Privacy</span>
                    </div>
                    <span className="rounded-md bg-indigo-500/20 px-1.5 py-0.5 text-[9px] font-bold text-indigo-300 border border-indigo-500/30">
                      Zero Telemetry
                    </span>
                  </div>

                  {/* Mastery Progress Bar */}
                  <div className="space-y-1.5 py-1">
                    <div className="flex justify-between text-xs">
                      <span className="font-bold text-foreground">FLN Classroom Fluency</span>
                      <span className="font-extrabold text-primary">94%</span>
                    </div>
                    <div className="h-2.5 w-full overflow-hidden rounded-full bg-secondary/80">
                      <div className="h-full w-[94%] rounded-full bg-gradient-to-r from-primary via-emerald-400 to-accent animate-pulse" />
                    </div>
                    <div className="flex justify-between text-[10px] text-muted-foreground font-medium pt-1">
                      <span>Target: NIPUN Bharat</span>
                      <span className="text-emerald-400 font-bold">Goal Achieved</span>
                    </div>
                  </div>

                  {/* Hardware Telemetry */}
                  <div className="flex items-center justify-between pt-1 border-t border-border/40 text-[10px] text-muted-foreground font-mono">
                    <span>⚡ 0.8ms Engine Latency</span>
                    <span className="font-bold text-indigo-300">2 GB RAM Tablet</span>
                  </div>
                </div>
              }
              action={
                <Link to="/progress" className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-deep hover:underline">
                  View Analytics Dashboard <ArrowRight className="size-3.5 transition-transform group-hover/bento:translate-x-1" />
                </Link>
              }
            />
          </BentoGrid>
        </div>
      </section>

      {/* 3D Hardware & Field Performance Bar */}
      <section className="relative z-10 border-t border-border/80 bg-gradient-to-r from-primary/10 via-card to-accent/10 py-16">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="grid gap-8 md:grid-cols-4">
            <div className="flex items-center gap-4 rounded-3xl border border-white/20 bg-card/85 p-5 shadow-lg backdrop-blur-xl">
              <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/20 text-primary border border-primary/30">
                <Zap className="size-7" />
              </div>
              <div>
                <p className="font-display text-2xl font-extrabold text-foreground">&lt; 3s</p>
                <p className="text-xs text-muted-foreground uppercase font-semibold">Speech Latency</p>
              </div>
            </div>

            <div className="flex items-center gap-4 rounded-3xl border border-white/20 bg-card/85 p-5 shadow-lg backdrop-blur-xl">
              <div className="flex size-14 items-center justify-center rounded-2xl bg-accent/20 text-accent border border-accent/30">
                <CloudDownload className="size-7" />
              </div>
              <div>
                <p className="font-display text-2xl font-extrabold text-foreground">100%</p>
                <p className="text-xs text-muted-foreground uppercase font-semibold">Offline Capable</p>
              </div>
            </div>

            <div className="flex items-center gap-4 rounded-3xl border border-white/20 bg-card/85 p-5 shadow-lg backdrop-blur-xl">
              <div className="flex size-14 items-center justify-center rounded-2xl bg-ochre/20 text-ochre border border-ochre/30">
                <Tablet className="size-7" />
              </div>
              <div>
                <p className="font-display text-2xl font-extrabold text-foreground">2 GB RAM</p>
                <p className="text-xs text-muted-foreground uppercase font-semibold">Low-Cost Tablets</p>
              </div>
            </div>

            <div className="flex items-center gap-4 rounded-3xl border border-white/20 bg-card/85 p-5 shadow-lg backdrop-blur-xl">
              <div className="flex size-14 items-center justify-center rounded-2xl bg-leaf/20 text-leaf border border-leaf/30">
                <GraduationCap className="size-7" />
              </div>
              <div>
                <p className="font-display text-2xl font-extrabold text-foreground">5,000+</p>
                <p className="text-xs text-muted-foreground uppercase font-semibold">Jharkhand Schools</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quote Banner & Call to Action with 3D Border Glow */}
      <section className="relative z-10 mx-auto max-w-5xl px-5 py-24 text-center">
        <div className="relative rounded-3xl border border-white/25 bg-gradient-to-b from-card/90 via-card/75 to-card/50 p-10 shadow-2xl backdrop-blur-2xl sm:p-14 overflow-hidden">
          <BorderBeam size={280} duration={12} delay={2} colorFrom="#f59e0b" colorTo="#10b981" />

          <p className="font-display text-3xl font-extrabold leading-snug text-foreground sm:text-4xl">
            “जिस भाषा में बच्चा सपने देखता है, उसी भाषा में उसे पढ़ना चाहिए।”
          </p>
          <p className="mt-4 text-base text-muted-foreground">
            A child should learn in the language they dream in.
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link to="/live">
              <ShimmerButton
                shimmerColor="rgba(255, 255, 255, 0.4)"
                borderRadius="16px"
                className="h-14 px-8 text-base shadow-xl"
              >
                <Mic className="mr-2 size-4" /> Start Live Classroom Mode
              </ShimmerButton>
            </Link>

            <Link to="/worksheets">
              <MovingBorderButton
                borderRadius="16px"
                duration={3500}
                className="h-14 px-8 text-base font-semibold"
              >
                <FileText className="mr-2 size-4" /> Generate Bilingual Worksheet
              </MovingBorderButton>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}