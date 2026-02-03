'use client';

import { useState } from 'react';
import { useData } from '@/context/DataContext';
import { Update } from '@/data/initial-data';

export default function AddUpdateForm() {
  const { addUpdate } = useData();
  const [content, setContent] = useState('');
  const [type, setType] = useState<Update['type']>('status');
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    
    addUpdate(content.trim(), type);
    setContent('');
    setType('status');
    setIsOpen(false);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="w-full p-4 rounded-xl border-2 border-dashed border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-500 hover:border-zinc-300 dark:hover:border-zinc-700 hover:text-zinc-600 dark:hover:text-zinc-400 transition-colors text-sm"
      >
        + Add new update
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="p-4 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="What's the update?"
        className="w-full bg-transparent text-sm text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-600 resize-none outline-none"
        rows={3}
        autoFocus
      />
      
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-zinc-100 dark:border-zinc-800">
        <div className="flex gap-2">
          {(['status', 'task', 'note', 'milestone'] as Update['type'][]).map(t => (
            <button
              key={t}
              type="button"
              onClick={() => setType(t)}
              className={`text-[10px] font-medium px-2 py-1 rounded-full transition-colors ${
                type === t
                  ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900'
                  : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-500 hover:bg-zinc-200 dark:hover:bg-zinc-700'
              }`}
            >
              {t.toUpperCase()}
            </button>
          ))}
        </div>
        
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => {
              setIsOpen(false);
              setContent('');
            }}
            className="text-xs px-3 py-1.5 rounded-lg text-zinc-500 dark:text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!content.trim()}
            className="text-xs px-3 py-1.5 rounded-lg bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Post Update
          </button>
        </div>
      </div>
    </form>
  );
}
