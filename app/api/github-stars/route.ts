import { NextRequest, NextResponse } from 'next/server';

interface CacheEntry {
  stars: number;
  formatted: string;
  timestamp: number;
}

// In-memory server-side cache across warm serverless/Node instances
const memoryCache = new Map<string, CacheEntry>();
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

function formatStars(count: number): string {
  if (count < 1000) return count.toLocaleString();
  if (count < 1000000) {
    const val = (count / 1000).toFixed(1).replace(/\.0$/, '');
    return `${val}k`;
  }
  const val = (count / 1000000).toFixed(1).replace(/\.0$/, '');
  return `${val}m`;
}

function parseRepoName(input: string): string | null {
  if (!input) return null;
  const clean = input.trim().replace(/^https?:\/\/(www\.)?github\.com\//, '').replace(/\/$/, '');
  const match = clean.match(/^([a-zA-Z0-9_.-]+)\/([a-zA-Z0-9_.-]+)/);
  if (!match) return null;
  return `${match[1]}/${match[2]}`.toLowerCase();
}

async function fetchRepoStars(repoFullName: string): Promise<{ stars: number; formatted: string } | null> {
  // Check cache
  const cached = memoryCache.get(repoFullName);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return { stars: cached.stars, formatted: cached.formatted };
  }

  try {
    const headers: Record<string, string> = {
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'MARIA-Resource-Platform/1.0',
    };

    if (process.env.GITHUB_TOKEN) {
      headers['Authorization'] = `token ${process.env.GITHUB_TOKEN}`;
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4000);

    const res = await fetch(`https://api.github.com/repos/${repoFullName}`, {
      headers,
      signal: controller.signal,
      next: { revalidate: 3600 },
    });

    clearTimeout(timeout);

    if (!res.ok) {
      // If rate limited (403) or not found (404), return cached if available or null
      return null;
    }

    const data = await res.json();
    if (typeof data.stargazers_count === 'number') {
      const entry: CacheEntry = {
        stars: data.stargazers_count,
        formatted: formatStars(data.stargazers_count),
        timestamp: Date.now(),
      };
      memoryCache.set(repoFullName, entry);
      return { stars: entry.stars, formatted: entry.formatted };
    }
  } catch {
    // Network or timeout failure - return cached if exists, otherwise null
    const fallback = memoryCache.get(repoFullName);
    if (fallback) {
      return { stars: fallback.stars, formatted: fallback.formatted };
    }
  }

  return null;
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const singleRepo = searchParams.get('repo');
  const batchRepos = searchParams.get('repos');

  if (!singleRepo && !batchRepos) {
    return NextResponse.json({ error: 'Missing repo or repos parameter' }, { status: 400 });
  }

  // Handle single repo request
  if (singleRepo) {
    const parsed = parseRepoName(singleRepo);
    if (!parsed) {
      return NextResponse.json({ error: 'Invalid repository format' }, { status: 400 });
    }

    const data = await fetchRepoStars(parsed);
    return NextResponse.json(
      {
        repo: parsed,
        stars: data?.stars ?? null,
        formatted: data?.formatted ?? null,
      },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
        },
      }
    );
  }

  // Handle batch repos request (max 15)
  if (batchRepos) {
    const rawList = batchRepos.split(',').slice(0, 15);
    const results: Record<string, { stars: number | null; formatted: string | null }> = {};

    await Promise.all(
      rawList.map(async (item) => {
        const parsed = parseRepoName(item);
        if (parsed) {
          const data = await fetchRepoStars(parsed);
          results[parsed] = {
            stars: data?.stars ?? null,
            formatted: data?.formatted ?? null,
          };
        }
      })
    );

    return NextResponse.json(results, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    });
  }

  return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
}
