'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useData, SearchResults } from '@/context/DataContext';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const router = useRouter();
  const { search } = useData();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResults | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
      setQuery('');
      setResults(null);
      setSelectedIndex(0);
    }
  }, [isOpen]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.trim()) {
        setResults(search(query));
        setSelectedIndex(0);
      } else {
        setResults(null);
      }
    }, 100);
    return () => clearTimeout(timer);
  }, [query, search]);

  // Handle escape key and keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleNavigate = (path: string) => {
    router.push(path);
    onClose();
  };

  const totalResults = results
    ? results.projects.length +
      results.documents.length +
      results.updates.length +
      results.tasks.length +
      results.links.length
    : 0;

  return (
    <div 
      className="fixed inset-0 modal-backdrop flex items-start justify-center z-50 pt-[10vh] px-4 animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="bg-white dark:bg-zinc-900 rounded-2xl w-full max-w-2xl border border-zinc-200 dark:border-zinc-800 shadow-2xl shadow-black/20 overflow-hidden animate-fade-in-scale"
        onClick={e => e.stopPropagation()}
      >
        {/* Search Input */}
        <div className="flex items-center gap-4 p-5 border-b border-zinc-200 dark:border-zinc-800">
          <svg className="w-5 h-5 text-zinc-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search projects, documents, tasks, links..."
            className="flex-1 bg-transparent text-lg focus:outline-none placeholder-zinc-400 dark:placeholder-zinc-600"
          />
          <button
            onClick={onClose}
            className="text-xs font-medium px-2.5 py-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-500 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
          >
            ESC
          </button>
        </div>

        {/* Results */}
        <div className="max-h-[60vh] overflow-y-auto">
          {!query.trim() ? (
            <div className="p-10 text-center">
              <div className="w-16 h-16 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🔍</span>
              </div>
              <p className="text-sm text-zinc-500 dark:text-zinc-500 font-medium">
                Start typing to search across all content
              </p>
              <p className="text-xs text-zinc-400 dark:text-zinc-600 mt-2">
                Projects, documents, tasks, updates, and links
              </p>
            </div>
          ) : results && totalResults > 0 ? (
            <div className="p-3">
              {/* Projects */}
              {results.projects.length > 0 && (
                <div className="mb-3">
                  <h3 className="text-[10px] uppercase tracking-wider font-bold text-zinc-500 px-3 py-2">
                    Projects
                    <span className="ml-2 text-zinc-400">({results.projects.length})</span>
                  </h3>
                  <div className="space-y-1">
                    {results.projects.map(project => (
                      <button
                        key={project.id}
                        onClick={() => handleNavigate(`/projects/${project.id}`)}
                        className="w-full text-left px-4 py-3 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all duration-150 group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-sky-500/10 flex items-center justify-center text-sky-600 dark:text-sky-400 group-hover:scale-110 transition-transform">
                            ◈
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-zinc-900 dark:text-white truncate">
                              {project.name}
                            </p>
                            <p className="text-xs text-zinc-500 dark:text-zinc-500 truncate">
                              {project.description}
                            </p>
                          </div>
                          <span className="text-zinc-400 opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Documents */}
              {results.documents.length > 0 && (
                <div className="mb-3">
                  <h3 className="text-[10px] uppercase tracking-wider font-bold text-zinc-500 px-3 py-2">
                    Documents
                    <span className="ml-2 text-zinc-400">({results.documents.length})</span>
                  </h3>
                  <div className="space-y-1">
                    {results.documents.map(doc => (
                      <button
                        key={doc.id}
                        onClick={() => handleNavigate(`/documents/${doc.id}`)}
                        className="w-full text-left px-4 py-3 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all duration-150 group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform">
                            ◇
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-zinc-900 dark:text-white truncate">
                              {doc.title}
                            </p>
                            <p className="text-xs text-zinc-500 dark:text-zinc-500 truncate">
                              {doc.description}
                            </p>
                          </div>
                          <span className="text-zinc-400 opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Tasks */}
              {results.tasks.length > 0 && (
                <div className="mb-3">
                  <h3 className="text-[10px] uppercase tracking-wider font-bold text-zinc-500 px-3 py-2">
                    Tasks
                    <span className="ml-2 text-zinc-400">({results.tasks.length})</span>
                  </h3>
                  <div className="space-y-1">
                    {results.tasks.map(task => (
                      <button
                        key={task.id}
                        onClick={() => handleNavigate('/tasks')}
                        className="w-full text-left px-4 py-3 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all duration-150 group"
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform ${
                            task.status === 'done' 
                              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' 
                              : task.status === 'in-progress'
                              ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                              : 'bg-zinc-500/10 text-zinc-600 dark:text-zinc-400'
                          }`}>
                            {task.status === 'done' ? '●' : task.status === 'in-progress' ? '◐' : '○'}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-zinc-900 dark:text-white truncate">
                              {task.title}
                            </p>
                            {task.description && (
                              <p className="text-xs text-zinc-500 dark:text-zinc-500 truncate">
                                {task.description}
                              </p>
                            )}
                          </div>
                          <span className="text-zinc-400 opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Updates */}
              {results.updates.length > 0 && (
                <div className="mb-3">
                  <h3 className="text-[10px] uppercase tracking-wider font-bold text-zinc-500 px-3 py-2">
                    Updates
                    <span className="ml-2 text-zinc-400">({results.updates.length})</span>
                  </h3>
                  <div className="space-y-1">
                    {results.updates.slice(0, 5).map(update => (
                      <button
                        key={update.id}
                        onClick={() => handleNavigate('/updates')}
                        className="w-full text-left px-4 py-3 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all duration-150 group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-pink-500/10 flex items-center justify-center text-pink-600 dark:text-pink-400 group-hover:scale-110 transition-transform">
                            ◆
                          </div>
                          <p className="flex-1 text-sm text-zinc-600 dark:text-zinc-400 truncate">
                            {update.content}
                          </p>
                          <span className="text-zinc-400 opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Links */}
              {results.links.length > 0 && (
                <div className="mb-3">
                  <h3 className="text-[10px] uppercase tracking-wider font-bold text-zinc-500 px-3 py-2">
                    Links
                    <span className="ml-2 text-zinc-400">({results.links.length})</span>
                  </h3>
                  <div className="space-y-1">
                    {results.links.map(link => (
                      <a
                        key={link.id}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={onClose}
                        className="block px-4 py-3 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all duration-150 group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
                            ↗
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-zinc-900 dark:text-white truncate">
                              {link.label}
                            </p>
                            <p className="text-xs text-zinc-500 dark:text-zinc-500 truncate">
                              {link.url}
                            </p>
                          </div>
                          <span className="text-zinc-400 opacity-0 group-hover:opacity-100 transition-opacity">↗</span>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : results && totalResults === 0 ? (
            <div className="p-10 text-center">
              <div className="w-16 h-16 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🤷</span>
              </div>
              <p className="text-sm text-zinc-500 dark:text-zinc-500 font-medium">
                No results found for "{query}"
              </p>
              <p className="text-xs text-zinc-400 dark:text-zinc-600 mt-2">
                Try a different search term
              </p>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
