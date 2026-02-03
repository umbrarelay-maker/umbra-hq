'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
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
  
  // Updates
  addUpdate: (content: string, type: Update['type']) => void;
  
  // Projects
  updateProject: (id: string, data: Partial<Project>) => void;
  addProject: (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => void;
  deleteProject: (id: string) => void;
  getProjectById: (id: string) => Project | undefined;
  
  // Documents
  addDocument: (doc: Omit<Document, 'id' | 'createdAt'>) => void;
  updateDocument: (id: string, data: Partial<Document>) => void;
  deleteDocument: (id: string) => void;
  getDocumentById: (id: string) => Document | undefined;
  
  // Blockers
  addBlocker: (blocker: Omit<Blocker, 'id' | 'createdAt' | 'resolved'>) => void;
  resolveBlocker: (id: string) => void;
  deleteBlocker: (id: string) => void;
  
  // Briefing
  updateBriefing: (briefing: Partial<DailyBriefing>) => void;
  
  // Tasks
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTask: (id: string, data: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  moveTask: (id: string, status: Task['status']) => void;
  
  // Quick Links
  addQuickLink: (link: Omit<QuickLink, 'id'>) => void;
  deleteQuickLink: (id: string) => void;
  
  // Search
  search: (query: string) => SearchResults;
  
  // Dark Mode
  darkMode: boolean;
  toggleDarkMode: () => void;
}

export interface SearchResults {
  projects: Project[];
  documents: Document[];
  updates: Update[];
  tasks: Task[];
  links: QuickLink[];
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const STORAGE_KEYS = {
  projects: 'umbra-hq-projects',
  documents: 'umbra-hq-documents',
  updates: 'umbra-hq-updates',
  quickLinks: 'umbra-hq-quicklinks',
  blockers: 'umbra-hq-blockers',
  briefing: 'umbra-hq-briefing',
  tasks: 'umbra-hq-tasks',
  darkMode: 'umbra-hq-darkmode'
};

export function DataProvider({ children }: { children: ReactNode }) {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [documents, setDocuments] = useState<Document[]>(initialDocuments);
  const [updates, setUpdates] = useState<Update[]>(initialUpdates);
  const [quickLinks, setQuickLinks] = useState<QuickLink[]>(initialQuickLinks);
  const [blockers, setBlockers] = useState<Blocker[]>(initialBlockers);
  const [briefing, setBriefing] = useState<DailyBriefing>(initialBriefing);
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [darkMode, setDarkMode] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedProjects = localStorage.getItem(STORAGE_KEYS.projects);
      const storedDocuments = localStorage.getItem(STORAGE_KEYS.documents);
      const storedUpdates = localStorage.getItem(STORAGE_KEYS.updates);
      const storedQuickLinks = localStorage.getItem(STORAGE_KEYS.quickLinks);
      const storedBlockers = localStorage.getItem(STORAGE_KEYS.blockers);
      const storedBriefing = localStorage.getItem(STORAGE_KEYS.briefing);
      const storedTasks = localStorage.getItem(STORAGE_KEYS.tasks);
      const storedDarkMode = localStorage.getItem(STORAGE_KEYS.darkMode);

      if (storedProjects) setProjects(JSON.parse(storedProjects));
      if (storedDocuments) setDocuments(JSON.parse(storedDocuments));
      if (storedUpdates) setUpdates(JSON.parse(storedUpdates));
      if (storedQuickLinks) setQuickLinks(JSON.parse(storedQuickLinks));
      if (storedBlockers) setBlockers(JSON.parse(storedBlockers));
      if (storedBriefing) setBriefing(JSON.parse(storedBriefing));
      if (storedTasks) setTasks(JSON.parse(storedTasks));
      if (storedDarkMode !== null) setDarkMode(JSON.parse(storedDarkMode));
      
      setIsLoaded(true);
    }
  }, []);

  // Save to localStorage on changes
  useEffect(() => {
    if (isLoaded && typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.projects, JSON.stringify(projects));
    }
  }, [projects, isLoaded]);

  useEffect(() => {
    if (isLoaded && typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.documents, JSON.stringify(documents));
    }
  }, [documents, isLoaded]);

  useEffect(() => {
    if (isLoaded && typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.updates, JSON.stringify(updates));
    }
  }, [updates, isLoaded]);

  useEffect(() => {
    if (isLoaded && typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.quickLinks, JSON.stringify(quickLinks));
    }
  }, [quickLinks, isLoaded]);

  useEffect(() => {
    if (isLoaded && typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.blockers, JSON.stringify(blockers));
    }
  }, [blockers, isLoaded]);

  useEffect(() => {
    if (isLoaded && typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.briefing, JSON.stringify(briefing));
    }
  }, [briefing, isLoaded]);

  useEffect(() => {
    if (isLoaded && typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.tasks, JSON.stringify(tasks));
    }
  }, [tasks, isLoaded]);

  useEffect(() => {
    if (isLoaded && typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.darkMode, JSON.stringify(darkMode));
    }
  }, [darkMode, isLoaded]);

  // Apply dark mode class to html
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.classList.toggle('dark', darkMode);
    }
  }, [darkMode]);

  // Updates
  const addUpdate = (content: string, type: Update['type']) => {
    const newUpdate: Update = {
      id: Date.now().toString(),
      content,
      timestamp: new Date().toISOString(),
      type
    };
    setUpdates(prev => [newUpdate, ...prev]);
  };

  // Projects
  const updateProject = (id: string, data: Partial<Project>) => {
    setProjects(prev =>
      prev.map(p =>
        p.id === id
          ? { ...p, ...data, updatedAt: new Date().toISOString() }
          : p
      )
    );
  };

  const addProject = (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newProject: Project = {
      ...project,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setProjects(prev => [newProject, ...prev]);
  };

  const deleteProject = (id: string) => {
    setProjects(prev => prev.filter(p => p.id !== id));
  };

  const getProjectById = (id: string) => projects.find(p => p.id === id);

  // Documents
  const addDocument = (doc: Omit<Document, 'id' | 'createdAt'>) => {
    const newDoc: Document = {
      ...doc,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    setDocuments(prev => [newDoc, ...prev]);
  };

  const updateDocument = (id: string, data: Partial<Document>) => {
    setDocuments(prev =>
      prev.map(d =>
        d.id === id
          ? { ...d, ...data, updatedAt: new Date().toISOString() }
          : d
      )
    );
  };

  const deleteDocument = (id: string) => {
    setDocuments(prev => prev.filter(d => d.id !== id));
  };

  const getDocumentById = (id: string) => documents.find(d => d.id === id);

  // Blockers
  const addBlocker = (blocker: Omit<Blocker, 'id' | 'createdAt' | 'resolved'>) => {
    const newBlocker: Blocker = {
      ...blocker,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      resolved: false
    };
    setBlockers(prev => [newBlocker, ...prev]);
  };

  const resolveBlocker = (id: string) => {
    setBlockers(prev =>
      prev.map(b => (b.id === id ? { ...b, resolved: true } : b))
    );
  };

  const deleteBlocker = (id: string) => {
    setBlockers(prev => prev.filter(b => b.id !== id));
  };

  // Briefing
  const updateBriefing = (data: Partial<DailyBriefing>) => {
    setBriefing(prev => ({ ...prev, ...data }));
  };

  // Tasks
  const addTask = (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newTask: Task = {
      ...task,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setTasks(prev => [newTask, ...prev]);
  };

  const updateTask = (id: string, data: Partial<Task>) => {
    setTasks(prev =>
      prev.map(t =>
        t.id === id
          ? { ...t, ...data, updatedAt: new Date().toISOString() }
          : t
      )
    );
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const moveTask = (id: string, status: Task['status']) => {
    updateTask(id, { status });
  };

  // Quick Links
  const addQuickLink = (link: Omit<QuickLink, 'id'>) => {
    const newLink: QuickLink = {
      ...link,
      id: Date.now().toString()
    };
    setQuickLinks(prev => [newLink, ...prev]);
  };

  const deleteQuickLink = (id: string) => {
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
        toggleDarkMode
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
