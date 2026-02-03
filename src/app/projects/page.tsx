'use client';

import { useState } from 'react';
import { useData } from '@/context/DataContext';
import ProjectCard from '@/components/ProjectCard';
import { Project } from '@/data/initial-data';

interface NewProjectModalProps {
  onClose: () => void;
  onSave: (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => void;
}

function NewProjectModal({ onClose, onSave }: NewProjectModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<Project['status']>('active');
  const [githubUrl, setGithubUrl] = useState('');
  const [vercelUrl, setVercelUrl] = useState('');
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSave({ 
      name, 
      description, 
      status, 
      githubUrl: githubUrl || undefined,
      vercelUrl: vercelUrl || undefined,
      notes,
      details: ''
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 modal-backdrop flex items-center justify-center z-50 p-4 animate-fade-in" onClick={onClose}>
      <div 
        className="bg-white dark:bg-zinc-900 rounded-2xl p-6 w-full max-w-lg border border-zinc-200 dark:border-zinc-800 shadow-2xl shadow-black/20 animate-fade-in-scale"
        onClick={e => e.stopPropagation()}
      >
        <h3 className="text-xl font-semibold mb-6 text-zinc-900 dark:text-white">New Project</h3>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs uppercase tracking-wider font-bold text-zinc-500 mb-2">
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              placeholder="Project name..."
              autoFocus
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-wider font-bold text-zinc-500 mb-2">
              Description
            </label>
            <input
              type="text"
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              placeholder="Brief description..."
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase tracking-wider font-bold text-zinc-500 mb-2">
                Status
              </label>
              <select
                value={status}
                onChange={e => setStatus(e.target.value as Project['status'])}
                className="w-full px-4 py-3 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              >
                <option value="active">Active</option>
                <option value="on-hold">On Hold</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider font-bold text-zinc-500 mb-2">
                Notes
              </label>
              <input
                type="text"
                value={notes}
                onChange={e => setNotes(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                placeholder="Quick notes..."
              />
            </div>
          </div>
          <div>
            <label className="block text-xs uppercase tracking-wider font-bold text-zinc-500 mb-2">
              GitHub URL (optional)
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
              Live URL (optional)
            </label>
            <input
              type="url"
              value={vercelUrl}
              onChange={e => setVercelUrl(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              placeholder="https://..."
            />
          </div>
          <div className="flex gap-3 pt-3">
            <div className="flex-1" />
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-sm font-medium text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl text-sm font-medium bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-all btn-press"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function ProjectsPage() {
  const { projects, addProject } = useData();
  const [filter, setFilter] = useState<Project['status'] | 'all'>('all');
  const [modalOpen, setModalOpen] = useState(false);
  
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
    <div className="max-w-6xl animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-white">Projects</h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-500 mt-2">
            Track and manage all ongoing projects.
          </p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-all btn-press shadow-lg shadow-zinc-900/10 dark:shadow-white/10"
        >
          <span className="text-lg">+</span>
          New Project
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-8">
        {(['all', 'active', 'completed', 'on-hold'] as const).map((status, index) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`text-xs font-medium px-4 py-2.5 rounded-xl transition-all duration-200 ${
              filter === status
                ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 shadow-lg shadow-zinc-900/10 dark:shadow-white/10'
                : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700 hover:text-zinc-900 dark:hover:text-white'
            }`}
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            {status === 'all' ? 'All' : status === 'on-hold' ? 'On Hold' : status.charAt(0).toUpperCase() + status.slice(1)}
            <span className={`ml-2 ${filter === status ? 'opacity-60' : 'opacity-40'}`}>
              {statusCounts[status]}
            </span>
          </button>
        ))}
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 stagger-children">
        {filteredProjects.map(project => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>

      {filteredProjects.length === 0 && (
        <div className="text-center py-16">
          <div className="w-16 h-16 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">📁</span>
          </div>
          <p className="text-sm text-zinc-500 dark:text-zinc-500 font-medium">
            No projects match this filter.
          </p>
        </div>
      )}

      {modalOpen && (
        <NewProjectModal
          onClose={() => setModalOpen(false)}
          onSave={(project) => addProject(project)}
        />
      )}
    </div>
  );
}
