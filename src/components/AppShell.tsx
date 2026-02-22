'use client';

import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useState } from 'react';
import Sidebar from './Sidebar';

const publicPaths = ['/login', '/auth/callback', '/auth/reset-password'];

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user } = useAuth();

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const isPublicPath = publicPaths.some(path => pathname.startsWith(path));
  const showSidebar = user && !isPublicPath;

  if (!showSidebar) {
    return <>{children}</>;
  }

  // Sidebar is fixed-position; content needs left margin equal to sidebar width.
  const desktopOffset = sidebarCollapsed ? 'md:ml-16' : 'md:ml-72';

  return (
    <div className="flex min-h-screen">
      <Sidebar collapsed={sidebarCollapsed} onCollapsedChange={setSidebarCollapsed} />
      <main className={`flex-1 ${desktopOffset} p-6 pt-16 md:pt-10 md:p-10 transition-all duration-200`}>
        <div className="animate-fade-in">{children}</div>
      </main>
    </div>
  );
}
