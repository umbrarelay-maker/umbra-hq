'use client';

import { DailyBriefing as BriefingType } from '@/data/initial-data';

interface DailyBriefingProps {
  briefing: BriefingType;
}

const moodConfig = {
  productive: { 
    icon: '⚡', 
    label: 'Productive', 
    gradient: 'from-emerald-500/8 to-transparent',
    border: 'border-emerald-500/15',
    badge: 'bg-emerald-50 dark:bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
  },
  blocked: { 
    icon: '⚠', 
    label: 'Blocked', 
    gradient: 'from-amber-500/8 to-transparent',
    border: 'border-amber-500/15',
    badge: 'bg-amber-50 dark:bg-amber-500/15 text-amber-600 dark:text-amber-400'
  },
  planning: { 
    icon: '◎', 
    label: 'Planning', 
    gradient: 'from-sky-500/8 to-transparent',
    border: 'border-sky-500/15',
    badge: 'bg-sky-50 dark:bg-sky-500/15 text-sky-600 dark:text-sky-400'
  },
  shipping: { 
    icon: '→', 
    label: 'Shipping', 
    gradient: 'from-sky-500/8 to-transparent',
    border: 'border-sky-500/15',
    badge: 'bg-sky-50 dark:bg-sky-500/15 text-sky-600 dark:text-sky-400'
  },
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
    <div className={`relative overflow-hidden p-6 rounded-lg bg-gradient-to-br ${mood.gradient} border ${mood.border}`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-5">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <span className="text-xl opacity-70">{mood.icon}</span>
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">
              Daily Briefing
            </h2>
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-500 ml-8">
            {formatDate(briefing.date)}
          </p>
        </div>
        <span className={`text-[10px] font-medium px-2.5 py-1 rounded ${mood.badge}`}>
          {mood.label}
        </span>
      </div>

      {/* Summary */}
      <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed mb-6 max-w-3xl">
        {briefing.summary}
      </p>

      {/* Two columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Key Items */}
        <div className="bg-white/60 dark:bg-zinc-900/40 rounded-lg p-4 border border-zinc-200/50 dark:border-zinc-800/50">
          <h3 className="text-[10px] uppercase tracking-wider font-semibold text-zinc-500 dark:text-zinc-500 mb-3 flex items-center gap-2">
            <span className="text-emerald-500">✓</span>
            Key Items
          </h3>
          <ul className="space-y-2">
            {briefing.keyItems.map((item, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm text-zinc-600 dark:text-zinc-400">
                <span className="w-1 h-1 rounded-full bg-emerald-500 mt-2 shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* What's Next */}
        <div className="bg-white/60 dark:bg-zinc-900/40 rounded-lg p-4 border border-zinc-200/50 dark:border-zinc-800/50">
          <h3 className="text-[10px] uppercase tracking-wider font-semibold text-zinc-500 dark:text-zinc-500 mb-3 flex items-center gap-2">
            <span className="text-sky-500">→</span>
            What's Next
          </h3>
          <ul className="space-y-2">
            {briefing.whatsNext.map((item, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm text-zinc-600 dark:text-zinc-400">
                <span className="w-1 h-1 rounded-full bg-sky-500 mt-2 shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
