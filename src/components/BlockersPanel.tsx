'use client';

import { Blocker } from '@/data/initial-data';
import { useData } from '@/context/DataContext';

interface BlockersPanelProps {
  blockers: Blocker[];
  compact?: boolean;
}

const severityConfig = {
  critical: { 
    bg: 'bg-red-500/5 border-red-500/30 hover:border-red-500/50', 
    text: 'text-red-600 dark:text-red-400',
    badge: 'bg-red-500 text-white',
    icon: '🚨',
    glow: 'shadow-red-500/10'
  },
  high: { 
    bg: 'bg-orange-500/5 border-orange-500/30 hover:border-orange-500/50', 
    text: 'text-orange-600 dark:text-orange-400',
    badge: 'bg-orange-500 text-white',
    icon: '⚠️',
    glow: 'shadow-orange-500/10'
  },
  medium: { 
    bg: 'bg-amber-500/5 border-amber-500/30 hover:border-amber-500/50', 
    text: 'text-amber-600 dark:text-amber-400',
    badge: 'bg-amber-500 text-black',
    icon: '📋',
    glow: 'shadow-amber-500/10'
  },
};

const categoryLabels: Record<Blocker['category'], string> = {
  billing: 'Billing',
  access: 'Access Required',
  'rate-limit': 'Rate Limit',
  account: 'Account Needed',
  technical: 'Technical Issue',
  other: 'Other',
};

export default function BlockersPanel({ blockers, compact }: BlockersPanelProps) {
  const { resolveBlocker } = useData();
  
  const activeBlockers = blockers.filter(b => !b.resolved);
  const hasBlockers = activeBlockers.length > 0;

  // If no active blockers, show a subtle "all clear" message
  if (!hasBlockers) {
    return (
      <div className="p-5 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-2xl">
          ✅
        </div>
        <div>
          <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
            No Blockers
          </p>
          <p className="text-xs text-zinc-500 dark:text-zinc-500 mt-0.5">
            All systems go. Nothing blocking progress.
          </p>
        </div>
      </div>
    );
  }

  // Critical blockers get extra attention
  const criticalBlockers = activeBlockers.filter(b => b.severity === 'critical');
  const hasCritical = criticalBlockers.length > 0;

  return (
    <div className={`rounded-2xl border-2 overflow-hidden transition-all duration-300 ${
      hasCritical 
        ? 'bg-red-500/5 border-red-500/40 animate-pulse-subtle' 
        : 'bg-orange-500/5 border-orange-500/30'
    }`}>
      {/* Header */}
      <div className={`px-6 py-4 flex items-center justify-between ${
        hasCritical ? 'bg-red-500/10' : 'bg-orange-500/10'
      }`}>
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl ${
            hasCritical ? 'bg-red-500/20' : 'bg-orange-500/20'
          }`}>
            {hasCritical ? '🚨' : '⚠️'}
          </div>
          <div>
            <h3 className={`text-sm font-bold ${
              hasCritical ? 'text-red-600 dark:text-red-400' : 'text-orange-600 dark:text-orange-400'
            }`}>
              {hasCritical ? 'CRITICAL: Attention Required' : 'Blockers Need Attention'}
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-500 mt-0.5">
              {activeBlockers.length} item{activeBlockers.length > 1 ? 's' : ''} blocking progress
            </p>
          </div>
        </div>
        <span className={`text-sm font-bold w-8 h-8 flex items-center justify-center rounded-full ${
          hasCritical ? 'bg-red-500 text-white' : 'bg-orange-500 text-white'
        }`}>
          {activeBlockers.length}
        </span>
      </div>

      {/* Blockers List */}
      <div className="p-4 space-y-3">
        {activeBlockers.map(blocker => {
          const config = severityConfig[blocker.severity];
          return (
            <div 
              key={blocker.id}
              className={`group p-4 rounded-xl border transition-all duration-200 ${config.bg} hover:shadow-lg ${config.glow}`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span className="text-base">{config.icon}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${config.badge}`}>
                      {blocker.severity.toUpperCase()}
                    </span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-zinc-200/80 dark:bg-zinc-700/80 text-zinc-600 dark:text-zinc-400">
                      {categoryLabels[blocker.category]}
                    </span>
                  </div>
                  <h4 className={`text-sm font-semibold ${config.text} mb-1`}>
                    {blocker.title}
                  </h4>
                  {!compact && (
                    <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                      {blocker.description}
                    </p>
                  )}
                </div>
                {!compact && (
                  <button
                    onClick={() => resolveBlocker(blocker.id)}
                    className="shrink-0 text-xs font-medium px-3 py-1.5 rounded-lg bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-700 hover:text-zinc-900 dark:hover:text-white transition-all duration-200 opacity-0 group-hover:opacity-100 btn-press"
                  >
                    Resolve
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
