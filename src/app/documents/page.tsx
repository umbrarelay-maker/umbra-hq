'use client';

import { useState } from 'react';
import { useData } from '@/context/DataContext';
import DocumentCard from '@/components/DocumentCard';
import { Document } from '@/data/initial-data';

const categoryConfig = {
  audits: { icon: '◈', label: 'Audits', color: 'bg-rose-500/10 text-rose-600 dark:text-rose-400' },
  research: { icon: '◇', label: 'Research', color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400' },
  marketing: { icon: '◆', label: 'Marketing', color: 'bg-pink-500/10 text-pink-600 dark:text-pink-400' },
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
    <div className="fixed inset-0 modal-backdrop flex items-center justify-center z-50 p-4 animate-fade-in" onClick={onClose}>
      <div 
        className="bg-white dark:bg-zinc-900 rounded-2xl p-6 w-full max-w-md border border-zinc-200 dark:border-zinc-800 shadow-2xl shadow-black/20 animate-fade-in-scale"
        onClick={e => e.stopPropagation()}
      >
        <h3 className="text-xl font-semibold mb-6 text-zinc-900 dark:text-white">New Document</h3>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs uppercase tracking-wider font-bold text-zinc-500 mb-2">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
              placeholder="Document title..."
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
              className="w-full px-4 py-3 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
              placeholder="Brief description..."
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-wider font-bold text-zinc-500 mb-2">
              Category
            </label>
            <select
              value={category}
              onChange={e => setCategory(e.target.value as Document['category'])}
              className="w-full px-4 py-3 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
            >
              {Object.entries(categoryConfig).map(([key, config]) => (
                <option key={key} value={key}>{config.label}</option>
              ))}
            </select>
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

export default function DocumentsPage() {
  const { documents, addDocument } = useData();
  const [modalOpen, setModalOpen] = useState(false);
  const [filter, setFilter] = useState<Document['category'] | 'all'>('all');

  const filteredDocs = filter === 'all' 
    ? documents 
    : documents.filter(d => d.category === filter);

  return (
    <div className="max-w-5xl animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-white">Documents</h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-500 mt-2">
            Create and manage documents with rich text editing
          </p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-all btn-press shadow-lg shadow-zinc-900/10 dark:shadow-white/10"
        >
          <span className="text-lg">+</span>
          New Document
        </button>
      </div>

      {/* Filter */}
      <div className="flex flex-wrap gap-2 mb-8">
        <button
          onClick={() => setFilter('all')}
          className={`text-xs font-medium px-4 py-2.5 rounded-xl transition-all duration-200 ${
            filter === 'all'
              ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 shadow-lg shadow-zinc-900/10 dark:shadow-white/10'
              : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700 hover:text-zinc-900 dark:hover:text-white'
          }`}
        >
          All <span className={filter === 'all' ? 'opacity-60' : 'opacity-40'}>({documents.length})</span>
        </button>
        {Object.entries(categoryConfig).map(([key, config]) => {
          const count = documents.filter(d => d.category === key).length;
          if (count === 0) return null;
          return (
            <button
              key={key}
              onClick={() => setFilter(key as Document['category'])}
              className={`text-xs font-medium px-4 py-2.5 rounded-xl transition-all duration-200 inline-flex items-center gap-2 ${
                filter === key
                  ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 shadow-lg shadow-zinc-900/10 dark:shadow-white/10'
                  : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700 hover:text-zinc-900 dark:hover:text-white'
              }`}
            >
              <span>{config.icon}</span>
              {config.label}
              <span className={filter === key ? 'opacity-60' : 'opacity-40'}>({count})</span>
            </button>
          );
        })}
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 stagger-children">
        {filteredDocs.map(doc => (
          <DocumentCard key={doc.id} document={doc} />
        ))}
      </div>

      {filteredDocs.length === 0 && (
        <div className="text-center py-16">
          <div className="w-16 h-16 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">📄</span>
          </div>
          <p className="text-sm text-zinc-500 dark:text-zinc-500 font-medium mb-1">
            No documents found
          </p>
          <p className="text-xs text-zinc-400 dark:text-zinc-600">
            Create your first document to get started
          </p>
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
