import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { User, ShoppingCart, Menu, X, ChevronDown } from "lucide-react";
import logo from "@/assets/chole-sport-logo.png";
import { useCart } from "@/context/CartContext";
import { CATEGORIES } from "@/data/categories";
import { CONTACT_PHONE_DISPLAY } from "@/lib/contact";
import { HeaderSearchBar } from "@/components/site/HeaderSearchBar";

export function Header() {
  const [open, setOpen] = useState<string | null>(null);
  const [mobile, setMobile] = useState(false);
  const { totalQuantity } = useCart();

  return (
    <header className="sticky top-0 z-50 border-b border-border/80 bg-background/90 backdrop-blur-md">
      <div className="relative max-w-7xl mx-auto px-4">
        {/* Top bar: logo · actions (search icon like Bash Gal) */}
        <div className="flex items-center gap-3 md:gap-4 py-3 md:py-3.5">
          <a href="/" className="shrink-0">
            <img
              src={logo}
              alt="CHOLE sport"
              className="h-12 sm:h-14 md:h-16 w-auto block"
            />
          </a>

          <div className="flex items-center gap-3 sm:gap-4 shrink-0 ms-auto">
            <a
              href={`tel:${CONTACT_PHONE_DISPLAY.replace(/-/g, "")}`}
              className="hidden xl:inline text-xs font-medium text-muted-foreground hover:text-accent transition"
              dir="ltr"
            >
              {CONTACT_PHONE_DISPLAY}
            </a>
            <HeaderSearchBar id="header-search" />
            <Link
              to="/account"
              className="hidden sm:flex text-foreground hover:text-sky-600 transition"
              aria-label="החשבון שלי"
            >
              <User size={20} />
            </Link>
            <Link
              to="/cart"
              className="relative text-foreground hover:text-sky-600 transition"
              aria-label={`עגלת קניות - ${totalQuantity} פריטים`}
            >
              <ShoppingCart size={21} />
              {totalQuantity > 0 && (
                <span className="absolute -top-1.5 -end-2 bg-accent text-accent-foreground text-[10px] font-bold min-w-4 h-4 px-1 flex items-center justify-center">
                  {totalQuantity}
                </span>
              )}
            </Link>
            <button
              className="lg:hidden text-foreground"
              onClick={() => setMobile(!mobile)}
              aria-label={mobile ? "סגור תפריט" : "פתח תפריט"}
              aria-expanded={mobile}
            >
              {mobile ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Desktop nav */}
        <nav className="hidden lg:block border-t border-border/60">
          <ul
            className="flex items-center justify-between gap-1 py-1.5"
            onMouseLeave={() => setOpen(null)}
          >
            {CATEGORIES.map((cat) => {
              const hasSubs = cat.subcategories.length > 0;

              return (
                <li
                  key={cat.slug}
                  className="relative"
                  onMouseEnter={() => setOpen(cat.name)}
                >
                  <Link
                    to="/categories/$categorySlug"
                    params={{ categorySlug: cat.slug }}
                    className="flex items-center justify-center gap-0.5 px-1.5 py-2.5 text-[13px] font-medium leading-tight text-foreground/85 hover:text-accent transition whitespace-nowrap"
                  >
                    {cat.name}
                    {hasSubs && <ChevronDown size={12} className="opacity-50 shrink-0" />}
                  </Link>
                  {open === cat.name && hasSubs && (
                    <div className="absolute start-0 top-full mt-0 bg-card border border-border shadow-[var(--shadow-card)] py-4 px-5 min-w-[240px] z-40">
                      <ul className="space-y-1.5">
                        {cat.subcategories.map((sub, index) => {
                          const productId = cat.subcategoryProductIds?.[index];
                          const anchorId = cat.subcategoryAnchorIds?.[index];
                          const className =
                            "text-sm text-muted-foreground hover:text-accent transition block py-1";

                          return (
                            <li key={sub}>
                              {productId ? (
                                <Link
                                  to="/products/$productId"
                                  params={{ productId }}
                                  className={className}
                                >
                                  {sub}
                                </Link>
                              ) : (
                                <Link
                                  to="/categories/$categorySlug"
                                  params={{ categorySlug: cat.slug }}
                                  hash={anchorId}
                                  className={className}
                                >
                                  {sub}
                                </Link>
                              )}
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>
      </div>

      {mobile && (
        <div className="lg:hidden border-t border-border bg-card">
          <div className="p-4">
            <ul>
              <li className="border-b border-border">
                <Link
                  to="/account"
                  className="flex items-center gap-2 py-3 text-sm font-semibold text-accent"
                  onClick={() => setMobile(false)}
                >
                  <User size={18} />
                  החשבון שלי
                </Link>
              </li>
              {CATEGORIES.map((cat) => (
                <li key={cat.slug} className="border-b border-border last:border-0">
                  <Link
                    to="/categories/$categorySlug"
                    params={{ categorySlug: cat.slug }}
                    className="block py-3 text-sm font-semibold"
                    onClick={() => setMobile(false)}
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </header>
  );
}
