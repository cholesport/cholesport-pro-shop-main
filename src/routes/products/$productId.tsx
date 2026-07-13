import { createFileRoute, notFound } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { ProductDetailPage } from "@/components/site/ProductDetailPage";
import { getProductById } from "@/data/products";
import {
  getLandingMatSeoDescription,
  getLandingMatSeoTitle,
  getLandingMatVariantById,
  isLandingMatProduct,
} from "@/data/landingMats";
import {
  getAirfloorMatSeoDescription,
  getAirfloorMatSeoTitle,
  getAirfloorMatVariantById,
  isAirfloorMatProduct,
} from "@/data/airfloorMats";

export const Route = createFileRoute("/products/$productId")({
  loader: ({ params }) => {
    const product = getProductById(params.productId);
    if (!product) throw notFound();
    return product;
  },
  head: ({ loaderData }) => {
    const landingVariant = getLandingMatVariantById(loaderData.id);
    const airfloorVariant = getAirfloorMatVariantById(loaderData.id);
    const isLandingMat = isLandingMatProduct(loaderData) && landingVariant;
    const isAirfloorMat = isAirfloorMatProduct(loaderData) && airfloorVariant;

    return {
      meta: [
        {
          title: isLandingMat
            ? `${getLandingMatSeoTitle(landingVariant)} — CHOLE sport`
            : isAirfloorMat
              ? `${getAirfloorMatSeoTitle(airfloorVariant)} — CHOLE sport`
              : `${loaderData.title} — CHOLE sport`,
        },
        {
          name: "description",
          content: isLandingMat
            ? getLandingMatSeoDescription(landingVariant)
            : isAirfloorMat
              ? getAirfloorMatSeoDescription(airfloorVariant)
              : (loaderData.introParagraphs[0] ?? loaderData.title),
        },
      ],
    };
  },
  component: ProductRoute,
});

function ProductRoute() {
  const product = Route.useLoaderData();

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main id="main-content">
        <ProductDetailPage product={product} />
      </main>
      <Footer />
    </div>
  );
}
