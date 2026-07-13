import { useCallback, useEffect, useId, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { X, RotateCcw, Contrast, Link2, BookOpen, PauseCircle } from "lucide-react";
import wheelchairIcon from "@/assets/wheelchair.png";
import {
  applyA11ySettings,
  DEFAULT_A11Y,
  loadA11ySettings,
  saveA11ySettings,
  type A11ySettings,
} from "@/lib/accessibility";

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

function ToggleRow({
  label,
  description,
  checked,
  onChange,
  icon: Icon,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  icon: typeof Contrast;
}) {
  return (
    <label className="flex items-start gap-3 p-3 rounded-lg hover:bg-secondary/80 cursor-pointer transition">
      <Icon size={20} className="text-accent mt-0.5 shrink-0" aria-hidden="true" />
      <span className="flex-1 min-w-0">
        <span className="block text-sm font-semibold text-foreground">{label}</span>
        <span className="block text-xs text-muted-foreground mt-0.5">{description}</span>
      </span>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-1 size-4 accent-accent shrink-0"
      />
    </label>
  );
}

export function AccessibilityWidget() {
  const [open, setOpen] = useState(false);
  const [settings, setSettings] = useState<A11ySettings>(DEFAULT_A11Y);
  const panelRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelId = useId();
  const titleId = useId();

  useEffect(() => {
    const saved = loadA11ySettings();
    setSettings(saved);
    applyA11ySettings(saved);
  }, []);

  useEffect(() => {
    saveA11ySettings(settings);
    applyA11ySettings(settings);
  }, [settings]);

  const closePanel = useCallback(() => {
    setOpen(false);
    buttonRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!open) return;

    const panel = panelRef.current;
    if (!panel) return;

    const focusables = panel.querySelectorAll<HTMLElement>(FOCUSABLE);
    focusables[0]?.focus();

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault();
        closePanel();
        return;
      }

      if (e.key !== "Tab" || focusables.length === 0) return;

      const first = focusables[0];
      const last = focusables[focusables.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, closePanel]);

  function update(partial: Partial<A11ySettings>) {
    setSettings((prev) => ({ ...prev, ...partial }));
  }

  function reset() {
    setSettings(DEFAULT_A11Y);
  }

  return (
    <div className="relative">
      {open && (
        <div
          ref={panelRef}
          id={panelId}
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          className="absolute bottom-full mb-3 right-0 w-[min(calc(100vw-2rem),320px)] bg-card border border-border rounded-xl shadow-2xl overflow-hidden"
        >
          <div className="flex items-center justify-between px-4 py-3 bg-primary text-primary-foreground">
            <h2 id={titleId} className="font-bold text-sm">
              תפריט נגישות
            </h2>
            <button
              type="button"
              onClick={closePanel}
              className="p-1 rounded hover:bg-primary-foreground/10 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-foreground"
              aria-label="סגירת תפריט נגישות"
            >
              <X size={18} aria-hidden="true" />
            </button>
          </div>

          <div className="p-2 max-h-[min(60vh,420px)] overflow-y-auto">
            <div className="px-3 py-2">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                גודל טקסט
              </p>
              <div className="flex gap-2" role="group" aria-label="גודל טקסט">
                {(
                  [
                    ["normal", "רגיל"],
                    ["large", "גדול"],
                    ["xlarge", "גדול מאוד"],
                  ] as const
                ).map(([value, label]) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => update({ fontSize: value })}
                    className={`flex-1 py-2 px-2 rounded-lg text-xs font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                      settings.fontSize === value
                        ? "bg-accent text-accent-foreground"
                        : "bg-secondary text-foreground hover:bg-secondary/80"
                    }`}
                    aria-pressed={settings.fontSize === value}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <ToggleRow
              icon={Contrast}
              label="ניגודיות גבוהה"
              description="הגברת הניגודיות בין טקסט לרקע"
              checked={settings.highContrast}
              onChange={(v) => update({ highContrast: v })}
            />
            <ToggleRow
              icon={Link2}
              label="הדגשת קישורים"
              description="הוספת קו תחתון לכל הקישורים"
              checked={settings.highlightLinks}
              onChange={(v) => update({ highlightLinks: v })}
            />
            <ToggleRow
              icon={BookOpen}
              label="גופן קריא"
              description="מעבר לגופן sans-serif קריא יותר"
              checked={settings.readableFont}
              onChange={(v) => update({ readableFont: v })}
            />
            <ToggleRow
              icon={PauseCircle}
              label="עצירת אנימציות"
              description="ביטול אנימציות ומעברים חזותיים"
              checked={settings.reduceMotion}
              onChange={(v) => update({ reduceMotion: v })}
            />
          </div>

          <div className="border-t border-border p-3 flex gap-2">
            <button
              type="button"
              onClick={reset}
              className="flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-md"
            >
              <RotateCcw size={16} aria-hidden="true" />
              איפוס
            </button>
            <Link
              to="/privacy"
              className="flex-1 text-center py-2 text-sm font-medium text-accent hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-md"
            >
              מדיניות פרטיות
            </Link>
          </div>
        </div>
      )}

      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        aria-haspopup="dialog"
        aria-controls={open ? panelId : undefined}
        aria-label="תפריט נגישות"
        title="כפתור נגישות"
        className="group relative flex items-center justify-center size-14 rounded-full bg-[#0066CC] shadow-lg hover:bg-[#0052A3] hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0066CC] focus-visible:ring-offset-2 transition-colors duration-200"
      >
        <span
          aria-hidden="true"
          className="absolute top-1/2 -translate-y-1/2 right-full me-2 px-3 py-2 rounded-full bg-[#0052A3] text-white text-sm font-semibold whitespace-nowrap shadow-md opacity-0 invisible group-hover:opacity-100 group-hover:visible group-focus-visible:opacity-100 group-focus-visible:visible transition-opacity duration-200 pointer-events-none"
        >
          כפתור נגישות
        </span>
        <span
          aria-hidden="true"
          className="inline-block size-8 bg-white [mask-size:contain] [mask-repeat:no-repeat] [mask-position:center] [-webkit-mask-size:contain] [-webkit-mask-repeat:no-repeat] [-webkit-mask-position:center]"
          style={{ maskImage: `url(${wheelchairIcon})`, WebkitMaskImage: `url(${wheelchairIcon})` }}
        />
      </button>
    </div>
  );
}
