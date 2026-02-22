'use client';

import { useMemo } from 'react';
import { useData } from '@/context/DataContext';
import DocumentCard from '@/components/DocumentCard';

const PREFIX = 'STATE:';

export default function StatesPage() {
  const { documents } = useData();

  const stateDocs = useMemo(() => {
    return documents
      .filter((d) => (d.title || '').toUpperCase().startsWith(PREFIX))
      .sort((a, b) => (b.updatedAt || b.createdAt).localeCompare(a.updatedAt || a.createdAt));
  }, [documents]);

  return (
    <div className="max-w-6xl animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-white">Project States</h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-500 mt-2">
          Canonical “current state” snapshots. Convention: document title starts with <span className="font-mono">STATE:</span>
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 stagger-children">
        {stateDocs.map((doc) => (
          <DocumentCard key={doc.id} document={doc} />
        ))}
      </div>

      {stateDocs.length === 0 && (
        <div className="text-center py-16">
          <div className="w-16 h-16 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">📌</span>
          </div>
          <p className="text-sm text-zinc-500 dark:text-zinc-500 font-medium">No state snapshots yet.</p>
          <p className="text-xs text-zinc-500 dark:text-zinc-600 mt-2">
            Create a document named <span className="font-mono">STATE: UmbraTools</span> (etc.).
          </p>
        </div>
      )}
    </div>
  );
}
