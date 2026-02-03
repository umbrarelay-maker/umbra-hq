'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  Project,
  Document,
  Update,
  QuickLink,
  Blocker,
  DailyBriefing,
  initialProjects,
  initialDocuments,
  initialUpdates,
  initialQuickLinks,
  initialBlockers,
  initialBriefing
} from '@/data/initial-data';

interface DataContextType {
  projects: Project[];
  documents: Document[];
  updates: Update[];
  quickLinks: QuickLink[];
  blockers: Blocker[];
  briefing: DailyBriefing;
  addUpdate: (content: string, type: Update['type']) => void;
  updateProject: (id: string, data: Partial<Project>) => void;
  addProject: (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => void;
  addBlocker: (blocker: Omit<Blocker, 'id' | 'createdAt' | 'resolved'>) => void;
  resolveBlocker: (id: string) => void;
  updateBriefing: (briefing: Partial<DailyBriefing>) => void;
  getProjectById: (id: string) => Project | undefined;
  getDocumentById: (id: string) => Document | undefined;
  darkMode: boolean;
  toggleDarkMode: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const STORAGE_KEYS = {
  projects: 'umbra-hq-projects',
  documents: 'umbra-hq-documents',
  updates: 'umbra-hq-updates',
  quickLinks: 'umbra-hq-quicklinks',
  blockers: 'umbra-hq-blockers',
  briefing: 'umbra-hq-briefing',
  darkMode: 'umbra-hq-darkmode'
};

export function DataProvider({ children }: { children: ReactNode }) {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [documents, setDocuments] = useState<Document[]>(initialDocuments);
  const [updates, setUpdates] = useState<Update[]>(initialUpdates);
  const [quickLinks, setQuickLinks] = useState<QuickLink[]>(initialQuickLinks);
  const [blockers, setBlockers] = useState<Blocker[]>(initialBlockers);
  const [briefing, setBriefing] = useState<DailyBriefing>(initialBriefing);
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
      const storedDarkMode = localStorage.getItem(STORAGE_KEYS.darkMode);

      if (storedProjects) setProjects(JSON.parse(storedProjects));
      if (storedDocuments) setDocuments(JSON.parse(storedDocuments));
      if (storedUpdates) setUpdates(JSON.parse(storedUpdates));
      if (storedQuickLinks) setQuickLinks(JSON.parse(storedQuickLinks));
      if (storedBlockers) setBlockers(JSON.parse(storedBlockers));
      if (storedBriefing) setBriefing(JSON.parse(storedBriefing));
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
      localStorage.setItem(STORAGE_KEYS.darkMode, JSON.stringify(darkMode));
    }
  }, [darkMode, isLoaded]);

  // Apply dark mode class to html
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.classList.toggle('dark', darkMode);
    }
  }, [darkMode]);

  const addUpdate = (content: string, type: Update['type']) => {
    const newUpdate: Update = {
      id: Date.now().toString(),
      content,
      timestamp: new Date().toISOString(),
      type
    };
    setUpdates(prev => [newUpdate, ...prev]);
  };

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

  const updateBriefing = (data: Partial<DailyBriefing>) => {
    setBriefing(prev => ({ ...prev, ...data }));
  };

  const getProjectById = (id: string) => projects.find(p => p.id === id);
  const getDocumentById = (id: string) => documents.find(d => d.id === id);

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
        addUpdate,
        updateProject,
        addProject,
        addBlocker,
        resolveBlocker,
        updateBriefing,
        getProjectById,
        getDocumentById,
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
