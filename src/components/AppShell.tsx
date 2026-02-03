'use client';

import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Sidebar from './Sidebar';

const publicPaths = ['/login', '/auth/callback', '/auth/reset-password'];

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user } = useAuth();
  
  const isPublicPath = publicPaths.some(path => pathname.startsWith(path));
  const showSidebar = user && !isPublicPath;

  if (!showSidebar) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 ml-72 p-10">
        <div className="animate-fade-in">
          {children}
        </div>
      </main>
    </div>
  );
}
