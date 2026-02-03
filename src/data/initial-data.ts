// Initial data for Umbra HQ

export interface Project {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'completed' | 'on-hold';
  githubUrl?: string;
  vercelUrl?: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface Document {
  id: string;
  title: string;
  category: 'audits' | 'research' | 'marketing' | 'technical' | 'other';
  url?: string;
  description: string;
  createdAt: string;
}

export interface Update {
  id: string;
  content: string;
  timestamp: string;
  type: 'status' | 'task' | 'note' | 'milestone';
}

export interface QuickLink {
  id: string;
  label: string;
  url: string;
  category: 'site' | 'repo' | 'tool';
}

export const initialProjects: Project[] = [
  {
    id: '1',
    name: 'Demo Site',
    description: 'Interactive demo showcasing Umbra capabilities and features',
    status: 'active',
    githubUrl: 'https://github.com/umbrarelay-maker/demo-site',
    vercelUrl: 'https://demo-site.vercel.app',
    notes: 'Main showcase for potential users. Needs polishing.',
    createdAt: '2026-02-03T00:00:00Z',
    updatedAt: '2026-02-03T05:00:00Z'
  },
  {
    id: '2',
    name: 'Report Viewer',
    description: 'Web interface for viewing and navigating generated reports',
    status: 'active',
    githubUrl: 'https://github.com/umbrarelay-maker/report-viewer',
    vercelUrl: 'https://report-viewer.vercel.app',
    notes: 'Renders markdown reports with navigation. MVP complete.',
    createdAt: '2026-02-03T00:00:00Z',
    updatedAt: '2026-02-03T04:30:00Z'
  },
  {
    id: '3',
    name: 'Chatbot Framework',
    description: 'Modular chatbot framework with pluggable backends',
    status: 'active',
    githubUrl: 'https://github.com/umbrarelay-maker/chatbot-framework',
    notes: 'Core architecture defined. Building conversation engine.',
    createdAt: '2026-02-03T01:00:00Z',
    updatedAt: '2026-02-03T05:15:00Z'
  },
  {
    id: '4',
    name: 'Conduit AI',
    description: 'AI-powered workflow automation and orchestration platform',
    status: 'active',
    githubUrl: 'https://github.com/umbrarelay-maker/conduit-ai',
    notes: 'Conceptual phase. Defining core workflows.',
    createdAt: '2026-02-03T02:00:00Z',
    updatedAt: '2026-02-03T05:00:00Z'
  },
  {
    id: '5',
    name: 'Marketing Plan',
    description: 'Strategic marketing documentation and campaign planning',
    status: 'active',
    notes: 'Drafting initial GTM strategy. Focus on dev community.',
    createdAt: '2026-02-03T03:00:00Z',
    updatedAt: '2026-02-03T05:30:00Z'
  }
];

export const initialDocuments: Document[] = [
  {
    id: '1',
    title: 'Project Audit Report',
    category: 'audits',
    description: 'Comprehensive audit of current project states and priorities',
    createdAt: '2026-02-03T04:00:00Z'
  },
  {
    id: '2',
    title: 'AI Landscape Research',
    category: 'research',
    description: 'Analysis of current AI tools and market positioning',
    createdAt: '2026-02-03T03:30:00Z'
  },
  {
    id: '3',
    title: 'Go-to-Market Strategy',
    category: 'marketing',
    description: 'Initial marketing strategy for Umbra ecosystem',
    createdAt: '2026-02-03T05:00:00Z'
  },
  {
    id: '4',
    title: 'Architecture Overview',
    category: 'technical',
    description: 'Technical architecture documentation for all systems',
    createdAt: '2026-02-03T02:00:00Z'
  }
];

export const initialUpdates: Update[] = [
  {
    id: '1',
    content: '🚀 Created Umbra HQ dashboard - our central collaboration hub is now live!',
    timestamp: '2026-02-03T05:40:00Z',
    type: 'milestone'
  },
  {
    id: '2',
    content: 'Completed initial setup of 5 core projects: Demo Site, Report Viewer, Chatbot Framework, Conduit AI, and Marketing Plan',
    timestamp: '2026-02-03T05:30:00Z',
    type: 'task'
  },
  {
    id: '3',
    content: 'Successfully deployed Report Viewer to Vercel - MVP is functional',
    timestamp: '2026-02-03T04:30:00Z',
    type: 'task'
  },
  {
    id: '4',
    content: 'Architected Chatbot Framework with modular design for pluggable LLM backends',
    timestamp: '2026-02-03T04:00:00Z',
    type: 'task'
  },
  {
    id: '5',
    content: 'Tonight\'s focus: Building out the core infrastructure and getting everything deployed',
    timestamp: '2026-02-03T03:00:00Z',
    type: 'status'
  },
  {
    id: '6',
    content: 'Starting session with Joe - lots to build tonight! 💪',
    timestamp: '2026-02-03T02:00:00Z',
    type: 'status'
  }
];

export const initialQuickLinks: QuickLink[] = [
  {
    id: '1',
    label: 'Demo Site',
    url: 'https://demo-site.vercel.app',
    category: 'site'
  },
  {
    id: '2',
    label: 'Report Viewer',
    url: 'https://report-viewer.vercel.app',
    category: 'site'
  },
  {
    id: '3',
    label: 'Umbra HQ',
    url: 'https://umbra-hq.vercel.app',
    category: 'site'
  },
  {
    id: '4',
    label: 'Demo Site Repo',
    url: 'https://github.com/umbrarelay-maker/demo-site',
    category: 'repo'
  },
  {
    id: '5',
    label: 'Report Viewer Repo',
    url: 'https://github.com/umbrarelay-maker/report-viewer',
    category: 'repo'
  },
  {
    id: '6',
    label: 'Chatbot Framework Repo',
    url: 'https://github.com/umbrarelay-maker/chatbot-framework',
    category: 'repo'
  },
  {
    id: '7',
    label: 'Conduit AI Repo',
    url: 'https://github.com/umbrarelay-maker/conduit-ai',
    category: 'repo'
  },
  {
    id: '8',
    label: 'OpenClaw',
    url: 'https://openclaw.dev',
    category: 'tool'
  }
];
