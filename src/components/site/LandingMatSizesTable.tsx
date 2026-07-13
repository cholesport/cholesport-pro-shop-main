import { Link } from "@tanstack/react-router";
import {
  formatLandingMatDimensions,
  formatLandingMatDimensionsSlash,
  LANDING_MAT_VARIANTS,
  type LandingMatVariant,
} from "@/data/landingMats";

type LandingMatSizesTableProps = {
  currentProductId: string;
};

function formatPrice(n: number) {
  return n.toLocaleString("he-IL");
}

function DimensionsText({ children }: { children: string }) {
  return (
    <span dir="ltr" className="unicode-bidi-plaintext inline-block">
      {children}
    </span>
  );
}

export function LandingMatSizesTable({ currentProductId }: LandingMatSizesTableProps) {
  return (
    <section dir="rtl" className="mt-12 max-w-3xl" aria-labelledby="landing-mat-sizes-heading">
      <h2 id="landing-mat-sizes-heading" className="text-xl font-bold text-foreground mb-2">
        טבלת מידות — מזרני נחיתה
      </h2>
      <p className="text-sm text-muted-foreground mb-5">
        5 גדלים שונים לפי הצורך. לחצו על שורה כדי לעבור למידה אחרת.
      </p>

      {/* Desktop table */}
      <div className="hidden sm:block overflow-x-auto rounded-xl border border-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-secondary/60 text-foreground">
              <th scope="col" className="text-start font-bold px-4 py-3">
                מידות (אורך / רוחב / עובי)
              </th>
              <th scope="col" className="text-start font-bold px-4 py-3">
                מחיר
              </th>
              <th scope="col" className="text-start font-bold px-4 py-3 sr-only">
                פעולה
              </th>
            </tr>
          </thead>
          <tbody>
            {LANDING_MAT_VARIANTS.map((variant) => (
              <SizeRow
                key={variant.id}
                variant={variant}
                currentProductId={currentProductId}
                layout="table"
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="sm:hidden space-y-3">
        {LANDING_MAT_VARIANTS.map((variant) => (
          <SizeRow
            key={variant.id}
            variant={variant}
            currentProductId={currentProductId}
            layout="card"
          />
        ))}
      </div>
    </section>
  );
}

function SizeRow({
  variant,
  currentProductId,
  layout,
}: {
  variant: LandingMatVariant;
  currentProductId: string;
  layout: "table" | "card";
}) {
  const isCurrent = variant.id === currentProductId;
  const dims = formatLandingMatDimensionsSlash(variant);
  const shortDims = formatLandingMatDimensions(variant);

  if (layout === "card") {
    return (
      <Link
        to="/products/$productId"
        params={{ productId: variant.id }}
        aria-current={isCurrent ? "page" : undefined}
        className={`block rounded-xl border p-4 transition ${
          isCurrent
            ? "border-accent bg-accent/5 ring-2 ring-accent/30"
            : "border-border bg-card hover:border-accent/40"
        }`}
      >
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="font-bold text-foreground">
              <DimensionsText>{shortDims}</DimensionsText>
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              <DimensionsText>{dims}</DimensionsText>
            </p>
          </div>
          <div className="text-end shrink-0">
            <p className="text-lg font-black text-foreground">
              <span dir="ltr" className="unicode-bidi-plaintext inline-block">
                {formatPrice(variant.price)} ₪
              </span>
            </p>
            {isCurrent && (
              <span className="text-xs font-bold text-accent">המידה הנוכחית</span>
            )}
          </div>
        </div>
      </Link>
    );
  }

  return (
    <tr
      className={`border-t border-border transition ${
        isCurrent ? "bg-accent/5" : "hover:bg-secondary/40"
      }`}
    >
      <td className="px-4 py-3">
        <Link
          to="/products/$productId"
          params={{ productId: variant.id }}
          aria-current={isCurrent ? "page" : undefined}
          className={`font-semibold hover:text-accent transition ${
            isCurrent ? "text-accent" : "text-foreground"
          }`}
        >
          <DimensionsText>{dims}</DimensionsText>
          {isCurrent && (
            <span className="ms-2 text-xs font-bold text-accent">(נבחר)</span>
          )}
        </Link>
      </td>
      <td className="px-4 py-3 font-bold text-foreground whitespace-nowrap">
        <span dir="ltr" className="unicode-bidi-plaintext inline-block">
          {formatPrice(variant.price)} ₪
        </span>
      </td>
      <td className="px-4 py-3">
        {!isCurrent && (
          <Link
            to="/products/$productId"
            params={{ productId: variant.id }}
            className="inline-flex items-center gap-1 text-xs font-semibold text-accent hover:underline"
          >
            <span aria-hidden>←</span>
            לעמוד המוצר
          </Link>
        )}
      </td>
    </tr>
  );
}
