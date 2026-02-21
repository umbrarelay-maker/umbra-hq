'use client';

import Link from 'next/link';
import { Project } from '@/data/initial-data';

interface ProjectCardProps {
  project: Project;
  compact?: boolean;
}

const statusStyles: Record<Project['status'], { bg: string; dot: string; label: string }> = {
  planning: {
    bg: 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400',
    dot: 'bg-zinc-500',
    label: 'Planning'
  },
  active: { 
    bg: 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400', 
    dot: 'bg-emerald-500',
    label: 'Active' 
  },
  completed: { 
    bg: 'bg-sky-50 dark:bg-sky-500/10 text-sky-600 dark:text-sky-400', 
    dot: 'bg-sky-500',
    label: 'Completed' 
  },
  'on-hold': { 
    bg: 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400', 
    dot: 'bg-amber-500',
    label: 'On Hold' 
  },
};

export default function ProjectCard({ project, compact }: ProjectCardProps) {
  const status = statusStyles[project.status];

  if (compact) {
    return (
      <Link 
        href={`/projects/${project.id}`}
        className="group flex items-center justify-between p-3.5 rounded-lg bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 hover:border-sky-300 dark:hover:border-sky-500/30 transition-colors duration-150"
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className={`w-2 h-2 rounded-full ${status.dot}`} />
          <span className="text-sm font-medium text-zinc-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors truncate">
            {project.name}
          </span>
        </div>
        <div className="flex items-center gap-2.5 shrink-0">
          <span className={`text-[10px] font-medium px-2 py-0.5 rounded ${status.bg}`}>
            {status.label}
          </span>
          <span className="text-zinc-400 dark:text-zinc-600 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-150">
            →
          </span>
        </div>
      </Link>
    );
  }

  return (
    <div className="group p-5 rounded-lg bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 hover:border-sky-300 dark:hover:border-sky-500/30 transition-colors duration-150">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <div className={`w-2 h-2 rounded-full ${status.dot}`} />
          <Link 
            href={`/projects/${project.id}`} 
            className="text-sm font-semibold text-zinc-900 dark:text-white hover:text-sky-600 dark:hover:text-sky-400 transition-colors"
          >
            {project.name}
          </Link>
        </div>
        <span className={`text-[10px] font-medium px-2 py-0.5 rounded ${status.bg}`}>
          {status.label}
        </span>
      </div>

      {/* Description */}
      <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4 leading-relaxed line-clamp-2">
        {project.description}
      </p>

      {/* Notes */}
      {project.notes && (
        <p className="text-xs text-zinc-500 dark:text-zinc-500 mb-4 italic bg-zinc-50 dark:bg-zinc-800/50 px-3 py-2 rounded border border-zinc-100 dark:border-zinc-800">
          "{project.notes}"
        </p>
      )}

      {/* Links */}
      <div className="flex flex-wrap gap-2">
        <Link
          href={`/projects/${project.id}`}
          className="inline-flex items-center gap-1 text-xs font-medium px-3 py-1.5 rounded bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-white transition-colors duration-150"
        >
          Details →
        </Link>
        {project.githubUrl && (
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700 hover:text-zinc-900 dark:hover:text-white transition-colors duration-150"
          >
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
              <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
            </svg>
            GitHub
          </a>
        )}
        {project.vercelUrl && (
          <a
            href={project.vercelUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700 hover:text-zinc-900 dark:hover:text-white transition-colors duration-150"
          >
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 1L24 22H0L12 1z" />
            </svg>
            Live
          </a>
        )}
      </div>
    </div>
  );
}
