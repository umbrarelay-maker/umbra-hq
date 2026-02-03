'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useData } from '@/context/DataContext';
import Link from 'next/link';
import RichTextEditor from '@/components/RichTextEditor';

const statusStyles = {
  active: { bg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400', label: 'Active' },
  completed: { bg: 'bg-blue-500/10 text-blue-600 dark:text-blue-400', label: 'Completed' },
  'on-hold': { bg: 'bg-amber-500/10 text-amber-600 dark:text-amber-400', label: 'On Hold' },
};

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { getProjectById, updateProject, deleteProject, tasks, updates } = useData();
  
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

  const statusStyle = statusStyles[project.status];

  return (
    <div className="max-w-4xl">
      {/* Back Link */}
      <Link href="/projects" className="text-sm text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 mb-6 inline-flex items-center gap-1">
        ← Back to Projects
      </Link>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            {isEditing ? (
              <div className="space-y-3">
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full text-3xl font-semibold tracking-tight bg-transparent border-b-2 border-zinc-200 dark:border-zinc-700 focus:border-zinc-400 dark:focus:border-zinc-500 focus:outline-none py-1"
                  placeholder="Project name..."
                />
                <input
                  type="text"
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  className="w-full text-lg text-zinc-600 dark:text-zinc-400 bg-transparent border-b border-zinc-200 dark:border-zinc-700 focus:border-zinc-400 dark:focus:border-zinc-500 focus:outline-none py-1"
                  placeholder="Brief description..."
                />
              </div>
            ) : (
              <>
                <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-white mb-2">
                  {project.name}
                </h1>
                <p className="text-lg text-zinc-600 dark:text-zinc-400">
                  {project.description}
                </p>
              </>
            )}
          </div>
          <div className="flex items-center gap-2 ml-4">
            {isEditing ? (
              <select
                value={status}
                onChange={e => setStatus(e.target.value as typeof status)}
                className="text-xs font-medium px-3 py-1.5 rounded-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 focus:outline-none"
              >
                <option value="active">Active</option>
                <option value="on-hold">On Hold</option>
                <option value="completed">Completed</option>
              </select>
            ) : (
              <span className={`text-xs font-medium px-3 py-1.5 rounded-full ${statusStyle.bg}`}>
                {statusStyle.label}
              </span>
            )}
            {hasChanges && (
              <span className="text-xs font-medium px-3 py-1.5 rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-400">
                Unsaved
              </span>
            )}
          </div>
        </div>

        {/* Links */}
        {isEditing ? (
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs uppercase tracking-wider text-zinc-500 mb-1.5">
                GitHub URL
              </label>
              <input
                type="url"
                value={githubUrl}
                onChange={e => setGithubUrl(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-500"
                placeholder="https://github.com/..."
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider text-zinc-500 mb-1.5">
                Live URL
              </label>
              <input
                type="url"
                value={vercelUrl}
                onChange={e => setVercelUrl(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-500"
                placeholder="https://..."
              />
            </div>
          </div>
        ) : (
          <div className="flex gap-3 mb-4">
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
        )}

        {/* Action Buttons */}
        <div className="flex items-center gap-4">
          <p className="text-sm text-zinc-500 dark:text-zinc-500">
            Created {new Date(project.createdAt).toLocaleDateString('en-US', { 
              month: 'long', day: 'numeric', year: 'numeric' 
            })}
            {project.updatedAt !== project.createdAt && (
              <span> • Updated {new Date(project.updatedAt).toLocaleDateString('en-US', { 
                month: 'long', day: 'numeric', year: 'numeric' 
              })}</span>
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
                  className="px-4 py-2 rounded-lg text-sm text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={!hasChanges}
                  className="px-4 py-2 rounded-lg text-sm bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-colors disabled:opacity-50"
                >
                  Save
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 rounded-lg text-sm text-red-500 hover:bg-red-500/10 transition-colors"
                >
                  Delete
                </button>
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 rounded-lg text-sm bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-colors"
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
        <div className="mb-8 p-4 rounded-xl bg-amber-500/5 border border-amber-500/20">
          <label className="block text-xs uppercase tracking-wider text-amber-600 dark:text-amber-400 mb-2">
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
        <div className="mb-8 p-4 rounded-xl bg-amber-500/5 border border-amber-500/20">
          <h3 className="text-xs uppercase tracking-wider text-amber-600 dark:text-amber-400 mb-2">
            Notes
          </h3>
          <p className="text-sm text-zinc-700 dark:text-zinc-300 italic">
            "{project.notes}"
          </p>
        </div>
      )}

      {/* Related Tasks */}
      {projectTasks.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-white mb-4 flex items-center gap-2">
            <span>◐</span> Related Tasks
            <span className="text-xs bg-zinc-200 dark:bg-zinc-700 px-2 py-0.5 rounded-full">
              {projectTasks.length}
            </span>
          </h2>
          <div className="grid grid-cols-3 gap-3">
            {projectTasks.map(task => (
              <Link
                key={task.id}
                href="/tasks"
                className="p-3 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors"
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className={
                    task.status === 'done' ? 'text-emerald-500' :
                    task.status === 'in-progress' ? 'text-blue-500' : 'text-zinc-400'
                  }>
                    {task.status === 'done' ? '●' : task.status === 'in-progress' ? '◐' : '○'}
                  </span>
                  <span className={`text-[10px] font-medium ${
                    task.priority === 'high' ? 'text-red-500' :
                    task.priority === 'medium' ? 'text-amber-500' : 'text-blue-500'
                  }`}>
                    {task.priority.toUpperCase()}
                  </span>
                </div>
                <p className="text-sm font-medium text-zinc-900 dark:text-white truncate">
                  {task.title}
                </p>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Details Editor */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-white mb-4">
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
