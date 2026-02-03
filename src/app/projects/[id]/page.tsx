'use client';

import { useParams } from 'next/navigation';
import { useData } from '@/context/DataContext';
import Link from 'next/link';

const statusStyles = {
  active: { bg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400', label: 'Active' },
  completed: { bg: 'bg-blue-500/10 text-blue-600 dark:text-blue-400', label: 'Completed' },
  'on-hold': { bg: 'bg-amber-500/10 text-amber-600 dark:text-amber-400', label: 'On Hold' },
};

export default function ProjectDetailPage() {
  const params = useParams();
  const { getProjectById } = useData();
  
  const project = getProjectById(params.id as string);

  if (!project) {
    return (
      <div className="max-w-4xl">
        <Link href="/projects" className="text-sm text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 mb-4 inline-block">
          ← Back to Projects
        </Link>
        <div className="text-center py-12">
          <h1 className="text-xl font-semibold text-zinc-900 dark:text-white mb-2">
            Project Not Found
          </h1>
          <p className="text-zinc-500 dark:text-zinc-500">
            The project you're looking for doesn't exist.
          </p>
        </div>
      </div>
    );
  }

  const status = statusStyles[project.status];

  return (
    <div className="max-w-4xl">
      {/* Back Link */}
      <Link href="/projects" className="text-sm text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 mb-6 inline-flex items-center gap-1">
        ← Back to Projects
      </Link>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-white mb-2">
              {project.name}
            </h1>
            <p className="text-lg text-zinc-600 dark:text-zinc-400">
              {project.description}
            </p>
          </div>
          <span className={`text-xs font-medium px-3 py-1.5 rounded-full ${status.bg}`}>
            {status.label}
          </span>
        </div>

        {/* Links */}
        <div className="flex gap-3">
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm px-4 py-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
            >
              GitHub Repository →
            </a>
          )}
          {project.vercelUrl && (
            <a
              href={project.vercelUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm px-4 py-2 rounded-lg bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-colors"
            >
              View Live Site →
            </a>
          )}
        </div>
      </div>

      {/* Notes */}
      {project.notes && (
        <div className="mb-8 p-4 rounded-xl bg-amber-500/5 border border-amber-500/20">
          <h3 className="text-xs uppercase tracking-wider text-amber-600 dark:text-amber-400 mb-2">
            Notes
          </h3>
          <p className="text-sm text-zinc-700 dark:text-zinc-300 italic">
            "{project.notes}"
          </p>
        </div>
      )}

      {/* Details (Markdown-like content) */}
      {project.details && (
        <div className="prose prose-zinc dark:prose-invert max-w-none">
          <div className="p-6 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
            {project.details.split('\n').map((line, i) => {
              if (line.startsWith('## ')) {
                return <h2 key={i} className="text-xl font-semibold text-zinc-900 dark:text-white mt-6 mb-3 first:mt-0">{line.replace('## ', '')}</h2>;
              }
              if (line.startsWith('### ')) {
                return <h3 key={i} className="text-lg font-medium text-zinc-800 dark:text-zinc-200 mt-4 mb-2">{line.replace('### ', '')}</h3>;
              }
              if (line.startsWith('- **')) {
                const match = line.match(/- \*\*(.+?)\*\*(.*)$/);
                if (match) {
                  return (
                    <p key={i} className="text-sm text-zinc-600 dark:text-zinc-400 my-1 pl-4">
                      • <strong className="text-zinc-800 dark:text-zinc-200">{match[1]}</strong>{match[2]}
                    </p>
                  );
                }
              }
              if (line.startsWith('- ')) {
                return <p key={i} className="text-sm text-zinc-600 dark:text-zinc-400 my-1 pl-4">• {line.replace('- ', '')}</p>;
              }
              if (line.match(/^\d+\./)) {
                return <p key={i} className="text-sm text-zinc-600 dark:text-zinc-400 my-1 pl-4">{line}</p>;
              }
              if (line.trim() === '') {
                return <div key={i} className="h-2" />;
              }
              return <p key={i} className="text-sm text-zinc-600 dark:text-zinc-400 my-2">{line}</p>;
            })}
          </div>
        </div>
      )}

      {/* Metadata */}
      <div className="mt-8 pt-6 border-t border-zinc-200 dark:border-zinc-800">
        <div className="flex gap-8 text-xs text-zinc-500 dark:text-zinc-500">
          <div>
            <span className="uppercase tracking-wider">Created</span>
            <p className="text-zinc-700 dark:text-zinc-300 mt-1">
              {new Date(project.createdAt).toLocaleDateString('en-US', { 
                month: 'long', day: 'numeric', year: 'numeric' 
              })}
            </p>
          </div>
          <div>
            <span className="uppercase tracking-wider">Last Updated</span>
            <p className="text-zinc-700 dark:text-zinc-300 mt-1">
              {new Date(project.updatedAt).toLocaleDateString('en-US', { 
                month: 'long', day: 'numeric', year: 'numeric' 
              })}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
