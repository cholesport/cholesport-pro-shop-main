import { toast } from "sonner";

export const DEFAULT_ACTION_ERROR_MESSAGE = "משהו השתבש. נסו שוב בעוד רגע.";

/** Normalize unknown errors into a user-facing Hebrew message. */
export function getErrorMessage(
  error: unknown,
  fallback = DEFAULT_ACTION_ERROR_MESSAGE,
): string {
  if (error instanceof Error && error.message.trim()) return error.message;
  if (typeof error === "string" && error.trim()) return error;
  return fallback;
}

type SafeActionOptions = {
  fallbackMessage?: string;
  /** When false, only logs — no toast (use for background refresh). */
  notify?: boolean;
  onError?: (error: unknown) => void;
};

/**
 * Run an async user action without letting failures crash the UI.
 * Returns the result, or `null` when the action fails.
 */
export async function safeAction<T>(
  action: () => Promise<T>,
  options: SafeActionOptions = {},
): Promise<T | null> {
  const {
    fallbackMessage = DEFAULT_ACTION_ERROR_MESSAGE,
    notify = true,
    onError,
  } = options;

  try {
    return await action();
  } catch (error) {
    console.error(error);
    onError?.(error);
    if (notify) toast.error(getErrorMessage(error, fallbackMessage));
    return null;
  }
}

/** Sync variant for handlers that must not throw (e.g. onClick). */
export function safeSyncAction<T>(
  action: () => T,
  options: SafeActionOptions = {},
): T | null {
  const {
    fallbackMessage = DEFAULT_ACTION_ERROR_MESSAGE,
    notify = true,
    onError,
  } = options;

  try {
    return action();
  } catch (error) {
    console.error(error);
    onError?.(error);
    if (notify) toast.error(getErrorMessage(error, fallbackMessage));
    return null;
  }
}
