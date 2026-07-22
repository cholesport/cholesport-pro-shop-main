import { COMPANY } from "@/data/legal";
import { CONTACT_PHONE_E164 } from "@/lib/contact";
import {
  SITE_DEFAULT_OG_IMAGE,
  SITE_HOST,
  SITE_KEYWORDS,
  SITE_NAME,
  SITE_ORIGIN,
  SITE_SEO_DESCRIPTION,
  SITE_SEO_TITLE,
  absoluteUrl,
} from "@/data/site";

export type PageSeoInput = {
  title?: string;
  description?: string;
  path?: string;
  image?: string;
  type?: "website" | "product";
  noIndex?: boolean;
};

/** Shared document head pieces for TanStack Router `head()`. */
export function buildPageSeoHead(input: PageSeoInput = {}) {
  const title = input.title ?? SITE_SEO_TITLE;
  const description = input.description ?? SITE_SEO_DESCRIPTION;
  const url = absoluteUrl(input.path ?? "/");
  const image = input.image ?? SITE_DEFAULT_OG_IMAGE;
  const type = input.type ?? "website";

  return {
    meta: [
      { title },
      { name: "description", content: description },
      { name: "keywords", content: SITE_KEYWORDS },
      { name: "author", content: SITE_NAME },
      { name: "application-name", content: SITE_NAME },
      {
        name: "robots",
        content: input.noIndex
          ? "noindex, nofollow"
          : "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
      },
      { name: "googlebot", content: input.noIndex ? "noindex, nofollow" : "index, follow" },
      { property: "og:locale", content: "he_IL" },
      { property: "og:type", content: type },
      { property: "og:site_name", content: SITE_NAME },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:url", content: url },
      { property: "og:image", content: image },
      { property: "og:image:alt", content: `${SITE_NAME} - לוגו` },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
      { name: "twitter:image", content: image },
    ],
    links: [
      { rel: "canonical", href: url },
      { rel: "alternate", hrefLang: "he", href: url },
      { rel: "alternate", hrefLang: "x-default", href: url },
    ],
  };
}

export function buildOrganizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "SportingGoodsStore",
    "@id": `${SITE_ORIGIN}/#organization`,
    name: SITE_NAME,
    alternateName: ["CHOLE", "cholesport", SITE_HOST, "www.cholesport.co.il", "צ׳ולה ספורט"],
    url: SITE_ORIGIN,
    logo: SITE_DEFAULT_OG_IMAGE,
    image: SITE_DEFAULT_OG_IMAGE,
    email: COMPANY.email,
    telephone: `+${CONTACT_PHONE_E164}`,
    description: SITE_SEO_DESCRIPTION,
    address: {
      "@type": "PostalAddress",
      streetAddress: "בית השואבה 6",
      addressLocality: "תל אביב",
      addressCountry: "IL",
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: `+${CONTACT_PHONE_E164}`,
      contactType: "customer service",
      availableLanguage: ["Hebrew", "he"],
      areaServed: "IL",
    },
  };
}

export function buildWebsiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_ORIGIN}/#website`,
    name: SITE_NAME,
    alternateName: ["cholesport.co.il", "www.cholesport.co.il", "CHOLE sport", "צ׳ולה ספורט"],
    url: SITE_ORIGIN,
    inLanguage: "he-IL",
    publisher: { "@id": `${SITE_ORIGIN}/#organization` },
  };
}

export function jsonLdScript(data: Record<string, unknown>) {
  return {
    type: "application/ld+json" as const,
    children: JSON.stringify(data),
  };
}
