'use client';

interface StatsCardProps {
  label: string;
  value: string | number;
  icon: string;
  accent?: boolean;
  trend?: { value: number; isUp: boolean };
}

export default function StatsCard({ label, value, icon, accent, trend }: StatsCardProps) {
  return (
    <div className={`group relative p-5 rounded-lg border transition-colors duration-150 ${
      accent 
        ? 'bg-zinc-900 dark:bg-zinc-100 border-zinc-800 dark:border-zinc-200' 
        : 'bg-white dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700'
    }`}>
      <div className="flex items-start justify-between">
        <div>
          <p className={`text-[10px] uppercase tracking-wider font-semibold mb-1.5 ${
            accent 
              ? 'text-zinc-400 dark:text-zinc-500' 
              : 'text-zinc-500 dark:text-zinc-500'
          }`}>
            {label}
          </p>
          <div className="flex items-end gap-2">
            <p className={`text-3xl font-semibold tabular-nums ${
              accent 
                ? 'text-white dark:text-zinc-900' 
                : 'text-zinc-900 dark:text-white'
            }`}>
              {value}
            </p>
            {trend && (
              <span className={`text-xs font-medium mb-1 flex items-center gap-0.5 ${
                trend.isUp ? 'text-emerald-500' : 'text-rose-500'
              }`}>
                {trend.isUp ? '↑' : '↓'} {trend.value}%
              </span>
            )}
          </div>
        </div>
        <div className={`text-2xl opacity-50 ${
          accent 
            ? 'text-zinc-400 dark:text-zinc-500' 
            : 'text-zinc-400 dark:text-zinc-600'
        }`}>
          {icon}
        </div>
      </div>
    </div>
  );
}
