'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from './AuthContext';
import {
  Project,
  Document,
  Update,
  QuickLink,
  Blocker,
  DailyBriefing,
  Task,
  initialProjects,
  initialDocuments,
  initialUpdates,
  initialQuickLinks,
  initialBlockers,
  initialBriefing,
  initialTasks
} from '@/data/initial-data';

interface DataContextType {
  // Data
  projects: Project[];
  documents: Document[];
  updates: Update[];
  quickLinks: QuickLink[];
  blockers: Blocker[];
  briefing: DailyBriefing;
  tasks: Task[];
  
  // Loading state
  isLoading: boolean;
  
  // Updates
  addUpdate: (content: string, type: Update['type']) => Promise<void>;
  
  // Projects
  updateProject: (id: string, data: Partial<Project>) => Promise<void>;
  addProject: (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  getProjectById: (id: string) => Project | undefined;
  
  // Documents
  addDocument: (doc: Omit<Document, 'id' | 'createdAt'>) => Promise<void>;
  updateDocument: (id: string, data: Partial<Document>) => Promise<void>;
  deleteDocument: (id: string) => Promise<void>;
  getDocumentById: (id: string) => Document | undefined;
  
  // Blockers
  addBlocker: (blocker: Omit<Blocker, 'id' | 'createdAt' | 'resolved'>) => Promise<void>;
  resolveBlocker: (id: string) => Promise<void>;
  deleteBlocker: (id: string) => Promise<void>;
  
  // Briefing
  updateBriefing: (briefing: Partial<DailyBriefing>) => Promise<void>;
  
  // Tasks
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateTask: (id: string, data: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  moveTask: (id: string, status: Task['status']) => Promise<void>;
  
  // Quick Links
  addQuickLink: (link: Omit<QuickLink, 'id'>) => Promise<void>;
  deleteQuickLink: (id: string) => Promise<void>;
  
  // Search
  search: (query: string) => SearchResults;
  
  // Dark Mode
  darkMode: boolean;
  toggleDarkMode: () => void;
  
  // Refresh
  refreshData: () => Promise<void>;
}

export interface SearchResults {
  projects: Project[];
  documents: Document[];
  updates: Update[];
  tasks: Task[];
  links: QuickLink[];
}

const DataContext = createContext<DataContextType | undefined>(undefined);

// Helper to convert Supabase row to app types
function projectFromRow(row: Record<string, unknown>): Project {
  return {
    id: row.id as string,
    name: row.name as string,
    description: row.description as string,
    status: row.status as Project['status'],
    githubUrl: row.github_url as string | undefined,
    vercelUrl: row.vercel_url as string | undefined,
    notes: row.notes as string,
    details: row.details as string | undefined,
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string
  };
}

function documentFromRow(row: Record<string, unknown>): Document {
  return {
    id: row.id as string,
    title: row.title as string,
    description: row.description as string,
    content: row.content as string | undefined,
    category: row.category as Document['category'],
    url: row.url as string | undefined,
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string | undefined
  };
}

function updateFromRow(row: Record<string, unknown>): Update {
  return {
    id: row.id as string,
    content: row.content as string,
    timestamp: row.created_at as string,
    type: row.type as Update['type']
  };
}

function taskFromRow(row: Record<string, unknown>): Task {
  return {
    id: row.id as string,
    title: row.title as string,
    description: row.description as string | undefined,
    status: row.status as Task['status'],
    priority: row.priority as Task['priority'],
    projectId: row.project_id as string | undefined,
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string
  };
}

function linkFromRow(row: Record<string, unknown>): QuickLink {
  return {
    id: row.id as string,
    label: row.label as string,
    url: row.url as string,
    category: row.category as QuickLink['category'],
    description: row.description as string | undefined
  };
}

function briefingFromRow(row: Record<string, unknown>): DailyBriefing {
  return {
    date: row.date as string,
    summary: row.summary as string,
    mood: row.mood as DailyBriefing['mood'],
    keyItems: row.key_items as string[],
    whatsNext: row.whats_next as string[]
  };
}

function blockerFromRow(row: Record<string, unknown>): Blocker {
  return {
    id: row.id as string,
    title: row.title as string,
    description: row.description as string,
    severity: row.severity as Blocker['severity'],
    category: row.category as Blocker['category'],
    resolved: row.resolved as boolean,
    createdAt: row.created_at as string
  };
}

export function DataProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [updates, setUpdates] = useState<Update[]>([]);
  const [quickLinks, setQuickLinks] = useState<QuickLink[]>([]);
  const [blockers, setBlockers] = useState<Blocker[]>([]);
  const [briefing, setBriefing] = useState<DailyBriefing>(initialBriefing);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [darkMode, setDarkMode] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [useSupabase, setUseSupabase] = useState(true);

  // Fetch all data from Supabase
  const fetchAllData = useCallback(async () => {
    if (!useSupabase || !user) {
      // If no user or not using Supabase, use initial data
      setProjects(initialProjects);
      setDocuments(initialDocuments);
      setUpdates(initialUpdates);
      setTasks(initialTasks);
      setQuickLinks(initialQuickLinks);
      setBlockers(initialBlockers);
      setBriefing(initialBriefing);
      setIsLoading(false);
      return;
    }
    
    try {
      setIsLoading(true);
      
      // Fetch all tables in parallel
      const [
        projectsRes,
        documentsRes,
        updatesRes,
        tasksRes,
        linksRes,
        briefingsRes,
        blockersRes
      ] = await Promise.all([
        supabase.from('projects').select('*').order('created_at', { ascending: false }),
        supabase.from('documents').select('*').order('created_at', { ascending: false }),
        supabase.from('updates').select('*').order('created_at', { ascending: false }),
        supabase.from('tasks').select('*').order('created_at', { ascending: false }),
        supabase.from('links').select('*').order('created_at', { ascending: false }),
        supabase.from('briefings').select('*').order('date', { ascending: false }).limit(1),
        supabase.from('blockers').select('*').order('created_at', { ascending: false })
      ]);

      // Check for errors - if tables don't exist, fall back to initial data
      if (projectsRes.error?.code === '42P01' || projectsRes.error?.code === 'PGRST205') {
        console.warn('Supabase tables not found, using initial data. Run the migration first.');
        setUseSupabase(false);
        setProjects(initialProjects);
        setDocuments(initialDocuments);
        setUpdates(initialUpdates);
        setTasks(initialTasks);
        setQuickLinks(initialQuickLinks);
        setBlockers(initialBlockers);
        setBriefing(initialBriefing);
        setIsLoading(false);
        return;
      }

      // Map to app types
      if (projectsRes.data) setProjects(projectsRes.data.map(projectFromRow));
      if (documentsRes.data) setDocuments(documentsRes.data.map(documentFromRow));
      if (updatesRes.data) setUpdates(updatesRes.data.map(updateFromRow));
      if (tasksRes.data) setTasks(tasksRes.data.map(taskFromRow));
      if (linksRes.data) setQuickLinks(linksRes.data.map(linkFromRow));
      if (blockersRes.data) setBlockers(blockersRes.data.map(blockerFromRow));
      if (briefingsRes.data && briefingsRes.data.length > 0) {
        setBriefing(briefingFromRow(briefingsRes.data[0]));
      }
    } catch (error) {
      console.error('Error fetching data from Supabase:', error);
      // Fall back to initial data
      setUseSupabase(false);
      setProjects(initialProjects);
      setDocuments(initialDocuments);
      setUpdates(initialUpdates);
      setTasks(initialTasks);
      setQuickLinks(initialQuickLinks);
      setBlockers(initialBlockers);
      setBriefing(initialBriefing);
    } finally {
      setIsLoading(false);
    }
  }, [useSupabase, user]);

  // Fetch data when user changes
  useEffect(() => {
    fetchAllData();
  }, [fetchAllData, user]);

  // Load dark mode preference from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('umbra-hq-darkmode');
      if (stored !== null) setDarkMode(JSON.parse(stored));
    }
  }, []);

  // Apply dark mode class to html
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.classList.toggle('dark', darkMode);
    }
    if (typeof window !== 'undefined') {
      localStorage.setItem('umbra-hq-darkmode', JSON.stringify(darkMode));
    }
  }, [darkMode]);

  // Updates
  const addUpdate = async (content: string, type: Update['type']) => {
    if (!useSupabase || !user) {
      const newUpdate: Update = {
        id: Date.now().toString(),
        content,
        timestamp: new Date().toISOString(),
        type
      };
      setUpdates(prev => [newUpdate, ...prev]);
      return;
    }

    const { data, error } = await supabase
      .from('updates')
      .insert({ content, type, user_id: user.id })
      .select()
      .single();
    
    if (error) {
      console.error('Error adding update:', error);
      return;
    }
    
    setUpdates(prev => [updateFromRow(data), ...prev]);
  };

  // Projects
  const updateProject = async (id: string, data: Partial<Project>) => {
    if (!useSupabase || !user) {
      setProjects(prev =>
        prev.map(p =>
          p.id === id
            ? { ...p, ...data, updatedAt: new Date().toISOString() }
            : p
        )
      );
      return;
    }

    const updateData: Record<string, unknown> = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.status !== undefined) updateData.status = data.status;
    if (data.githubUrl !== undefined) updateData.github_url = data.githubUrl;
    if (data.vercelUrl !== undefined) updateData.vercel_url = data.vercelUrl;
    if (data.notes !== undefined) updateData.notes = data.notes;
    if (data.details !== undefined) updateData.details = data.details;

    const { error } = await supabase
      .from('projects')
      .update(updateData)
      .eq('id', id);
    
    if (error) {
      console.error('Error updating project:', error);
      return;
    }
    
    setProjects(prev =>
      prev.map(p =>
        p.id === id
          ? { ...p, ...data, updatedAt: new Date().toISOString() }
          : p
      )
    );
  };

  const addProject = async (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!useSupabase || !user) {
      const newProject: Project = {
        ...project,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      setProjects(prev => [newProject, ...prev]);
      return;
    }

    const { data, error } = await supabase
      .from('projects')
      .insert({
        user_id: user.id,
        name: project.name,
        description: project.description,
        status: project.status,
        github_url: project.githubUrl,
        vercel_url: project.vercelUrl,
        notes: project.notes,
        details: project.details
      })
      .select()
      .single();
    
    if (error) {
      console.error('Error adding project:', error);
      return;
    }
    
    setProjects(prev => [projectFromRow(data), ...prev]);
  };

  const deleteProject = async (id: string) => {
    if (!useSupabase || !user) {
      setProjects(prev => prev.filter(p => p.id !== id));
      return;
    }

    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting project:', error);
      return;
    }
    
    setProjects(prev => prev.filter(p => p.id !== id));
  };

  const getProjectById = (id: string) => projects.find(p => p.id === id);

  // Documents
  const addDocument = async (doc: Omit<Document, 'id' | 'createdAt'>) => {
    if (!useSupabase || !user) {
      const newDoc: Document = {
        ...doc,
        id: Date.now().toString(),
        createdAt: new Date().toISOString()
      };
      setDocuments(prev => [newDoc, ...prev]);
      return;
    }

    const { data, error } = await supabase
      .from('documents')
      .insert({
        user_id: user.id,
        title: doc.title,
        description: doc.description,
        content: doc.content,
        category: doc.category,
        url: doc.url
      })
      .select()
      .single();
    
    if (error) {
      console.error('Error adding document:', error);
      return;
    }
    
    setDocuments(prev => [documentFromRow(data), ...prev]);
  };

  const updateDocument = async (id: string, data: Partial<Document>) => {
    if (!useSupabase || !user) {
      setDocuments(prev =>
        prev.map(d =>
          d.id === id
            ? { ...d, ...data, updatedAt: new Date().toISOString() }
            : d
        )
      );
      return;
    }

    const updateData: Record<string, unknown> = {};
    if (data.title !== undefined) updateData.title = data.title;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.content !== undefined) updateData.content = data.content;
    if (data.category !== undefined) updateData.category = data.category;
    if (data.url !== undefined) updateData.url = data.url;

    const { error } = await supabase
      .from('documents')
      .update(updateData)
      .eq('id', id);
    
    if (error) {
      console.error('Error updating document:', error);
      return;
    }
    
    setDocuments(prev =>
      prev.map(d =>
        d.id === id
          ? { ...d, ...data, updatedAt: new Date().toISOString() }
          : d
      )
    );
  };

  const deleteDocument = async (id: string) => {
    if (!useSupabase || !user) {
      setDocuments(prev => prev.filter(d => d.id !== id));
      return;
    }

    const { error } = await supabase
      .from('documents')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting document:', error);
      return;
    }
    
    setDocuments(prev => prev.filter(d => d.id !== id));
  };

  const getDocumentById = (id: string) => documents.find(d => d.id === id);

  // Blockers
  const addBlocker = async (blocker: Omit<Blocker, 'id' | 'createdAt' | 'resolved'>) => {
    if (!useSupabase || !user) {
      const newBlocker: Blocker = {
        ...blocker,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        resolved: false
      };
      setBlockers(prev => [newBlocker, ...prev]);
      return;
    }

    const { data, error } = await supabase
      .from('blockers')
      .insert({
        user_id: user.id,
        title: blocker.title,
        description: blocker.description,
        severity: blocker.severity,
        category: blocker.category
      })
      .select()
      .single();
    
    if (error) {
      console.error('Error adding blocker:', error);
      return;
    }
    
    setBlockers(prev => [blockerFromRow(data), ...prev]);
  };

  const resolveBlocker = async (id: string) => {
    if (!useSupabase || !user) {
      setBlockers(prev =>
        prev.map(b => (b.id === id ? { ...b, resolved: true } : b))
      );
      return;
    }

    const { error } = await supabase
      .from('blockers')
      .update({ resolved: true })
      .eq('id', id);
    
    if (error) {
      console.error('Error resolving blocker:', error);
      return;
    }
    
    setBlockers(prev =>
      prev.map(b => (b.id === id ? { ...b, resolved: true } : b))
    );
  };

  const deleteBlocker = async (id: string) => {
    if (!useSupabase || !user) {
      setBlockers(prev => prev.filter(b => b.id !== id));
      return;
    }

    const { error } = await supabase
      .from('blockers')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting blocker:', error);
      return;
    }
    
    setBlockers(prev => prev.filter(b => b.id !== id));
  };

  // Briefing
  const updateBriefing = async (data: Partial<DailyBriefing>) => {
    const newBriefing = { ...briefing, ...data };
    setBriefing(newBriefing);

    if (!useSupabase || !user) return;

    // Upsert briefing by date
    const { error } = await supabase
      .from('briefings')
      .upsert({
        user_id: user.id,
        date: newBriefing.date,
        summary: newBriefing.summary,
        mood: newBriefing.mood,
        key_items: newBriefing.keyItems,
        whats_next: newBriefing.whatsNext
      }, { onConflict: 'user_id,date' });
    
    if (error) {
      console.error('Error updating briefing:', error);
    }
  };

  // Tasks
  const addTask = async (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!useSupabase || !user) {
      const newTask: Task = {
        ...task,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      setTasks(prev => [newTask, ...prev]);
      return;
    }

    const { data, error } = await supabase
      .from('tasks')
      .insert({
        user_id: user.id,
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority,
        project_id: task.projectId
      })
      .select()
      .single();
    
    if (error) {
      console.error('Error adding task:', error);
      return;
    }
    
    setTasks(prev => [taskFromRow(data), ...prev]);
  };

  const updateTask = async (id: string, data: Partial<Task>) => {
    if (!useSupabase || !user) {
      setTasks(prev =>
        prev.map(t =>
          t.id === id
            ? { ...t, ...data, updatedAt: new Date().toISOString() }
            : t
        )
      );
      return;
    }

    const updateData: Record<string, unknown> = {};
    if (data.title !== undefined) updateData.title = data.title;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.status !== undefined) updateData.status = data.status;
    if (data.priority !== undefined) updateData.priority = data.priority;
    if (data.projectId !== undefined) updateData.project_id = data.projectId;

    const { error } = await supabase
      .from('tasks')
      .update(updateData)
      .eq('id', id);
    
    if (error) {
      console.error('Error updating task:', error);
      return;
    }
    
    setTasks(prev =>
      prev.map(t =>
        t.id === id
          ? { ...t, ...data, updatedAt: new Date().toISOString() }
          : t
      )
    );
  };

  const deleteTask = async (id: string) => {
    if (!useSupabase || !user) {
      setTasks(prev => prev.filter(t => t.id !== id));
      return;
    }

    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting task:', error);
      return;
    }
    
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const moveTask = async (id: string, status: Task['status']) => {
    await updateTask(id, { status });
  };

  // Quick Links
  const addQuickLink = async (link: Omit<QuickLink, 'id'>) => {
    if (!useSupabase || !user) {
      const newLink: QuickLink = {
        ...link,
        id: Date.now().toString()
      };
      setQuickLinks(prev => [newLink, ...prev]);
      return;
    }

    const { data, error } = await supabase
      .from('links')
      .insert({
        user_id: user.id,
        label: link.label,
        url: link.url,
        category: link.category,
        description: link.description
      })
      .select()
      .single();
    
    if (error) {
      console.error('Error adding link:', error);
      return;
    }
    
    setQuickLinks(prev => [linkFromRow(data), ...prev]);
  };

  const deleteQuickLink = async (id: string) => {
    if (!useSupabase || !user) {
      setQuickLinks(prev => prev.filter(l => l.id !== id));
      return;
    }

    const { error } = await supabase
      .from('links')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting link:', error);
      return;
    }
    
    setQuickLinks(prev => prev.filter(l => l.id !== id));
  };

  // Search
  const search = (query: string): SearchResults => {
    const q = query.toLowerCase().trim();
    if (!q) {
      return { projects: [], documents: [], updates: [], tasks: [], links: [] };
    }

    return {
      projects: projects.filter(
        p =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.notes.toLowerCase().includes(q) ||
          (p.details && p.details.toLowerCase().includes(q))
      ),
      documents: documents.filter(
        d =>
          d.title.toLowerCase().includes(q) ||
          d.description.toLowerCase().includes(q) ||
          (d.content && d.content.toLowerCase().includes(q))
      ),
      updates: updates.filter(u => u.content.toLowerCase().includes(q)),
      tasks: tasks.filter(
        t =>
          t.title.toLowerCase().includes(q) ||
          (t.description && t.description.toLowerCase().includes(q))
      ),
      links: quickLinks.filter(
        l =>
          l.label.toLowerCase().includes(q) ||
          l.url.toLowerCase().includes(q) ||
          (l.description && l.description.toLowerCase().includes(q))
      )
    };
  };

  const toggleDarkMode = () => {
    setDarkMode(prev => !prev);
  };

  const refreshData = async () => {
    await fetchAllData();
  };

  return (
    <DataContext.Provider
      value={{
        projects,
        documents,
        updates,
        quickLinks,
        blockers,
        briefing,
        tasks,
        isLoading,
        addUpdate,
        updateProject,
        addProject,
        deleteProject,
        getProjectById,
        addDocument,
        updateDocument,
        deleteDocument,
        getDocumentById,
        addBlocker,
        resolveBlocker,
        deleteBlocker,
        updateBriefing,
        addTask,
        updateTask,
        deleteTask,
        moveTask,
        addQuickLink,
        deleteQuickLink,
        search,
        darkMode,
        toggleDarkMode,
        refreshData
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
