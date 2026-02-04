'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useData } from '@/context/DataContext';
import { useAuth } from '@/context/AuthContext';
import SearchModal from './SearchModal';

const navItems = [
  { href: '/', label: 'Dashboard', icon: '⊞', description: 'Overview' },
  { href: '/projects', label: 'Projects', icon: '⬡', description: 'Track work' },
  { href: '/tasks', label: 'Tasks', icon: '☰', description: 'Kanban board' },
  { href: '/documents', label: 'Documents', icon: '◫', description: 'Notes & docs' },
  { href: '/links', label: 'Links', icon: '↗', description: 'Quick access' },
  { href: '/updates', label: 'Updates', icon: '●', description: 'Activity feed' },
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
      <aside className={`w-72 h-screen fixed left-0 top-0 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-md border-r border-zinc-200 dark:border-zinc-800 flex flex-col z-40 ${mounted ? 'animate-slide-in' : 'opacity-0'}`}>
        {/* Logo */}
        <div className="p-6 pb-5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-sky-500 to-pink-400 flex items-center justify-center shadow-md">
              <span className="text-white font-semibold text-base">U</span>
            </div>
            <div>
              <h1 className="text-base font-semibold tracking-tight text-zinc-900 dark:text-white">
                Umbra<span className="text-sky-600 dark:text-sky-400">HQ</span>
              </h1>
              <p className="text-[10px] text-zinc-500 dark:text-zinc-600 font-medium uppercase tracking-wider">
                Workspace
              </p>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="px-4 pb-4">
          <button
            onClick={() => setSearchOpen(true)}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm text-zinc-500 dark:text-zinc-500 bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-150 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 transition-colors duration-150 group"
          >
            <svg className="w-4 h-4 text-zinc-400 group-hover:text-zinc-500 dark:group-hover:text-zinc-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <span className="flex-1 text-left text-zinc-400">Search...</span>
            <span className="text-[10px] font-medium bg-zinc-200 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-500 px-1.5 py-0.5 rounded">
              ⌘K
            </span>
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 overflow-y-auto">
          <div className="space-y-0.5 stagger-children">
            {navItems.map((item, index) => {
              const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`group flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm transition-colors duration-150 relative ${
                    isActive
                      ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900'
                      : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900 hover:text-zinc-900 dark:hover:text-white'
                  }`}
                  style={{ animationDelay: `${index * 0.03}s` }}
                >
                  <span className="text-base opacity-70">
                    {item.icon}
                  </span>
                  <div className="flex-1 min-w-0">
                    <span className="font-medium">{item.label}</span>
                  </div>
                  {item.label === 'Projects' && activeProjects > 0 && (
                    <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded transition-colors ${
                      isActive 
                        ? 'bg-white/20 dark:bg-zinc-900/20' 
                        : 'bg-sky-100 dark:bg-sky-500/15 text-sky-600 dark:text-sky-400'
                    }`}>
                      {activeProjects}
                    </span>
                  )}
                  {item.label === 'Tasks' && activeTasks > 0 && (
                    <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded transition-colors ${
                      isActive 
                        ? 'bg-white/20 dark:bg-zinc-900/20' 
                        : 'bg-pink-100 dark:bg-pink-500/15 text-pink-600 dark:text-pink-400'
                    }`}>
                      {activeTasks}
                    </span>
                  )}
                  {item.label === 'Updates' && updates.length > 0 && (
                    <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded transition-colors ${
                      isActive 
                        ? 'bg-white/20 dark:bg-zinc-900/20' 
                        : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400'
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
        <div className="p-4 border-t border-zinc-200 dark:border-zinc-800">
          <button
            onClick={toggleDarkMode}
            className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors duration-150"
          >
            <div className="flex items-center gap-3">
              <span className="text-sm opacity-70">
                {darkMode ? '◐' : '○'}
              </span>
              <span className="font-medium">{darkMode ? 'Dark' : 'Light'}</span>
            </div>
            <div className={`w-9 h-5 rounded-full p-0.5 transition-colors ${darkMode ? 'bg-sky-500' : 'bg-zinc-300'}`}>
              <div className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-150 ${darkMode ? 'translate-x-4' : 'translate-x-0'}`} />
            </div>
          </button>
          
          {/* User info and logout */}
          {user && (
            <div className="mt-3 px-3.5 py-2.5 bg-zinc-100 dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800">
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-md bg-gradient-to-br from-sky-500 to-pink-400 flex items-center justify-center text-white text-xs font-medium">
                  {user.email?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-zinc-700 dark:text-zinc-300 truncate">
                    {user.email}
                  </p>
                </div>
                <button
                  onClick={handleSignOut}
                  className="p-1.5 rounded text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors"
                  title="Sign out"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </button>
              </div>
            </div>
          )}
          
          <div className="mt-4 px-3.5">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span className="text-[11px] font-medium text-zinc-500 dark:text-zinc-500">
                Connected
              </span>
            </div>
            <div className="text-[10px] text-zinc-400 dark:text-zinc-600 mt-1 uppercase tracking-wider">
              v2.0
            </div>
          </div>
        </div>
      </aside>

      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
