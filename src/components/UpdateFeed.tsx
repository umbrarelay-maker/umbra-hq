'use client';

import { Update } from '@/data/initial-data';

interface UpdateFeedProps {
  updates: Update[];
  limit?: number;
}

const typeStyles: Record<Update['type'], { bg: string; label: string }> = {
  status: { bg: 'bg-blue-500/10 text-blue-600 dark:text-blue-400', label: 'STATUS' },
  task: { bg: 'bg-green-500/10 text-green-600 dark:text-green-400', label: 'TASK' },
  note: { bg: 'bg-zinc-500/10 text-zinc-600 dark:text-zinc-400', label: 'NOTE' },
  milestone: { bg: 'bg-purple-500/10 text-purple-600 dark:text-purple-400', label: 'MILESTONE' },
};

function formatTime(timestamp: string) {
  const date = new Date(timestamp);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor(diff / (1000 * 60));
  
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export default function UpdateFeed({ updates, limit }: UpdateFeedProps) {
  const displayUpdates = limit ? updates.slice(0, limit) : updates;

  return (
    <div className="space-y-3">
      {displayUpdates.map((update, index) => (
        <div
          key={update.id}
          className="group flex gap-4 p-4 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors"
        >
          {/* Timeline dot */}
          <div className="flex flex-col items-center">
            <div className="w-2.5 h-2.5 rounded-full bg-zinc-300 dark:bg-zinc-600 group-hover:bg-zinc-400 dark:group-hover:bg-zinc-500 transition-colors" />
            {index < displayUpdates.length - 1 && (
              <div className="w-px flex-1 bg-zinc-200 dark:bg-zinc-800 mt-2" />
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1.5">
              <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${typeStyles[update.type].bg}`}>
                {typeStyles[update.type].label}
              </span>
              <span className="text-xs text-zinc-400 dark:text-zinc-600">
                {formatTime(update.timestamp)}
              </span>
            </div>
            <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
              {update.content}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
