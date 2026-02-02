import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { searchParams } = new URL(request.url);
  
  const schoolId = searchParams.get('school_id');
  const status = searchParams.get('status');
  const classId = searchParams.get('class_id');
  const search = searchParams.get('search');
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '20');

  if (!schoolId) {
    return NextResponse.json({ error: 'school_id is required' }, { status: 400 });
  }

  let query = supabase
    .from('students')
    .select(`
      *,
      current_class:classes(id, name, section),
      guardian:guardians(id, full_name, phone)
    `, { count: 'exact' })
    .eq('school_id', schoolId);

  if (status) {
    query = query.eq('status', status);
  }

  if (classId) {
    query = query.eq('current_class_id', classId);
  }

  if (search) {
    query = query.or(`first_name.ilike.%${search}%,last_name.ilike.%${search}%,admission_number.ilike.%${search}%`);
  }

  const offset = (page - 1) * limit;
  query = query.range(offset, offset + limit - 1).order('created_at', { ascending: false });

  const { data, error, count } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    data,
    pagination: {
      page,
      limit,
      total: count || 0,
      totalPages: Math.ceil((count || 0) / limit),
    },
  });
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const body = await request.json();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const {
    school_id,
    first_name,
    last_name,
    date_of_birth,
    gender,
    nationality,
    address,
    medical_info,
    guardian_id,
    current_class_id,
    enrollment_date,
  } = body;

  if (!school_id || !first_name || !last_name) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('students')
    .insert({
      school_id,
      first_name,
      last_name,
      date_of_birth,
      gender,
      nationality,
      address,
      medical_info,
      guardian_id,
      current_class_id,
      enrollment_date: enrollment_date || new Date().toISOString().split('T')[0],
      status: 'active',
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data }, { status: 201 });
}
