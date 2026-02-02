import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { searchParams } = new URL(request.url);
  
  const schoolId = searchParams.get('school_id');
  const classId = searchParams.get('class_id');
  const date = searchParams.get('date');
  const studentId = searchParams.get('student_id');

  if (!schoolId) {
    return NextResponse.json({ error: 'school_id is required' }, { status: 400 });
  }

  let query = supabase
    .from('attendance_records')
    .select(`
      *,
      student:students(id, first_name, last_name, admission_number),
      class:classes(id, name, section)
    `)
    .eq('school_id', schoolId);

  if (classId) {
    query = query.eq('class_id', classId);
  }

  if (date) {
    query = query.eq('date', date);
  }

  if (studentId) {
    query = query.eq('student_id', studentId);
  }

  query = query.order('date', { ascending: false });

  const { data, error } = await query;

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

  const { records } = body;

  if (!records || !Array.isArray(records) || records.length === 0) {
    return NextResponse.json({ error: 'Records array is required' }, { status: 400 });
  }

  // Delete existing records for this date/class combination
  const firstRecord = records[0];
  if (firstRecord.class_id && firstRecord.date) {
    await supabase
      .from('attendance_records')
      .delete()
      .eq('class_id', firstRecord.class_id)
      .eq('date', firstRecord.date);
  }

  // Insert new records
  const { data, error } = await supabase
    .from('attendance_records')
    .insert(records)
    .select();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data }, { status: 201 });
}

export async function PATCH(request: NextRequest) {
  const supabase = await createClient();
  const body = await request.json();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id, status, notes } = body;

  if (!id) {
    return NextResponse.json({ error: 'Record ID is required' }, { status: 400 });
  }

  const updateData: Record<string, string> = {};
  if (status) updateData.status = status;
  if (notes !== undefined) updateData.notes = notes;

  const { data, error } = await supabase
    .from('attendance_records')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data });
}
