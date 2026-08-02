import { Component, type ErrorInfo, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { reportLovableError } from "@/lib/lovable-error-reporting";

type ErrorBoundaryProps = {
  children: ReactNode;
  /** Short Hebrew label for the failed section (e.g. "עגלת הקניות"). */
  sectionLabel?: string;
  className?: string;
};

type ErrorBoundaryState = {
  error: Error | null;
};

/**
 * Isolates render/runtime errors in a page section so the rest of the site keeps working.
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error(error, info.componentStack);
    reportLovableError(error, {
      boundary: "site_error_boundary",
      section: this.props.sectionLabel ?? "unknown",
      componentStack: info.componentStack,
    });
  }

  private reset = () => {
    this.setState({ error: null });
  };

  render() {
    if (!this.state.error) return this.props.children;

    const label = this.props.sectionLabel ?? "העמוד";

    return (
      <div
        role="alert"
        className={
          this.props.className ??
          "flex min-h-[40vh] items-center justify-center bg-background px-4 py-16"
        }
      >
        <div className="max-w-md text-center">
          <h1 className="text-xl font-semibold text-foreground">
            לא הצלחנו להציג את {label}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
            משהו השתבש, אבל שאר האתר ממשיך לעבוד. אפשר לנסות שוב או לחזור לדף הבית.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            <button
              type="button"
              onClick={this.reset}
              className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              נסו שוב
            </button>
            <Link
              to="/"
              className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
            >
              חזרה לדף הבית
            </Link>
          </div>
        </div>
      </div>
    );
  }
}
