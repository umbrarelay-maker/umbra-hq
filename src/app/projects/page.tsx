'use client';

import { useState } from 'react';
import { useData } from '@/context/DataContext';
import ProjectCard from '@/components/ProjectCard';
import { Project } from '@/data/initial-data';

export default function ProjectsPage() {
  const { projects } = useData();
  const [filter, setFilter] = useState<Project['status'] | 'all'>('all');
  
  const filteredProjects = filter === 'all' 
    ? projects 
    : projects.filter(p => p.status === filter);

  const statusCounts = {
    all: projects.length,
    active: projects.filter(p => p.status === 'active').length,
    completed: projects.filter(p => p.status === 'completed').length,
    'on-hold': projects.filter(p => p.status === 'on-hold').length,
  };

  return (
    <div className="max-w-5xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight">Projects</h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-500 mt-1">
          Track and manage all ongoing projects.
        </p>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-6">
        {(['all', 'active', 'completed', 'on-hold'] as const).map(status => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`text-xs px-4 py-2 rounded-lg transition-colors ${
              filter === status
                ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-medium'
                : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700'
            }`}
          >
            {status === 'all' ? 'All' : status === 'on-hold' ? 'On Hold' : status.charAt(0).toUpperCase() + status.slice(1)}
            <span className="ml-2 opacity-60">{statusCounts[status]}</span>
          </button>
        ))}
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-2 gap-4">
        {filteredProjects.map(project => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>

      {filteredProjects.length === 0 && (
        <div className="text-center py-12 text-zinc-500 dark:text-zinc-500">
          No projects match this filter.
        </div>
      )}
    </div>
  );
}
