import { Link } from "@tanstack/react-router";
import {
  AIRFLOOR_MAT_VARIANTS,
  formatAirfloorSizeSlash,
  type AirfloorMatVariant,
} from "@/data/airfloorMats";

type AirfloorSizesTableProps = {
  currentProductId: string;
};

function formatPrice(n: number) {
  return n.toLocaleString("he-IL");
}

function SizeLabel({ variant }: { variant: AirfloorMatVariant }) {
  const label = `${formatAirfloorSizeSlash(variant)} מטר`;
  return (
    <span dir="ltr" className="unicode-bidi-plaintext inline-block">
      {label}
    </span>
  );
}

export function AirfloorSizesTable({ currentProductId }: AirfloorSizesTableProps) {
  return (
    <section dir="rtl" className="mt-12 max-w-3xl" aria-labelledby="airfloor-sizes-heading">
      <h2 id="airfloor-sizes-heading" className="text-xl font-bold text-foreground mb-2">
        טבלת מידות ומחירי מבצע - מזרני איירפלור
      </h2>
      <p className="text-sm text-muted-foreground mb-5">
        כל המידות במחיר מבצע (כ־16% הנחה). לחצו על שורה כדי לעבור למידה אחרת. צריכים מידה שלא מופיעה כאן? אפשר להזמין איירפלור בגודל מיוחד בוואטסאפ.
      </p>

      <div className="hidden sm:block overflow-x-auto rounded-xl border border-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-secondary/60 text-foreground">
              <th scope="col" className="text-start font-bold px-4 py-3">
                מידות (אורך / רוחב / עובי)
              </th>
              <th scope="col" className="text-start font-bold px-4 py-3">
                מחיר מבצע
              </th>
              <th scope="col" className="text-start font-bold px-4 py-3 sr-only">
                פעולה
              </th>
            </tr>
          </thead>
          <tbody>
            {AIRFLOOR_MAT_VARIANTS.map((variant) => (
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

      <div className="sm:hidden space-y-3">
        {AIRFLOOR_MAT_VARIANTS.map((variant) => (
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
  variant: AirfloorMatVariant;
  currentProductId: string;
  layout: "table" | "card";
}) {
  const isCurrent = variant.id === currentProductId;

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
          <p className="font-bold text-foreground">
            <SizeLabel variant={variant} />
          </p>
          <div className="text-end shrink-0">
            <p className="text-lg font-black text-destructive">
              <span dir="ltr" className="unicode-bidi-plaintext inline-block">
                {formatPrice(variant.price)} ₪
              </span>
            </p>
            {variant.was > variant.price && (
              <p className="text-sm text-muted-foreground line-through">
                <span dir="ltr" className="unicode-bidi-plaintext inline-block">
                  {formatPrice(variant.was)} ₪
                </span>
              </p>
            )}
            {isCurrent && <span className="text-xs font-bold text-accent">המידה הנוכחית</span>}
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
          <SizeLabel variant={variant} />
          {isCurrent && <span className="ms-2 text-xs font-bold text-accent">(נבחר)</span>}
        </Link>
      </td>
      <td className="px-4 py-3 whitespace-nowrap">
        <span className="font-bold text-destructive" dir="ltr">
          {formatPrice(variant.price)} ₪
        </span>
        {variant.was > variant.price && (
          <span className="ms-2 text-sm text-muted-foreground line-through" dir="ltr">
            {formatPrice(variant.was)} ₪
          </span>
        )}
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
