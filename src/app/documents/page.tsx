'use client';

import { useState } from 'react';
import { useData } from '@/context/DataContext';
import DocumentCard from '@/components/DocumentCard';
import { Document } from '@/data/initial-data';

const categoryConfig = {
  audits: { icon: '◈', label: 'Audits', color: 'bg-rose-500/10 text-rose-600 dark:text-rose-400' },
  research: { icon: '◇', label: 'Research', color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400' },
  marketing: { icon: '◆', label: 'Marketing', color: 'bg-purple-500/10 text-purple-600 dark:text-purple-400' },
  technical: { icon: '◉', label: 'Technical', color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' },
  other: { icon: '○', label: 'Other', color: 'bg-zinc-500/10 text-zinc-600 dark:text-zinc-400' },
};

interface NewDocModalProps {
  onClose: () => void;
  onSave: (doc: Omit<Document, 'id' | 'createdAt'>) => void;
}

function NewDocModal({ onClose, onSave }: NewDocModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<Document['category']>('other');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSave({ 
      title, 
      description, 
      category, 
      content: '' 
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 w-full max-w-md border border-zinc-200 dark:border-zinc-800">
        <h3 className="text-lg font-semibold mb-4">New Document</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs uppercase tracking-wider text-zinc-500 mb-1.5">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-500"
              placeholder="Document title..."
              autoFocus
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-wider text-zinc-500 mb-1.5">
              Description
            </label>
            <input
              type="text"
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-500"
              placeholder="Brief description..."
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-wider text-zinc-500 mb-1.5">
              Category
            </label>
            <select
              value={category}
              onChange={e => setCategory(e.target.value as Document['category'])}
              className="w-full px-3 py-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-500"
            >
              {Object.entries(categoryConfig).map(([key, config]) => (
                <option key={key} value={key}>{config.label}</option>
              ))}
            </select>
          </div>
          <div className="flex gap-2 pt-2">
            <div className="flex-1" />
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-sm text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg text-sm bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-colors"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function DocumentsPage() {
  const { documents, addDocument } = useData();
  const [modalOpen, setModalOpen] = useState(false);
  const [filter, setFilter] = useState<Document['category'] | 'all'>('all');

  const filteredDocs = filter === 'all' 
    ? documents 
    : documents.filter(d => d.category === filter);

  return (
    <div className="max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Documents</h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-500 mt-1">
            Create and manage documents with rich text editing
          </p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="px-4 py-2 rounded-lg text-sm bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-colors"
        >
          + New Document
        </button>
      </div>

      {/* Filter */}
      <div className="flex gap-2 mb-6 flex-wrap">
        <button
          onClick={() => setFilter('all')}
          className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
            filter === 'all'
              ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900'
              : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700'
          }`}
        >
          All ({documents.length})
        </button>
        {Object.entries(categoryConfig).map(([key, config]) => {
          const count = documents.filter(d => d.category === key).length;
          if (count === 0) return null;
          return (
            <button
              key={key}
              onClick={() => setFilter(key as Document['category'])}
              className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                filter === key
                  ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900'
                  : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700'
              }`}
            >
              {config.icon} {config.label} ({count})
            </button>
          );
        })}
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-2 gap-4">
        {filteredDocs.map(doc => (
          <DocumentCard key={doc.id} document={doc} />
        ))}
      </div>

      {filteredDocs.length === 0 && (
        <div className="text-center py-12 text-zinc-400 dark:text-zinc-600">
          <p className="text-lg mb-2">No documents found</p>
          <p className="text-sm">Create your first document to get started</p>
        </div>
      )}

      {modalOpen && (
        <NewDocModal
          onClose={() => setModalOpen(false)}
          onSave={(doc) => addDocument(doc)}
        />
      )}
    </div>
  );
}
