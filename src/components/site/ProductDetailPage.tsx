import { useState, Fragment } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Star, Store } from "lucide-react";
import { toast } from "sonner";
import type { Product } from "@/data/products";
import { getRelatedProducts } from "@/data/products";
import { useCart } from "@/context/CartContext";
import { PAYMENT_SUMMARY, PAYMENT_WHATSAPP_NOTICE } from "@/data/payment";
import { SHOWROOM_SHORT, SHOWROOM_TITLE } from "@/data/showroom";
import { COMPANY } from "@/data/legal";
import { ComplementaryEquipmentSection } from "@/components/site/ComplementaryEquipmentSection";
import { TableTennisEquipmentCarousel } from "@/components/site/TableTennisEquipmentCarousel";
import { LandingMatAirfloorSection } from "@/components/site/LandingMatAirfloorSection";
import { LandingMatWarrantySection } from "@/components/site/LandingMatWarrantySection";
import { LandingMatSizeBar } from "@/components/site/LandingMatSizeBar";
import { AirfloorSizeBar } from "@/components/site/AirfloorSizeBar";
import { GymboreeProductBar } from "@/components/site/GymboreeProductBar";
import { TrainingAccessoriesProductBar } from "@/components/site/TrainingAccessoriesProductBar";
import { TrainingHurdleHeightBar } from "@/components/site/TrainingHurdleHeightBar";
import { BalancePitaColorOptions } from "@/components/site/BalancePitaColorOptions";
import { QuantityInput } from "@/components/site/QuantityInput";
import { LandingMatSizesTable } from "@/components/site/LandingMatSizesTable";
import { AirfloorSafetyNotice } from "@/components/site/AirfloorSafetyNotice";
import { AirfloorSizesTable } from "@/components/site/AirfloorSizesTable";
import { ProductMedia } from "@/components/site/ProductMedia";
import { PONG_BOT_NOVA_S_PRO_ID } from "@/data/products";
import {
  isLandingMatAirfloorProduct,
  isLandingMatProduct,
} from "@/data/landingMats";
import {
  isAirfloorMatProduct,
  shouldShowAirfloorSafetyNotice,
} from "@/data/airfloorMats";
import { isGymboreeProduct } from "@/data/gymboree";
import {
  getPuzzleMatDealLabel,
  getPuzzleMatUnitPrice,
  isHurdleProduct,
  isPuzzleMatProductId,
  isTrainingAccessoryProduct,
  PUZZLE_MAT_UNIT_PRICE,
} from "@/data/trainingAccessories";
import { hasProductImage, shouldContainProductImage } from "@/lib/productMedia";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { BrandMark } from "@/components/site/BrandLogos";
import { FadeIn } from "@/components/site/FadeIn";
import { getStoreBrandByProductBrand } from "@/data/brands";

function formatPrice(n: number) {
  return n.toLocaleString("he-IL", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function Stars({ rating, reviews }: { rating: number; reviews: number }) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={16}
          className={i < Math.round(rating) ? "fill-amber-400 text-amber-400" : "text-muted-foreground/40"}
        />
      ))}
      {reviews > 0 && <span className="text-sm text-muted-foreground me-2">({reviews})</span>}
    </div>
  );
}

function RelatedCard({ product }: { product: Product }) {
  const storeBrand = getStoreBrandByProductBrand(product.brand);
  const containImage = shouldContainProductImage(product);

  return (
    <Link
      to="/products/$productId"
      params={{ productId: product.id }}
      className="group block text-center"
    >
      <div
        className={`aspect-square rounded-lg overflow-hidden mb-3 ${
          containImage ? "bg-white border border-border" : "bg-secondary"
        }`}
      >
        <ProductMedia
          product={product}
          alt={product.title}
          fit={containImage ? "contain" : "cover"}
          imgClassName={
            containImage
              ? "p-2 group-hover:scale-[1.02] transition duration-300"
              : "group-hover:scale-105 transition duration-300"
          }
        />
      </div>
      <p className="text-sm font-medium text-foreground leading-snug line-clamp-2 min-h-[2.5rem]">
        {product.title}
      </p>
      {storeBrand ? (
        <div className="mt-2 flex justify-center">
          <BrandMark brand={storeBrand} heightClass="h-5" linked={false} />
        </div>
      ) : (
        <p className="text-xs text-muted-foreground mt-1">{product.brand}</p>
      )}
      <p className="text-sm font-bold mt-2">₪{formatPrice(product.price)}</p>
      {product.reviews > 0 && (
        <div className="flex justify-center mt-1">
          <Stars rating={product.rating} reviews={product.reviews} />
        </div>
      )}
    </Link>
  );
}

