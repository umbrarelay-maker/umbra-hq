'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useData } from '@/context/DataContext';

const navItems = [
  { href: '/', label: 'Dashboard', icon: '◉' },
  { href: '/projects', label: 'Projects', icon: '◈' },
  { href: '/documents', label: 'Documents', icon: '◇' },
  { href: '/updates', label: 'Updates', icon: '◆' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { darkMode, toggleDarkMode, projects, updates } = useData();
  
  const activeProjects = projects.filter(p => p.status === 'active').length;

  return (
    <aside className="w-64 h-screen fixed left-0 top-0 bg-white dark:bg-zinc-950 border-r border-zinc-200 dark:border-zinc-800 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-zinc-200 dark:border-zinc-800">
        <h1 className="text-xl font-semibold tracking-tight text-zinc-900 dark:text-white">
          Umbra<span className="text-zinc-400 dark:text-zinc-500">HQ</span>
        </h1>
        <p className="text-xs text-zinc-500 dark:text-zinc-600 mt-1">
          Collaboration Hub
        </p>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4">
        <ul className="space-y-1">
          {navItems.map(item => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                  pathname === item.href
                    ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white font-medium'
                    : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900 hover:text-zinc-900 dark:hover:text-white'
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                {item.label}
                {item.label === 'Projects' && (
                  <span className="ml-auto text-xs bg-zinc-200 dark:bg-zinc-700 px-2 py-0.5 rounded-full">
                    {activeProjects}
                  </span>
                )}
                {item.label === 'Updates' && (
                  <span className="ml-auto text-xs bg-zinc-200 dark:bg-zinc-700 px-2 py-0.5 rounded-full">
                    {updates.length}
                  </span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-zinc-200 dark:border-zinc-800">
        <button
          onClick={toggleDarkMode}
          className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
        >
          <span>{darkMode ? '◐ Dark Mode' : '○ Light Mode'}</span>
          <span className="text-xs">{darkMode ? 'On' : 'Off'}</span>
        </button>
        <div className="mt-3 px-3 text-xs text-zinc-400 dark:text-zinc-600">
          Joe × Umbra
        </div>
      </div>
    </aside>
  );
}
