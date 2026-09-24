import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { LangProvider } from "@/components/LangContext";
import { OfflineBadge } from "@/components/OfflineBadge";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Bhasha Setu — MTB-MLE Teaching Suite" },
      {
        name: "description",
        content:
          "Offline AI teaching suite that turns Hindi FLN lessons into Santhali, Ho and Mundari for tribal-area primary classrooms.",
      },
      { name: "author", content: "Bhasha Setu" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Figtree:wght@400;500;600;700&family=Noto+Sans+Ol+Chiki&family=Outfit:wght@500;600;700;800&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

const NAV = [
  { to: "/", label: "Home" },
  { to: "/translate", label: "Translate" },
  { to: "/live", label: "Live Class" },
  { to: "/worksheets", label: "Worksheets" },
  { to: "/library", label: "Lesson Library" },
  { to: "/progress", label: "Progress" },
] as const;

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <LangProvider>
        <div className="flex min-h-screen flex-col bg-background text-foreground antialiased selection:bg-primary/20 selection:text-primary">
          <div className="sohrai-band h-1.5 w-full" />
          <header className="sticky top-0 z-50 border-b border-border/70 bg-background/80 backdrop-blur-2xl transition-all">
            <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-3.5 sm:px-6">
              <Link to="/" className="group flex items-center gap-3">
                <span className="relative flex size-11 items-center justify-center rounded-xl border border-white/20 bg-gradient-to-br from-primary via-leaf to-emerald-800 text-xl font-tribal font-bold text-white shadow-lift transition-transform duration-300 group-hover:scale-105 group-hover:rotate-3">
                  <span className="relative z-10">ᱥ</span>
                  <span className="absolute inset-0 rounded-xl bg-white/20 opacity-0 transition-opacity group-hover:opacity-100" />
                </span>
                <span className="leading-tight">
                  <span className="block font-display text-lg font-bold tracking-tight text-foreground transition-colors group-hover:text-primary">
                    Bhasha Setu
                  </span>
                  <span className="block text-[11px] font-medium text-muted-foreground">
                    PALASH 3D MTB-MLE Suite
                  </span>
                </span>
              </Link>

              <nav className="order-3 flex w-full flex-wrap items-center justify-center gap-1.5 rounded-2xl border border-border/60 bg-card/60 p-1.5 shadow-sm backdrop-blur-md md:order-2 md:w-auto">
                {NAV.map((n) => (
                  <Link
                    key={n.to}
                    to={n.to}
                    activeOptions={{ exact: n.to === "/" }}
                    activeProps={{
                      className:
                        "bg-primary text-primary-foreground shadow-[0_2px_12px_rgba(0,0,0,0.15)] font-bold",
                    }}
                    inactiveProps={{
                      className:
                        "text-muted-foreground hover:text-foreground hover:bg-secondary/70",
                    }}
                    className="rounded-xl px-3.5 py-1.5 text-xs font-semibold tracking-wide transition-all duration-200"
                  >
                    {n.label}
                  </Link>
                ))}
              </nav>

              <div className="order-2 ml-auto flex items-center gap-3 md:order-3 md:ml-0">
                <OfflineBadge />
              </div>
            </div>
          </header>

          <main className="flex-1">
            {/* Required: nested routes render here. */}
            <Outlet />
          </main>

          <footer className="mt-16 border-t border-border/70 bg-gradient-to-b from-card/40 to-card/90">
            <div className="mx-auto max-w-7xl px-5 py-12 lg:px-8">
              <div className="flex flex-col items-center justify-between gap-6 text-center sm:flex-row sm:text-left">
                <div className="flex items-center gap-3">
                  <span className="flex size-9 items-center justify-center rounded-lg bg-primary font-tribal text-base font-bold text-white shadow-sm">
                    ᱥ
                  </span>
                  <div>
                    <p className="font-display font-bold text-foreground">
                      Bhasha Setu — Mother-Tongue Learning Bridge
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Built for Jharkhand's Multilingual Classrooms • Santhali • Ho • Mundari
                    </p>
                  </div>
                </div>
                <div className="text-xs text-muted-foreground">
                  <span>100% On-Device • Zero Internet Required in Classrooms</span>
                </div>
              </div>
              <div className="mt-8 border-t border-border/40 pt-6 text-center text-xs text-muted-foreground">
                Prototype for Department of Higher &amp; Technical Education, Government of Jharkhand.
                Language models execute locally via client-side Web Speech &amp; FLN dictionary matrices.
              </div>
            </div>
          </footer>
        </div>
      </LangProvider>
    </QueryClientProvider>
  );
}
