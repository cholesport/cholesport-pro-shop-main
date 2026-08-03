import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  useRouterState,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { ErrorBoundary } from "@/components/site/ErrorBoundary";
import { SiteFloatingActions, SkipToContent } from "@/components/site/SiteFloatingActions";
import { PageFade } from "@/components/site/FadeIn";
import { applyA11ySettings, loadA11ySettings } from "@/lib/accessibility";
import { isAdminHostname } from "@/data/adminSite";
import { CartProvider } from "@/context/CartContext";
import { useClientErrorReporting } from "@/hooks/useClientErrorReporting";
import { Toaster } from "@/components/ui/sonner";
import {
  buildOrganizationJsonLd,
  buildPageSeoHead,
  buildWebsiteJsonLd,
  jsonLdScript,
} from "@/lib/seo";
import {
  GTM_HEAD_SCRIPT,
  GTM_NOSCRIPT_IFRAME_SRC,
} from "@/lib/gtm";
import {
  GOOGLE_ADS_GTAG_SRC,
  GOOGLE_ADS_INIT_SCRIPT,
} from "@/lib/googleAds";

function NotFoundComponent() {
  return (
    <div id="main-content" className="flex min-h-screen items-center justify-center bg-background px-4">
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
    <div id="main-content" className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          לא הצלחנו לטעון את העמוד
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          משהו השתבש בצד שלנו. אפשר לנסות שוב או לחזור לדף הבית.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            נסו שוב
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            חזרה לדף הבית
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => {
    const seo = buildPageSeoHead({ path: "/" });
    return {
      meta: [
        { charSet: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        { name: "theme-color", content: "#df8927" },
        ...seo.meta,
      ],
      links: [
        {
          rel: "stylesheet",
          href: appCss,
        },
        { rel: "icon", type: "image/png", href: "/favicon.png" },
        { rel: "apple-touch-icon", href: "/favicon.png" },
        { rel: "preconnect", href: "https://fonts.googleapis.com" },
        { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=Rubik:wght@400;500;600;700;800&display=swap",
        },
        ...seo.links,
      ],
      scripts: [jsonLdScript(buildOrganizationJsonLd()), jsonLdScript(buildWebsiteJsonLd())],
    };
  },
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="he" dir="rtl">
      <head>
        <script async src={GOOGLE_ADS_GTAG_SRC} />
        <script
          dangerouslySetInnerHTML={{
            __html: GOOGLE_ADS_INIT_SCRIPT,
          }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: GTM_HEAD_SCRIPT,
          }}
        />
        <HeadContent />
      </head>
      <body>
        <noscript>
          <iframe
            src={GTM_NOSCRIPT_IFRAME_SRC}
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
            title="Google Tag Manager"
          />
        </noscript>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var s=JSON.parse(localStorage.getItem("chole-a11y-settings")||"{}");var r=document.documentElement;if(s.fontSize==="large")r.classList.add("a11y-font-large");if(s.fontSize==="xlarge")r.classList.add("a11y-font-xlarge");if(s.highContrast)r.classList.add("a11y-high-contrast");if(s.highlightLinks)r.classList.add("a11y-highlight-links");if(s.readableFont)r.classList.add("a11y-readable-font");if(s.reduceMotion)r.classList.add("a11y-reduce-motion");}catch(e){}})();`,
          }}
        />
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useClientErrorReporting();

  useEffect(() => {
    applyA11ySettings(loadA11ySettings());
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (isAdminHostname(window.location.hostname) && !pathname.startsWith("/admin")) {
      window.location.replace("/admin/registrations");
    }
  }, [pathname]);

  return (
    <QueryClientProvider client={queryClient}>
      <CartProvider>
        <SkipToContent />
        {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
        <PageFade pageKey={pathname}>
          <ErrorBoundary sectionLabel="העמוד">
            <Outlet />
          </ErrorBoundary>
        </PageFade>
        {!pathname.startsWith("/admin") && <SiteFloatingActions />}
        <Toaster position="top-center" dir="rtl" richColors closeButton />
      </CartProvider>
    </QueryClientProvider>
  );
}
