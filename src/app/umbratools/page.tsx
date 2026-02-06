'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface ChangelogEntry {
  date: string;
  title: string;
  items: string[];
}

const changelog: ChangelogEntry[] = [
  {
    date: '2026-02-06',
    title: 'Built 5 New Tools + SEO Optimizations',
    items: [
      'URL Encoder/Decoder — Percent-encoding for URLs',
      'Unix Timestamp Converter — Timestamps ↔ dates, live clock',
      'Color Converter — HEX, RGB, HSL with color picker',
      'Lorem Ipsum Generator — Paragraphs, sentences, words',
      'Regex Tester — Real-time matching with highlighting',
      'Added JSON-LD structured data to all 10 tools',
      'Added FAQ schema + Breadcrumb schema for rich results',
    ],
  },
  {
    date: '2026-02-06',
    title: 'Launch',
    items: [
      'Site live at umbratools.dev',
      'GA4 tracking added (G-P6M34PC96J)',
      'Google Search Console verified + sitemap submitted',
      'Initial 5 tools: JSON Formatter, UUID Generator, Base64, Hash Generator, Word Counter',
    ],
  },
];

const tools = [
  { name: 'JSON Formatter', slug: 'json-formatter', category: 'Data' },
  { name: 'UUID Generator', slug: 'uuid-generator', category: 'Generator' },
  { name: 'Base64 Encoder', slug: 'base64', category: 'Encoding' },
  { name: 'Hash Generator', slug: 'hash-generator', category: 'Security' },
  { name: 'Word Counter', slug: 'word-counter', category: 'Text' },
  { name: 'URL Encoder', slug: 'url-encoder', category: 'Encoding' },
  { name: 'Timestamp Converter', slug: 'timestamp', category: 'Date/Time' },
  { name: 'Color Converter', slug: 'color-converter', category: 'Design' },
  { name: 'Lorem Ipsum', slug: 'lorem-ipsum', category: 'Generator' },
  { name: 'Regex Tester', slug: 'regex-tester', category: 'Developer' },
];

export default function UmbraToolsPage() {
  const [siteStatus, setSiteStatus] = useState<'checking' | 'online' | 'offline'>('checking');

  useEffect(() => {
    fetch('https://umbratools.dev', { mode: 'no-cors' })
      .then(() => setSiteStatus('online'))
      .catch(() => setSiteStatus('offline'));
  }, []);

  return (
    <div className="max-w-4xl animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center shadow-lg">
            <span className="text-white text-xl">⚡</span>
          </div>
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-white">
              UmbraTools
            </h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-500">
              Free developer utilities • SEO experiment
            </p>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="p-4 rounded-xl bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800">
          <div className="text-2xl font-bold text-zinc-900 dark:text-white">{tools.length}</div>
          <div className="text-sm text-zinc-500">Tools Live</div>
        </div>
        <div className="p-4 rounded-xl bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800">
          <div className="text-2xl font-bold text-zinc-900 dark:text-white">12</div>
          <div className="text-sm text-zinc-500">Indexed Pages</div>
        </div>
        <div className="p-4 rounded-xl bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${siteStatus === 'online' ? 'bg-emerald-500' : siteStatus === 'offline' ? 'bg-red-500' : 'bg-yellow-500 animate-pulse'}`} />
            <span className="text-lg font-semibold text-zinc-900 dark:text-white capitalize">{siteStatus}</span>
          </div>
          <div className="text-sm text-zinc-500">Site Status</div>
        </div>
        <div className="p-4 rounded-xl bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800">
          <div className="text-2xl font-bold text-zinc-900 dark:text-white">—</div>
          <div className="text-sm text-zinc-500">GA4 Sessions</div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="flex flex-wrap gap-3 mb-8">
        <a
          href="https://umbratools.dev"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 text-white font-medium transition-colors"
        >
          <span>Visit Site</span>
          <span>↗</span>
        </a>
        <a
          href="https://search.google.com/search-console"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 font-medium transition-colors"
        >
          Search Console
        </a>
        <a
          href="https://analytics.google.com"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 font-medium transition-colors"
        >
          GA4 Analytics
        </a>
        <a
          href="https://github.com/umbrarelay-maker/umbratools"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 font-medium transition-colors"
        >
          GitHub
        </a>
      </div>

      {/* Tools Grid */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-white mb-4">Tools</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
          {tools.map((tool) => (
            <a
              key={tool.slug}
              href={`https://umbratools.dev/tools/${tool.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-lg bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 hover:border-violet-500/50 transition-colors group"
            >
              <div className="text-sm font-medium text-zinc-700 dark:text-zinc-300 group-hover:text-violet-500 dark:group-hover:text-violet-400 transition-colors">
                {tool.name}
              </div>
              <div className="text-xs text-zinc-400">{tool.category}</div>
            </a>
          ))}
        </div>
      </div>

      {/* Changelog */}
      <div>
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-white mb-4">Changelog</h2>
        <div className="space-y-6">
          {changelog.map((entry, i) => (
            <div key={i} className="relative pl-6 border-l-2 border-zinc-200 dark:border-zinc-800">
              <div className="absolute left-[-5px] top-1 w-2 h-2 rounded-full bg-violet-500" />
              <div className="text-xs font-medium text-zinc-500 dark:text-zinc-500 mb-1">
                {entry.date}
              </div>
              <div className="text-sm font-semibold text-zinc-900 dark:text-white mb-2">
                {entry.title}
              </div>
              <ul className="space-y-1">
                {entry.items.map((item, j) => (
                  <li key={j} className="text-sm text-zinc-600 dark:text-zinc-400 flex items-start gap-2">
                    <span className="text-violet-500 mt-1">•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* SEO Notes */}
      <div className="mt-8 p-4 rounded-xl bg-zinc-100 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800">
        <h3 className="text-sm font-semibold text-zinc-900 dark:text-white mb-2">SEO Status</h3>
        <ul className="text-sm text-zinc-600 dark:text-zinc-400 space-y-1">
          <li>✓ Sitemap submitted to Google Search Console</li>
          <li>✓ JSON-LD structured data on all pages</li>
          <li>✓ FAQ schema for rich results</li>
          <li>✓ GA4 tracking installed</li>
          <li>⏳ Waiting for initial indexing (check in 2-3 days)</li>
          <li>⏳ API access pending for automated monitoring</li>
        </ul>
      </div>
    </div>
  );
}
