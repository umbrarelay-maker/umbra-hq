'use client';

import { QuickLink } from '@/data/initial-data';

interface QuickLinksProps {
  links: QuickLink[];
}

const categoryConfig: Record<QuickLink['category'], { icon: string; label: string; color: string }> = {
  site: { icon: '◎', label: 'Deployed Sites', color: 'text-emerald-500' },
  repo: { icon: '◉', label: 'Repositories', color: 'text-pink-500' },
  tool: { icon: '◇', label: 'Tools', color: 'text-blue-500' },
  docs: { icon: '◆', label: 'Documentation', color: 'text-amber-500' },
  resource: { icon: '○', label: 'Resources', color: 'text-zinc-500' },
};

export default function QuickLinks({ links }: QuickLinksProps) {
  const grouped = links.reduce((acc, link) => {
    if (!acc[link.category]) acc[link.category] = [];
    acc[link.category].push(link);
    return acc;
  }, {} as Record<string, QuickLink[]>);

  return (
    <div className="space-y-5">
      {Object.entries(grouped).map(([category, categoryLinks]) => {
        const config = categoryConfig[category as QuickLink['category']];
        return (
          <div key={category}>
            <h4 className="text-[10px] uppercase tracking-wider font-bold text-zinc-500 dark:text-zinc-500 mb-2.5 px-1 flex items-center gap-2">
              <span className={config?.color || 'text-zinc-500'}>{config?.icon || '•'}</span>
              {config?.label || category}
            </h4>
            <div className="space-y-1">
              {categoryLinks.map((link, index) => (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100/80 dark:hover:bg-zinc-800/50 hover:text-zinc-900 dark:hover:text-white transition-all duration-200"
                  style={{ animationDelay: `${index * 0.03}s` }}
                >
                  <span className="flex-1 font-medium truncate">{link.label}</span>
                  <span className="text-xs text-zinc-400 dark:text-zinc-600 opacity-0 group-hover:opacity-100 transition-all duration-200 transform group-hover:translate-x-0.5">↗</span>
                </a>
              ))}
            </div>
          </div>
        );
      })}
      {Object.keys(grouped).length === 0 && (
        <div className="text-center py-6 text-sm text-zinc-500 dark:text-zinc-500">
          No links yet
        </div>
      )}
    </div>
  );
}
