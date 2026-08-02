import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import type { PassesStore } from "@/data/passes";

const UPSTASH_KEY = "chole:activity-passes";

function emptyStore(): PassesStore {
  return {
    passes: [],
    standingRegistrations: [],
    redemptions: [],
    updatedAt: new Date().toISOString(),
  };
}

function getFileStorePath(): string {
  if (process.env.PASSES_STORE_PATH) {
    return process.env.PASSES_STORE_PATH;
  }
  if (process.env.VERCEL) {
    return "/tmp/chole-passes.json";
  }
  return join(process.cwd(), "data/passes.json");
}

async function readFromUpstash(): Promise<PassesStore | null> {
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
  return JSON.parse(json.result) as PassesStore;
}

async function writeToUpstash(store: PassesStore): Promise<void> {
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

async function readFromFile(): Promise<PassesStore> {
  const path = getFileStorePath();
  try {
    const raw = await readFile(path, "utf8");
    return JSON.parse(raw) as PassesStore;
  } catch (error) {
    const err = error as NodeJS.ErrnoException;
    if (err.code === "ENOENT") return emptyStore();
    throw error;
  }
}

async function writeToFile(store: PassesStore): Promise<void> {
  const path = getFileStorePath();
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, JSON.stringify(store, null, 2), "utf8");
}

export async function loadPassesStore(): Promise<PassesStore> {
  const fromUpstash = await readFromUpstash();
  if (fromUpstash) return fromUpstash;
  return readFromFile();
}

export async function savePassesStore(store: PassesStore): Promise<void> {
  const payload: PassesStore = {
    ...store,
    updatedAt: new Date().toISOString(),
  };

  if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
    await writeToUpstash(payload);
    return;
  }

  await writeToFile(payload);
}

export function findPassById(store: PassesStore, id: string) {
  return store.passes.find((pass) => pass.id === id);
}

export function getActivePassesForCustomer(store: PassesStore, customerId: string) {
  return store.passes.filter(
    (pass) => pass.customerId === customerId && pass.status === "active" && pass.entriesRemaining > 0,
  );
}

export function getPassesForCustomer(store: PassesStore, customerId: string) {
  return store.passes.filter((pass) => pass.customerId === customerId);
}
