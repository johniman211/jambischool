import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { searchParams } = new URL(request.url);
  
  const schoolId = searchParams.get('school_id');
  const studentId = searchParams.get('student_id');
  const status = searchParams.get('status');
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '20');

  if (!schoolId) {
    return NextResponse.json({ error: 'school_id is required' }, { status: 400 });
  }

  let query = supabase
    .from('fee_invoices')
    .select(`
      *,
      student:students(id, first_name, last_name, admission_number),
      term:terms(id, name)
    `, { count: 'exact' })
    .eq('school_id', schoolId);

  if (studentId) {
    query = query.eq('student_id', studentId);
  }

  if (status) {
    query = query.eq('status', status);
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
    student_id,
    term_id,
    due_date,
    items,
  } = body;

  if (!school_id || !student_id || !items || items.length === 0) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  // Calculate total
  const totalAmount = items.reduce((sum: number, item: { amount: number }) => sum + item.amount, 0);

  // Generate invoice number
  const { count } = await supabase
    .from('fee_invoices')
    .select('*', { count: 'exact', head: true })
    .eq('school_id', school_id);

  const invoiceNumber = `INV-${new Date().getFullYear()}-${String((count || 0) + 1).padStart(5, '0')}`;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase as any)
    .from('fee_invoices')
    .insert({
      school_id,
      student_id,
      term_id,
      invoice_number: invoiceNumber,
      total_amount: totalAmount,
      paid_amount: 0,
      due_date,
      status: 'pending',
      items,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data }, { status: 201 });
}
