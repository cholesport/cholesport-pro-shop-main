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
import { SiteFloatingActions, SkipToContent } from "@/components/site/SiteFloatingActions";
import { applyA11ySettings, loadA11ySettings } from "@/lib/accessibility";
import { CartProvider } from "@/context/CartContext";
import { Toaster } from "@/components/ui/sonner";

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
      { title: "CHOLE sport — ציוד ספורט וכושר מקצועי" },
      { name: "description", content: "חנות מובילה לציוד ספורט: הליכונים, משקולות, יוגה, אומנויות לחימה, טניס שולחן ועוד. איסוף עצמי מהחנות או משלוח בתיאום בוואטסאפ." },
      { property: "og:title", content: "CHOLE sport — ציוד ספורט מקצועי" },
      { property: "og:description", content: "ציוד ספורט באיכות מקצועית לאתלטים, מאמנים ומשפחות." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:site", content: "@Lovable" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Rubik:wght@400;500;600;700;800&display=swap",
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
    <html lang="he" dir="rtl">
      <head>
        <HeadContent />
      </head>
      <body>
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

  useEffect(() => {
    applyA11ySettings(loadA11ySettings());
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <CartProvider>
        <SkipToContent />
        {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
        <Outlet />
        <SiteFloatingActions />
        <Toaster position="top-center" dir="rtl" richColors closeButton />
      </CartProvider>
    </QueryClientProvider>
  );
}
