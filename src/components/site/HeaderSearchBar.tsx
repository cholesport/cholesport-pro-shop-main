import { useEffect, useId, useRef, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { searchProducts } from "@/lib/productSearch";

const SEARCH_PLACEHOLDER = "חיפוש: מזרני איירפלור, מזרני נחיתה, ציוד ג׳ימבורי…";

function formatPrice(price: number) {
  return price.toLocaleString("he-IL");
}

type HeaderSearchBarProps = {
  id?: string;
};

export function HeaderSearchBar({ id }: HeaderSearchBarProps) {
  const navigate = useNavigate();
  const listboxId = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const results = searchProducts(query);
  const showDropdown = open && query.trim().length > 0;

  useEffect(() => {
    setActiveIndex(results.length > 0 ? 0 : -1);
  }, [query, results.length]);

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, []);

  function clearSearch() {
    setQuery("");
    setOpen(false);
    setActiveIndex(-1);
  }

  function goToProduct(productId: string) {
    clearSearch();
    void navigate({ to: "/products/$productId", params: { productId } });
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (!showDropdown) {
      if (event.key === "ArrowDown" && query.trim()) setOpen(true);
      return;
    }

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
      case "Escape":
        event.preventDefault();
        setOpen(false);
        inputRef.current?.blur();
        break;
    }
  }

  return (
    <div ref={containerRef} className="relative w-full">
      <label htmlFor={id} className="sr-only">
        חיפוש מוצרים
      </label>
      <Search
        size={18}
        className="absolute start-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
        aria-hidden
      />
      <input
        ref={inputRef}
        id={id}
        type="search"
        role="combobox"
        autoComplete="off"
        aria-autocomplete="list"
        aria-expanded={showDropdown}
        aria-controls={showDropdown ? listboxId : undefined}
        aria-activedescendant={
          showDropdown && activeIndex >= 0 ? `${listboxId}-option-${activeIndex}` : undefined
        }
        placeholder={SEARCH_PLACEHOLDER}
        value={query}
        onChange={(event) => {
          setQuery(event.target.value);
          setOpen(true);
        }}
        onFocus={() => {
          if (query.trim()) setOpen(true);
        }}
        onKeyDown={handleKeyDown}
        className="w-full ps-11 pe-4 py-2.5 text-sm border border-border bg-background focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent transition-colors"
      />

      {showDropdown && (
        <div
          dir="rtl"
          className="absolute top-[calc(100%+0.5rem)] start-0 end-0 z-[60] overflow-hidden border border-border bg-card shadow-[var(--shadow-card)]"
        >
          {results.length > 0 ? (
            <ul id={listboxId} role="listbox" aria-label="תוצאות חיפוש" className="max-h-80 overflow-y-auto py-2">
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
                      onClick={clearSearch}
                      className={`flex items-center gap-3 px-3 py-2.5 transition ${
                        isActive ? "bg-accent/10 text-foreground" : "hover:bg-secondary/80"
                      }`}
                    >
                      <div className="size-12 shrink-0 overflow-hidden rounded-lg border border-border bg-secondary flex items-center justify-center px-1">
                        {product.img || product.images[0] ? (
                          <img
                            src={product.img ?? product.images[0]}
                            alt=""
                            className="size-full object-cover"
                          />
                        ) : (
                          <span className="text-[9px] font-semibold leading-tight text-center text-foreground/70 line-clamp-3">
                            {product.title}
                          </span>
                        )}
                      </div>
                      <div className="min-w-0 flex-1 text-start">
                        <p className="text-sm font-semibold leading-snug line-clamp-2">{product.title}</p>
                        <p className="mt-0.5 text-xs text-muted-foreground">{product.cat}</p>
                      </div>
                      <p className="shrink-0 text-sm font-bold whitespace-nowrap">
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
            <p className="px-4 py-6 text-sm text-center text-muted-foreground">לא נמצאו מוצרים</p>
          )}
        </div>
      )}
    </div>
  );
}
