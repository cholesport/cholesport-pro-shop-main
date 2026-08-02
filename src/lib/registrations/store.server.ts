import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import type { RegistrationsStore } from "@/data/registrations";

const UPSTASH_KEY = "chole:activity-registrations";

function emptyStore(): RegistrationsStore {
  return { registrations: [], updatedAt: new Date().toISOString() };
}

function getFileStorePath(): string {
  if (process.env.REGISTRATIONS_STORE_PATH) {
    return process.env.REGISTRATIONS_STORE_PATH;
  }
  if (process.env.VERCEL) {
    return "/tmp/chole-registrations.json";
  }
  return join(process.cwd(), "data/registrations.json");
}

async function readFromUpstash(): Promise<RegistrationsStore | null> {
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
  return JSON.parse(json.result) as RegistrationsStore;
}

async function writeToUpstash(store: RegistrationsStore): Promise<void> {
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

async function readFromFile(): Promise<RegistrationsStore> {
  const path = getFileStorePath();
  try {
    const raw = await readFile(path, "utf8");
    return JSON.parse(raw) as RegistrationsStore;
  } catch (error) {
    const err = error as NodeJS.ErrnoException;
    if (err.code === "ENOENT") return emptyStore();
    throw error;
  }
}

async function writeToFile(store: RegistrationsStore): Promise<void> {
  const path = getFileStorePath();
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, JSON.stringify(store, null, 2), "utf8");
}

export async function loadRegistrationsStore(): Promise<RegistrationsStore> {
  const fromUpstash = await readFromUpstash();
  if (fromUpstash) return fromUpstash;
  return readFromFile();
}

export async function saveRegistrationsStore(store: RegistrationsStore): Promise<void> {
  const payload: RegistrationsStore = {
    ...store,
    updatedAt: new Date().toISOString(),
  };

  if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
    await writeToUpstash(payload);
    return;
  }

  await writeToFile(payload);
}
