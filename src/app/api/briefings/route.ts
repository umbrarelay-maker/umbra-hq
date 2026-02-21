import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY!;

function unauthorized() {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}

export async function POST(request: Request) {
  const expected = process.env.HQ_UPDATES_TOKEN?.trim();
  const authHeader = request.headers.get('authorization');

  if (!expected || !authHeader || authHeader.trim() !== `Bearer ${expected}`) {
    return unauthorized();
  }

  let body: any;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const date = typeof body?.date === 'string' ? body.date : null; // YYYY-MM-DD
  const summary = typeof body?.summary === 'string' ? body.summary : '';
  const mood = typeof body?.mood === 'string' ? body.mood : 'planning';
  const key_items = Array.isArray(body?.key_items) ? body.key_items : [];
  const whats_next = Array.isArray(body?.whats_next) ? body.whats_next : [];

  if (!date || !summary.trim()) {
    return NextResponse.json({ error: 'date and summary are required' }, { status: 400 });
  }

  const allowedMoods = new Set(['productive', 'blocked', 'planning', 'shipping']);
  if (!allowedMoods.has(mood)) {
    return NextResponse.json({ error: 'Invalid mood' }, { status: 400 });
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  const { data, error } = await supabase
    .from('briefings')
    .upsert({ date, summary, mood, key_items, whats_next }, { onConflict: 'date' })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, briefing: data });
}

export async function GET() {
  return NextResponse.json({
    message: 'POST daily briefing JSON with Authorization: Bearer $HQ_UPDATES_TOKEN'
  });
}
