'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  Project,
  Document,
  Update,
  QuickLink,
  initialProjects,
  initialDocuments,
  initialUpdates,
  initialQuickLinks
} from '@/data/initial-data';

interface DataContextType {
  projects: Project[];
  documents: Document[];
  updates: Update[];
  quickLinks: QuickLink[];
  addUpdate: (content: string, type: Update['type']) => void;
  updateProject: (id: string, data: Partial<Project>) => void;
  addProject: (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => void;
  darkMode: boolean;
  toggleDarkMode: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const STORAGE_KEYS = {
  projects: 'umbra-hq-projects',
  documents: 'umbra-hq-documents',
  updates: 'umbra-hq-updates',
  quickLinks: 'umbra-hq-quicklinks',
  darkMode: 'umbra-hq-darkmode'
};

export function DataProvider({ children }: { children: ReactNode }) {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [documents, setDocuments] = useState<Document[]>(initialDocuments);
  const [updates, setUpdates] = useState<Update[]>(initialUpdates);
  const [quickLinks, setQuickLinks] = useState<QuickLink[]>(initialQuickLinks);
  const [darkMode, setDarkMode] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedProjects = localStorage.getItem(STORAGE_KEYS.projects);
      const storedDocuments = localStorage.getItem(STORAGE_KEYS.documents);
      const storedUpdates = localStorage.getItem(STORAGE_KEYS.updates);
      const storedQuickLinks = localStorage.getItem(STORAGE_KEYS.quickLinks);
      const storedDarkMode = localStorage.getItem(STORAGE_KEYS.darkMode);

      if (storedProjects) setProjects(JSON.parse(storedProjects));
      if (storedDocuments) setDocuments(JSON.parse(storedDocuments));
      if (storedUpdates) setUpdates(JSON.parse(storedUpdates));
      if (storedQuickLinks) setQuickLinks(JSON.parse(storedQuickLinks));
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
        addUpdate,
        updateProject,
        addProject,
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
