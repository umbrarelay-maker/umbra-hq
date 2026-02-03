'use client';

import { useParams } from 'next/navigation';
import { useData } from '@/context/DataContext';
import Link from 'next/link';

const categoryStyles = {
  audits: { bg: 'bg-rose-500/10 text-rose-600 dark:text-rose-400', icon: '◈' },
  research: { bg: 'bg-blue-500/10 text-blue-600 dark:text-blue-400', icon: '◇' },
  marketing: { bg: 'bg-purple-500/10 text-purple-600 dark:text-purple-400', icon: '◆' },
  technical: { bg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400', icon: '◉' },
  other: { bg: 'bg-zinc-500/10 text-zinc-600 dark:text-zinc-400', icon: '○' },
};

export default function DocumentDetailPage() {
  const params = useParams();
  const { getDocumentById } = useData();
  
  const doc = getDocumentById(params.id as string);

  if (!doc) {
    return (
      <div className="max-w-4xl">
        <Link href="/documents" className="text-sm text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 mb-4 inline-block">
          ← Back to Documents
        </Link>
        <div className="text-center py-12">
          <h1 className="text-xl font-semibold text-zinc-900 dark:text-white mb-2">
            Document Not Found
          </h1>
          <p className="text-zinc-500 dark:text-zinc-500">
            The document you're looking for doesn't exist.
          </p>
        </div>
      </div>
    );
  }

  const category = categoryStyles[doc.category];

  return (
    <div className="max-w-4xl">
      {/* Back Link */}
      <Link href="/documents" className="text-sm text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 mb-6 inline-flex items-center gap-1">
        ← Back to Documents
      </Link>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <span className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl ${category.bg}`}>
            {category.icon}
          </span>
          <span className={`text-xs font-medium px-3 py-1 rounded-full ${category.bg}`}>
            {doc.category.toUpperCase()}
          </span>
        </div>
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-white mb-3">
          {doc.title}
        </h1>
        <p className="text-lg text-zinc-600 dark:text-zinc-400 mb-4">
          {doc.description}
        </p>
        <p className="text-sm text-zinc-500 dark:text-zinc-500">
          Created {new Date(doc.createdAt).toLocaleDateString('en-US', { 
            month: 'long', day: 'numeric', year: 'numeric' 
          })}
        </p>
      </div>

      {/* External Link */}
      {doc.url && (
        <div className="mb-8">
          <a
            href={doc.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm px-4 py-2 rounded-lg bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-colors"
          >
            View External Document →
          </a>
        </div>
      )}

      {/* Content */}
      {doc.content && (
        <div className="prose prose-zinc dark:prose-invert max-w-none">
          <div className="p-8 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
            {doc.content.split('\n').map((line, i) => {
              if (line.startsWith('# ')) {
                return <h1 key={i} className="text-2xl font-bold text-zinc-900 dark:text-white mb-4">{line.replace('# ', '')}</h1>;
              }
              if (line.startsWith('## ')) {
                return <h2 key={i} className="text-xl font-semibold text-zinc-900 dark:text-white mt-8 mb-3">{line.replace('## ', '')}</h2>;
              }
              if (line.startsWith('### ')) {
                return <h3 key={i} className="text-lg font-medium text-zinc-800 dark:text-zinc-200 mt-6 mb-2">{line.replace('### ', '')}</h3>;
              }
              if (line.startsWith('**') && line.endsWith('**')) {
                return <p key={i} className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 my-2">{line.replace(/\*\*/g, '')}</p>;
              }
              if (line.startsWith('| ')) {
                // Table row - render as styled table row
                const cells = line.split('|').filter(c => c.trim());
                const isHeader = line.includes('---');
                if (isHeader) return null;
                return (
                  <div key={i} className="grid grid-cols-4 gap-2 text-xs py-2 border-b border-zinc-100 dark:border-zinc-800">
                    {cells.map((cell, j) => (
                      <span key={j} className={j === 0 ? 'font-medium text-zinc-900 dark:text-white' : 'text-zinc-600 dark:text-zinc-400'}>
                        {cell.trim()}
                      </span>
                    ))}
                  </div>
                );
              }
              if (line.startsWith('- **')) {
                const match = line.match(/- \*\*(.+?)\*\*(.*)$/);
                if (match) {
                  return (
                    <p key={i} className="text-sm text-zinc-600 dark:text-zinc-400 my-1.5 pl-4">
                      • <strong className="text-zinc-800 dark:text-zinc-200">{match[1]}</strong>{match[2]}
                    </p>
                  );
                }
              }
              if (line.startsWith('- ')) {
                return <p key={i} className="text-sm text-zinc-600 dark:text-zinc-400 my-1.5 pl-4">• {line.replace('- ', '')}</p>;
              }
              if (line.match(/^\d+\./)) {
                return <p key={i} className="text-sm text-zinc-600 dark:text-zinc-400 my-1.5 pl-4">{line}</p>;
              }
              if (line.trim() === '') {
                return <div key={i} className="h-3" />;
              }
              return <p key={i} className="text-sm text-zinc-600 dark:text-zinc-400 my-2 leading-relaxed">{line}</p>;
            })}
          </div>
        </div>
      )}
    </div>
  );
}
