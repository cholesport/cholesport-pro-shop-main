import {
  AIRFLOOR_MAT_VARIANTS,
  type AirfloorMatVariant,
} from "@/data/airfloorMats";

const MAX_LENGTH_M = Math.max(...AIRFLOOR_MAT_VARIANTS.map((v) => v.lengthM));
const MAX_WIDTH_M = Math.max(...AIRFLOOR_MAT_VARIANTS.map((v) => v.widthM));
const MAX_THICKNESS_M = Math.max(...AIRFLOOR_MAT_VARIANTS.map((v) => v.thicknessM));

/** Smallest scale so the shortest mats stay readable in the gallery. */
const MIN_IMAGE_SCALE = 0.55;

/**
 * Relative visual scale for an airfloor product photo vs the longest size
 * (10×2×0.2 m). Length dominates; width/thickness are constant across the line
 * but stay in the formula for consistency with landing mats.
 */
export function getAirfloorMatImageScale(
  variant: Pick<AirfloorMatVariant, "lengthM" | "widthM" | "thicknessM">,
): number {
  const footprint = Math.sqrt(
    (variant.lengthM / MAX_LENGTH_M) * (variant.widthM / MAX_WIDTH_M),
  );
  const thickness = variant.thicknessM / MAX_THICKNESS_M;
  const scale = 0.88 * footprint + 0.12 * thickness;
  return Math.min(1, Math.max(MIN_IMAGE_SCALE, scale));
}
