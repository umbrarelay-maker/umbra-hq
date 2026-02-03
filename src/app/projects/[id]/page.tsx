'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useData } from '@/context/DataContext';
import Link from 'next/link';
import RichTextEditor from '@/components/RichTextEditor';

const statusStyles = {
  active: { 
    bg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400', 
    dot: 'bg-emerald-500',
    label: 'Active' 
  },
  completed: { 
    bg: 'bg-blue-500/10 text-blue-600 dark:text-blue-400', 
    dot: 'bg-blue-500',
    label: 'Completed' 
  },
  'on-hold': { 
    bg: 'bg-amber-500/10 text-amber-600 dark:text-amber-400', 
    dot: 'bg-amber-500',
    label: 'On Hold' 
  },
};

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { getProjectById, updateProject, deleteProject, tasks } = useData();
  
  const project = getProjectById(params.id as string);
  const [isEditing, setIsEditing] = useState(false);
  const [details, setDetails] = useState(project?.details || '');
  const [name, setName] = useState(project?.name || '');
  const [description, setDescription] = useState(project?.description || '');
  const [notes, setNotes] = useState(project?.notes || '');
  const [status, setStatus] = useState(project?.status || 'active');
  const [githubUrl, setGithubUrl] = useState(project?.githubUrl || '');
  const [vercelUrl, setVercelUrl] = useState(project?.vercelUrl || '');
  const [hasChanges, setHasChanges] = useState(false);

  // Get related tasks for this project
  const projectTasks = project ? tasks.filter(t => t.projectId === project.id) : [];

  useEffect(() => {
    if (project) {
      setDetails(project.details || '');
      setName(project.name);
      setDescription(project.description);
      setNotes(project.notes);
      setStatus(project.status);
      setGithubUrl(project.githubUrl || '');
      setVercelUrl(project.vercelUrl || '');
    }
  }, [project]);

  useEffect(() => {
    if (project) {
      const changed = 
        details !== (project.details || '') || 
        name !== project.name || 
        description !== project.description ||
        notes !== project.notes ||
        status !== project.status ||
        githubUrl !== (project.githubUrl || '') ||
        vercelUrl !== (project.vercelUrl || '');
      setHasChanges(changed);
    }
  }, [details, name, description, notes, status, githubUrl, vercelUrl, project]);

  const handleSave = () => {
    if (project) {
      updateProject(project.id, { 
        name, 
        description, 
        notes,
        status,
        githubUrl: githubUrl || undefined,
        vercelUrl: vercelUrl || undefined,
        details 
      });
      setHasChanges(false);
      setIsEditing(false);
    }
  };

  const handleDelete = () => {
    if (project && confirm('Are you sure you want to delete this project?')) {
      deleteProject(project.id);
      router.push('/projects');
    }
  };

  if (!project) {
    return (
      <div className="max-w-4xl animate-fade-in">
        <Link href="/projects" className="inline-flex items-center gap-2 text-sm font-medium text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 mb-6 group transition-colors">
          <span className="transition-transform group-hover:-translate-x-0.5">←</span>
          Back to Projects
        </Link>
        <div className="text-center py-16">
          <div className="w-16 h-16 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🔍</span>
          </div>
          <h1 className="text-xl font-semibold text-zinc-900 dark:text-white mb-2">
            Project Not Found
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-500">
            The project you're looking for doesn't exist.
          </p>
        </div>
      </div>
    );
  }

  const statusStyle = statusStyles[project.status];

  return (
    <div className="max-w-4xl animate-fade-in">
      {/* Back Link */}
      <Link href="/projects" className="inline-flex items-center gap-2 text-sm font-medium text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 mb-8 group transition-colors">
        <span className="transition-transform group-hover:-translate-x-0.5">←</span>
        Back to Projects
      </Link>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-start justify-between mb-5">
          <div className="flex-1">
            {isEditing ? (
              <div className="space-y-4">
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full text-3xl font-bold tracking-tight bg-transparent border-b-2 border-zinc-200 dark:border-zinc-700 focus:border-indigo-500 dark:focus:border-indigo-400 focus:outline-none py-2 text-zinc-900 dark:text-white transition-colors"
                  placeholder="Project name..."
                />
                <input
                  type="text"
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  className="w-full text-lg text-zinc-600 dark:text-zinc-400 bg-transparent border-b border-zinc-200 dark:border-zinc-700 focus:border-indigo-500 dark:focus:border-indigo-400 focus:outline-none py-2 transition-colors"
                  placeholder="Brief description..."
                />
              </div>
            ) : (
              <>
                <div className="flex items-center gap-4 mb-3">
                  <div className={`w-4 h-4 rounded-full ${statusStyle.dot} ring-4 ring-opacity-20 ${statusStyle.dot.replace('bg-', 'ring-')}`} />
                  <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
                    {project.name}
                  </h1>
                </div>
                <p className="text-lg text-zinc-600 dark:text-zinc-400">
                  {project.description}
                </p>
              </>
            )}
          </div>
          <div className="flex items-center gap-3 ml-4">
            {isEditing ? (
              <select
                value={status}
                onChange={e => setStatus(e.target.value as typeof status)}
                className="text-xs font-semibold px-4 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="active">Active</option>
                <option value="on-hold">On Hold</option>
                <option value="completed">Completed</option>
              </select>
            ) : (
              <span className={`text-xs font-bold px-4 py-2 rounded-full ${statusStyle.bg}`}>
                {statusStyle.label}
              </span>
            )}
            {hasChanges && (
              <span className="text-xs font-bold px-4 py-2 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 animate-pulse">
                Unsaved
              </span>
            )}
          </div>
        </div>

        {/* Links */}
        {isEditing ? (
          <div className="grid grid-cols-2 gap-4 mb-5">
            <div>
              <label className="block text-xs uppercase tracking-wider font-bold text-zinc-500 mb-2">
                GitHub URL
              </label>
              <input
                type="url"
                value={githubUrl}
                onChange={e => setGithubUrl(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                placeholder="https://github.com/..."
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider font-bold text-zinc-500 mb-2">
                Live URL
              </label>
              <input
                type="url"
                value={vercelUrl}
                onChange={e => setVercelUrl(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                placeholder="https://..."
              />
            </div>
          </div>
        ) : (project.githubUrl || project.vercelUrl) && (
          <div className="flex gap-3 mb-5">
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-medium px-5 py-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-all group"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
                </svg>
                GitHub Repository
                <span className="transition-transform group-hover:translate-x-0.5">→</span>
              </a>
            )}
            {project.vercelUrl && (
              <a
                href={project.vercelUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-medium px-5 py-2.5 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-all group btn-press"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 1L24 22H0L12 1z" />
                </svg>
                View Live Site
                <span className="transition-transform group-hover:translate-x-0.5">→</span>
              </a>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center gap-4 flex-wrap">
          <p className="text-sm text-zinc-500 dark:text-zinc-500">
            Created {new Date(project.createdAt).toLocaleDateString('en-US', { 
              month: 'long', day: 'numeric', year: 'numeric' 
            })}
            {project.updatedAt !== project.createdAt && (
              <span className="text-zinc-400 dark:text-zinc-600">
                {' '}• Updated {new Date(project.updatedAt).toLocaleDateString('en-US', { 
                  month: 'long', day: 'numeric', year: 'numeric' 
                })}
              </span>
            )}
          </p>
          <div className="flex-1" />
          <div className="flex gap-2">
            {isEditing ? (
              <>
                <button
                  onClick={() => {
                    setDetails(project.details || '');
                    setName(project.name);
                    setDescription(project.description);
                    setNotes(project.notes);
                    setStatus(project.status);
                    setGithubUrl(project.githubUrl || '');
                    setVercelUrl(project.vercelUrl || '');
                    setIsEditing(false);
                  }}
                  className="px-4 py-2 rounded-xl text-sm font-medium text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={!hasChanges}
                  className="px-5 py-2 rounded-xl text-sm font-medium bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-all btn-press disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Save
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 rounded-xl text-sm font-medium text-red-500 hover:bg-red-500/10 transition-colors"
                >
                  Delete
                </button>
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-5 py-2 rounded-xl text-sm font-medium bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-all btn-press"
                >
                  Edit
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Notes */}
      {isEditing ? (
        <div className="mb-8 p-5 rounded-2xl bg-amber-500/5 border border-amber-500/20">
          <label className="block text-xs uppercase tracking-wider font-bold text-amber-600 dark:text-amber-400 mb-3">
            Quick Notes
          </label>
          <textarea
            value={notes}
            onChange={e => setNotes(e.target.value)}
            className="w-full bg-transparent text-sm text-zinc-700 dark:text-zinc-300 focus:outline-none resize-none"
            rows={2}
            placeholder="Quick notes..."
          />
        </div>
      ) : project.notes && (
        <div className="mb-8 p-5 rounded-2xl bg-amber-500/5 border border-amber-500/20">
          <h3 className="text-xs uppercase tracking-wider font-bold text-amber-600 dark:text-amber-400 mb-2 flex items-center gap-2">
            <span>📝</span> Notes
          </h3>
          <p className="text-sm text-zinc-700 dark:text-zinc-300 italic leading-relaxed">
            "{project.notes}"
          </p>
        </div>
      )}

      {/* Related Tasks */}
      {projectTasks.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-white mb-5 flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              ◐
            </div>
            Related Tasks
            <span className="text-xs font-bold bg-zinc-200 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-400 px-2.5 py-1 rounded-full">
              {projectTasks.length}
            </span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 stagger-children">
            {projectTasks.map(task => (
              <Link
                key={task.id}
                href="/tasks"
                className="group p-4 rounded-xl bg-white dark:bg-zinc-900/50 border border-zinc-200/80 dark:border-zinc-800/80 hover:border-indigo-500/30 dark:hover:border-indigo-500/30 transition-all duration-200 hover:shadow-lg hover:shadow-indigo-500/5"
              >
                <div className="flex items-center gap-3 mb-2">
                  <span className={`text-lg ${
                    task.status === 'done' ? 'text-emerald-500' :
                    task.status === 'in-progress' ? 'text-amber-500' : 'text-zinc-400'
                  }`}>
                    {task.status === 'done' ? '●' : task.status === 'in-progress' ? '◐' : '○'}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    task.priority === 'high' ? 'bg-red-500/10 text-red-500' :
                    task.priority === 'medium' ? 'bg-amber-500/10 text-amber-500' : 'bg-blue-500/10 text-blue-500'
                  }`}>
                    {task.priority.toUpperCase()}
                  </span>
                </div>
                <p className="text-sm font-medium text-zinc-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors truncate">
                  {task.title}
                </p>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Details Editor */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-white mb-5 flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
            ◇
          </div>
          Project Details
        </h2>
        <RichTextEditor
          content={details}
          onChange={setDetails}
          editable={isEditing}
          placeholder="Add detailed project information, goals, tech stack, roadmap..."
        />
      </div>
    </div>
  );
}
