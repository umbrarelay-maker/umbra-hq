'use client';

import { DailyBriefing as BriefingType } from '@/data/initial-data';

interface DailyBriefingProps {
  briefing: BriefingType;
}

const moodConfig = {
  productive: { 
    icon: '⚡', 
    label: 'Productive', 
    gradient: 'from-emerald-500/10 to-emerald-500/5',
    border: 'border-emerald-500/20',
    badge: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
  },
  blocked: { 
    icon: '🚧', 
    label: 'Blocked', 
    gradient: 'from-red-500/10 to-red-500/5',
    border: 'border-red-500/20',
    badge: 'bg-red-500/15 text-red-600 dark:text-red-400'
  },
  planning: { 
    icon: '🎯', 
    label: 'Planning', 
    gradient: 'from-blue-500/10 to-blue-500/5',
    border: 'border-blue-500/20',
    badge: 'bg-blue-500/15 text-blue-600 dark:text-blue-400'
  },
  shipping: { 
    icon: '🚀', 
    label: 'Shipping', 
    gradient: 'from-violet-500/10 to-violet-500/5',
    border: 'border-violet-500/20',
    badge: 'bg-violet-500/15 text-violet-600 dark:text-violet-400'
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
    <div className={`relative overflow-hidden p-8 rounded-2xl bg-gradient-to-br ${mood.gradient} border-2 ${mood.border}`}>
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-white/5 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      
      {/* Header */}
      <div className="relative flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl animate-bounce" style={{ animationDuration: '2s' }}>{mood.icon}</span>
            <div>
              <h2 className="text-xl font-semibold text-zinc-900 dark:text-white">
                Daily Briefing
              </h2>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">
                {formatDate(briefing.date)}
              </p>
            </div>
          </div>
        </div>
        <span className={`text-xs font-bold px-4 py-1.5 rounded-full ${mood.badge}`}>
          {mood.label}
        </span>
      </div>

      {/* Summary */}
      <p className="relative text-base text-zinc-700 dark:text-zinc-300 leading-relaxed mb-8 max-w-3xl">
        {briefing.summary}
      </p>

      {/* Two columns */}
      <div className="relative grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Key Items */}
        <div className="bg-white/50 dark:bg-zinc-900/30 rounded-xl p-5 border border-zinc-200/50 dark:border-zinc-800/50">
          <h3 className="text-xs uppercase tracking-wider font-bold text-zinc-500 dark:text-zinc-400 mb-4 flex items-center gap-2">
            <span className="w-5 h-5 rounded-md bg-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400">✓</span>
            Key Items
          </h3>
          <ul className="space-y-3">
            {briefing.keyItems.map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-zinc-600 dark:text-zinc-400 group">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 shrink-0 group-hover:scale-150 transition-transform" />
                <span className="group-hover:text-zinc-900 dark:group-hover:text-zinc-200 transition-colors">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* What's Next */}
        <div className="bg-white/50 dark:bg-zinc-900/30 rounded-xl p-5 border border-zinc-200/50 dark:border-zinc-800/50">
          <h3 className="text-xs uppercase tracking-wider font-bold text-zinc-500 dark:text-zinc-400 mb-4 flex items-center gap-2">
            <span className="w-5 h-5 rounded-md bg-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400">→</span>
            What's Next
          </h3>
          <ul className="space-y-3">
            {briefing.whatsNext.map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-zinc-600 dark:text-zinc-400 group">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 shrink-0 group-hover:scale-150 transition-transform" />
                <span className="group-hover:text-zinc-900 dark:group-hover:text-zinc-200 transition-colors">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
