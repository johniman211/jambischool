import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { searchParams } = new URL(request.url);
  
  const schoolId = searchParams.get('school_id');

  if (!schoolId) {
    return NextResponse.json({ error: 'school_id is required' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('subjects')
    .select('*')
    .eq('school_id', schoolId)
    .eq('is_active', true)
    .order('name', { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data });
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const body = await request.json();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { school_id, name, code, description, is_compulsory } = body;

  if (!school_id || !name || !code) {
    return NextResponse.json({ error: 'school_id, name, and code are required' }, { status: 400 });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase as any)
    .from('subjects')
    .insert({
      school_id,
      name,
      code,
      description,
      is_compulsory: is_compulsory || false,
      is_active: true,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data }, { status: 201 });
}
