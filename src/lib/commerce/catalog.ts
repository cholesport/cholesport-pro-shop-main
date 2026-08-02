import {
  ACTIVITIES_CATEGORIES,
  ACTIVITIES_PRICING,
  type ActivityCategoryId,
  type ActivityPricingPlan,
} from "@/data/activities";
import { CATEGORIES } from "@/data/categories";
import { getProductById } from "@/data/products";
import type { ShopOrderItem } from "@/data/shopOrders";

export function getStorefrontCategoryForProductCat(productCat: string) {
  return CATEGORIES.find((category) => category.productCats.includes(productCat));
}

export function getActivityCategoryById(categoryId: ActivityCategoryId) {
  return ACTIVITIES_CATEGORIES.find((category) => category.id === categoryId);
}

export function getActivityPlanById(planId: string): ActivityPricingPlan | undefined {
  return ACTIVITIES_PRICING.find((plan) => plan.id === planId);
}

export function enrichShopOrderItem(
  item: Pick<ShopOrderItem, "productId" | "title" | "quantity" | "price">,
): ShopOrderItem {
  const product = getProductById(item.productId);
  const productCat = product?.cat;
  const category = productCat ? getStorefrontCategoryForProductCat(productCat) : undefined;

  return {
    ...item,
    productCat,
    categorySlug: category?.slug,
    categoryName: category?.name ?? productCat,
  };
}

export function getActivityCategoryMeta(categoryId: ActivityCategoryId) {
  const category = getActivityCategoryById(categoryId);
  return {
    categoryId,
    categoryName: category?.title ?? categoryId,
  };
}

export function getActivityPlanMeta(planId?: string) {
  if (!planId) {
    return { planName: undefined, isSubscription: undefined };
  }

  const plan = getActivityPlanById(planId);
  return {
    planName: plan?.name,
    isSubscription: plan?.isSubscription,
  };
}
