'use client';

import { useState, useEffect } from 'react';

interface StarData {
  stars: number | null;
  formatted: string | null;
}

interface StoredStarEntry {
  stars: number | null;
  formatted: string | null;
  timestamp: number;
}

const STORAGE_KEY = 'maria_gh_stars_cache';
const CLIENT_TTL_MS = 12 * 60 * 60 * 1000; // 12 hours

// In-memory module cache for instant lookups across cards without localStorage parsing overhead
const memoryCache = new Map<string, StarData>();
const pendingRequests = new Map<string, Promise<StarData>>();

export function parseGitHubRepo(repoUrl?: string | null): string | null {
  if (!repoUrl || typeof repoUrl !== 'string') return null;
  const match = repoUrl.match(/github\.com\/([a-zA-Z0-9_.-]+)\/([a-zA-Z0-9_.-]+)/i);
  if (!match) return null;
  return `${match[1]}/${match[2]}`.toLowerCase();
}

function getStoredCache(): Record<string, StoredStarEntry> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

function saveToStoredCache(repo: string, data: StarData) {
  if (typeof window === 'undefined') return;
  try {
    const existing = getStoredCache();
    existing[repo] = {
      stars: data.stars,
      formatted: data.formatted,
      timestamp: Date.now(),
    };
    // Keep max 200 items to avoid bloating localStorage
    const keys = Object.keys(existing);
    if (keys.length > 200) {
      delete existing[keys[0]];
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
  } catch {
    // Ignore quota or storage errors silently
  }
}

async function fetchStarCount(repo: string): Promise<StarData> {
  // Check in-memory
  if (memoryCache.has(repo)) {
    return memoryCache.get(repo)!;
  }

  // Check localStorage
  const stored = getStoredCache();
  const cached = stored[repo];
  if (cached && Date.now() - cached.timestamp < CLIENT_TTL_MS) {
    const data: StarData = { stars: cached.stars, formatted: cached.formatted };
    memoryCache.set(repo, data);
    return data;
  }

  // Deduplicate inflight requests for the same repo
  if (pendingRequests.has(repo)) {
    return pendingRequests.get(repo)!;
  }

  const fetchPromise = (async () => {
    try {
      const res = await fetch(`/api/github-stars?repo=${encodeURIComponent(repo)}`);
      if (!res.ok) {
        const nullData: StarData = { stars: null, formatted: null };
        memoryCache.set(repo, nullData);
        return nullData;
      }
      const json = await res.json();
      const result: StarData = {
        stars: typeof json.stars === 'number' ? json.stars : null,
        formatted: typeof json.formatted === 'string' ? json.formatted : null,
      };
      memoryCache.set(repo, result);
      saveToStoredCache(repo, result);
      return result;
    } catch {
      const nullData: StarData = { stars: null, formatted: null };
      memoryCache.set(repo, nullData);
      return nullData;
    } finally {
      pendingRequests.delete(repo);
    }
  })();

  pendingRequests.set(repo, fetchPromise);
  return fetchPromise;
}

export function useGitHubStars(repoUrl?: string | null): {
  stars: number | null;
  formatted: string | null;
  isLoading: boolean;
} {
  const repo = parseGitHubRepo(repoUrl);
  const [data, setData] = useState<StarData>(() => {
    if (!repo) return { stars: null, formatted: null };
    if (memoryCache.has(repo)) return memoryCache.get(repo)!;
    return { stars: null, formatted: null };
  });
  const [isLoading, setIsLoading] = useState<boolean>(!memoryCache.has(repo ?? ''));

  useEffect(() => {
    if (!repo) {
      setData({ stars: null, formatted: null });
      setIsLoading(false);
      return;
    }

    if (memoryCache.has(repo)) {
      setData(memoryCache.get(repo)!);
      setIsLoading(false);
      return;
    }

    let isMounted = true;
    setIsLoading(true);

    fetchStarCount(repo).then((res) => {
      if (isMounted) {
        setData(res);
        setIsLoading(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [repo]);

  return {
    stars: data.stars,
    formatted: data.formatted,
    isLoading,
  };
}
