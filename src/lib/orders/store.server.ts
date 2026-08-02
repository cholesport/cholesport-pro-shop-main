import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import type { ShopOrdersStore } from "@/data/shopOrders";

const UPSTASH_KEY = "chole:shop-orders";

function emptyStore(): ShopOrdersStore {
  return { orders: [], updatedAt: new Date().toISOString() };
}

function getFileStorePath(): string {
  if (process.env.SHOP_ORDERS_STORE_PATH) {
    return process.env.SHOP_ORDERS_STORE_PATH;
  }
  if (process.env.VERCEL) {
    return "/tmp/chole-shop-orders.json";
  }
  return join(process.cwd(), "data/shop-orders.json");
}

async function readFromUpstash(): Promise<ShopOrdersStore | null> {
  const baseUrl = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!baseUrl || !token) return null;

  const response = await fetch(`${baseUrl}/get/${UPSTASH_KEY}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) {
    throw new Error(`שגיאת קריאה מ-Upstash (${response.status})`);
  }

  const json = (await response.json()) as { result: string | null };
  if (!json.result) return emptyStore();
  return JSON.parse(json.result) as ShopOrdersStore;
}

async function writeToUpstash(store: ShopOrdersStore): Promise<void> {
  const baseUrl = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!baseUrl || !token) return;

  const response = await fetch(`${baseUrl}/set/${UPSTASH_KEY}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(store),
  });
  if (!response.ok) {
    throw new Error(`שגיאת כתיבה ל-Upstash (${response.status})`);
  }
}

async function readFromFile(): Promise<ShopOrdersStore> {
  const path = getFileStorePath();
  try {
    const raw = await readFile(path, "utf8");
    return JSON.parse(raw) as ShopOrdersStore;
  } catch (error) {
    const err = error as NodeJS.ErrnoException;
    if (err.code === "ENOENT") return emptyStore();
    throw error;
  }
}

async function writeToFile(store: ShopOrdersStore): Promise<void> {
  const path = getFileStorePath();
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, JSON.stringify(store, null, 2), "utf8");
}

export async function loadShopOrdersStore(): Promise<ShopOrdersStore> {
  const fromUpstash = await readFromUpstash();
  if (fromUpstash) return fromUpstash;
  return readFromFile();
}

export async function saveShopOrdersStore(store: ShopOrdersStore): Promise<void> {
  const payload: ShopOrdersStore = {
    ...store,
    updatedAt: new Date().toISOString(),
  };

  if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
    await writeToUpstash(payload);
    return;
  }

  await writeToFile(payload);
}
