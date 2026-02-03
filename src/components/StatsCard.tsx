'use client';

interface StatsCardProps {
  label: string;
  value: string | number;
  icon: string;
  accent?: boolean;
}

export default function StatsCard({ label, value, icon, accent }: StatsCardProps) {
  return (
    <div className={`p-5 rounded-xl border ${
      accent 
        ? 'bg-zinc-900 dark:bg-white border-zinc-800 dark:border-zinc-200' 
        : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800'
    }`}>
      <div className="flex items-start justify-between">
        <div>
          <p className={`text-xs uppercase tracking-wider ${
            accent 
              ? 'text-zinc-400 dark:text-zinc-600' 
              : 'text-zinc-500 dark:text-zinc-500'
          }`}>
            {label}
          </p>
          <p className={`text-3xl font-semibold mt-1 ${
            accent 
              ? 'text-white dark:text-zinc-900' 
              : 'text-zinc-900 dark:text-white'
          }`}>
            {value}
          </p>
        </div>
        <span className={`text-2xl ${
          accent 
            ? 'text-zinc-500 dark:text-zinc-400' 
            : 'text-zinc-300 dark:text-zinc-700'
        }`}>
          {icon}
        </span>
      </div>
    </div>
  );
}
