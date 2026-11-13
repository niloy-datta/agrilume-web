/**
 * Network and caching utilities for NASA Earth Intelligence APIs.
 *
 * Implements:
 * - Exponential backoff with random jitter
 * - Configurable request timeouts
 * - Rate limiting to prevent 429 Too Many Requests
 * - LocalStorage + memory caching with TTL and provenance timestamps
 */

export interface RetryOptions {
  maxRetries?: number;
  initialDelayMs?: number;
  maxDelayMs?: number;
  timeoutMs?: number;
  retryOnStatuses?: number[];
}

const DEFAULT_RETRY_OPTIONS: Required<RetryOptions> = {
  maxRetries: 3,
  initialDelayMs: 600,
  maxDelayMs: 5000,
  timeoutMs: 12000,
  retryOnStatuses: [429, 500, 502, 503, 504],
};

/**
 * Executes a fetch request with timeout, exponential backoff, and jitter.
 */
export async function fetchWithRetry(
  url: string,
  init?: RequestInit,
  options?: RetryOptions,
): Promise<Response> {
  const opts = { ...DEFAULT_RETRY_OPTIONS, ...options };
  let attempt = 0;
  let delay = opts.initialDelayMs;

  while (attempt <= opts.maxRetries) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), opts.timeoutMs);

    try {
      const response = await fetch(url, {
        ...init,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (response.ok || !opts.retryOnStatuses.includes(response.status)) {
        return response;
      }

      // Check for rate-limit Retry-After header
      const retryAfter = response.headers.get("Retry-After");
      if (retryAfter) {
        const seconds = parseInt(retryAfter, 10);
        if (!isNaN(seconds) && seconds > 0 && seconds <= 60) {
          delay = seconds * 1000;
        }
      }
    } catch (err: unknown) {
      clearTimeout(timeoutId);
      if (attempt === opts.maxRetries) {
        throw err;
      }
    }

    attempt++;
    if (attempt > opts.maxRetries) {
      break;
    }

    // Jitter: +/- 25% randomization to avoid thundering herds
    const jitter = delay * (0.75 + Math.random() * 0.5);
    await new Promise((resolve) => setTimeout(resolve, jitter));
    delay = Math.min(delay * 2, opts.maxDelayMs);
  }

  throw new Error(`Failed to fetch ${url} after ${opts.maxRetries} retries`);
}

/**
 * Token-bucket rate limiter for NASA and Earthdata requests.
 */
export class RateLimiter {
  private lastCallTime = 0;
  private minIntervalMs: number;

  constructor(requestsPerSecond = 5) {
    this.minIntervalMs = 1000 / requestsPerSecond;
  }

  async throttle(): Promise<void> {
    const now = Date.now();
    const elapsed = now - this.lastCallTime;
    if (elapsed < this.minIntervalMs) {
      const wait = this.minIntervalMs - elapsed;
      await new Promise((resolve) => setTimeout(resolve, wait));
    }
    this.lastCallTime = Date.now();
  }
}

export const globalNasaRateLimiter = new RateLimiter(4); // 4 requests/sec maximum to NASA

/**
 * Local cache with TTL and metadata support.
 */
export interface CacheEntry<T> {
  savedAt: number;
  expiresAt: number;
  data: T;
  version: string;
}

export class EarthDataCache {
  private inMemoryMap = new Map<string, CacheEntry<unknown>>();

  get<T>(key: string): T | null {
    // 1. Try memory
    const mem = this.inMemoryMap.get(key) as CacheEntry<T> | undefined;
    if (mem) {
      if (Date.now() < mem.expiresAt) return mem.data;
      this.inMemoryMap.delete(key);
    }

    // 2. Try localStorage if available
    if (typeof window !== "undefined" && window.localStorage) {
      try {
        const item = window.localStorage.getItem(`agrilume.cache:${key}`);
        if (!item) return null;
        const parsed = JSON.parse(item) as CacheEntry<T>;
        if (Date.now() < parsed.expiresAt) {
          this.inMemoryMap.set(key, parsed);
          return parsed.data;
        }
        window.localStorage.removeItem(`agrilume.cache:${key}`);
      } catch {
        return null;
      }
    }
    return null;
  }

  set<T>(key: string, data: T, ttlMs = 14 * 24 * 3600 * 1000, version = "v1"): void {
    const entry: CacheEntry<T> = {
      savedAt: Date.now(),
      expiresAt: Date.now() + ttlMs,
      data,
      version,
    };
    this.inMemoryMap.set(key, entry as CacheEntry<unknown>);

    if (typeof window !== "undefined" && window.localStorage) {
      try {
        window.localStorage.setItem(`agrilume.cache:${key}`, JSON.stringify(entry));
      } catch {
        // LocalStorage quota exceeded or disabled; memory cache continues working
      }
    }
  }
}

export const earthDataCache = new EarthDataCache();

