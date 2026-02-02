import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { searchParams } = new URL(request.url);
  
  const schoolId = searchParams.get('school_id');
  const invoiceId = searchParams.get('invoice_id');
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '20');

  if (!schoolId) {
    return NextResponse.json({ error: 'school_id is required' }, { status: 400 });
  }

  let query = supabase
    .from('fee_payments')
    .select(`
      *,
      invoice:fee_invoices(
        id,
        invoice_number,
        student:students(id, first_name, last_name)
      )
    `, { count: 'exact' })
    .eq('school_id', schoolId);

  if (invoiceId) {
    query = query.eq('invoice_id', invoiceId);
  }

  const offset = (page - 1) * limit;
  query = query.range(offset, offset + limit - 1).order('payment_date', { ascending: false });

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
    invoice_id,
    amount,
    payment_method,
    payment_date,
    reference,
    notes,
  } = body;

  if (!school_id || !invoice_id || !amount) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  // Generate receipt number
  const { count } = await supabase
    .from('fee_payments')
    .select('*', { count: 'exact', head: true })
    .eq('school_id', school_id);

  const receiptNumber = `RCP-${new Date().getFullYear()}-${String((count || 0) + 1).padStart(5, '0')}`;

  const { data, error } = await supabase
    .from('fee_payments')
    .insert({
      school_id,
      invoice_id,
      amount,
      payment_method: payment_method || 'cash',
      payment_date: payment_date || new Date().toISOString().split('T')[0],
      receipt_number: receiptNumber,
      reference,
      notes,
      recorded_by: user.id,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Update invoice paid amount and status (handled by trigger in DB)
  
  return NextResponse.json({ data }, { status: 201 });
}
