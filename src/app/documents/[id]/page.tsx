'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useData } from '@/context/DataContext';
import Link from 'next/link';
import RichTextEditor from '@/components/RichTextEditor';

const categoryStyles = {
  audits: { bg: 'bg-rose-500/10 text-rose-600 dark:text-rose-400', icon: '◈' },
  research: { bg: 'bg-blue-500/10 text-blue-600 dark:text-blue-400', icon: '◇' },
  marketing: { bg: 'bg-purple-500/10 text-purple-600 dark:text-purple-400', icon: '◆' },
  technical: { bg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400', icon: '◉' },
  other: { bg: 'bg-zinc-500/10 text-zinc-600 dark:text-zinc-400', icon: '○' },
};

export default function DocumentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { getDocumentById, updateDocument, deleteDocument } = useData();
  
  const doc = getDocumentById(params.id as string);
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(doc?.content || '');
  const [title, setTitle] = useState(doc?.title || '');
  const [description, setDescription] = useState(doc?.description || '');
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (doc) {
      setContent(doc.content || '');
      setTitle(doc.title);
      setDescription(doc.description);
    }
  }, [doc]);

  useEffect(() => {
    if (doc) {
      const changed = 
        content !== (doc.content || '') || 
        title !== doc.title || 
        description !== doc.description;
      setHasChanges(changed);
    }
  }, [content, title, description, doc]);

  const handleSave = () => {
    if (doc) {
      updateDocument(doc.id, { title, description, content });
      setHasChanges(false);
      setIsEditing(false);
    }
  };

  const handleDelete = () => {
    if (doc && confirm('Are you sure you want to delete this document?')) {
      deleteDocument(doc.id);
      router.push('/documents');
    }
  };

  if (!doc) {
    return (
      <div className="max-w-4xl">
        <Link href="/documents" className="text-sm text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 mb-4 inline-block">
          ← Back to Documents
        </Link>
        <div className="text-center py-12">
          <h1 className="text-xl font-semibold text-zinc-900 dark:text-white mb-2">
            Document Not Found
          </h1>
          <p className="text-zinc-500 dark:text-zinc-500">
            The document you're looking for doesn't exist.
          </p>
        </div>
      </div>
    );
  }

  const category = categoryStyles[doc.category];

  return (
    <div className="max-w-4xl">
      {/* Back Link */}
      <Link href="/documents" className="text-sm text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 mb-6 inline-flex items-center gap-1">
        ← Back to Documents
      </Link>

      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-4">
          <span className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl ${category.bg}`}>
            {category.icon}
          </span>
          <span className={`text-xs font-medium px-3 py-1 rounded-full ${category.bg}`}>
            {doc.category.toUpperCase()}
          </span>
          {hasChanges && (
            <span className="text-xs font-medium px-3 py-1 rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-400">
              Unsaved changes
            </span>
          )}
        </div>

        {isEditing ? (
          <div className="space-y-3 mb-4">
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full text-3xl font-semibold tracking-tight bg-transparent border-b-2 border-zinc-200 dark:border-zinc-700 focus:border-zinc-400 dark:focus:border-zinc-500 focus:outline-none py-1"
              placeholder="Document title..."
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
            <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-white mb-3">
              {doc.title}
            </h1>
            <p className="text-lg text-zinc-600 dark:text-zinc-400 mb-4">
              {doc.description}
            </p>
          </>
        )}

        <div className="flex items-center gap-4">
          <p className="text-sm text-zinc-500 dark:text-zinc-500">
            Created {new Date(doc.createdAt).toLocaleDateString('en-US', { 
              month: 'long', day: 'numeric', year: 'numeric' 
            })}
            {doc.updatedAt && doc.updatedAt !== doc.createdAt && (
              <span> • Updated {new Date(doc.updatedAt).toLocaleDateString('en-US', { 
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
                    setContent(doc.content || '');
                    setTitle(doc.title);
                    setDescription(doc.description);
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

      {/* External Link */}
      {doc.url && (
        <div className="mb-6">
          <a
            href={doc.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm px-4 py-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
          >
            View External Document →
          </a>
        </div>
      )}

      {/* Content Editor */}
      <RichTextEditor
        content={content}
        onChange={setContent}
        editable={isEditing}
        placeholder="Start writing your document..."
      />
    </div>
  );
}
