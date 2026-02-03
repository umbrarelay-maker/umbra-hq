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
    <div className={`group relative p-6 rounded-2xl border transition-all duration-300 hover-lift ${
      accent 
        ? 'bg-gradient-to-br from-zinc-900 to-zinc-800 dark:from-white dark:to-zinc-100 border-zinc-700 dark:border-zinc-300' 
        : 'bg-white dark:bg-zinc-900/50 border-zinc-200/80 dark:border-zinc-800/80 hover:border-zinc-300 dark:hover:border-zinc-700'
    }`}>
      {/* Subtle gradient overlay on hover */}
      {!accent && (
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      )}
      
      <div className="relative flex items-start justify-between">
        <div>
          <p className={`text-[11px] uppercase tracking-wider font-semibold mb-2 ${
            accent 
              ? 'text-zinc-400 dark:text-zinc-500' 
              : 'text-zinc-500 dark:text-zinc-500'
          }`}>
            {label}
          </p>
          <div className="flex items-end gap-2">
            <p className={`text-4xl font-bold tabular-nums ${
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
        <div className={`text-3xl transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12 ${
          accent 
            ? 'text-zinc-500 dark:text-zinc-400' 
            : 'text-zinc-300 dark:text-zinc-700 group-hover:text-zinc-400 dark:group-hover:text-zinc-600'
        }`}>
          {icon}
        </div>
      </div>
    </div>
  );
}
