'use client';

import { DailyBriefing as BriefingType } from '@/data/initial-data';

interface DailyBriefingProps {
  briefing: BriefingType;
}

const moodConfig = {
  productive: { icon: '⚡', label: 'Productive', bg: 'bg-emerald-500/10 border-emerald-500/20' },
  blocked: { icon: '🚧', label: 'Blocked', bg: 'bg-red-500/10 border-red-500/20' },
  planning: { icon: '🎯', label: 'Planning', bg: 'bg-blue-500/10 border-blue-500/20' },
  shipping: { icon: '🚀', label: 'Shipping', bg: 'bg-purple-500/10 border-purple-500/20' },
};

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { 
    weekday: 'long', 
    month: 'long', 
    day: 'numeric',
    year: 'numeric'
  });
}

export default function DailyBriefing({ briefing }: DailyBriefingProps) {
  const mood = moodConfig[briefing.mood];

  return (
    <div className={`p-6 rounded-2xl border-2 ${mood.bg} mb-8`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-2xl">{mood.icon}</span>
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">
              Daily Briefing
            </h2>
          </div>
          <p className="text-sm text-zinc-500 dark:text-zinc-500">
            {formatDate(briefing.date)}
          </p>
        </div>
        <span className={`text-xs font-medium px-3 py-1.5 rounded-full ${
          briefing.mood === 'shipping' ? 'bg-purple-500/20 text-purple-600 dark:text-purple-400' :
          briefing.mood === 'productive' ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400' :
          briefing.mood === 'blocked' ? 'bg-red-500/20 text-red-600 dark:text-red-400' :
          'bg-blue-500/20 text-blue-600 dark:text-blue-400'
        }`}>
          {mood.label}
        </span>
      </div>

      {/* Summary */}
      <p className="text-base text-zinc-700 dark:text-zinc-300 leading-relaxed mb-6">
        {briefing.summary}
      </p>

      {/* Two columns */}
      <div className="grid grid-cols-2 gap-6">
        {/* Key Items */}
        <div>
          <h3 className="text-xs uppercase tracking-wider text-zinc-500 dark:text-zinc-500 mb-3 flex items-center gap-2">
            <span>✓</span> Key Items
          </h3>
          <ul className="space-y-2">
            {briefing.keyItems.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                <span className="text-emerald-500 mt-0.5">•</span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* What's Next */}
        <div>
          <h3 className="text-xs uppercase tracking-wider text-zinc-500 dark:text-zinc-500 mb-3 flex items-center gap-2">
            <span>→</span> What's Next
          </h3>
          <ul className="space-y-2">
            {briefing.whatsNext.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                <span className="text-blue-500 mt-0.5">•</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
