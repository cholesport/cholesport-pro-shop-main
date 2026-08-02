/** Safe browser storage helpers — never throw into React effects or handlers. */

export function readStorageItem(
  storage: Storage,
  key: string,
): string | null {
  try {
    return storage.getItem(key);
  } catch {
    return null;
  }
}

export function writeStorageItem(
  storage: Storage,
  key: string,
  value: string,
): boolean {
  try {
    storage.setItem(key, value);
    return true;
  } catch {
    return false;
  }
}

export function removeStorageItem(storage: Storage, key: string): boolean {
  try {
    storage.removeItem(key);
    return true;
  } catch {
    return false;
  }
}

export function readLocalStorage(key: string): string | null {
  if (typeof window === "undefined") return null;
  return readStorageItem(localStorage, key);
}

export function writeLocalStorage(key: string, value: string): boolean {
  if (typeof window === "undefined") return false;
  return writeStorageItem(localStorage, key, value);
}

export function removeLocalStorage(key: string): boolean {
  if (typeof window === "undefined") return false;
  return removeStorageItem(localStorage, key);
}

export function readSessionStorage(key: string): string | null {
  if (typeof window === "undefined") return null;
  return readStorageItem(sessionStorage, key);
}

export function writeSessionStorage(key: string, value: string): boolean {
  if (typeof window === "undefined") return false;
  return writeStorageItem(sessionStorage, key, value);
}

export function removeSessionStorage(key: string): boolean {
  if (typeof window === "undefined") return false;
  return removeStorageItem(sessionStorage, key);
}
