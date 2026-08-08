import { ArrowRight } from "lucide-react";
import { useRouter, useRouterState } from "@tanstack/react-router";
import {
  canNavigateBackInHistory,
  getBackFallbackPath,
  shouldShowBackNav,
} from "@/lib/navigation";
import { cn } from "@/lib/utils";

type BackNavButtonProps = {
  className?: string;
  /** Show the word "חזרה" next to the icon (recommended for clarity). */
  showLabel?: boolean;
};

export function BackNavButton({ className, showLabel = true }: BackNavButtonProps) {
  const router = useRouter();
  const pathname = useRouterState({ select: (state) => state.location.pathname });

  if (!shouldShowBackNav(pathname)) {
    return null;
  }

  function handleBack() {
    if (canNavigateBackInHistory()) {
      router.history.back();
      return;
    }
    void router.navigate({ to: getBackFallbackPath(pathname) });
  }

  return (
    <button
      type="button"
      onClick={handleBack}
      className={cn(
        "inline-flex min-h-10 shrink-0 items-center gap-1.5 rounded-lg border border-border bg-card px-2.5 py-2 text-sm font-bold text-foreground shadow-sm transition",
        "hover:border-accent/50 hover:text-accent",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        className,
      )}
      aria-label="חזרה לעמוד הקודם"
    >
      <ArrowRight size={18} className="shrink-0 text-accent" aria-hidden />
      {showLabel && <span className="leading-none">חזרה</span>}
    </button>
  );
}
