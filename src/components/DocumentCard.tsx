'use client';

import Link from 'next/link';
import { Document } from '@/data/initial-data';

interface DocumentCardProps {
  document: Document;
}

const categoryStyles: Record<Document['category'], { bg: string; icon: string }> = {
  audits: { bg: 'bg-rose-500/10 text-rose-600 dark:text-rose-400', icon: '◈' },
  research: { bg: 'bg-blue-500/10 text-blue-600 dark:text-blue-400', icon: '◇' },
  marketing: { bg: 'bg-purple-500/10 text-purple-600 dark:text-purple-400', icon: '◆' },
  technical: { bg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400', icon: '◉' },
  other: { bg: 'bg-zinc-500/10 text-zinc-600 dark:text-zinc-400', icon: '○' },
};

function formatDate(timestamp: string) {
  return new Date(timestamp).toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric',
    year: 'numeric'
  });
}

export default function DocumentCard({ document }: DocumentCardProps) {
  return (
    <div className="p-5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors group">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-lg ${categoryStyles[document.category].bg}`}>
            {categoryStyles[document.category].icon}
          </span>
          <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${categoryStyles[document.category].bg}`}>
            {document.category.toUpperCase()}
          </span>
        </div>
        <span className="text-xs text-zinc-400 dark:text-zinc-600">
          {formatDate(document.createdAt)}
        </span>
      </div>

      {/* Title */}
      <Link href={`/documents/${document.id}`} className="text-base font-semibold text-zinc-900 dark:text-white hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors block mb-2">
        {document.title}
      </Link>

      {/* Description */}
      <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed mb-4">
        {document.description}
      </p>

      {/* Links */}
      <div className="flex gap-2">
        <Link
          href={`/documents/${document.id}`}
          className="text-xs px-3 py-1.5 rounded-lg bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-colors"
        >
          Read →
        </Link>
        {document.url && (
          <a
            href={document.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs px-3 py-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700 hover:text-zinc-900 dark:hover:text-white transition-colors"
          >
            External ↗
          </a>
        )}
      </div>
    </div>
  );
}
