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
    .from('academic_years')
    .select('*')
    .eq('school_id', schoolId)
    .order('start_date', { ascending: false });

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

  const { school_id, name, start_date, end_date, is_current } = body;

  if (!school_id || !name || !start_date || !end_date) {
    return NextResponse.json({ error: 'school_id, name, start_date, and end_date are required' }, { status: 400 });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const supabaseAny = supabase as any;

  // If this is set as current, unset other current academic years
  if (is_current) {
    await supabaseAny
      .from('academic_years')
      .update({ is_current: false })
      .eq('school_id', school_id);
  }

  const { data, error } = await supabaseAny
    .from('academic_years')
    .insert({
      school_id,
      name,
      start_date,
      end_date,
      is_current: is_current || false,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data }, { status: 201 });
}
