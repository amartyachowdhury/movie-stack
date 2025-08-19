import { useState, useEffect, useCallback } from 'react';

interface CacheItem<T> {
  data: T;
  timestamp: number;
  ttl: number; // Time to live in milliseconds
}

interface CacheOptions {
  ttl?: number; // Default TTL in milliseconds (5 minutes)
  maxSize?: number; // Maximum number of items in cache
}

class Cache {
  private storage: Map<string, CacheItem<any>>;
  private maxSize: number;
  private defaultTTL: number;

  constructor(options: CacheOptions = {}) {
    this.storage = new Map();
    this.maxSize = options.maxSize || 100;
    this.defaultTTL = options.ttl || 5 * 60 * 1000; // 5 minutes
  }

  set<T>(key: string, data: T, ttl?: number): void {
    // Remove expired items first
    this.cleanup();

    // If cache is full, remove oldest item
    if (this.storage.size >= this.maxSize) {
      const oldestKey = this.storage.keys().next().value;
      this.storage.delete(oldestKey);
    }

    this.storage.set(key, {
      data,
      timestamp: Date.now(),
      ttl: ttl || this.defaultTTL
    });
  }

  get<T>(key: string): T | null {
    const item = this.storage.get(key);
    
    if (!item) {
      return null;
    }

    // Check if item has expired
    if (Date.now() - item.timestamp > item.ttl) {
      this.storage.delete(key);
      return null;
    }

    return item.data;
  }

  has(key: string): boolean {
    return this.get(key) !== null;
  }

  delete(key: string): boolean {
    return this.storage.delete(key);
  }

  clear(): void {
    this.storage.clear();
  }

  private cleanup(): void {
    const now = Date.now();
    const keysToDelete: string[] = [];
    
    this.storage.forEach((item, key) => {
      if (now - item.timestamp > item.ttl) {
        keysToDelete.push(key);
      }
    });
    
    keysToDelete.forEach(key => {
      this.storage.delete(key);
    });
  }

  get size(): number {
    this.cleanup();
    return this.storage.size;
  }
}

// Global cache instance
const globalCache = new Cache();

export const useCache = <T>(key: string, fetcher: () => Promise<T>, options?: CacheOptions) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    // Check cache first
    const cachedData = globalCache.get<T>(key);
    if (cachedData) {
      setData(cachedData);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await fetcher();
      globalCache.set(key, result, options?.ttl);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [key, fetcher, options?.ttl]);

  const invalidate = useCallback(() => {
    globalCache.delete(key);
    setData(null);
  }, [key]);

  const refresh = useCallback(() => {
    globalCache.delete(key);
    fetchData();
  }, [key, fetchData]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    invalidate,
    refresh,
    refetch: fetchData
  };
};

// Utility functions for cache management
export const cacheUtils = {
  clear: () => globalCache.clear(),
  size: () => globalCache.size,
  has: (key: string) => globalCache.has(key),
  delete: (key: string) => globalCache.delete(key),
  set: <T>(key: string, data: T, ttl?: number) => globalCache.set(key, data, ttl),
  get: <T>(key: string) => globalCache.get<T>(key)
};
