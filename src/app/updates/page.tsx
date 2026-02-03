'use client';

import { useState } from 'react';
import { useData } from '@/context/DataContext';
import UpdateFeed from '@/components/UpdateFeed';
import AddUpdateForm from '@/components/AddUpdateForm';
import { Update } from '@/data/initial-data';

const typeConfig: Record<Update['type'] | 'all', { icon: string; label: string }> = {
  all: { icon: '◎', label: 'All' },
  status: { icon: '◐', label: 'Status' },
  task: { icon: '✓', label: 'Task' },
  note: { icon: '◇', label: 'Note' },
  milestone: { icon: '◆', label: 'Milestone' },
};

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
    <div className="max-w-3xl animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-white">Updates</h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-500 mt-2">
          Chronological log of all activity.
        </p>
      </div>

      {/* Add Update Form */}
      <div className="mb-8">
        <AddUpdateForm />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-8">
        {types.map((type, index) => {
          const config = typeConfig[type];
          return (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`text-xs font-medium px-4 py-2.5 rounded-xl transition-all duration-200 inline-flex items-center gap-2 ${
                filter === type
                  ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 shadow-lg shadow-zinc-900/10 dark:shadow-white/10'
                  : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700 hover:text-zinc-900 dark:hover:text-white'
              }`}
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <span>{config.icon}</span>
              {config.label}
              {typeCounts[type] > 0 && (
                <span className={filter === type ? 'opacity-60' : 'opacity-40'}>
                  ({typeCounts[type]})
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Updates Feed */}
      <UpdateFeed updates={filteredUpdates} />

      {filteredUpdates.length === 0 && (
        <div className="text-center py-16">
          <div className="w-16 h-16 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">📋</span>
          </div>
          <p className="text-sm text-zinc-500 dark:text-zinc-500 font-medium">
            No updates of this type.
          </p>
        </div>
      )}
    </div>
  );
}
