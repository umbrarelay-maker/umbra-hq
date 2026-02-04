'use client';

import { useData } from '@/context/DataContext';
import StatsCard from '@/components/StatsCard';
import UpdateFeed from '@/components/UpdateFeed';
import ProjectCard from '@/components/ProjectCard';
import QuickLinks from '@/components/QuickLinks';
import DailyBriefing from '@/components/DailyBriefing';
import BlockersPanel from '@/components/BlockersPanel';

export default function Dashboard() {
  const { projects, documents, updates, quickLinks, blockers, briefing } = useData();
  
  const activeProjects = projects.filter(p => p.status === 'active').length;
  const completedProjects = projects.filter(p => p.status === 'completed').length;
  const activeBlockers = blockers.filter(b => !b.resolved).length;

  return (
    <div className="max-w-6xl space-y-8">
      {/* Header */}
      <div className="animate-fade-in">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-sm font-medium text-sky-500 dark:text-sky-400 mb-1">
              Welcome back
            </p>
            <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-white">
              Dashboard
            </h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-500 mt-2 max-w-md">
              Here's what's happening with your projects today.
            </p>
          </div>
          <div className="hidden md:flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-500">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Systems operational
          </div>
        </div>
      </div>

      {/* Blockers Panel - Always at top, impossible to miss */}
      <div className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
        <BlockersPanel blockers={blockers} />
      </div>

      {/* Daily Briefing */}
      <div className="animate-slide-up" style={{ animationDelay: '0.15s' }}>
        <DailyBriefing briefing={briefing} />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 stagger-children">
        <StatsCard label="Active Projects" value={activeProjects} icon="◈" accent />
        <StatsCard label="Completed" value={completedProjects} icon="✓" />
        <StatsCard label="Documents" value={documents.length} icon="◇" />
        <StatsCard label="Updates" value={updates.length} icon="◆" />
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Updates */}
        <div className="lg:col-span-2 animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">Recent Updates</h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-500 mt-0.5">Latest activity across all projects</p>
            </div>
            <a href="/updates" className="text-xs font-medium text-sky-500 dark:text-sky-400 hover:text-sky-600 dark:hover:text-sky-300 transition-colors flex items-center gap-1 group">
              View all
              <span className="transition-transform group-hover:translate-x-0.5">→</span>
            </a>
          </div>
          <UpdateFeed updates={updates} limit={5} />
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          {/* Active Projects */}
          <div className="animate-slide-up" style={{ animationDelay: '0.25s' }}>
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">Active Projects</h2>
                <p className="text-xs text-zinc-500 dark:text-zinc-500 mt-0.5">Your current work</p>
              </div>
              <a href="/projects" className="text-xs font-medium text-sky-500 dark:text-sky-400 hover:text-sky-600 dark:hover:text-sky-300 transition-colors flex items-center gap-1 group">
                View all
                <span className="transition-transform group-hover:translate-x-0.5">→</span>
              </a>
            </div>
            <div className="space-y-3 stagger-children">
              {projects
                .filter(p => p.status === 'active')
                .slice(0, 5)
                .map(project => (
                  <ProjectCard key={project.id} project={project} compact />
                ))}
              {projects.filter(p => p.status === 'active').length === 0 && (
                <div className="text-center py-8 text-sm text-zinc-500 dark:text-zinc-500">
                  No active projects
                </div>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div className="animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-white mb-5">Quick Links</h2>
            <div className="p-4 rounded-lg bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800">
              <QuickLinks links={quickLinks} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
