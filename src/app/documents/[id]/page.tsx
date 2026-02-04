'use client';

import { useState, useEffect, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useData } from '@/context/DataContext';
import Link from 'next/link';
import RichTextEditor from '@/components/RichTextEditor';
import { markdownToHtml, isMarkdown } from '@/lib/markdown';

const categoryStyles = {
  audits: { bg: 'bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400', icon: '◈' },
  research: { bg: 'bg-sky-50 dark:bg-sky-500/10 text-sky-600 dark:text-sky-400', icon: '◇' },
  marketing: { bg: 'bg-pink-50 dark:bg-pink-500/10 text-pink-600 dark:text-pink-400', icon: '◆' },
  technical: { bg: 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400', icon: '◉' },
  other: { bg: 'bg-zinc-100 dark:bg-zinc-500/10 text-zinc-600 dark:text-zinc-400', icon: '○' },
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
      // Convert markdown to HTML if needed
      const rawContent = doc.content || '';
      const htmlContent = isMarkdown(rawContent) ? markdownToHtml(rawContent) : rawContent;
      setContent(htmlContent);
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
      <div className="max-w-4xl animate-fade-in">
        <Link href="/documents" className="inline-flex items-center gap-2 text-sm font-medium text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 mb-6 group transition-colors">
          <span className="transition-transform group-hover:-translate-x-0.5">←</span>
          Back to Documents
        </Link>
        <div className="text-center py-16">
          <div className="w-12 h-12 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mx-auto mb-4">
            <span className="text-xl opacity-50">◇</span>
          </div>
          <h1 className="text-lg font-semibold text-zinc-900 dark:text-white mb-2">
            Document Not Found
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-500">
            The document you're looking for doesn't exist.
          </p>
        </div>
      </div>
    );
  }

  const category = categoryStyles[doc.category];

  return (
    <div className="max-w-4xl animate-fade-in">
      {/* Back Link */}
      <Link href="/documents" className="inline-flex items-center gap-2 text-sm font-medium text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 mb-8 group transition-colors">
        <span className="transition-transform group-hover:-translate-x-0.5">←</span>
        Back to Documents
      </Link>

      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-xl ${category.bg}`}>
            {category.icon}
          </div>
          <span className={`text-[10px] font-medium px-2 py-0.5 rounded ${category.bg}`}>
            {doc.category.toUpperCase()}
          </span>
          {hasChanges && (
            <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-amber-50 dark:bg-amber-500/15 text-amber-600 dark:text-amber-400">
              Unsaved
            </span>
          )}
        </div>

        {isEditing ? (
          <div className="space-y-3 mb-4">
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full text-2xl font-semibold tracking-tight bg-transparent border-b border-zinc-200 dark:border-zinc-700 focus:border-sky-500 dark:focus:border-sky-400 focus:outline-none py-1.5 text-zinc-900 dark:text-white transition-colors"
              placeholder="Document title..."
            />
            <input
              type="text"
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="w-full text-base text-zinc-600 dark:text-zinc-400 bg-transparent border-b border-zinc-200 dark:border-zinc-700 focus:border-sky-500 dark:focus:border-sky-400 focus:outline-none py-1.5 transition-colors"
              placeholder="Brief description..."
            />
          </div>
        ) : (
          <>
            <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-white mb-2">
              {doc.title}
            </h1>
            <p className="text-base text-zinc-600 dark:text-zinc-400 mb-4">
              {doc.description}
            </p>
          </>
        )}

        <div className="flex items-center gap-4 flex-wrap">
          <p className="text-sm text-zinc-500 dark:text-zinc-500">
            Created {new Date(doc.createdAt).toLocaleDateString('en-US', { 
              month: 'long', day: 'numeric', year: 'numeric' 
            })}
            {doc.updatedAt && doc.updatedAt !== doc.createdAt && (
              <span className="text-zinc-400 dark:text-zinc-600">
                {' '}• Updated {new Date(doc.updatedAt).toLocaleDateString('en-US', { 
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
                    setContent(doc.content || '');
                    setTitle(doc.title);
                    setDescription(doc.description);
                    setIsEditing(false);
                  }}
                  className="px-3 py-1.5 rounded text-sm font-medium text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={!hasChanges}
                  className="px-4 py-1.5 rounded text-sm font-medium bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Save
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={handleDelete}
                  className="px-3 py-1.5 rounded text-sm font-medium text-zinc-500 hover:text-red-500 hover:bg-red-500/10 transition-colors"
                >
                  Delete
                </button>
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-1.5 rounded text-sm font-medium bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-white transition-colors"
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
            className="inline-flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            View External →
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
