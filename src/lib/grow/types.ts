/**
 * Future Grow (משולם) API types.
 * When API credentials and docs are provided, map these to live products,
 * packages and class schedules from the payment provider.
 */

export type GrowProductRef = {
  growProductId: string;
  sku?: string;
  name: string;
  price: number;
};

export type GrowSessionRef = {
  growSessionId: string;
  title: string;
  startsAt: string;
  endsAt: string;
};

/** Shape expected when syncing Grow catalog into site activities data. */
export type GrowActivitiesSyncPayload = {
  products: GrowProductRef[];
  sessions: GrowSessionRef[];
  syncedAt: string;
};
