import { SeedData } from "../types";

const STORAGE_KEYS = {
  ENCRYPTED_SEED: "cryptoseed_encrypted",
  SALT: "cryptoseed_salt",
  IV: "cryptoseed_iv",
};

export function saveEncryptedSeed(seedData: SeedData): void {
  localStorage.setItem(STORAGE_KEYS.ENCRYPTED_SEED, seedData.encrypted);
  localStorage.setItem(STORAGE_KEYS.IV, seedData.iv);
  localStorage.setItem(STORAGE_KEYS.SALT, seedData.salt);
}

export function getEncryptedSeed(): SeedData | null {
  const encrypted = localStorage.getItem(STORAGE_KEYS.ENCRYPTED_SEED);
  const iv = localStorage.getItem(STORAGE_KEYS.IV);
  const salt = localStorage.getItem(STORAGE_KEYS.SALT);

  if (!encrypted || !iv || !salt) {
    return null;
  }

  return { encrypted, iv, salt };
}

export function hasStoredSeed(): boolean {
  return getEncryptedSeed() !== null;
}

export function clearStoredSeed(): void {
  localStorage.removeItem(STORAGE_KEYS.ENCRYPTED_SEED);
  localStorage.removeItem(STORAGE_KEYS.IV);
  localStorage.removeItem(STORAGE_KEYS.SALT);
}

export function saveMasterPasswordHash(hash: string): void {
  sessionStorage.setItem("master_hash", hash);
}

export function getMasterPasswordHash(): string | null {
  return sessionStorage.getItem("master_hash");
}

export function clearSession(): void {
  sessionStorage.removeItem("master_hash");
}
