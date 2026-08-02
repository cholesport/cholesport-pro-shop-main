import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import type { CustomerRecord, CustomersStore } from "@/data/customers";

const UPSTASH_KEY = "chole:customers";

function emptyStore(): CustomersStore {
  return { customers: [], updatedAt: new Date().toISOString() };
}

function getFileStorePath(): string {
  if (process.env.CUSTOMERS_STORE_PATH) {
    return process.env.CUSTOMERS_STORE_PATH;
  }
  if (process.env.VERCEL) {
    return "/tmp/chole-customers.json";
  }
  return join(process.cwd(), "data/customers.json");
}

async function readFromUpstash(): Promise<CustomersStore | null> {
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
  return JSON.parse(json.result) as CustomersStore;
}

async function writeToUpstash(store: CustomersStore): Promise<void> {
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

async function readFromFile(): Promise<CustomersStore> {
  const path = getFileStorePath();
  try {
    const raw = await readFile(path, "utf8");
    return JSON.parse(raw) as CustomersStore;
  } catch (error) {
    const err = error as NodeJS.ErrnoException;
    if (err.code === "ENOENT") return emptyStore();
    throw error;
  }
}

async function writeToFile(store: CustomersStore): Promise<void> {
  const path = getFileStorePath();
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, JSON.stringify(store, null, 2), "utf8");
}

export async function loadCustomersStore(): Promise<CustomersStore> {
  const fromUpstash = await readFromUpstash();
  if (fromUpstash) return fromUpstash;
  return readFromFile();
}

export async function saveCustomersStore(store: CustomersStore): Promise<void> {
  const payload: CustomersStore = {
    ...store,
    updatedAt: new Date().toISOString(),
  };

  if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
    await writeToUpstash(payload);
    return;
  }

  await writeToFile(payload);
}

export function normalizeCustomerEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function findCustomerByEmail(
  store: CustomersStore,
  email: string,
): CustomerRecord | undefined {
  const normalized = normalizeCustomerEmail(email);
  return store.customers.find((customer) => normalizeCustomerEmail(customer.email) === normalized);
}

export function findCustomerById(
  store: CustomersStore,
  id: string,
): CustomerRecord | undefined {
  return store.customers.find((customer) => customer.id === id);
}
