'use client';

import { useState } from 'react';
import { QuickLink } from '@/data/initial-data';
import { useData } from '@/context/DataContext';

const categoryConfig = {
  site: { icon: '◉', label: 'Sites', color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' },
  repo: { icon: '◈', label: 'Repositories', color: 'bg-purple-500/10 text-purple-600 dark:text-purple-400' },
  tool: { icon: '◆', label: 'Tools', color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400' },
  docs: { icon: '◇', label: 'Documentation', color: 'bg-amber-500/10 text-amber-600 dark:text-amber-400' },
  resource: { icon: '○', label: 'Resources', color: 'bg-rose-500/10 text-rose-600 dark:text-rose-400' },
};

interface LinkModalProps {
  link?: QuickLink;
  onClose: () => void;
  onSave: (link: Omit<QuickLink, 'id'>) => void;
}

function LinkModal({ link, onClose, onSave }: LinkModalProps) {
  const [label, setLabel] = useState(link?.label || '');
  const [url, setUrl] = useState(link?.url || '');
  const [category, setCategory] = useState<QuickLink['category']>(link?.category || 'resource');
  const [description, setDescription] = useState(link?.description || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!label.trim() || !url.trim()) return;
    onSave({ label, url, category, description: description || undefined });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 w-full max-w-md border border-zinc-200 dark:border-zinc-800">
        <h3 className="text-lg font-semibold mb-4">
          {link ? 'Edit Link' : 'Add Link'}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs uppercase tracking-wider text-zinc-500 mb-1.5">
              Label
            </label>
            <input
              type="text"
              value={label}
              onChange={e => setLabel(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-500"
              placeholder="Link name..."
              autoFocus
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-wider text-zinc-500 mb-1.5">
              URL
            </label>
            <input
              type="url"
              value={url}
              onChange={e => setUrl(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-500"
              placeholder="https://..."
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-wider text-zinc-500 mb-1.5">
              Category
            </label>
            <select
              value={category}
              onChange={e => setCategory(e.target.value as QuickLink['category'])}
              className="w-full px-3 py-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-500"
            >
              {Object.entries(categoryConfig).map(([key, config]) => (
                <option key={key} value={key}>{config.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs uppercase tracking-wider text-zinc-500 mb-1.5">
              Description (optional)
            </label>
            <input
              type="text"
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-500"
              placeholder="Brief description..."
            />
          </div>
          <div className="flex gap-2 pt-2">
            <div className="flex-1" />
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-sm text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg text-sm bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-colors"
            >
              {link ? 'Save' : 'Add'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function LinkLibrary() {
  const { quickLinks, addQuickLink, deleteQuickLink } = useData();
  const [modalOpen, setModalOpen] = useState(false);
  const [filter, setFilter] = useState<QuickLink['category'] | 'all'>('all');

  const filteredLinks = filter === 'all' 
    ? quickLinks 
    : quickLinks.filter(l => l.category === filter);

  // Group by category
  const groupedLinks = filteredLinks.reduce((acc, link) => {
    if (!acc[link.category]) acc[link.category] = [];
    acc[link.category].push(link);
    return acc;
  }, {} as Record<string, QuickLink[]>);

  return (
    <div className="max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Link Library</h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-500 mt-1">
            Important links and resources organized by category
          </p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="px-4 py-2 rounded-lg text-sm bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-colors"
        >
          + Add Link
        </button>
      </div>

      {/* Filter */}
      <div className="flex gap-2 mb-6 flex-wrap">
        <button
          onClick={() => setFilter('all')}
          className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
            filter === 'all'
              ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900'
              : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700'
          }`}
        >
          All ({quickLinks.length})
        </button>
        {Object.entries(categoryConfig).map(([key, config]) => {
          const count = quickLinks.filter(l => l.category === key).length;
          if (count === 0) return null;
          return (
            <button
              key={key}
              onClick={() => setFilter(key as QuickLink['category'])}
              className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                filter === key
                  ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900'
                  : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700'
              }`}
            >
              {config.icon} {config.label} ({count})
            </button>
          );
        })}
      </div>

      {/* Links Grid */}
      {Object.entries(groupedLinks).map(([category, links]) => {
        const config = categoryConfig[category as keyof typeof categoryConfig];
        return (
          <div key={category} className="mb-8">
            <h2 className="text-sm font-semibold text-zinc-900 dark:text-white mb-3 flex items-center gap-2">
              <span className={`w-6 h-6 rounded-lg flex items-center justify-center ${config.color}`}>
                {config.icon}
              </span>
              {config.label}
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {links.map(link => (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group p-4 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all hover:shadow-md"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-zinc-900 dark:text-white group-hover:text-zinc-700 dark:group-hover:text-zinc-200 truncate">
                        {link.label}
                      </p>
                      {link.description && (
                        <p className="text-xs text-zinc-500 dark:text-zinc-500 mt-1 line-clamp-2">
                          {link.description}
                        </p>
                      )}
                      <p className="text-xs text-zinc-400 dark:text-zinc-600 mt-2 truncate">
                        {link.url.replace(/^https?:\/\//, '')}
                      </p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        deleteQuickLink(link.id);
                      }}
                      className="opacity-0 group-hover:opacity-100 ml-2 p-1 text-zinc-400 hover:text-red-500 transition-all"
                      title="Delete link"
                    >
                      ×
                    </button>
                  </div>
                </a>
              ))}
            </div>
          </div>
        );
      })}

      {filteredLinks.length === 0 && (
        <div className="text-center py-12 text-zinc-400 dark:text-zinc-600">
          <p className="text-lg mb-2">No links found</p>
          <p className="text-sm">Add your first link to get started</p>
        </div>
      )}

      {modalOpen && (
        <LinkModal
          onClose={() => setModalOpen(false)}
          onSave={(link) => addQuickLink(link)}
        />
      )}
    </div>
  );
}
