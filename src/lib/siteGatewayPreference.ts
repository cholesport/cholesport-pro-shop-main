import type { SiteGatewayAreaId } from "@/data/siteGateway";
import { SITE_GATEWAY_STORAGE_KEY } from "@/data/siteGateway";
import { readLocalStorage, writeLocalStorage } from "@/lib/safeStorage";

const VALID_AREAS: SiteGatewayAreaId[] = ["table-tennis", "kids", "shop"];

export function isSiteGatewayAreaId(value: string | null | undefined): value is SiteGatewayAreaId {
  return VALID_AREAS.includes(value as SiteGatewayAreaId);
}

export function readSiteGatewayPreference(): SiteGatewayAreaId | null {
  const stored = readLocalStorage(SITE_GATEWAY_STORAGE_KEY);
  return isSiteGatewayAreaId(stored) ? stored : null;
}

export function saveSiteGatewayPreference(areaId: SiteGatewayAreaId): void {
  writeLocalStorage(SITE_GATEWAY_STORAGE_KEY, areaId);
}
