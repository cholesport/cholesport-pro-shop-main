import {
  BRANDS_SECTION_SUBTITLE,
  BRANDS_SECTION_TITLE,
  STORE_BRANDS,
  getBrandLogo,
  type StoreBrand,
} from "@/data/brands";

type BrandMarkProps = {
  brand: StoreBrand;
  variant?: "light" | "dark";
  /** Tailwind height class for the image */
  heightClass?: string;
  className?: string;
  linked?: boolean;
};

export function BrandMark({
  brand,
  variant = "light",
  heightClass = "h-8",
  className = "",
  linked = true,
}: BrandMarkProps) {
  const img = (
    <img
      src={getBrandLogo(brand, variant)}
      alt={brand.name}
      className={`${heightClass} w-auto object-contain ${className}`}
    />
  );

  if (!linked) return img;

  return (
    <a
      href={brand.href}
      className="inline-flex items-center opacity-90 hover:opacity-100 transition"
      aria-label={brand.name}
    >
      {img}
    </a>
  );
}

type BrandLogoRowProps = {
  variant?: "light" | "dark";
  heightClass?: string;
  className?: string;
};

/** Compact horizontal row of all store brands — footer / inline use. */
export function BrandLogoRow({
  variant = "light",
  heightClass = "h-7 md:h-8",
  className = "",
}: BrandLogoRowProps) {
  return (
    <ul className={`flex flex-wrap items-center gap-6 md:gap-10 ${className}`} aria-label="מותגים בחנות">
      {STORE_BRANDS.map((brand) => (
        <li key={brand.id}>
          <BrandMark brand={brand} variant={variant} heightClass={heightClass} />
        </li>
      ))}
    </ul>
  );
}

/** Homepage section highlighting brands we sell. */
export function BrandsSection() {
  return (
    <section id="brands" className="border-y border-border bg-card" aria-labelledby="brands-heading">
      <div className="max-w-7xl mx-auto px-4 py-12 md:py-16">
        <div className="max-w-xl mb-8 md:mb-10">
          <h2 id="brands-heading" className="text-2xl md:text-3xl font-extrabold text-foreground">
            {BRANDS_SECTION_TITLE}
          </h2>
          <p className="text-muted-foreground mt-3 leading-relaxed">{BRANDS_SECTION_SUBTITLE}</p>
        </div>
        <BrandLogoRow heightClass="h-10 md:h-12" />
      </div>
    </section>
  );
}
