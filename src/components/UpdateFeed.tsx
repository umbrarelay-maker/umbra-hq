'use client';

import { Update } from '@/data/initial-data';

interface UpdateFeedProps {
  updates: Update[];
  limit?: number;
}

const typeStyles: Record<Update['type'], { bg: string; dot: string; label: string }> = {
  status: { 
    bg: 'bg-blue-500/10 text-blue-600 dark:text-blue-400', 
    dot: 'bg-blue-500',
    label: 'STATUS' 
  },
  task: { 
    bg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400', 
    dot: 'bg-emerald-500',
    label: 'TASK' 
  },
  note: { 
    bg: 'bg-zinc-500/10 text-zinc-600 dark:text-zinc-400', 
    dot: 'bg-zinc-500',
    label: 'NOTE' 
  },
  milestone: { 
    bg: 'bg-violet-500/10 text-violet-600 dark:text-violet-400', 
    dot: 'bg-violet-500',
    label: 'MILESTONE' 
  },
};

function formatTime(timestamp: string) {
  const date = new Date(timestamp);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor(diff / (1000 * 60));
  
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (hours < 48) return 'Yesterday';
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export default function UpdateFeed({ updates, limit }: UpdateFeedProps) {
  const displayUpdates = limit ? updates.slice(0, limit) : updates;

  if (displayUpdates.length === 0) {
    return (
      <div className="text-center py-12 text-sm text-zinc-500 dark:text-zinc-500">
        No updates yet
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {displayUpdates.map((update, index) => {
        const type = typeStyles[update.type];
        return (
          <div
            key={update.id}
            className="group relative flex gap-4 p-5 rounded-2xl bg-white dark:bg-zinc-900/50 border border-zinc-200/80 dark:border-zinc-800/80 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all duration-200 hover:shadow-lg hover:shadow-zinc-900/5 dark:hover:shadow-black/20"
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            {/* Timeline */}
            <div className="flex flex-col items-center pt-1">
              <div className={`w-3 h-3 rounded-full ${type.dot} ring-4 ring-opacity-20 ${type.dot.replace('bg-', 'ring-')} group-hover:scale-125 transition-transform duration-200`} />
              {index < displayUpdates.length - 1 && (
                <div className="w-px flex-1 bg-gradient-to-b from-zinc-200 dark:from-zinc-800 to-transparent mt-3" />
              )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${type.bg}`}>
                  {type.label}
                </span>
                <span className="text-xs text-zinc-400 dark:text-zinc-600 font-medium">
                  {formatTime(update.timestamp)}
                </span>
              </div>
              <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed group-hover:text-zinc-900 dark:group-hover:text-white transition-colors">
                {update.content}
              </p>
            </div>

            {/* Hover indicator */}
            <div className="absolute right-5 top-1/2 -translate-y-1/2 text-zinc-300 dark:text-zinc-700 opacity-0 group-hover:opacity-100 transition-opacity">
              →
            </div>
          </div>
        );
      })}
    </div>
  );
}
