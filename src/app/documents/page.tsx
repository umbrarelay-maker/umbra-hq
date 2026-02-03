'use client';

import { useState } from 'react';
import { useData } from '@/context/DataContext';
import DocumentCard from '@/components/DocumentCard';
import { Document } from '@/data/initial-data';

export default function DocumentsPage() {
  const { documents } = useData();
  const [filter, setFilter] = useState<Document['category'] | 'all'>('all');
  
  const filteredDocuments = filter === 'all' 
    ? documents 
    : documents.filter(d => d.category === filter);

  const categories: (Document['category'] | 'all')[] = ['all', 'audits', 'research', 'marketing', 'technical', 'other'];

  const categoryCounts = categories.reduce((acc, cat) => {
    acc[cat] = cat === 'all' ? documents.length : documents.filter(d => d.category === cat).length;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="max-w-5xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight">Documents</h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-500 mt-1">
          Reports, research, and documentation.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        {categories.map(category => (
          <button
            key={category}
            onClick={() => setFilter(category)}
            className={`text-xs px-4 py-2 rounded-lg transition-colors ${
              filter === category
                ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-medium'
                : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700'
            }`}
          >
            {category === 'all' ? 'All' : category.charAt(0).toUpperCase() + category.slice(1)}
            {categoryCounts[category] > 0 && (
              <span className="ml-2 opacity-60">{categoryCounts[category]}</span>
            )}
          </button>
        ))}
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-2 gap-4">
        {filteredDocuments.map(document => (
          <DocumentCard key={document.id} document={document} />
        ))}
      </div>

      {filteredDocuments.length === 0 && (
        <div className="text-center py-12 text-zinc-500 dark:text-zinc-500">
          No documents in this category.
        </div>
      )}
    </div>
  );
}
