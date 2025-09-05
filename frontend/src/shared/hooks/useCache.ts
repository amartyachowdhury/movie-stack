import { useRef, useCallback, useEffect } from 'react';

interface CacheItem<T> {
  value: T;
  timestamp: number;
  ttl: number;
  accessCount: number;
  lastAccessed: number;
}

interface CacheOptions {
  maxSize?: number;
  defaultTTL?: number;
  enableMemoryManagement?: boolean;
  enableCompression?: boolean;
}

interface CacheStats {
  size: number;
  hits: number;
  misses: number;
  hitRate: number;
  memoryUsage: number;
  evictions: number;
}

class LRUCache<T = any> {
  private cache = new Map<string, CacheItem<T>>();
  private maxSize: number;
  private defaultTTL: number;
  private enableMemoryManagement: boolean;
  private enableCompression: boolean;
  private stats = {
    hits: 0,
    misses: 0,
    evictions: 0
  };

  constructor(options: CacheOptions = {}) {
    this.maxSize = options.maxSize || 100;
    this.defaultTTL = options.defaultTTL || 300000; // 5 minutes
    this.enableMemoryManagement = options.enableMemoryManagement || false;
    this.enableCompression = options.enableCompression || false;
  }

  set(key: string, value: T, ttl?: number): void {
    // Check if cache is full and evict if necessary
    if (this.cache.size >= this.maxSize) {
      this.evictLRU();
    }

    const item: CacheItem<T> = {
      value: this.enableCompression ? this.compress(value) : value,
      timestamp: Date.now(),
      ttl: ttl || this.defaultTTL,
      accessCount: 0,
      lastAccessed: Date.now()
    };

    this.cache.set(key, item);
  }

  get(key: string): T | null {
    const item = this.cache.get(key);

    if (!item) {
      this.stats.misses++;
      return null;
    }

    // Check if item has expired
    if (Date.now() - item.timestamp > item.ttl) {
      this.cache.delete(key);
      this.stats.misses++;
      return null;
    }

    // Update access statistics
    item.accessCount++;
    item.lastAccessed = Date.now();
    this.stats.hits++;

    // Move to end (most recently used)
    this.cache.delete(key);
    this.cache.set(key, item);

    return this.enableCompression ? this.decompress(item.value) : item.value;
  }

  has(key: string): boolean {
    const item = this.cache.get(key);
    if (!item) return false;

    // Check if item has expired
    if (Date.now() - item.timestamp > item.ttl) {
      this.cache.delete(key);
      return false;
    }

    return true;
  }

  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
    this.stats.hits = 0;
    this.stats.misses = 0;
    this.stats.evictions = 0;
  }

  keys(): string[] {
    return Array.from(this.cache.keys());
  }

  values(): T[] {
    return Array.from(this.cache.values()).map(item => 
      this.enableCompression ? this.decompress(item.value) : item.value
    );
  }

  entries(): [string, T][] {
    return Array.from(this.cache.entries()).map(([key, item]) => [
      key,
      this.enableCompression ? this.decompress(item.value) : item.value
    ]);
  }

  getStats(): CacheStats {
    const totalRequests = this.stats.hits + this.stats.misses;
    const hitRate = totalRequests > 0 ? (this.stats.hits / totalRequests) * 100 : 0;

    return {
      size: this.cache.size,
      hits: this.stats.hits,
      misses: this.stats.misses,
      hitRate,
      memoryUsage: this.getMemoryUsage(),
      evictions: this.stats.evictions
    };
  }

  private evictLRU(): void {
    let oldestKey: string | null = null;
    let oldestTime = Date.now();

    this.cache.forEach((item, key) => {
      if (item.lastAccessed < oldestTime) {
        oldestTime = item.lastAccessed;
        oldestKey = key;
      }
    });

    if (oldestKey) {
      this.cache.delete(oldestKey);
      this.stats.evictions++;
    }
  }

  private compress(value: T): T {
    if (typeof value === 'string' && value.length > 1000) {
      // Simple compression for large strings
      return value.replace(/\s+/g, ' ').trim() as T;
    }
    return value;
  }

  private decompress(value: T): T {
    return value;
  }

  private getMemoryUsage(): number {
    if (!this.enableMemoryManagement) return 0;

    try {
      const memory = (performance as any).memory;
      return memory ? memory.usedJSHeapSize / 1024 / 1024 : 0; // MB
    } catch {
      return 0;
    }
  }

  // Cleanup expired items
  cleanup(): void {
    const now = Date.now();
    const keysToDelete: string[] = [];

    this.cache.forEach((item, key) => {
      if (now - item.timestamp > item.ttl) {
        keysToDelete.push(key);
      }
    });

    keysToDelete.forEach(key => this.cache.delete(key));
  }
}

export const useCache = <T = any>(options: CacheOptions = {}) => {
  const cacheRef = useRef<LRUCache<T>>(new LRUCache<T>(options));

  // Cleanup expired items periodically
  useEffect(() => {
    const interval = setInterval(() => {
      cacheRef.current.cleanup();
    }, 60000); // Cleanup every minute

    return () => clearInterval(interval);
  }, []);

  const set = useCallback((key: string, value: T, ttl?: number) => {
    cacheRef.current.set(key, value, ttl);
  }, []);

  const get = useCallback((key: string): T | null => {
    return cacheRef.current.get(key);
  }, []);

  const has = useCallback((key: string): boolean => {
    return cacheRef.current.has(key);
  }, []);

  const deleteItem = useCallback((key: string): boolean => {
    return cacheRef.current.delete(key);
  }, []);

  const clear = useCallback(() => {
    cacheRef.current.clear();
  }, []);

  const keys = useCallback((): string[] => {
    return cacheRef.current.keys();
  }, []);

  const values = useCallback((): T[] => {
    return cacheRef.current.values();
  }, []);

  const entries = useCallback((): [string, T][] => {
    return cacheRef.current.entries();
  }, []);

  const getStats = useCallback((): CacheStats => {
    return cacheRef.current.getStats();
  }, []);

  const cleanup = useCallback(() => {
    cacheRef.current.cleanup();
  }, []);

  return {
    set,
    get,
    has,
    delete: deleteItem,
    clear,
    keys,
    values,
    entries,
    getStats,
    cleanup
  };
};
