'use client';

import Link from 'next/link';
import { Document } from '@/data/initial-data';

interface DocumentCardProps {
  document: Document;
}

const categoryStyles: Record<Document['category'], { bg: string; icon: string; gradient: string }> = {
  audits: { 
    bg: 'bg-rose-500/10 text-rose-600 dark:text-rose-400', 
    icon: '◈',
    gradient: 'from-rose-500/20 to-rose-500/5'
  },
  research: { 
    bg: 'bg-blue-500/10 text-blue-600 dark:text-blue-400', 
    icon: '◇',
    gradient: 'from-blue-500/20 to-blue-500/5'
  },
  marketing: { 
    bg: 'bg-pink-500/10 text-pink-600 dark:text-pink-400', 
    icon: '◆',
    gradient: 'from-pink-500/20 to-pink-500/5'
  },
  technical: { 
    bg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400', 
    icon: '◉',
    gradient: 'from-emerald-500/20 to-emerald-500/5'
  },
  other: { 
    bg: 'bg-zinc-500/10 text-zinc-600 dark:text-zinc-400', 
    icon: '○',
    gradient: 'from-zinc-500/20 to-zinc-500/5'
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
    <div className="group relative p-6 rounded-2xl bg-white dark:bg-zinc-900/50 border border-zinc-200/80 dark:border-zinc-800/80 hover:border-sky-500/30 dark:hover:border-sky-500/30 transition-all duration-300 hover:shadow-xl hover:shadow-sky-500/5 dark:hover:shadow-sky-500/10 hover-lift overflow-hidden">
      {/* Gradient background on hover */}
      <div className={`absolute inset-0 bg-gradient-to-br ${category.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`} />
      
      {/* Header */}
      <div className="relative flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl ${category.bg} group-hover:scale-110 transition-transform duration-300`}>
            {category.icon}
          </div>
          <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${category.bg}`}>
            {document.category.toUpperCase()}
          </span>
        </div>
        <span className="text-xs text-zinc-400 dark:text-zinc-600 font-medium">
          {formatDate(document.createdAt)}
        </span>
      </div>

      {/* Title */}
      <Link 
        href={`/documents/${document.id}`} 
        className="relative block text-lg font-semibold text-zinc-900 dark:text-white hover:text-sky-600 dark:hover:text-sky-400 transition-colors mb-3"
      >
        {document.title}
      </Link>

      {/* Description */}
      <p className="relative text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed mb-5 line-clamp-2">
        {document.description}
      </p>

      {/* Links */}
      <div className="relative flex gap-2">
        <Link
          href={`/documents/${document.id}`}
          className="inline-flex items-center gap-1 text-xs font-medium px-4 py-2 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-all duration-200 btn-press"
        >
          Read
          <span className="transition-transform group-hover:translate-x-0.5">→</span>
        </Link>
        {document.url && (
          <a
            href={document.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-medium px-4 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700 hover:text-zinc-900 dark:hover:text-white transition-all duration-200 btn-press"
          >
            External
            <span>↗</span>
          </a>
        )}
      </div>
    </div>
  );
}
