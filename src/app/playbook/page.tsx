'use client';

import { useMemo, useState } from 'react';
import { useData } from '@/context/DataContext';
import UpdateFeed from '@/components/UpdateFeed';
import AddUpdateForm from '@/components/AddUpdateForm';
import { Update } from '@/data/initial-data';

const filters = ['all', 'decisions', 'lessons'] as const;
type Filter = (typeof filters)[number];

function isDecision(u: Update) {
  const c = u.content.trim();
  return c.startsWith('[DECISION]') || c.startsWith('[DECISION][LESSON]') || c.startsWith('[LESSON][DECISION]');
}
function isLesson(u: Update) {
  const c = u.content.trim();
  return c.startsWith('[LESSON]') || c.startsWith('[DECISION][LESSON]') || c.startsWith('[LESSON][DECISION]');
}

function stripTags(content: string) {
  return content
    .trim()
    .replace(/^\[DECISION\]\s*/i, '')
    .replace(/^\[LESSON\]\s*/i, '')
    .replace(/^\[DECISION\]\[LESSON\]\s*/i, '')
    .replace(/^\[LESSON\]\[DECISION\]\s*/i, '');
}

export default function PlaybookPage() {
  const { updates } = useData();
  const [filter, setFilter] = useState<Filter>('all');

  const filtered = useMemo(() => {
    if (filter === 'decisions') return updates.filter(isDecision);
    if (filter === 'lessons') return updates.filter(isLesson);
    return updates.filter((u) => isDecision(u) || isLesson(u));
  }, [updates, filter]);

  const counts = useMemo(() => {
    const d = updates.filter(isDecision).length;
    const l = updates.filter(isLesson).length;
    return { decisions: d, lessons: l, all: d + l };
  }, [updates]);

  return (
    <div className="max-w-3xl animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-white">Playbook</h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-500 mt-2">
          Decisions + lessons. Keep it tight. HQ is the system of record.
        </p>
      </div>

      <div className="mb-8">
        <AddUpdateForm />
        <p className="text-[11px] text-zinc-500 dark:text-zinc-500 mt-2">
          Prefix entries with <span className="font-mono">[DECISION]</span>, <span className="font-mono">[LESSON]</span>, or <span className="font-mono">[DECISION][LESSON]</span> when it is both.
        </p>
      </div>

      <div className="flex flex-wrap gap-2 mb-8">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`text-xs font-medium px-4 py-2.5 rounded-xl transition-all duration-200 inline-flex items-center gap-2 ${
              filter === f
                ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 shadow-lg shadow-zinc-900/10 dark:shadow-white/10'
                : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700 hover:text-zinc-900 dark:hover:text-white'
            }`}
          >
            {f === 'all' ? 'All' : f === 'decisions' ? 'Decisions' : 'Lessons'}
            <span className={filter === f ? 'opacity-60' : 'opacity-40'}>
              ({counts[f]})
            </span>
          </button>
        ))}
      </div>

      <UpdateFeed updates={filtered} />

      {filtered.length === 0 && (
        <div className="text-center py-16">
          <div className="w-16 h-16 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">◇</span>
          </div>
          <p className="text-sm text-zinc-500 dark:text-zinc-500 font-medium">Nothing logged yet.</p>
        </div>
      )}
    </div>
  );
}
