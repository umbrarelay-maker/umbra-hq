'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useData } from '@/context/DataContext';
import { useAuth } from '@/context/AuthContext';
import SearchModal from './SearchModal';

const navItems = [
  { href: '/', label: 'Dashboard', icon: '◉', description: 'Overview' },
  { href: '/projects', label: 'Projects', icon: '◈', description: 'Track work' },
  { href: '/tasks', label: 'Tasks', icon: '◐', description: 'Kanban board' },
  { href: '/documents', label: 'Documents', icon: '◇', description: 'Notes & docs' },
  { href: '/links', label: 'Links', icon: '↗', description: 'Quick access' },
  { href: '/updates', label: 'Updates', icon: '◆', description: 'Activity feed' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { darkMode, toggleDarkMode, projects, tasks, updates } = useData();
  const { user, signOut } = useAuth();
  const [searchOpen, setSearchOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  const activeProjects = projects.filter(p => p.status === 'active').length;
  const activeTasks = tasks.filter(t => t.status !== 'done').length;

  useEffect(() => {
    setMounted(true);
  }, []);

  // Keyboard shortcut for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <>
      <aside className={`w-72 h-screen fixed left-0 top-0 bg-white/80 dark:bg-zinc-950/90 backdrop-blur-xl border-r border-zinc-200/80 dark:border-zinc-800/80 flex flex-col z-40 ${mounted ? 'animate-slide-in' : 'opacity-0'}`}>
        {/* Logo */}
        <div className="p-6 pb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-400 to-pink-500 flex items-center justify-center shadow-lg shadow-sky-500/20">
              <span className="text-white font-bold text-lg">U</span>
            </div>
            <div>
              <h1 className="text-lg font-semibold tracking-tight text-zinc-900 dark:text-white">
                Umbra<span className="text-sky-500 dark:text-sky-400">HQ</span>
              </h1>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-600 font-medium">
                AI Workspace
              </p>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="px-4 pb-4">
          <button
            onClick={() => setSearchOpen(true)}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-zinc-500 dark:text-zinc-500 bg-zinc-100/80 dark:bg-zinc-900/80 hover:bg-zinc-200/80 dark:hover:bg-zinc-800/80 border border-zinc-200/50 dark:border-zinc-800/50 transition-all duration-200 hover:border-zinc-300 dark:hover:border-zinc-700 group"
          >
            <svg className="w-4 h-4 text-zinc-400 group-hover:text-zinc-500 dark:group-hover:text-zinc-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <span className="flex-1 text-left">Search...</span>
            <span className="text-[10px] font-medium bg-zinc-200 dark:bg-zinc-700/50 text-zinc-500 dark:text-zinc-500 px-1.5 py-0.5 rounded-md">
              ⌘K
            </span>
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 overflow-y-auto">
          <div className="space-y-1 stagger-children">
            {navItems.map((item, index) => {
              const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`group flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all duration-200 relative ${
                    isActive
                      ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 shadow-lg shadow-zinc-900/10 dark:shadow-white/10'
                      : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900 hover:text-zinc-900 dark:hover:text-white'
                  }`}
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <span className={`text-lg transition-transform duration-200 ${!isActive && 'group-hover:scale-110'}`}>
                    {item.icon}
                  </span>
                  <div className="flex-1 min-w-0">
                    <span className="font-medium">{item.label}</span>
                  </div>
                  {item.label === 'Projects' && activeProjects > 0 && (
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full transition-colors ${
                      isActive 
                        ? 'bg-white/20 dark:bg-zinc-900/20' 
                        : 'bg-sky-500/10 text-sky-600 dark:text-sky-400'
                    }`}>
                      {activeProjects}
                    </span>
                  )}
                  {item.label === 'Tasks' && activeTasks > 0 && (
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full transition-colors ${
                      isActive 
                        ? 'bg-white/20 dark:bg-zinc-900/20' 
                        : 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                    }`}>
                      {activeTasks}
                    </span>
                  )}
                  {item.label === 'Updates' && updates.length > 0 && (
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full transition-colors ${
                      isActive 
                        ? 'bg-white/20 dark:bg-zinc-900/20' 
                        : 'bg-zinc-200 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-400'
                    }`}>
                      {updates.length}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-zinc-200/80 dark:border-zinc-800/80">
          <button
            onClick={toggleDarkMode}
            className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-all duration-200 group"
          >
            <div className="flex items-center gap-3">
              <span className="text-lg transition-transform duration-200 group-hover:rotate-12">
                {darkMode ? '🌙' : '☀️'}
              </span>
              <span className="font-medium">{darkMode ? 'Dark Mode' : 'Light Mode'}</span>
            </div>
            <div className={`w-10 h-6 rounded-full p-0.5 transition-colors ${darkMode ? 'bg-sky-500' : 'bg-zinc-300'}`}>
              <div className={`w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-200 ${darkMode ? 'translate-x-4' : 'translate-x-0'}`} />
            </div>
          </button>
          
          {/* User info and logout */}
          {user && (
            <div className="mt-3 px-4 py-3 bg-zinc-100/50 dark:bg-zinc-900/50 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-sky-400 to-pink-500 flex items-center justify-center text-white text-xs font-medium">
                  {user.email?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-zinc-700 dark:text-zinc-300 truncate">
                    {user.email}
                  </p>
                </div>
                <button
                  onClick={handleSignOut}
                  className="p-1.5 rounded-lg text-zinc-400 hover:text-red-500 hover:bg-red-500/10 transition-colors"
                  title="Sign out"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </button>
              </div>
            </div>
          )}
          
          <div className="mt-4 px-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-medium text-zinc-500 dark:text-zinc-500">
                Joe × Umbra
              </span>
            </div>
            <div className="text-[10px] text-zinc-400 dark:text-zinc-600 mt-1.5 font-medium">
              v2.0 — Premium Edition
            </div>
          </div>
        </div>
      </aside>

      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
