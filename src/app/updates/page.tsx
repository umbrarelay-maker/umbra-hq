'use client';

import { useState } from 'react';
import { useData } from '@/context/DataContext';
import UpdateFeed from '@/components/UpdateFeed';
import AddUpdateForm from '@/components/AddUpdateForm';
import { Update } from '@/data/initial-data';

export default function UpdatesPage() {
  const { updates } = useData();
  const [filter, setFilter] = useState<Update['type'] | 'all'>('all');
  
  const filteredUpdates = filter === 'all' 
    ? updates 
    : updates.filter(u => u.type === filter);

  const types: (Update['type'] | 'all')[] = ['all', 'status', 'task', 'note', 'milestone'];

  const typeCounts = types.reduce((acc, type) => {
    acc[type] = type === 'all' ? updates.length : updates.filter(u => u.type === type).length;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="max-w-3xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight">Updates</h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-500 mt-1">
          Chronological log of all activity.
        </p>
      </div>

      {/* Add Update Form */}
      <div className="mb-6">
        <AddUpdateForm />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        {types.map(type => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            className={`text-xs px-4 py-2 rounded-lg transition-colors ${
              filter === type
                ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-medium'
                : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700'
            }`}
          >
            {type === 'all' ? 'All' : type.charAt(0).toUpperCase() + type.slice(1)}
            {typeCounts[type] > 0 && (
              <span className="ml-2 opacity-60">{typeCounts[type]}</span>
            )}
          </button>
        ))}
      </div>

      {/* Updates Feed */}
      <UpdateFeed updates={filteredUpdates} />

      {filteredUpdates.length === 0 && (
        <div className="text-center py-12 text-zinc-500 dark:text-zinc-500">
          No updates of this type.
        </div>
      )}
    </div>
  );
}
