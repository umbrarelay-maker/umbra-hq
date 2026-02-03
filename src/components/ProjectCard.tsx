'use client';

import Link from 'next/link';
import { Project } from '@/data/initial-data';

interface ProjectCardProps {
  project: Project;
  compact?: boolean;
}

const statusStyles: Record<Project['status'], { bg: string; label: string }> = {
  active: { bg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400', label: 'Active' },
  completed: { bg: 'bg-blue-500/10 text-blue-600 dark:text-blue-400', label: 'Completed' },
  'on-hold': { bg: 'bg-amber-500/10 text-amber-600 dark:text-amber-400', label: 'On Hold' },
};

export default function ProjectCard({ project, compact }: ProjectCardProps) {
  if (compact) {
    return (
      <Link 
        href={`/projects/${project.id}`}
        className="flex items-center justify-between p-3 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors group"
      >
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-emerald-500" />
          <span className="text-sm font-medium text-zinc-900 dark:text-white group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition-colors">
            {project.name}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${statusStyles[project.status].bg}`}>
            {statusStyles[project.status].label}
          </span>
          <span className="text-zinc-400 dark:text-zinc-600 text-xs opacity-0 group-hover:opacity-100 transition-opacity">→</span>
        </div>
      </Link>
    );
  }

  return (
    <div className="p-5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors group">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <Link href={`/projects/${project.id}`} className="text-base font-semibold text-zinc-900 dark:text-white hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors">
          {project.name}
        </Link>
        <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${statusStyles[project.status].bg}`}>
          {statusStyles[project.status].label}
        </span>
      </div>

      {/* Description */}
      <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4 leading-relaxed">
        {project.description}
      </p>

      {/* Notes */}
      {project.notes && (
        <p className="text-xs text-zinc-500 dark:text-zinc-500 mb-4 italic">
          "{project.notes}"
        </p>
      )}

      {/* Links */}
      <div className="flex flex-wrap gap-2">
        <Link
          href={`/projects/${project.id}`}
          className="text-xs px-3 py-1.5 rounded-lg bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-colors"
        >
          Details →
        </Link>
        {project.githubUrl && (
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs px-3 py-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700 hover:text-zinc-900 dark:hover:text-white transition-colors"
          >
            GitHub ↗
          </a>
        )}
        {project.vercelUrl && (
          <a
            href={project.vercelUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs px-3 py-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700 hover:text-zinc-900 dark:hover:text-white transition-colors"
          >
            Live ↗
          </a>
        )}
      </div>
    </div>
  );
}
