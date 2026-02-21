import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY!;

export async function POST(request: Request) {
  // Simple bearer auth using a dedicated token (server-side only)
  const authHeader = request.headers.get('authorization');
  const expectedKey = process.env.HQ_UPDATES_TOKEN;

  if (!expectedKey || !authHeader || authHeader !== `Bearer ${expectedKey}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let body: any;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const content = typeof body?.content === 'string' ? body.content.trim() : '';
  const type = typeof body?.type === 'string' ? body.type : 'note';

  if (!content) {
    return NextResponse.json({ error: 'content is required' }, { status: 400 });
  }

  const allowed = new Set(['status', 'task', 'note', 'milestone']);
  if (!allowed.has(type)) {
    return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  const { data, error } = await supabase
    .from('updates')
    .insert({ content, type })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, update: data });
}

export async function GET() {
  return NextResponse.json({
    message: 'POST {content,type} with Authorization: Bearer $SUPABASE_SERVICE_KEY to create an update'
  });
}
