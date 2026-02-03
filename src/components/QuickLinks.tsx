'use client';

import { QuickLink } from '@/data/initial-data';

interface QuickLinksProps {
  links: QuickLink[];
}

const categoryIcons: Record<QuickLink['category'], string> = {
  site: '◎',
  repo: '◉',
  tool: '◇',
  docs: '◆',
  resource: '○',
};

const categoryLabels: Record<QuickLink['category'], string> = {
  site: 'Deployed Sites',
  repo: 'Repositories',
  tool: 'Tools',
  docs: 'Documentation',
  resource: 'Resources',
};

export default function QuickLinks({ links }: QuickLinksProps) {
  const grouped = links.reduce((acc, link) => {
    if (!acc[link.category]) acc[link.category] = [];
    acc[link.category].push(link);
    return acc;
  }, {} as Record<string, QuickLink[]>);

  return (
    <div className="space-y-4">
      {Object.entries(grouped).map(([category, categoryLinks]) => (
        <div key={category}>
          <h4 className="text-xs uppercase tracking-wider text-zinc-500 dark:text-zinc-500 mb-2 px-1">
            {categoryLabels[category as QuickLink['category']] || category}
          </h4>
          <div className="space-y-1">
            {categoryLinks.map(link => (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-white transition-colors"
              >
                <span className="text-zinc-400 dark:text-zinc-600">
                  {categoryIcons[link.category as QuickLink['category']]}
                </span>
                {link.label}
                <span className="ml-auto text-xs text-zinc-400 dark:text-zinc-600">↗</span>
              </a>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
