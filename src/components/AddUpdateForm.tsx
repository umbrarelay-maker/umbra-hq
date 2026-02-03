'use client';

import { useState } from 'react';
import { useData } from '@/context/DataContext';
import { Update } from '@/data/initial-data';

const typeConfig: Record<Update['type'], { icon: string; label: string }> = {
  status: { icon: '◐', label: 'STATUS' },
  task: { icon: '✓', label: 'TASK' },
  note: { icon: '◇', label: 'NOTE' },
  milestone: { icon: '◆', label: 'MILESTONE' },
};

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
        className="group w-full p-5 rounded-2xl border-2 border-dashed border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-500 hover:border-sky-500/30 dark:hover:border-sky-500/30 hover:text-sky-600 dark:hover:text-sky-400 transition-all duration-200 text-sm font-medium flex items-center justify-center gap-2"
      >
        <span className="text-lg transition-transform group-hover:scale-110">+</span>
        Add new update
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="p-5 rounded-2xl bg-white dark:bg-zinc-900/50 border border-zinc-200/80 dark:border-zinc-800/80 shadow-lg shadow-zinc-900/5 dark:shadow-black/20 animate-fade-in-scale">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="What's the update?"
        className="w-full bg-transparent text-sm text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-600 resize-none outline-none min-h-[80px]"
        rows={3}
        autoFocus
      />
      
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-800">
        <div className="flex gap-2">
          {(Object.keys(typeConfig) as Update['type'][]).map(t => {
            const config = typeConfig[t];
            return (
              <button
                key={t}
                type="button"
                onClick={() => setType(t)}
                className={`text-[10px] font-bold px-3 py-1.5 rounded-full transition-all duration-200 inline-flex items-center gap-1.5 ${
                  type === t
                    ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 shadow-sm'
                    : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-500 hover:bg-zinc-200 dark:hover:bg-zinc-700 hover:text-zinc-700 dark:hover:text-zinc-300'
                }`}
              >
                <span>{config.icon}</span>
                {config.label}
              </button>
            );
          })}
        </div>
        
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => {
              setIsOpen(false);
              setContent('');
            }}
            className="text-xs font-medium px-4 py-2 rounded-xl text-zinc-500 dark:text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!content.trim()}
            className="text-xs font-medium px-4 py-2 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all btn-press"
          >
            Post Update
          </button>
        </div>
      </div>
    </form>
  );
}
