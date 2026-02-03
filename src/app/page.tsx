'use client';

import { useData } from '@/context/DataContext';
import StatsCard from '@/components/StatsCard';
import UpdateFeed from '@/components/UpdateFeed';
import ProjectCard from '@/components/ProjectCard';
import QuickLinks from '@/components/QuickLinks';

export default function Dashboard() {
  const { projects, documents, updates, quickLinks } = useData();
  
  const activeProjects = projects.filter(p => p.status === 'active').length;
  const completedProjects = projects.filter(p => p.status === 'completed').length;

  return (
    <div className="max-w-6xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-500 mt-1">
          Welcome back. Here's what's happening.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <StatsCard label="Active Projects" value={activeProjects} icon="◈" accent />
        <StatsCard label="Completed" value={completedProjects} icon="✓" />
        <StatsCard label="Documents" value={documents.length} icon="◇" />
        <StatsCard label="Updates" value={updates.length} icon="◆" />
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-3 gap-6">
        {/* Recent Updates */}
        <div className="col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Recent Updates</h2>
            <a href="/updates" className="text-xs text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors">
              View all →
            </a>
          </div>
          <UpdateFeed updates={updates} limit={5} />
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Active Projects */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Active Projects</h2>
              <a href="/projects" className="text-xs text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors">
                View all →
              </a>
            </div>
            <div className="space-y-2">
              {projects
                .filter(p => p.status === 'active')
                .slice(0, 5)
                .map(project => (
                  <ProjectCard key={project.id} project={project} compact />
                ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Quick Links</h2>
            <div className="p-4 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
              <QuickLinks links={quickLinks} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
