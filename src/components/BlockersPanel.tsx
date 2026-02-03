'use client';

import { Blocker } from '@/data/initial-data';
import { useData } from '@/context/DataContext';

interface BlockersPanelProps {
  blockers: Blocker[];
  compact?: boolean;
}

const severityConfig = {
  critical: { 
    bg: 'bg-red-500/10 border-red-500/50', 
    text: 'text-red-600 dark:text-red-400',
    badge: 'bg-red-500 text-white',
    icon: '🚨'
  },
  high: { 
    bg: 'bg-orange-500/10 border-orange-500/50', 
    text: 'text-orange-600 dark:text-orange-400',
    badge: 'bg-orange-500 text-white',
    icon: '⚠️'
  },
  medium: { 
    bg: 'bg-yellow-500/10 border-yellow-500/50', 
    text: 'text-yellow-600 dark:text-yellow-400',
    badge: 'bg-yellow-500 text-black',
    icon: '📋'
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
      <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20 mb-6">
        <div className="flex items-center gap-3">
          <span className="text-xl">✅</span>
          <div>
            <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
              No Blockers
            </p>
            <p className="text-xs text-zinc-500 dark:text-zinc-500">
              All systems go. Nothing blocking progress.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Critical blockers get extra attention
  const criticalBlockers = activeBlockers.filter(b => b.severity === 'critical');
  const hasCritical = criticalBlockers.length > 0;

  return (
    <div className={`rounded-xl border-2 mb-6 overflow-hidden ${
      hasCritical 
        ? 'bg-red-500/5 border-red-500/50 animate-pulse-subtle' 
        : 'bg-orange-500/5 border-orange-500/30'
    }`}>
      {/* Header */}
      <div className={`px-4 py-3 flex items-center justify-between ${
        hasCritical ? 'bg-red-500/10' : 'bg-orange-500/10'
      }`}>
        <div className="flex items-center gap-2">
          <span className="text-xl">{hasCritical ? '🚨' : '⚠️'}</span>
          <h3 className={`text-sm font-semibold ${
            hasCritical ? 'text-red-600 dark:text-red-400' : 'text-orange-600 dark:text-orange-400'
          }`}>
            {hasCritical ? 'CRITICAL: Attention Required' : 'Blockers Need Attention'}
          </h3>
        </div>
        <span className={`text-xs font-bold px-2 py-1 rounded-full ${
          hasCritical ? 'bg-red-500 text-white' : 'bg-orange-500 text-white'
        }`}>
          {activeBlockers.length}
        </span>
      </div>

      {/* Blockers List */}
      <div className="p-3 space-y-2">
        {activeBlockers.map(blocker => {
          const config = severityConfig[blocker.severity];
          return (
            <div 
              key={blocker.id}
              className={`p-3 rounded-lg border ${config.bg} ${!compact ? 'hover:bg-opacity-20' : ''}`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm">{config.icon}</span>
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${config.badge}`}>
                      {blocker.severity.toUpperCase()}
                    </span>
                    <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-zinc-200 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-400">
                      {categoryLabels[blocker.category]}
                    </span>
                  </div>
                  <h4 className={`text-sm font-medium ${config.text} mb-1`}>
                    {blocker.title}
                  </h4>
                  {!compact && (
                    <p className="text-xs text-zinc-600 dark:text-zinc-400">
                      {blocker.description}
                    </p>
                  )}
                </div>
                {!compact && (
                  <button
                    onClick={() => resolveBlocker(blocker.id)}
                    className="text-xs px-2 py-1 rounded bg-zinc-200 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-300 dark:hover:bg-zinc-600 transition-colors shrink-0"
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
