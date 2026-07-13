import { PRODUCTS, type Product } from "@/data/products";

function normalizeSearchText(text: string): string {
  return text
    .trim()
    .toLowerCase()
    .replace(/['"״׳]/g, "")
    .replace(/\s+/g, " ");
}

function getProductSearchHaystack(product: Product): string {
  return normalizeSearchText([product.title, product.brand, product.cat, product.sku, product.id].join(" "));
}

type ScoredProduct = { product: Product; score: number };

function scoreProduct(product: Product, query: string, tokens: string[]): number | null {
  const haystack = getProductSearchHaystack(product);
  if (!tokens.every((token) => haystack.includes(token))) return null;

  const title = normalizeSearchText(product.title);
  const category = normalizeSearchText(product.cat);
  const id = normalizeSearchText(product.id);
  let score = 0;

  if (title === query) score += 200;
  else if (title.startsWith(query)) score += 120;
  else if (title.includes(query)) score += 80;

  if (category.includes(query)) score += 40;
  if (id.includes(query)) score += 30;
  if (normalizeSearchText(product.brand).includes(query)) score += 20;

  score += Math.max(0, 20 - title.indexOf(tokens[0] ?? ""));

  return score;
}

/** Returns products matching the query, best matches first. */
export function searchProducts(query: string, limit = 8): Product[] {
  const normalizedQuery = normalizeSearchText(query);
  if (!normalizedQuery) return [];

  const tokens = normalizedQuery.split(" ").filter(Boolean);

  return PRODUCTS.map((product) => {
    const score = scoreProduct(product, normalizedQuery, tokens);
    return score === null ? null : { product, score };
  })
    .filter((entry): entry is ScoredProduct => entry !== null)
    .sort((a, b) => b.score - a.score || a.product.title.localeCompare(b.product.title, "he"))
    .slice(0, limit)
    .map(({ product }) => product);
}
