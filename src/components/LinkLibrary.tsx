'use client';

import { useState } from 'react';
import { QuickLink } from '@/data/initial-data';
import { useData } from '@/context/DataContext';

const categoryConfig = {
  site: { icon: '◉', label: 'Sites', color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' },
  repo: { icon: '◈', label: 'Repositories', color: 'bg-violet-500/10 text-violet-600 dark:text-violet-400' },
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
    <div className="fixed inset-0 modal-backdrop flex items-center justify-center z-50 p-4 animate-fade-in" onClick={onClose}>
      <div 
        className="bg-white dark:bg-zinc-900 rounded-2xl p-6 w-full max-w-md border border-zinc-200 dark:border-zinc-800 shadow-2xl shadow-black/20 animate-fade-in-scale"
        onClick={e => e.stopPropagation()}
      >
        <h3 className="text-xl font-semibold mb-6 text-zinc-900 dark:text-white">
          {link ? 'Edit Link' : 'Add Link'}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs uppercase tracking-wider font-bold text-zinc-500 mb-2">
              Label
            </label>
            <input
              type="text"
              value={label}
              onChange={e => setLabel(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              placeholder="Link name..."
              autoFocus
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-wider font-bold text-zinc-500 mb-2">
              URL
            </label>
            <input
              type="url"
              value={url}
              onChange={e => setUrl(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              placeholder="https://..."
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-wider font-bold text-zinc-500 mb-2">
              Category
            </label>
            <select
              value={category}
              onChange={e => setCategory(e.target.value as QuickLink['category'])}
              className="w-full px-4 py-3 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            >
              {Object.entries(categoryConfig).map(([key, config]) => (
                <option key={key} value={key}>{config.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs uppercase tracking-wider font-bold text-zinc-500 mb-2">
              Description (optional)
            </label>
            <input
              type="text"
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              placeholder="Brief description..."
            />
          </div>
          <div className="flex gap-3 pt-3">
            <div className="flex-1" />
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-sm font-medium text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl text-sm font-medium bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-all btn-press"
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
    <div className="max-w-5xl animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-white">Link Library</h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-500 mt-2">
            Important links and resources organized by category
          </p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-all btn-press shadow-lg shadow-zinc-900/10 dark:shadow-white/10"
        >
          <span className="text-lg">+</span>
          Add Link
        </button>
      </div>

      {/* Filter */}
      <div className="flex flex-wrap gap-2 mb-8">
        <button
          onClick={() => setFilter('all')}
          className={`text-xs font-medium px-4 py-2.5 rounded-xl transition-all duration-200 ${
            filter === 'all'
              ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 shadow-lg shadow-zinc-900/10 dark:shadow-white/10'
              : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700 hover:text-zinc-900 dark:hover:text-white'
          }`}
        >
          All <span className={filter === 'all' ? 'opacity-60' : 'opacity-40'}>({quickLinks.length})</span>
        </button>
        {Object.entries(categoryConfig).map(([key, config]) => {
          const count = quickLinks.filter(l => l.category === key).length;
          if (count === 0) return null;
          return (
            <button
              key={key}
              onClick={() => setFilter(key as QuickLink['category'])}
              className={`text-xs font-medium px-4 py-2.5 rounded-xl transition-all duration-200 inline-flex items-center gap-2 ${
                filter === key
                  ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 shadow-lg shadow-zinc-900/10 dark:shadow-white/10'
                  : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700 hover:text-zinc-900 dark:hover:text-white'
              }`}
            >
              <span>{config.icon}</span>
              {config.label}
              <span className={filter === key ? 'opacity-60' : 'opacity-40'}>({count})</span>
            </button>
          );
        })}
      </div>

      {/* Links Grid */}
      {Object.entries(groupedLinks).map(([category, links], categoryIndex) => {
        const config = categoryConfig[category as keyof typeof categoryConfig];
        return (
          <div key={category} className="mb-10 animate-slide-up" style={{ animationDelay: `${categoryIndex * 0.1}s` }}>
            <h2 className="text-sm font-semibold text-zinc-900 dark:text-white mb-4 flex items-center gap-3">
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-lg ${config.color}`}>
                {config.icon}
              </div>
              {config.label}
              <span className="text-xs font-bold text-zinc-400 dark:text-zinc-600">
                ({links.length})
              </span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 stagger-children">
              {links.map(link => (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative p-5 rounded-2xl bg-white dark:bg-zinc-900/50 border border-zinc-200/80 dark:border-zinc-800/80 hover:border-indigo-500/30 dark:hover:border-indigo-500/30 transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/5 dark:hover:shadow-indigo-500/10 hover-lift"
                >
                  {/* Gradient on hover */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                  
                  <div className="relative flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-zinc-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors truncate">
                        {link.label}
                      </p>
                      {link.description && (
                        <p className="text-xs text-zinc-500 dark:text-zinc-500 mt-1.5 line-clamp-2 leading-relaxed">
                          {link.description}
                        </p>
                      )}
                      <p className="text-xs text-zinc-400 dark:text-zinc-600 mt-2 truncate font-medium">
                        {link.url.replace(/^https?:\/\//, '')}
                      </p>
                    </div>
                    <div className="ml-4 flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          deleteQuickLink(link.id);
                        }}
                        className="opacity-0 group-hover:opacity-100 p-2 rounded-lg text-zinc-400 hover:text-red-500 hover:bg-red-500/10 transition-all"
                        title="Delete link"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                      <span className="text-zinc-400 dark:text-zinc-600 opacity-0 group-hover:opacity-100 transition-all duration-200 transform group-hover:translate-x-0.5">
                        ↗
                      </span>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        );
      })}

      {filteredLinks.length === 0 && (
        <div className="text-center py-16">
          <div className="w-16 h-16 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🔗</span>
          </div>
          <p className="text-sm text-zinc-500 dark:text-zinc-500 font-medium mb-1">
            No links found
          </p>
          <p className="text-xs text-zinc-400 dark:text-zinc-600">
            Add your first link to get started
          </p>
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
