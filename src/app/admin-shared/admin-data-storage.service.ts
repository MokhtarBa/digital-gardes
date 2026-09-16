import { Injectable } from '@angular/core';

/**
 * A small wrapper around browser storage so admin screens can keep their
 * locally-created records without depending on a backend yet.
 */
@Injectable({ providedIn: 'root' })
export class AdminDataStorageService {
  load<T>(key: string, fallback: T, isValid: (value: unknown) => value is T): T {
    const storage = this.browserStorage;

    if (!storage) {
      return this.copyFallback(fallback);
    }

    try {
      const storedValue = storage.getItem(key);
      if (!storedValue) {
        return this.copyFallback(fallback);
      }

      const parsedValue: unknown = JSON.parse(storedValue);
      return isValid(parsedValue) ? parsedValue : this.copyFallback(fallback);
    } catch {
      return this.copyFallback(fallback);
    }
  }

  save<T>(key: string, value: T): void {
    const storage = this.browserStorage;

    if (!storage) {
      return;
    }

    try {
      storage.setItem(key, JSON.stringify(value));
    } catch {
      // Storage can be unavailable in private browsing or restricted test environments.
    }
  }

  private get browserStorage(): Storage | null {
    if (typeof globalThis === 'undefined' || !('localStorage' in globalThis)) {
      return null;
    }

    try {
      return globalThis.localStorage;
    } catch {
      return null;
    }
  }

  private copyFallback<T>(fallback: T): T {
    return JSON.parse(JSON.stringify(fallback)) as T;
  }
}
