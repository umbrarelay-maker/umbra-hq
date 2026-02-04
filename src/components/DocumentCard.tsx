'use client';

import Link from 'next/link';
import { Document } from '@/data/initial-data';

interface DocumentCardProps {
  document: Document;
}

const categoryStyles: Record<Document['category'], { bg: string; icon: string }> = {
  audits: { 
    bg: 'bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400', 
    icon: '◈'
  },
  research: { 
    bg: 'bg-sky-50 dark:bg-sky-500/10 text-sky-600 dark:text-sky-400', 
    icon: '◇'
  },
  marketing: { 
    bg: 'bg-pink-50 dark:bg-pink-500/10 text-pink-600 dark:text-pink-400', 
    icon: '◆'
  },
  technical: { 
    bg: 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400', 
    icon: '◉'
  },
  other: { 
    bg: 'bg-zinc-100 dark:bg-zinc-500/10 text-zinc-600 dark:text-zinc-400', 
    icon: '○'
  },
};

function formatDate(timestamp: string) {
  return new Date(timestamp).toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric',
    year: 'numeric'
  });
}

export default function DocumentCard({ document }: DocumentCardProps) {
  const category = categoryStyles[document.category];

  return (
    <div className="group p-5 rounded-lg bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 hover:border-sky-300 dark:hover:border-sky-500/30 transition-colors duration-150">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <div className={`w-8 h-8 rounded-md flex items-center justify-center text-base ${category.bg}`}>
            {category.icon}
          </div>
          <span className={`text-[10px] font-medium px-2 py-0.5 rounded ${category.bg}`}>
            {document.category.toUpperCase()}
          </span>
        </div>
        <span className="text-xs text-zinc-400 dark:text-zinc-600">
          {formatDate(document.createdAt)}
        </span>
      </div>

      {/* Title */}
      <Link 
        href={`/documents/${document.id}`} 
        className="block text-sm font-semibold text-zinc-900 dark:text-white hover:text-sky-600 dark:hover:text-sky-400 transition-colors mb-2"
      >
        {document.title}
      </Link>

      {/* Description */}
      <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed mb-4 line-clamp-2">
        {document.description}
      </p>

      {/* Links */}
      <div className="flex gap-2">
        <Link
          href={`/documents/${document.id}`}
          className="inline-flex items-center gap-1 text-xs font-medium px-3 py-1.5 rounded bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-white transition-colors duration-150"
        >
          Read →
        </Link>
        {document.url && (
          <a
            href={document.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700 hover:text-zinc-900 dark:hover:text-white transition-colors duration-150"
          >
            External ↗
          </a>
        )}
      </div>
    </div>
  );
}
