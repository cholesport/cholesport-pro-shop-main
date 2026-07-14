import { useEffect, useState } from "react";
import { Minus, Plus } from "lucide-react";

type QuantityInputProps = {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  id?: string;
  /** Larger padding for PDP buy box */
  size?: "sm" | "md";
};

function clampQuantity(raw: number, min: number, max: number) {
  if (!Number.isFinite(raw)) return min;
  return Math.min(max, Math.max(min, Math.floor(raw)));
}

/** Quantity control with +/- and a free-typed number field. */
export function QuantityInput({
  value,
  onChange,
  min = 1,
  max = 9999,
  id,
  size = "md",
}: QuantityInputProps) {
  const [draft, setDraft] = useState(String(value));
  const [focused, setFocused] = useState(false);
  const btnPad = size === "sm" ? "p-2" : "p-3";
  const inputPad = size === "sm" ? "px-2 py-1 w-14 text-sm" : "px-3 py-2 w-16 text-base";

  useEffect(() => {
    if (!focused) setDraft(String(value));
  }, [value, focused]);

  function commit(raw: string) {
    if (raw.trim() === "") {
      onChange(min);
      setDraft(String(min));
      return;
    }
    const next = clampQuantity(Number(raw), min, max);
    onChange(next);
    setDraft(String(next));
  }

  return (
    <div className="inline-flex items-center border border-border rounded-lg">
      <button
        type="button"
        onClick={() => onChange(clampQuantity(value - 1, min, max))}
        className={`${btnPad} hover:bg-secondary transition`}
        aria-label="הפחת כמות"
      >
        <Minus size={size === "sm" ? 14 : 16} />
      </button>
      <input
        id={id}
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        value={draft}
        onFocus={() => setFocused(true)}
        onChange={(e) => setDraft(e.target.value.replace(/[^\d]/g, ""))}
        onBlur={() => {
          setFocused(false);
          commit(draft);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.currentTarget.blur();
          }
        }}
        className={`${inputPad} min-w-0 text-center font-semibold bg-transparent border-0 outline-none`}
        aria-label="כמות"
      />
      <button
        type="button"
        onClick={() => onChange(clampQuantity(value + 1, min, max))}
        className={`${btnPad} hover:bg-secondary transition`}
        aria-label="הוסף כמות"
      >
        <Plus size={size === "sm" ? 14 : 16} />
      </button>
    </div>
  );
}
