import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import {
  initialProjects,
  initialDocuments,
  initialUpdates,
  initialQuickLinks,
  initialBlockers,
  initialBriefing,
  initialTasks
} from '@/data/initial-data';

// Use service role key for seeding
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY!;

export async function POST(request: Request) {
  // Check for authorization
  const authHeader = request.headers.get('authorization');
  const expectedKey = process.env.SUPABASE_SERVICE_KEY;
  
  if (!authHeader || authHeader !== `Bearer ${expectedKey}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  const supabase = createClient(supabaseUrl, supabaseServiceKey);
  const results: Record<string, unknown> = {};
  
  try {
    // Seed projects
    const { data: projectData, error: projectError } = await supabase
      .from('projects')
      .upsert(
        initialProjects.map(p => ({
          name: p.name,
          description: p.description,
          status: p.status,
          github_url: p.githubUrl,
          vercel_url: p.vercelUrl,
          notes: p.notes,
          details: p.details
        })),
        { onConflict: 'name' }
      )
      .select();
    
    results.projects = projectError ? { error: projectError.message } : { count: projectData?.length };

    // Get project ID mapping for tasks that reference projects
    const { data: allProjects } = await supabase.from('projects').select('id, name');
    const projectMap = new Map(allProjects?.map(p => [p.name, p.id]) || []);

    // Seed documents
    const { data: docData, error: docError } = await supabase
      .from('documents')
      .upsert(
        initialDocuments.map(d => ({
          title: d.title,
          description: d.description,
          content: d.content,
          category: d.category,
          url: d.url
        })),
        { onConflict: 'title' }
      )
      .select();
    
    results.documents = docError ? { error: docError.message } : { count: docData?.length };

    // Seed updates
    const { data: updateData, error: updateError } = await supabase
      .from('updates')
      .insert(
        initialUpdates.map(u => ({
          content: u.content,
          type: u.type,
          created_at: u.timestamp
        }))
      )
      .select();
    
    results.updates = updateError ? { error: updateError.message } : { count: updateData?.length };

    // Seed tasks with project references
    const projectNameById: Record<string, string> = {
      '1': 'Demo Site',
      '2': 'Report Viewer',
      '3': 'Chatbot Framework',
      '4': 'Conduit AI',
      '5': 'Marketing Plan'
    };
    
    const { data: taskData, error: taskError } = await supabase
      .from('tasks')
      .insert(
        initialTasks.map(t => ({
          title: t.title,
          description: t.description,
          status: t.status,
          priority: t.priority,
          project_id: t.projectId ? projectMap.get(projectNameById[t.projectId]) : null
        }))
      )
      .select();
    
    results.tasks = taskError ? { error: taskError.message } : { count: taskData?.length };

    // Seed links
    const { data: linkData, error: linkError } = await supabase
      .from('links')
      .upsert(
        initialQuickLinks.map(l => ({
          label: l.label,
          url: l.url,
          category: l.category,
          description: l.description
        })),
        { onConflict: 'url' }
      )
      .select();
    
    results.links = linkError ? { error: linkError.message } : { count: linkData?.length };

    // Seed briefing
    const { data: briefingData, error: briefingError } = await supabase
      .from('briefings')
      .upsert({
        date: initialBriefing.date,
        summary: initialBriefing.summary,
        mood: initialBriefing.mood,
        key_items: initialBriefing.keyItems,
        whats_next: initialBriefing.whatsNext
      }, { onConflict: 'date' })
      .select();
    
    results.briefings = briefingError ? { error: briefingError.message } : { count: briefingData?.length };

    // Seed blockers if any
    if (initialBlockers.length > 0) {
      const { data: blockerData, error: blockerError } = await supabase
        .from('blockers')
        .insert(
          initialBlockers.map(b => ({
            title: b.title,
            description: b.description,
            severity: b.severity,
            category: b.category,
            resolved: b.resolved
          }))
        )
        .select();
      
      results.blockers = blockerError ? { error: blockerError.message } : { count: blockerData?.length };
    } else {
      results.blockers = { count: 0, message: 'No initial blockers' };
    }

    return NextResponse.json({ success: true, results });
  } catch (error) {
    console.error('Seed error:', error);
    return NextResponse.json({ error: 'Seed failed', details: String(error) }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ 
    message: 'POST to this endpoint with Bearer authorization to seed the database',
    usage: 'curl -X POST -H "Authorization: Bearer $SERVICE_KEY" /api/seed'
  });
}
