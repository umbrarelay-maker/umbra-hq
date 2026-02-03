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
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
      setQuery('');
      setResults(null);
    }
  }, [isOpen]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.trim()) {
        setResults(search(query));
      } else {
        setResults(null);
      }
    }, 150);
    return () => clearTimeout(timer);
  }, [query, search]);

  // Handle escape key
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
    <div className="fixed inset-0 bg-black/50 flex items-start justify-center z-50 pt-24 px-4">
      <div 
        className="bg-white dark:bg-zinc-900 rounded-2xl w-full max-w-2xl border border-zinc-200 dark:border-zinc-800 shadow-2xl overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Search Input */}
        <div className="flex items-center gap-3 p-4 border-b border-zinc-200 dark:border-zinc-800">
          <span className="text-xl text-zinc-400">◎</span>
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
            className="text-xs px-2 py-1 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-500 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
          >
            ESC
          </button>
        </div>

        {/* Results */}
        <div className="max-h-[60vh] overflow-y-auto">
          {!query.trim() ? (
            <div className="p-8 text-center text-zinc-400 dark:text-zinc-600">
              <p className="text-sm">Start typing to search across all content</p>
              <p className="text-xs mt-2">Projects, documents, tasks, updates, and links</p>
            </div>
          ) : results && totalResults > 0 ? (
            <div className="p-2">
              {/* Projects */}
              {results.projects.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-xs uppercase tracking-wider text-zinc-500 px-3 py-2">
                    Projects ({results.projects.length})
                  </h3>
                  {results.projects.map(project => (
                    <button
                      key={project.id}
                      onClick={() => handleNavigate(`/projects/${project.id}`)}
                      className="w-full text-left px-3 py-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-lg">◈</span>
                        <div>
                          <p className="text-sm font-medium text-zinc-900 dark:text-white">
                            {project.name}
                          </p>
                          <p className="text-xs text-zinc-500 dark:text-zinc-500 line-clamp-1">
                            {project.description}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* Documents */}
              {results.documents.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-xs uppercase tracking-wider text-zinc-500 px-3 py-2">
                    Documents ({results.documents.length})
                  </h3>
                  {results.documents.map(doc => (
                    <button
                      key={doc.id}
                      onClick={() => handleNavigate(`/documents/${doc.id}`)}
                      className="w-full text-left px-3 py-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-lg">◇</span>
                        <div>
                          <p className="text-sm font-medium text-zinc-900 dark:text-white">
                            {doc.title}
                          </p>
                          <p className="text-xs text-zinc-500 dark:text-zinc-500 line-clamp-1">
                            {doc.description}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* Tasks */}
              {results.tasks.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-xs uppercase tracking-wider text-zinc-500 px-3 py-2">
                    Tasks ({results.tasks.length})
                  </h3>
                  {results.tasks.map(task => (
                    <button
                      key={task.id}
                      onClick={() => handleNavigate('/tasks')}
                      className="w-full text-left px-3 py-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-lg">
                          {task.status === 'done' ? '●' : task.status === 'in-progress' ? '◐' : '○'}
                        </span>
                        <div>
                          <p className="text-sm font-medium text-zinc-900 dark:text-white">
                            {task.title}
                          </p>
                          {task.description && (
                            <p className="text-xs text-zinc-500 dark:text-zinc-500 line-clamp-1">
                              {task.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* Updates */}
              {results.updates.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-xs uppercase tracking-wider text-zinc-500 px-3 py-2">
                    Updates ({results.updates.length})
                  </h3>
                  {results.updates.slice(0, 5).map(update => (
                    <button
                      key={update.id}
                      onClick={() => handleNavigate('/updates')}
                      className="w-full text-left px-3 py-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-lg">◆</span>
                        <p className="text-sm text-zinc-600 dark:text-zinc-400 line-clamp-1">
                          {update.content}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* Links */}
              {results.links.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-xs uppercase tracking-wider text-zinc-500 px-3 py-2">
                    Links ({results.links.length})
                  </h3>
                  {results.links.map(link => (
                    <a
                      key={link.id}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={onClose}
                      className="block px-3 py-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-lg">↗</span>
                        <div>
                          <p className="text-sm font-medium text-zinc-900 dark:text-white">
                            {link.label}
                          </p>
                          <p className="text-xs text-zinc-500 dark:text-zinc-500">
                            {link.url}
                          </p>
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              )}
            </div>
          ) : results && totalResults === 0 ? (
            <div className="p-8 text-center text-zinc-400 dark:text-zinc-600">
              <p className="text-sm">No results found for "{query}"</p>
              <p className="text-xs mt-2">Try a different search term</p>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
