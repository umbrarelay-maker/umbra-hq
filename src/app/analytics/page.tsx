'use client';

import { useState, useEffect, useCallback } from 'react';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

interface PageView {
  page: string;
  referrer: string;
  country: string;
  city: string;
  user_agent: string;
  created_at: string;
}

interface DayBucket {
  date: string;
  count: number;
}

export default function AnalyticsPage() {
  const [views, setViews] = useState<PageView[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [range, setRange] = useState<'24h' | '7d' | '30d'>('7d');
  const [source, setSource] = useState<'page_views' | 'updates'>('page_views');

  const fetchAnalytics = useCallback(async () => {
    setLoading(true);
    setError('');

    const now = new Date();
    const rangeMs = range === '24h' ? 86400000 : range === '7d' ? 604800000 : 2592000000;
    const since = new Date(now.getTime() - rangeMs).toISOString();

    try {
      // Try dedicated page_views table first
      let res = await fetch(
        `${SUPABASE_URL}/rest/v1/page_views?select=page,referrer,country,city,user_agent,created_at&created_at=gte.${since}&order=created_at.desc&limit=5000`,
        { headers: { apikey: SUPABASE_KEY } }
      );

      if (res.ok) {
        const data = await res.json();
        setViews(data);
        setSource('page_views');
        setLoading(false);
        return;
      }

      // Fallback: read from updates table
      res = await fetch(
        `${SUPABASE_URL}/rest/v1/updates?select=content,created_at&type=eq.note&content=like.[PV]*&created_at=gte.${since}&order=created_at.desc&limit=5000`,
        { headers: { apikey: SUPABASE_KEY } }
      );

      if (res.ok) {
        const data = await res.json();
        const parsed: PageView[] = data
          .filter((d: { content: string }) => d.content.startsWith('[PV]'))
          .map((d: { content: string; created_at: string }) => {
            try {
              const json = JSON.parse(d.content.slice(4));
              return { ...json, created_at: d.created_at };
            } catch {
              return null;
            }
          })
          .filter(Boolean);
        setViews(parsed);
        setSource('updates');
      } else {
        setError('Failed to fetch analytics data');
      }
    } catch (e) {
      setError('Network error');
    }
    setLoading(false);
  }, [range]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  // Compute stats
  const totalViews = views.length;

  const topPages = Object.entries(
    views.reduce((acc, v) => {
      acc[v.page] = (acc[v.page] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  )
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);

  const topReferrers = Object.entries(
    views
      .filter((v) => v.referrer && v.referrer !== '')
      .reduce((acc, v) => {
        let ref = v.referrer;
        try {
          ref = new URL(v.referrer).hostname;
        } catch {}
        acc[ref] = (acc[ref] || 0) + 1;
        return acc;
      }, {} as Record<string, number>)
  )
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);

  const topCountries = Object.entries(
    views
      .filter((v) => v.country && v.country !== '')
      .reduce((acc, v) => {
        acc[v.country] = (acc[v.country] || 0) + 1;
        return acc;
      }, {} as Record<string, number>)
  )
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);

  // Daily buckets for chart
  const dailyBuckets: DayBucket[] = (() => {
    const days = range === '24h' ? 1 : range === '7d' ? 7 : 30;
    const buckets: Record<string, number> = {};
    for (let i = 0; i < days; i++) {
      const d = new Date(Date.now() - i * 86400000);
      const key = d.toISOString().slice(0, 10);
      buckets[key] = 0;
    }
    views.forEach((v) => {
      const key = v.created_at.slice(0, 10);
      if (buckets[key] !== undefined) buckets[key]++;
    });
    return Object.entries(buckets)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => a.date.localeCompare(b.date));
  })();

  const maxDaily = Math.max(...dailyBuckets.map((d) => d.count), 1);

  // Recent views (last 20)
  const recentViews = views.slice(0, 20);

  const now24h = views.filter(
    (v) => new Date(v.created_at).getTime() > Date.now() - 86400000
  ).length;

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-900 dark:text-white">
            Analytics
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-500 mt-1">
            UmbraTools traffic · {source === 'updates' && (
              <span className="text-amber-500">Using fallback storage — run migration for dedicated table</span>
            )}
            {source === 'page_views' && (
              <span className="text-emerald-500">Using dedicated table</span>
            )}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {(['24h', '7d', '30d'] as const).map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                range === r
                  ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900'
                  : 'text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-900'
              }`}
            >
              {r}
            </button>
          ))}
          <button
            onClick={fetchAnalytics}
            className="ml-2 px-3 py-1.5 text-xs font-medium rounded-lg text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
          >
            ↻
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64 text-zinc-500">
          <div className="animate-pulse">Loading analytics...</div>
        </div>
      ) : error ? (
        <div className="flex items-center justify-center h-64 text-red-400">
          {error}
        </div>
      ) : (
        <>
          {/* Stats cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <StatCard label="Total Views" value={totalViews} />
            <StatCard label="Last 24h" value={now24h} />
            <StatCard label="Top Page" value={topPages[0]?.[0] || '—'} sub={topPages[0] ? `${topPages[0][1]} views` : ''} />
            <StatCard label="Countries" value={topCountries.length} />
          </div>

          {/* Daily chart */}
          <div className="bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 mb-6">
            <h2 className="text-sm font-medium text-zinc-500 dark:text-zinc-400 mb-4">
              Daily Page Views
            </h2>
            <div className="flex items-end gap-1 h-40">
              {dailyBuckets.map((d) => (
                <div
                  key={d.date}
                  className="flex-1 flex flex-col items-center gap-1 group relative"
                >
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                    {d.date}: {d.count}
                  </div>
                  <div
                    className="w-full rounded-t bg-sky-500/80 dark:bg-sky-400/60 hover:bg-sky-500 dark:hover:bg-sky-400 transition-colors min-h-[2px]"
                    style={{
                      height: `${Math.max((d.count / maxDaily) * 100, 1.5)}%`,
                    }}
                  />
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-2">
              <span className="text-[10px] text-zinc-500">{dailyBuckets[0]?.date}</span>
              <span className="text-[10px] text-zinc-500">{dailyBuckets[dailyBuckets.length - 1]?.date}</span>
            </div>
          </div>

          {/* Three column grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Top Pages */}
            <div className="bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6">
              <h2 className="text-sm font-medium text-zinc-500 dark:text-zinc-400 mb-4">
                Top Pages
              </h2>
              <div className="space-y-3">
                {topPages.length === 0 && (
                  <p className="text-xs text-zinc-500">No data yet</p>
                )}
                {topPages.map(([page, count]) => (
                  <div key={page} className="flex items-center justify-between">
                    <span className="text-sm text-zinc-700 dark:text-zinc-300 truncate mr-2 font-mono">
                      {page}
                    </span>
                    <span className="text-xs text-zinc-500 tabular-nums flex-shrink-0">
                      {count}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Referrers */}
            <div className="bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6">
              <h2 className="text-sm font-medium text-zinc-500 dark:text-zinc-400 mb-4">
                Referrers
              </h2>
              <div className="space-y-3">
                {topReferrers.length === 0 && (
                  <p className="text-xs text-zinc-500">No referrer data yet</p>
                )}
                {topReferrers.map(([ref, count]) => (
                  <div key={ref} className="flex items-center justify-between">
                    <span className="text-sm text-zinc-700 dark:text-zinc-300 truncate mr-2">
                      {ref}
                    </span>
                    <span className="text-xs text-zinc-500 tabular-nums flex-shrink-0">
                      {count}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Countries */}
            <div className="bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6">
              <h2 className="text-sm font-medium text-zinc-500 dark:text-zinc-400 mb-4">
                Countries
              </h2>
              <div className="space-y-3">
                {topCountries.length === 0 && (
                  <p className="text-xs text-zinc-500">No country data yet</p>
                )}
                {topCountries.map(([country, count]) => (
                  <div key={country} className="flex items-center justify-between">
                    <span className="text-sm text-zinc-700 dark:text-zinc-300">
                      {countryFlag(country)} {country}
                    </span>
                    <span className="text-xs text-zinc-500 tabular-nums flex-shrink-0">
                      {count}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent views */}
          <div className="bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6">
            <h2 className="text-sm font-medium text-zinc-500 dark:text-zinc-400 mb-4">
              Recent Page Views
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs text-zinc-500 border-b border-zinc-200 dark:border-zinc-800">
                    <th className="pb-2 font-medium">Page</th>
                    <th className="pb-2 font-medium">Referrer</th>
                    <th className="pb-2 font-medium">Country</th>
                    <th className="pb-2 font-medium">Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/50">
                  {recentViews.map((v, i) => (
                    <tr key={i} className="text-zinc-600 dark:text-zinc-400">
                      <td className="py-2 font-mono text-xs text-zinc-700 dark:text-zinc-300">
                        {v.page}
                      </td>
                      <td className="py-2 text-xs truncate max-w-[200px]">
                        {v.referrer || '—'}
                      </td>
                      <td className="py-2 text-xs">
                        {v.country ? `${countryFlag(v.country)} ${v.country}` : '—'}
                      </td>
                      <td className="py-2 text-xs text-zinc-500 whitespace-nowrap">
                        {timeAgo(v.created_at)}
                      </td>
                    </tr>
                  ))}
                  {recentViews.length === 0 && (
                    <tr>
                      <td colSpan={4} className="py-8 text-center text-zinc-500 text-xs">
                        No page views recorded yet. Visit umbratools.dev to generate data.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function StatCard({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div className="bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5">
      <p className="text-xs text-zinc-500 dark:text-zinc-500 font-medium mb-1">{label}</p>
      <p className="text-2xl font-semibold text-zinc-900 dark:text-white truncate">
        {typeof value === 'number' ? value.toLocaleString() : value}
      </p>
      {sub && <p className="text-xs text-zinc-500 mt-0.5">{sub}</p>}
    </div>
  );
}

function countryFlag(code: string): string {
  if (!code || code.length !== 2) return '🌍';
  const offset = 127397;
  return String.fromCodePoint(
    ...code.toUpperCase().split('').map((c) => c.charCodeAt(0) + offset)
  );
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}
