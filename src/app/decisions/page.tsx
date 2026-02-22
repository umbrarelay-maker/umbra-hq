'use client';

import { useMemo, useState } from 'react';
import { useData } from '@/context/DataContext';
import UpdateFeed from '@/components/UpdateFeed';

const PREFIX = '[DECISION]';

export default function DecisionsPage() {
  const { updates, addUpdate } = useData();
  const [content, setContent] = useState('');

  const decisionUpdates = useMemo(() => {
    return updates.filter((u) => u.content.trim().startsWith(PREFIX));
  }, [updates]);

  const onAdd = async () => {
    const c = content.trim();
    if (!c) return;
    await addUpdate(`${PREFIX} ${c}`, 'milestone');
    setContent('');
  };

  return (
    <div className="max-w-3xl animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-white">Decisions</h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-500 mt-2">
          Canonical decisions log. Keep it short: what we decided + why.
        </p>
      </div>

      <div className="mb-8 p-4 rounded-lg bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800">
        <label className="block text-xs uppercase tracking-wider font-bold text-zinc-500 mb-2">New decision</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Example: NightOwl stays planning until new design direction is approved."
          className="w-full min-h-[90px] px-4 py-3 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
        />
        <div className="flex justify-end mt-3">
          <button
            onClick={onAdd}
            className="px-5 py-2.5 rounded-xl text-sm font-medium bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-all btn-press"
          >
            Add decision
          </button>
        </div>
      </div>

      <UpdateFeed updates={decisionUpdates} />

      {decisionUpdates.length === 0 && (
        <div className="text-center py-16">
          <div className="w-16 h-16 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">◆</span>
          </div>
          <p className="text-sm text-zinc-500 dark:text-zinc-500 font-medium">No decisions logged yet.</p>
        </div>
      )}
    </div>
  );
}
