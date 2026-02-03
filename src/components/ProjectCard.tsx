'use client';

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
      <div className="flex items-center justify-between p-3 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-emerald-500" />
          <span className="text-sm font-medium text-zinc-900 dark:text-white">
            {project.name}
          </span>
        </div>
        <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${statusStyles[project.status].bg}`}>
          {statusStyles[project.status].label}
        </span>
      </div>
    );
  }

  return (
    <div className="p-5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-base font-semibold text-zinc-900 dark:text-white">
          {project.name}
        </h3>
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
        {project.githubUrl && (
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs px-3 py-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700 hover:text-zinc-900 dark:hover:text-white transition-colors"
          >
            GitHub →
          </a>
        )}
        {project.vercelUrl && (
          <a
            href={project.vercelUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs px-3 py-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700 hover:text-zinc-900 dark:hover:text-white transition-colors"
          >
            Live Site →
          </a>
        )}
      </div>
    </div>
  );
}
