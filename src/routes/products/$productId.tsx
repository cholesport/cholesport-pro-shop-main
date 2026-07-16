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
import {
  getGymboreeProductById,
  getGymboreeSeoDescription,
  getGymboreeSeoTitle,
  isGymboreeProduct,
} from "@/data/gymboree";
import {
  getTrainingAccessoryById,
  getTrainingAccessorySeoDescription,
  getTrainingAccessorySeoTitle,
  isTrainingAccessoryProduct,
} from "@/data/trainingAccessories";
import { buildPageSeoHead } from "@/lib/seo";

export const Route = createFileRoute("/products/$productId")({
  loader: ({ params }) => {
    const product = getProductById(params.productId);
    if (!product) throw notFound();
    return product;
  },
  head: ({ loaderData }) => {
    const landingVariant = getLandingMatVariantById(loaderData.id);
    const airfloorVariant = getAirfloorMatVariantById(loaderData.id);
    const gymboreeProduct = getGymboreeProductById(loaderData.id);
    const trainingAccessory = getTrainingAccessoryById(loaderData.id);
    const isLandingMat = isLandingMatProduct(loaderData) && landingVariant;
    const isAirfloorMat = isAirfloorMatProduct(loaderData) && airfloorVariant;
    const isGymboree = isGymboreeProduct(loaderData) && gymboreeProduct;
    const isTrainingAccessory = isTrainingAccessoryProduct(loaderData) && trainingAccessory;

    const title = isLandingMat
      ? getLandingMatSeoTitle(landingVariant)
      : isAirfloorMat
        ? getAirfloorMatSeoTitle(airfloorVariant)
        : isGymboree
          ? getGymboreeSeoTitle(gymboreeProduct)
          : isTrainingAccessory
            ? getTrainingAccessorySeoTitle(trainingAccessory)
            : loaderData.title;

    const description = isLandingMat
      ? getLandingMatSeoDescription(landingVariant)
      : isAirfloorMat
        ? getAirfloorMatSeoDescription(airfloorVariant)
        : isGymboree
          ? getGymboreeSeoDescription(gymboreeProduct)
          : isTrainingAccessory
            ? getTrainingAccessorySeoDescription(trainingAccessory)
            : (loaderData.introParagraphs[0] ?? loaderData.title);

    const image =
      typeof loaderData.image === "string"
        ? loaderData.image.startsWith("http")
          ? loaderData.image
          : undefined
        : undefined;

    const seo = buildPageSeoHead({
      title: `${title} — CHOLE sport | cholesport.co.il`,
      description,
      path: `/products/${loaderData.id}`,
      type: "product",
      image,
    });
    return { meta: seo.meta, links: seo.links };
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
