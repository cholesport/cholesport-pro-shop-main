import {
  LANDING_MAT_VARIANTS,
  type LandingMatVariant,
} from "@/data/landingMats";

const MAX_LENGTH_CM = Math.max(...LANDING_MAT_VARIANTS.map((v) => v.lengthCm));
const MAX_WIDTH_CM = Math.max(...LANDING_MAT_VARIANTS.map((v) => v.widthCm));
const MAX_THICKNESS_CM = Math.max(...LANDING_MAT_VARIANTS.map((v) => v.thicknessCm));

/** Smallest scale so compact mats stay readable in the gallery. */
const MIN_IMAGE_SCALE = 0.55;

/**
 * Relative visual scale for a landing-mat product photo vs the largest size
 * (250×200×30). Footprint dominates; thickness adds a small boost so 30cm
 * mats read slightly larger than 20cm at the same width.
 */
export function getLandingMatImageScale(
  variant: Pick<LandingMatVariant, "lengthCm" | "widthCm" | "thicknessCm">,
): number {
  const footprint = Math.sqrt(
    (variant.lengthCm / MAX_LENGTH_CM) * (variant.widthCm / MAX_WIDTH_CM),
  );
  const thickness = variant.thicknessCm / MAX_THICKNESS_CM;
  const scale = 0.88 * footprint + 0.12 * thickness;
  return Math.min(1, Math.max(MIN_IMAGE_SCALE, scale));
}