function FeatureHighlight({
  highlight,
  className = "mt-6",
}: {
  highlight: NonNullable<Product["featureHighlight"]>;
  className?: string;
}) {
  return (
    <figure
      className={`grid md:grid-cols-2 gap-6 md:gap-8 items-center rounded-xl border border-border bg-secondary/40 p-4 md:p-6 ${className}`}
    >
      <div className="bg-white rounded-lg overflow-hidden aspect-[4/3] border border-border">
        <img
          src={highlight.image}
          alt={highlight.title}
          className="w-full h-full object-contain"
          loading="lazy"
        />
      </div>
      <figcaption className="text-sm leading-relaxed">
        <h3 className="text-base md:text-lg font-bold text-foreground">{highlight.title}</h3>
        <p className="text-muted-foreground mt-3">{highlight.caption}</p>
      </figcaption>
    </figure>
  );
}

export function ProductDetailPage({ product }: { product: Product }) {
  const [activeImage, setActiveImage] = useState(0);
  const [isGalleryHovered, setIsGalleryHovered] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();
  const navigate = useNavigate();
  const related = getRelatedProducts(product);
  const isGameTable = product.cat === "שולחנות משחק";
  const showTtEquipment = isGameTable || product.cat === "טניס שולחן";
  const showLandingMatSizes = isLandingMatProduct(product);
  const showLandingMatAirfloor = isLandingMatAirfloorProduct(product.id);
  const showAirfloorSizes = isAirfloorMatProduct(product);
  const showAirfloorSafety = shouldShowAirfloorSafetyNotice(product.id);
  const showGymboreeProducts = isGymboreeProduct(product);
  const showTrainingAccessories = isTrainingAccessoryProduct(product);
  const showHurdleHeights = isHurdleProduct(product.id);
  const showBalancePitaColors = product.id === "training-balance-pita";
  const isPuzzleMat = isPuzzleMatProductId(product.id);
  const unitPrice = isPuzzleMat ? getPuzzleMatUnitPrice(quantity) : product.price;
  const puzzleDealLabel = isPuzzleMat ? getPuzzleMatDealLabel(quantity) : null;
  const hasDiscount = product.was > product.price;
  const showGallery = hasProductImage(product);
  const primaryImage = product.images[activeImage] ?? product.img;
  const hoverSwapImage = product.images.length > 1 ? product.images[1] : undefined;
  const showHoverSwap = Boolean(isGalleryHovered && activeImage === 0 && hoverSwapImage);
  const storeBrand = getStoreBrandByProductBrand(product.brand);

  function handleAddToCart() {
    addItem(product, quantity);
    toast.success("נוסף לעגלה", {
      description: `${product.title} · כמות ${quantity}`,
      action: {
        label: "לעגלה",
        onClick: () => navigate({ to: "/cart" }),
      },
    });
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
      {showLandingMatSizes && <LandingMatSizeBar currentProductId={product.id} />}
      {showAirfloorSizes && <AirfloorSizeBar currentProductId={product.id} />}
      {showGymboreeProducts && <GymboreeProductBar currentProductId={product.id} />}
      {showTrainingAccessories && (
        <TrainingAccessoriesProductBar currentProductId={product.id} />
      )}
      {showHurdleHeights && <TrainingHurdleHeightBar currentProductId={product.id} />}

      <FadeIn preset="detail" immediate className="grid lg:grid-cols-2 gap-10 lg:gap-16">
        {/* Gallery */}
        <div className="flex gap-4">
          <div
            className="relative flex-1 bg-secondary rounded-xl overflow-hidden aspect-square border border-border flex items-center justify-center"
            onMouseEnter={() => setIsGalleryHovered(true)}
            onMouseLeave={() => setIsGalleryHovered(false)}
          >
            {showGallery && primaryImage ? (
              <div className="relative w-full h-full flex items-center justify-center bg-white p-3 md:p-5">
                <img
                  src={primaryImage}
                  alt={product.title}
                  className={`w-full h-full object-contain transition-opacity duration-300 ${
                    showHoverSwap ? "opacity-0" : "opacity-100"
                  }`}
                />
                {hoverSwapImage && activeImage === 0 && (
                  <img
                    src={hoverSwapImage}
                    alt={`${product.title} — מצב קיפול`}
                    className={`absolute inset-3 md:inset-5 w-auto h-auto max-w-[calc(100%-1.5rem)] md:max-w-[calc(100%-2.5rem)] max-h-[calc(100%-1.5rem)] md:max-h-[calc(100%-2.5rem)] object-contain m-auto transition-opacity duration-300 ${
                      showHoverSwap ? "opacity-100" : "opacity-0"
                    }`}
                  />
                )}
              </div>
            ) : (
              <div className="px-8 text-center">
                <p className="text-xl md:text-2xl font-bold text-foreground leading-snug">
                  {product.title}
                </p>
                <p className="mt-3 text-sm text-muted-foreground">תמונת מוצר תתווסף בקרוב</p>
              </div>
            )}
          </div>
          {showGallery && product.images.length > 1 && (
            <div className="flex flex-col gap-2 w-20 shrink-0">
              {product.images.map((img, i) => (
                <button
                  key={img + i}
                  type="button"
                  onClick={() => setActiveImage(i)}
                  className={`aspect-square rounded-lg overflow-hidden border-2 bg-white transition ${
                    activeImage === i ? "border-foreground" : "border-transparent opacity-70 hover:opacity-100"
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-contain" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Buy box */}
        <div className="flex flex-col">
          {storeBrand ? (
            <BrandMark brand={storeBrand} heightClass="h-7 md:h-8" />
          ) : (
            <p className="text-sm text-muted-foreground tracking-wide">{product.brand}</p>
          )}
          <div className="flex flex-wrap items-center gap-2 mt-1">
            <h1 className="text-2xl md:text-3xl font-bold text-foreground leading-tight">{product.title}</h1>
            {product.badge && (
              <span className="inline-flex items-center rounded-full bg-accent px-3 py-1 text-xs font-bold uppercase tracking-wide text-accent-foreground">
                {product.badge}
              </span>
            )}
          </div>
          <p className="text-sm text-muted-foreground mt-2">מק״ט {product.sku}</p>

          <div className="mt-6 flex items-baseline gap-3 flex-wrap">
            <span
              className={`text-3xl font-bold ${
                isPuzzleMat && unitPrice < PUZZLE_MAT_UNIT_PRICE
                  ? "text-destructive"
                  : hasDiscount
                    ? "text-destructive"
                    : "text-foreground"
              }`}
            >
              ₪ {formatPrice(unitPrice)}
            </span>
            {isPuzzleMat && unitPrice < PUZZLE_MAT_UNIT_PRICE ? (
              <span className="text-lg text-muted-foreground line-through">
                ₪ {formatPrice(PUZZLE_MAT_UNIT_PRICE)}
              </span>
            ) : (
              hasDiscount && (
                <span className="text-lg text-muted-foreground line-through">
                  ₪ {formatPrice(product.was)}
                </span>
              )
            )}
            {isPuzzleMat && (
              <span className="text-sm text-muted-foreground">ליחידה</span>
            )}
          </div>

          {puzzleDealLabel && (
            <p className="mt-2 text-sm font-medium text-accent">{puzzleDealLabel}</p>
          )}

          <p className="mt-2 text-sm text-muted-foreground">{PAYMENT_WHATSAPP_NOTICE}</p>

          {product.reviews > 0 && (
            <div className="mt-3">
              <Stars rating={product.rating} reviews={product.reviews} />
            </div>
          )}

          <div className="mt-8">
            <label htmlFor="product-quantity" className="text-sm font-semibold text-foreground block mb-2">
              כמות
            </label>
            <QuantityInput
              id="product-quantity"
              value={quantity}
              onChange={setQuantity}
              size="md"
            />
            {isPuzzleMat && (
              <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                מ-20 יח׳ המחיר יורד ל-100 ₪ ליחידה · מעל 40 יח׳ — 80 ₪ ליחידה
              </p>
            )}
          </div>

          {product.stockNote && (
            <p className="mt-4 text-sm text-amber-600 font-medium flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              {product.stockNote}
            </p>
          )}

          <p className="mt-4 text-xs text-muted-foreground">{PAYMENT_SUMMARY}</p>

          {showBalancePitaColors && <BalancePitaColorOptions />}

          <Button
            onClick={handleAddToCart}
            className="mt-6 w-full h-12 text-base font-bold rounded-none bg-foreground text-background hover:bg-foreground/90"
          >
            הוספה לסל
          </Button>

          <div className="mt-6 flex gap-3 rounded-xl border border-border bg-secondary/50 p-4">
            <Store size={20} className="text-accent shrink-0 mt-0.5" aria-hidden />
            <div className="text-sm leading-relaxed">
              <p className="font-semibold text-foreground">{SHOWROOM_TITLE}</p>
              <p className="text-muted-foreground mt-1">{SHOWROOM_SHORT}.</p>
              <p className="text-muted-foreground mt-1">
                {COMPANY.address} ·{" "}
                <a href={`tel:${COMPANY.phone.replace(/-/g, "")}`} className="text-accent hover:underline">
                  {COMPANY.phone}
                </a>
              </p>
              <Link
                to="/categories/$categorySlug"
                params={{ categorySlug: "show-room" }}
                className="inline-block mt-2 text-xs font-semibold text-accent hover:underline"
              >
                למידע נוסף על ה-{SHOWROOM_TITLE}
              </Link>
            </div>
          </div>

          <div className="mt-10 space-y-4 text-foreground">
            <h2 className="text-lg font-bold">{product.introTitle}</h2>
            {product.introParagraphs.map((p) => (
              <p key={p.slice(0, 40)} className="text-sm leading-relaxed text-muted-foreground">
                {p}
              </p>
            ))}
            {showAirfloorSafety && <AirfloorSafetyNotice />}
          </div>
        </div>
      </FadeIn>

      {/* Features */}
      <FadeIn preset="detail" as="section" className="mt-16 max-w-3xl">
        <h2 className="text-xl font-bold text-foreground mb-6">{product.featuresTitle}</h2>
        <ul className="space-y-5">
          {product.features.map((f) => (
            <Fragment key={f.title}>
              <li className="text-sm leading-relaxed">
                <strong className="text-foreground font-bold">{f.title}:</strong>{" "}
                <span className="text-muted-foreground">{f.description}</span>
              </li>
              {product.featureHighlight &&
                f.title.startsWith(product.featureHighlight.afterFeaturePrefix) && (
                <li className="list-none">
                  <FeatureHighlight highlight={product.featureHighlight} />
                </li>
              )}
            </Fragment>
          ))}
        </ul>
      </FadeIn>

      {/* Specs */}
      <FadeIn preset="detail" as="section" className="mt-12 max-w-3xl">
        <h2 className="text-xl font-bold text-foreground mb-4">{product.specsTitle}</h2>
        <ul className="space-y-2 text-sm">
          {product.specs.map((s) => (
            <li key={s.label}>
              <strong className="font-bold">{s.label}:</strong> {s.value}
            </li>
          ))}
        </ul>
      </FadeIn>

      {showLandingMatAirfloor && (
        <FadeIn preset="detail">
          <LandingMatAirfloorSection />
        </FadeIn>
      )}

      {showLandingMatSizes && (
        <FadeIn preset="detail">
          <LandingMatSizesTable currentProductId={product.id} />
        </FadeIn>
      )}

      {showAirfloorSizes && (
        <FadeIn preset="detail">
          <AirfloorSizesTable currentProductId={product.id} />
        </FadeIn>
      )}

      {/* Warranty */}
      {showLandingMatAirfloor ? (
        <FadeIn preset="detail">
          <LandingMatWarrantySection />
        </FadeIn>
      ) : (
        <FadeIn preset="detail" as="section" className="mt-12 max-w-3xl">
          <h2 className="text-xl font-bold text-foreground mb-3">{product.warrantyTitle}</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">{product.warrantyText}</p>
        </FadeIn>
      )}

      {/* Audience */}
      <FadeIn preset="detail" as="section" className="mt-12 max-w-3xl">
        <h2 className="text-xl font-bold text-foreground mb-6">{product.audienceTitle}</h2>
        <ol className="space-y-4 list-decimal list-inside text-sm">
          {product.audience.map((a) => (
            <li key={a.title} className="leading-relaxed">
              <strong className="font-bold text-foreground">{a.title}:</strong>{" "}
              <span className="text-muted-foreground">{a.description}</span>
            </li>
          ))}
        </ol>
      </FadeIn>

      {/* CTA */}
      <section className="mt-12 pt-8 border-t border-border max-w-3xl text-center">
        <p className="text-lg font-bold text-foreground">{product.ctaText}</p>
        {product.videoNote && (
          <p className="text-xs text-muted-foreground mt-4">{product.videoNote}</p>
        )}
      </section>

      {/* Complementary training robot — game tables only */}
      {isGameTable && <ComplementaryEquipmentSection />}

      {/* Accordion */}
      <section className="mt-12 max-w-3xl">
        <Accordion type="single" collapsible className="w-full">
          {product.accordion.map((item) => (
            <AccordionItem key={item.title} value={item.title}>
              <AccordionTrigger className="text-base font-semibold hover:no-underline">
                {item.title}
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground leading-relaxed">
                {item.content}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      {/* Reviews */}
      <section className="mt-12 max-w-3xl border-t border-border pt-8">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <Stars rating={product.rating} reviews={product.reviews} />
          <Button variant="outline" className="rounded-none">
            הוספת ביקורת
          </Button>
        </div>
        <p className="text-center text-sm text-muted-foreground">
          היו הראשונים{" "}
          <button type="button" className="underline hover:text-foreground transition">
            להוסיף ביקורת
          </button>
        </p>
      </section>

      {/* Related products */}
      {related.length > 0 && (
        <section className="mt-16 pt-8 border-t border-border">
          <h2 className="text-xl font-bold text-center text-foreground mb-10">בדרך כלל נקנו ביחד</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {related.map((p) => (
              <RelatedCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* Table tennis equipment carousel */}
      {showTtEquipment && (
        <TableTennisEquipmentCarousel
          excludeProductId={product.id}
          prioritizeProductId={isGameTable ? PONG_BOT_NOVA_S_PRO_ID : undefined}
        />
      )}
    </div>
  );
}
