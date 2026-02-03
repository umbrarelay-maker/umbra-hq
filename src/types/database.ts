export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      projects: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          description: string;
          status: 'active' | 'completed' | 'on-hold';
          github_url: string | null;
          vercel_url: string | null;
          notes: string;
          details: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          description: string;
          status: 'active' | 'completed' | 'on-hold';
          github_url?: string | null;
          vercel_url?: string | null;
          notes?: string;
          details?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          description?: string;
          status?: 'active' | 'completed' | 'on-hold';
          github_url?: string | null;
          vercel_url?: string | null;
          notes?: string;
          details?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      documents: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          content: string | null;
          description: string;
          category: 'audits' | 'research' | 'marketing' | 'technical' | 'other';
          url: string | null;
          created_at: string;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          content?: string | null;
          description: string;
          category: 'audits' | 'research' | 'marketing' | 'technical' | 'other';
          url?: string | null;
          created_at?: string;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          content?: string | null;
          description?: string;
          category?: 'audits' | 'research' | 'marketing' | 'technical' | 'other';
          url?: string | null;
          created_at?: string;
          updated_at?: string | null;
        };
      };
      updates: {
        Row: {
          id: string;
          user_id: string;
          content: string;
          type: 'status' | 'task' | 'note' | 'milestone';
          project_id: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          content: string;
          type: 'status' | 'task' | 'note' | 'milestone';
          project_id?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          content?: string;
          type?: 'status' | 'task' | 'note' | 'milestone';
          project_id?: string | null;
          created_at?: string;
        };
      };
      tasks: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          description: string | null;
          status: 'todo' | 'in-progress' | 'done';
          priority: 'low' | 'medium' | 'high';
          project_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          description?: string | null;
          status: 'todo' | 'in-progress' | 'done';
          priority: 'low' | 'medium' | 'high';
          project_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          description?: string | null;
          status?: 'todo' | 'in-progress' | 'done';
          priority?: 'low' | 'medium' | 'high';
          project_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      links: {
        Row: {
          id: string;
          user_id: string;
          label: string;
          url: string;
          category: 'site' | 'repo' | 'tool' | 'docs' | 'resource';
          description: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          label: string;
          url: string;
          category: 'site' | 'repo' | 'tool' | 'docs' | 'resource';
          description?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          label?: string;
          url?: string;
          category?: 'site' | 'repo' | 'tool' | 'docs' | 'resource';
          description?: string | null;
          created_at?: string;
        };
      };
      briefings: {
        Row: {
          id: string;
          user_id: string;
          date: string;
          summary: string;
          mood: 'productive' | 'blocked' | 'planning' | 'shipping';
          key_items: Json;
          whats_next: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          date: string;
          summary: string;
          mood: 'productive' | 'blocked' | 'planning' | 'shipping';
          key_items: Json;
          whats_next: Json;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          date?: string;
          summary?: string;
          mood?: 'productive' | 'blocked' | 'planning' | 'shipping';
          key_items?: Json;
          whats_next?: Json;
          created_at?: string;
        };
      };
      blockers: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          description: string;
          severity: 'critical' | 'high' | 'medium';
          category: 'billing' | 'access' | 'rate-limit' | 'account' | 'technical' | 'other';
          resolved: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          description: string;
          severity: 'critical' | 'high' | 'medium';
          category: 'billing' | 'access' | 'rate-limit' | 'account' | 'technical' | 'other';
          resolved?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          description?: string;
          severity?: 'critical' | 'high' | 'medium';
          category?: 'billing' | 'access' | 'rate-limit' | 'account' | 'technical' | 'other';
          resolved?: boolean;
          created_at?: string;
        };
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}
