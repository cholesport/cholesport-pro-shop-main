import { useEffect } from "react";
import { toast } from "sonner";
import { DEFAULT_ACTION_ERROR_MESSAGE } from "@/lib/safeAction";
import { reportLovableError } from "@/lib/lovable-error-reporting";

let lastUnhandledToastAt = 0;
const UNHANDLED_TOAST_COOLDOWN_MS = 8000;

function notifyUnhandledError() {
  const now = Date.now();
  if (now - lastUnhandledToastAt < UNHANDLED_TOAST_COOLDOWN_MS) return;
  lastUnhandledToastAt = now;
  toast.error(DEFAULT_ACTION_ERROR_MESSAGE);
}

/** Global client safety net — logs and reports uncaught errors without crashing the shell. */
export function useClientErrorReporting() {
  useEffect(() => {
    function onError(event: ErrorEvent) {
      console.error(event.error ?? event.message);
      reportLovableError(event.error ?? event.message, {
        boundary: "window_onerror",
      });
      notifyUnhandledError();
    }

    function onUnhandledRejection(event: PromiseRejectionEvent) {
      console.error(event.reason);
      reportLovableError(event.reason, {
        boundary: "unhandledrejection",
      });
      notifyUnhandledError();
    }

    window.addEventListener("error", onError);
    window.addEventListener("unhandledrejection", onUnhandledRejection);
    return () => {
      window.removeEventListener("error", onError);
      window.removeEventListener("unhandledrejection", onUnhandledRejection);
    };
  }, []);
}
