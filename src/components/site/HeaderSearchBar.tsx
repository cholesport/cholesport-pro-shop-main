import { useEffect, useId, useRef, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Search, X } from "lucide-react";
import { searchProducts } from "@/lib/productSearch";

function formatPrice(price: number) {
  return price.toLocaleString("he-IL");
}

type HeaderSearchBarProps = {
  id?: string;
};

/**
 * Predictive product search in the Bash Gal style:
 * header icon opens a full-width top panel with a large input and live results.
 */
export function HeaderSearchBar({ id = "header-search" }: HeaderSearchBarProps) {
  const navigate = useNavigate();
  const listboxId = useId();
  const panelId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const results = searchProducts(query);
  const showResults = open && query.trim().length > 0;

  useEffect(() => {
    setActiveIndex(results.length > 0 ? 0 : -1);
  }, [query, results.length]);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const timer = window.setTimeout(() => inputRef.current?.focus(), 30);

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        closeSearch();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.clearTimeout(timer);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  function closeSearch() {
    setOpen(false);
    setQuery("");
    setActiveIndex(-1);
  }

  function toggleSearch() {
    if (open) closeSearch();
    else setOpen(true);
  }

  function goToProduct(productId: string) {
    closeSearch();
    void navigate({ to: "/products/$productId", params: { productId } });
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (!showResults) return;

    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        setActiveIndex((current) => (current + 1) % results.length);
        break;
      case "ArrowUp":
        event.preventDefault();
        setActiveIndex((current) => (current <= 0 ? results.length - 1 : current - 1));
        break;
      case "Enter":
        event.preventDefault();
        if (activeIndex >= 0 && results[activeIndex]) {
          goToProduct(results[activeIndex].id);
        } else if (results.length === 1) {
          goToProduct(results[0].id);
        }
        break;
    }
  }

  return (
    <>
      <button
        type="button"
        data-search-trigger
        onClick={toggleSearch}
        aria-expanded={open}
        aria-controls={open ? panelId : undefined}
        aria-label="חיפוש"
        className="flex items-center gap-1.5 text-foreground transition hover:text-sky-600"
      >
        <Search size={21} aria-hidden />
        <span className="hidden text-xs font-medium xl:inline">חיפוש</span>
      </button>

      {open ? (
        <div className="fixed inset-0 z-[80]" role="presentation">
          <button
            type="button"
            className="absolute inset-0 bg-foreground/40"
            aria-label="סגור חיפוש"
            onClick={closeSearch}
          />
          <div
            ref={panelRef}
            id={panelId}
            dir="rtl"
            className="relative z-10 border-b border-border bg-card shadow-[var(--shadow-card)]"
            role="dialog"
            aria-modal="true"
            aria-label="חיפוש מוצרים"
          >
            <div className="mx-auto max-w-7xl px-4 py-5 md:py-6">
              <div className="flex items-center justify-between gap-3 mb-4">
                <p className="text-sm font-semibold tracking-wide text-foreground">חיפוש</p>
                <button
                  type="button"
                  onClick={closeSearch}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground transition hover:text-foreground"
                >
                  <X size={18} aria-hidden />
                  סגור
                </button>
              </div>

              <div className="relative">
                <Search
                  size={20}
                  className="pointer-events-none absolute start-4 top-1/2 -translate-y-1/2 text-muted-foreground"
                  aria-hidden
                />
                <label htmlFor={id} className="sr-only">
                  חיפוש מוצרים
                </label>
                <input
                  ref={inputRef}
                  id={id}
                  type="search"
                  role="combobox"
                  autoComplete="off"
                  placeholder="חיפוש מוצרים..."
                  aria-autocomplete="list"
                  aria-expanded={showResults}
                  aria-controls={showResults ? listboxId : undefined}
                  aria-activedescendant={
                    showResults && activeIndex >= 0
                      ? `${listboxId}-option-${activeIndex}`
                      : undefined
                  }
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  onKeyDown={handleKeyDown}
                  className="w-full border border-border bg-background py-4 ps-12 pe-12 text-base text-foreground placeholder:text-muted-foreground focus:border-foreground focus:outline-none md:text-[15px]"
                />
                {query ? (
                  <button
                    type="button"
                    onClick={() => {
                      setQuery("");
                      setActiveIndex(-1);
                      inputRef.current?.focus();
                    }}
                    className="absolute end-3 top-1/2 -translate-y-1/2 rounded-full p-1.5 text-muted-foreground transition hover:bg-secondary hover:text-foreground"
                    aria-label="נקה חיפוש"
                  >
                    <X size={16} />
                  </button>
                ) : null}
              </div>

              {showResults ? (
                <div className="mt-4 border-t border-border pt-2">
                  {results.length > 0 ? (
                    <ul
                      id={listboxId}
                      role="listbox"
                      aria-label="תוצאות חיפוש"
                      className="max-h-[min(60vh,28rem)] overflow-y-auto py-1"
                    >
                      {results.map((product, index) => {
                        const isActive = index === activeIndex;

                        return (
                          <li
                            key={product.id}
                            id={`${listboxId}-option-${index}`}
                            role="option"
                            aria-selected={isActive}
                          >
                            <Link
                              to="/products/$productId"
                              params={{ productId: product.id }}
                              onMouseEnter={() => setActiveIndex(index)}
                              onClick={closeSearch}
                              className={`flex items-center gap-3 px-2 py-3 transition md:px-3 ${
                                isActive ? "bg-secondary" : "hover:bg-secondary/70"
                              }`}
                            >
                              <div className="flex size-14 shrink-0 items-center justify-center overflow-hidden border border-border bg-white p-1.5 md:size-16">
                                {product.img || product.images[0] ? (
                                  <img
                                    src={product.img ?? product.images[0]}
                                    alt=""
                                    className="size-full object-contain"
                                  />
                                ) : (
                                  <span className="line-clamp-3 text-center text-[9px] font-semibold leading-tight text-foreground/70">
                                    {product.title}
                                  </span>
                                )}
                              </div>
                              <div className="min-w-0 flex-1 text-start">
                                <p className="line-clamp-2 text-sm font-semibold leading-snug text-foreground md:text-[15px]">
                                  {product.title}
                                </p>
                                <p className="mt-0.5 text-xs text-muted-foreground">{product.cat}</p>
                              </div>
                              <p className="shrink-0 text-sm font-bold whitespace-nowrap md:text-base">
                                <span dir="ltr" className="unicode-bidi-plaintext inline-block">
                                  {formatPrice(product.price)} ₪
                                </span>
                              </p>
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  ) : (
                    <p className="px-2 py-8 text-center text-sm text-muted-foreground">
                      לא נמצאו מוצרים
                    </p>
                  )}
                </div>
              ) : (
                <p className="mt-4 border-t border-border px-1 pt-4 text-sm text-muted-foreground">
                  התחילו להקליד כדי לחפש מוצרים בחנות
                </p>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
