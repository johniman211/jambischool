-- Jambi School Management System
-- Initial Database Schema Migration
-- This migration creates all core tables with proper constraints and RLS policies

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ===========================================
-- ENUM TYPES
-- ===========================================

CREATE TYPE user_role AS ENUM (
  'super_admin',
  'school_admin', 
  'head_teacher',
  'teacher',
  'registrar',
  'accountant',
  'librarian',
  'staff',
  'parent',
  'student'
);

CREATE TYPE student_status AS ENUM (
  'active',
  'transferred',
  'graduated',
  'suspended',
  'withdrawn'
);

CREATE TYPE payment_method AS ENUM (
  'cash',
  'mobile_money',
  'bank_transfer',
  'check',
  'other'
);

CREATE TYPE payment_status AS ENUM (
  'pending',
  'completed',
  'failed',
  'refunded'
);

CREATE TYPE invoice_status AS ENUM (
  'draft',
  'sent',
  'paid',
  'partial',
  'overdue',
  'cancelled'
);

CREATE TYPE notification_channel AS ENUM (
  'email',
  'sms',
  'whatsapp',
  'push'
);

CREATE TYPE audit_action AS ENUM (
  'create',
  'update',
  'delete',
  'view',
  'export',
  'login',
  'logout'
);

CREATE TYPE currency AS ENUM ('USD', 'SSP');

CREATE TYPE attendance_status AS ENUM ('present', 'absent', 'late', 'excused');

CREATE TYPE exam_type AS ENUM (
  'continuous_assessment',
  'mid_term',
  'end_term',
  'mock',
  'final'
);

CREATE TYPE gender AS ENUM ('male', 'female', 'other');

-- ===========================================
-- SCHOOLS TABLE
-- ===========================================

CREATE TABLE schools (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(100) NOT NULL UNIQUE,
  address TEXT,
  phone VARCHAR(50),
  email VARCHAR(255),
  website VARCHAR(255),
  logo_url TEXT,
  timezone VARCHAR(50) DEFAULT 'UTC',
  currency currency DEFAULT 'USD',
  is_active BOOLEAN DEFAULT true,
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_schools_slug ON schools(slug);
CREATE INDEX idx_schools_is_active ON schools(is_active);

-- ===========================================
-- PROFILES TABLE (extends Supabase auth.users)
-- ===========================================

CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  avatar_url TEXT,
  phone VARCHAR(50),
  is_super_admin BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_profiles_email ON profiles(email);
CREATE INDEX idx_profiles_is_super_admin ON profiles(is_super_admin);

-- ===========================================
-- SCHOOL MEMBERSHIPS (links users to schools with roles)
-- ===========================================

CREATE TABLE school_memberships (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  role user_role NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, school_id)
);

CREATE INDEX idx_school_memberships_user_id ON school_memberships(user_id);
CREATE INDEX idx_school_memberships_school_id ON school_memberships(school_id);
CREATE INDEX idx_school_memberships_role ON school_memberships(role);

-- ===========================================
-- ACADEMIC YEARS
-- ===========================================

CREATE TABLE academic_years (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  is_current BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT valid_date_range CHECK (end_date > start_date)
);

CREATE INDEX idx_academic_years_school_id ON academic_years(school_id);
CREATE INDEX idx_academic_years_is_current ON academic_years(is_current);

-- ===========================================
-- TERMS
-- ===========================================

CREATE TABLE terms (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  academic_year_id UUID NOT NULL REFERENCES academic_years(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  is_current BOOLEAN DEFAULT false,
  sequence INT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT valid_term_date_range CHECK (end_date > start_date)
);

CREATE INDEX idx_terms_school_id ON terms(school_id);
CREATE INDEX idx_terms_academic_year_id ON terms(academic_year_id);
CREATE INDEX idx_terms_is_current ON terms(is_current);

-- ===========================================
-- CLASSES
-- ===========================================

CREATE TABLE classes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  level INT NOT NULL,
  description TEXT,
  capacity INT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_classes_school_id ON classes(school_id);
CREATE INDEX idx_classes_level ON classes(level);
CREATE INDEX idx_classes_is_active ON classes(is_active);

-- ===========================================
-- STREAMS (sections within classes)
-- ===========================================

CREATE TABLE streams (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  name VARCHAR(50) NOT NULL,
  capacity INT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_streams_school_id ON streams(school_id);
CREATE INDEX idx_streams_class_id ON streams(class_id);

-- ===========================================
-- SUBJECTS
-- ===========================================

CREATE TABLE subjects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  code VARCHAR(20) NOT NULL,
  description TEXT,
  is_compulsory BOOLEAN DEFAULT true,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(school_id, code)
);

CREATE INDEX idx_subjects_school_id ON subjects(school_id);
CREATE INDEX idx_subjects_code ON subjects(code);

-- ===========================================
-- CLASS SUBJECTS (subjects assigned to classes)
-- ===========================================

CREATE TABLE class_subjects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  subject_id UUID NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
  teacher_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  periods_per_week INT DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(class_id, subject_id)
);

CREATE INDEX idx_class_subjects_school_id ON class_subjects(school_id);
CREATE INDEX idx_class_subjects_class_id ON class_subjects(class_id);
CREATE INDEX idx_class_subjects_subject_id ON class_subjects(subject_id);

-- ===========================================
-- GRADING SCALES
-- ===========================================

CREATE TABLE grading_scales (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  is_default BOOLEAN DEFAULT false,
  grades JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_grading_scales_school_id ON grading_scales(school_id);

-- ===========================================
-- STUDENTS
-- ===========================================

CREATE TABLE students (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  admission_number VARCHAR(50) NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  middle_name VARCHAR(100),
  last_name VARCHAR(100) NOT NULL,
  gender gender NOT NULL,
  date_of_birth DATE NOT NULL,
  photo_url TEXT,
  address TEXT,
  nationality VARCHAR(100),
  religion VARCHAR(100),
  blood_group VARCHAR(10),
  medical_conditions TEXT,
  status student_status DEFAULT 'active',
  admission_date DATE NOT NULL,
  graduation_date DATE,
  previous_school VARCHAR(255),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(school_id, admission_number)
);

CREATE INDEX idx_students_school_id ON students(school_id);
CREATE INDEX idx_students_admission_number ON students(admission_number);
CREATE INDEX idx_students_status ON students(status);
CREATE INDEX idx_students_name ON students(first_name, last_name);

-- ===========================================
-- GUARDIANS
-- ===========================================

CREATE TABLE guardians (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  relationship VARCHAR(50) NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  alt_phone VARCHAR(50),
  email VARCHAR(255),
  address TEXT,
  occupation VARCHAR(100),
  is_primary BOOLEAN DEFAULT false,
  is_emergency_contact BOOLEAN DEFAULT false,
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_guardians_school_id ON guardians(school_id);
CREATE INDEX idx_guardians_student_id ON guardians(student_id);
CREATE INDEX idx_guardians_user_id ON guardians(user_id);

-- ===========================================
-- ENROLLMENTS
-- ===========================================

CREATE TABLE enrollments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  stream_id UUID REFERENCES streams(id) ON DELETE SET NULL,
  academic_year_id UUID NOT NULL REFERENCES academic_years(id) ON DELETE CASCADE,
  roll_number VARCHAR(20),
  is_active BOOLEAN DEFAULT true,
  enrolled_at TIMESTAMPTZ DEFAULT NOW(),
  withdrawn_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(student_id, academic_year_id)
);

CREATE INDEX idx_enrollments_school_id ON enrollments(school_id);
CREATE INDEX idx_enrollments_student_id ON enrollments(student_id);
CREATE INDEX idx_enrollments_class_id ON enrollments(class_id);
CREATE INDEX idx_enrollments_academic_year_id ON enrollments(academic_year_id);
CREATE INDEX idx_enrollments_is_active ON enrollments(is_active);

-- ===========================================
-- ATTENDANCE RECORDS
-- ===========================================

CREATE TABLE attendance_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  status attendance_status NOT NULL,
  remarks TEXT,
  recorded_by UUID NOT NULL REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(student_id, date)
);

CREATE INDEX idx_attendance_school_id ON attendance_records(school_id);
CREATE INDEX idx_attendance_student_id ON attendance_records(student_id);
CREATE INDEX idx_attendance_class_id ON attendance_records(class_id);
CREATE INDEX idx_attendance_date ON attendance_records(date);

-- ===========================================
-- EXAMS
-- ===========================================

CREATE TABLE exams (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  term_id UUID NOT NULL REFERENCES terms(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  exam_type exam_type NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  max_score DECIMAL(5,2) DEFAULT 100,
  weight_percentage DECIMAL(5,2) DEFAULT 100,
  is_published BOOLEAN DEFAULT false,
  is_locked BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_exams_school_id ON exams(school_id);
CREATE INDEX idx_exams_term_id ON exams(term_id);
CREATE INDEX idx_exams_is_published ON exams(is_published);

-- ===========================================
-- MARKS
-- ===========================================

CREATE TABLE marks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  exam_id UUID NOT NULL REFERENCES exams(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  subject_id UUID NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
  class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  score DECIMAL(5,2),
  grade VARCHAR(5),
  remarks TEXT,
  entered_by UUID NOT NULL REFERENCES profiles(id),
  approved_by UUID REFERENCES profiles(id),
  is_approved BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(exam_id, student_id, subject_id)
);

CREATE INDEX idx_marks_school_id ON marks(school_id);
CREATE INDEX idx_marks_exam_id ON marks(exam_id);
CREATE INDEX idx_marks_student_id ON marks(student_id);
CREATE INDEX idx_marks_subject_id ON marks(subject_id);
CREATE INDEX idx_marks_is_approved ON marks(is_approved);

-- ===========================================
-- REPORT CARDS
-- ===========================================

CREATE TABLE report_cards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  term_id UUID NOT NULL REFERENCES terms(id) ON DELETE CASCADE,
  class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  total_marks DECIMAL(8,2) DEFAULT 0,
  average DECIMAL(5,2) DEFAULT 0,
  grade VARCHAR(5),
  position INT,
  class_size INT DEFAULT 0,
  attendance_percentage DECIMAL(5,2),
  teacher_remarks TEXT,
  head_teacher_remarks TEXT,
  is_published BOOLEAN DEFAULT false,
  published_at TIMESTAMPTZ,
  pdf_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(student_id, term_id)
);

CREATE INDEX idx_report_cards_school_id ON report_cards(school_id);
CREATE INDEX idx_report_cards_student_id ON report_cards(student_id);
CREATE INDEX idx_report_cards_term_id ON report_cards(term_id);
CREATE INDEX idx_report_cards_is_published ON report_cards(is_published);

-- ===========================================
-- FEE STRUCTURES
-- ===========================================

CREATE TABLE fee_structures (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  academic_year_id UUID NOT NULL REFERENCES academic_years(id) ON DELETE CASCADE,
  term_id UUID REFERENCES terms(id) ON DELETE SET NULL,
  class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  amount DECIMAL(12,2) NOT NULL,
  currency currency DEFAULT 'USD',
  is_mandatory BOOLEAN DEFAULT true,
  due_date DATE,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_fee_structures_school_id ON fee_structures(school_id);
CREATE INDEX idx_fee_structures_academic_year_id ON fee_structures(academic_year_id);
CREATE INDEX idx_fee_structures_class_id ON fee_structures(class_id);
CREATE INDEX idx_fee_structures_is_active ON fee_structures(is_active);

-- ===========================================
-- INVOICES
-- ===========================================

CREATE TABLE invoices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  invoice_number VARCHAR(50) NOT NULL,
  academic_year_id UUID NOT NULL REFERENCES academic_years(id) ON DELETE CASCADE,
  term_id UUID REFERENCES terms(id) ON DELETE SET NULL,
  subtotal DECIMAL(12,2) NOT NULL,
  discount DECIMAL(12,2) DEFAULT 0,
  total DECIMAL(12,2) NOT NULL,
  amount_paid DECIMAL(12,2) DEFAULT 0,
  balance DECIMAL(12,2) NOT NULL,
  currency currency DEFAULT 'USD',
  status invoice_status DEFAULT 'draft',
  due_date DATE NOT NULL,
  notes TEXT,
  created_by UUID NOT NULL REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(school_id, invoice_number)
);

CREATE INDEX idx_invoices_school_id ON invoices(school_id);
CREATE INDEX idx_invoices_student_id ON invoices(student_id);
CREATE INDEX idx_invoices_invoice_number ON invoices(invoice_number);
CREATE INDEX idx_invoices_status ON invoices(status);
CREATE INDEX idx_invoices_due_date ON invoices(due_date);

-- ===========================================
-- INVOICE ITEMS
-- ===========================================

CREATE TABLE invoice_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  invoice_id UUID NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
  fee_structure_id UUID REFERENCES fee_structures(id) ON DELETE SET NULL,
  description VARCHAR(255) NOT NULL,
  quantity INT DEFAULT 1,
  unit_price DECIMAL(12,2) NOT NULL,
  amount DECIMAL(12,2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_invoice_items_school_id ON invoice_items(school_id);
CREATE INDEX idx_invoice_items_invoice_id ON invoice_items(invoice_id);

-- ===========================================
-- PAYMENTS
-- ===========================================

CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  invoice_id UUID NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  receipt_number VARCHAR(50) NOT NULL,
  amount DECIMAL(12,2) NOT NULL,
  currency currency DEFAULT 'USD',
  payment_method payment_method NOT NULL,
  payment_date DATE NOT NULL,
  reference_number VARCHAR(100),
  status payment_status DEFAULT 'completed',
  notes TEXT,
  received_by UUID NOT NULL REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(school_id, receipt_number)
);

CREATE INDEX idx_payments_school_id ON payments(school_id);
CREATE INDEX idx_payments_invoice_id ON payments(invoice_id);
CREATE INDEX idx_payments_student_id ON payments(student_id);
CREATE INDEX idx_payments_receipt_number ON payments(receipt_number);
CREATE INDEX idx_payments_payment_date ON payments(payment_date);
CREATE INDEX idx_payments_status ON payments(status);

-- ===========================================
-- STAFF PROFILES
-- ===========================================

CREATE TABLE staff_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  employee_id VARCHAR(50) NOT NULL,
  department VARCHAR(100),
  designation VARCHAR(100),
  date_of_joining DATE NOT NULL,
  date_of_leaving DATE,
  qualification TEXT,
  experience_years INT,
  salary DECIMAL(12,2),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(school_id, employee_id),
  UNIQUE(school_id, user_id)
);

CREATE INDEX idx_staff_profiles_school_id ON staff_profiles(school_id);
CREATE INDEX idx_staff_profiles_user_id ON staff_profiles(user_id);
CREATE INDEX idx_staff_profiles_is_active ON staff_profiles(is_active);

-- ===========================================
-- TEACHER ASSIGNMENTS
-- ===========================================

CREATE TABLE teacher_assignments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  staff_id UUID NOT NULL REFERENCES staff_profiles(id) ON DELETE CASCADE,
  class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  subject_id UUID NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
  academic_year_id UUID NOT NULL REFERENCES academic_years(id) ON DELETE CASCADE,
  is_class_teacher BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(staff_id, class_id, subject_id, academic_year_id)
);

CREATE INDEX idx_teacher_assignments_school_id ON teacher_assignments(school_id);
CREATE INDEX idx_teacher_assignments_staff_id ON teacher_assignments(staff_id);
CREATE INDEX idx_teacher_assignments_class_id ON teacher_assignments(class_id);

-- ===========================================
-- TIMETABLES
-- ===========================================

CREATE TABLE timetables (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  stream_id UUID REFERENCES streams(id) ON DELETE SET NULL,
  academic_year_id UUID NOT NULL REFERENCES academic_years(id) ON DELETE CASCADE,
  day_of_week INT NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
  period_number INT NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  subject_id UUID REFERENCES subjects(id) ON DELETE SET NULL,
  teacher_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  room VARCHAR(50),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(class_id, stream_id, academic_year_id, day_of_week, period_number)
);

CREATE INDEX idx_timetables_school_id ON timetables(school_id);
CREATE INDEX idx_timetables_class_id ON timetables(class_id);
CREATE INDEX idx_timetables_teacher_id ON timetables(teacher_id);
CREATE INDEX idx_timetables_day_of_week ON timetables(day_of_week);

-- ===========================================
-- DISCIPLINE RECORDS
-- ===========================================

CREATE TABLE discipline_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  incident_date DATE NOT NULL,
  incident_type VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  action_taken TEXT,
  reported_by UUID NOT NULL REFERENCES profiles(id),
  is_resolved BOOLEAN DEFAULT false,
  resolved_at TIMESTAMPTZ,
  resolved_by UUID REFERENCES profiles(id),
  is_confidential BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_discipline_records_school_id ON discipline_records(school_id);
CREATE INDEX idx_discipline_records_student_id ON discipline_records(student_id);
CREATE INDEX idx_discipline_records_incident_date ON discipline_records(incident_date);
CREATE INDEX idx_discipline_records_is_resolved ON discipline_records(is_resolved);

-- ===========================================
-- STUDENT DOCUMENTS
-- ===========================================

CREATE TABLE student_documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  document_type VARCHAR(100) NOT NULL,
  file_name VARCHAR(255) NOT NULL,
  file_path TEXT NOT NULL,
  file_size INT NOT NULL,
  mime_type VARCHAR(100) NOT NULL,
  uploaded_by UUID NOT NULL REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_student_documents_school_id ON student_documents(school_id);
CREATE INDEX idx_student_documents_student_id ON student_documents(student_id);
CREATE INDEX idx_student_documents_document_type ON student_documents(document_type);

-- ===========================================
-- NOTIFICATIONS OUTBOX
-- ===========================================

CREATE TABLE notifications_outbox (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  channel notification_channel NOT NULL,
  recipient VARCHAR(255) NOT NULL,
  subject VARCHAR(255),
  message TEXT NOT NULL,
  template VARCHAR(100),
  template_data JSONB,
  status VARCHAR(20) DEFAULT 'pending',
  sent_at TIMESTAMPTZ,
  error_message TEXT,
  retry_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_notifications_school_id ON notifications_outbox(school_id);
CREATE INDEX idx_notifications_status ON notifications_outbox(status);
CREATE INDEX idx_notifications_channel ON notifications_outbox(channel);

-- ===========================================
-- AUDIT LOGS (append-only)
-- ===========================================

CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  school_id UUID REFERENCES schools(id) ON DELETE SET NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  action audit_action NOT NULL,
  table_name VARCHAR(100) NOT NULL,
  record_id VARCHAR(100) NOT NULL,
  old_values JSONB,
  new_values JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_audit_logs_school_id ON audit_logs(school_id);
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_table_name ON audit_logs(table_name);
CREATE INDEX idx_audit_logs_record_id ON audit_logs(record_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);

-- ===========================================
-- HELPER FUNCTIONS
-- ===========================================

-- Function to get user's role in a school
CREATE OR REPLACE FUNCTION get_user_school_role(p_user_id UUID, p_school_id UUID)
RETURNS user_role AS $$
DECLARE
  v_role user_role;
BEGIN
  SELECT role INTO v_role
  FROM school_memberships
  WHERE user_id = p_user_id AND school_id = p_school_id AND is_active = true;
  RETURN v_role;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user is super admin
CREATE OR REPLACE FUNCTION is_super_admin(p_user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  v_is_super BOOLEAN;
BEGIN
  SELECT is_super_admin INTO v_is_super
  FROM profiles
  WHERE id = p_user_id;
  RETURN COALESCE(v_is_super, false);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to generate admission number
CREATE OR REPLACE FUNCTION generate_admission_number(p_school_id UUID)
RETURNS VARCHAR AS $$
DECLARE
  v_year VARCHAR(4);
  v_count INT;
  v_number VARCHAR(50);
BEGIN
  v_year := EXTRACT(YEAR FROM CURRENT_DATE)::VARCHAR;
  SELECT COUNT(*) + 1 INTO v_count FROM students WHERE school_id = p_school_id;
  v_number := 'ADM-' || v_year || '-' || LPAD(v_count::VARCHAR, 5, '0');
  RETURN v_number;
END;
$$ LANGUAGE plpgsql;

-- Function to generate invoice number
CREATE OR REPLACE FUNCTION generate_invoice_number(p_school_id UUID)
RETURNS VARCHAR AS $$
DECLARE
  v_year VARCHAR(4);
  v_count INT;
  v_number VARCHAR(50);
BEGIN
  v_year := EXTRACT(YEAR FROM CURRENT_DATE)::VARCHAR;
  SELECT COUNT(*) + 1 INTO v_count FROM invoices WHERE school_id = p_school_id;
  v_number := 'INV-' || v_year || '-' || LPAD(v_count::VARCHAR, 6, '0');
  RETURN v_number;
END;
$$ LANGUAGE plpgsql;

-- Function to generate receipt number
CREATE OR REPLACE FUNCTION generate_receipt_number(p_school_id UUID)
RETURNS VARCHAR AS $$
DECLARE
  v_year VARCHAR(4);
  v_count INT;
  v_number VARCHAR(50);
BEGIN
  v_year := EXTRACT(YEAR FROM CURRENT_DATE)::VARCHAR;
  SELECT COUNT(*) + 1 INTO v_count FROM payments WHERE school_id = p_school_id;
  v_number := 'RCP-' || v_year || '-' || LPAD(v_count::VARCHAR, 6, '0');
  RETURN v_number;
END;
$$ LANGUAGE plpgsql;

-- Function to update invoice balance after payment
CREATE OR REPLACE FUNCTION update_invoice_on_payment()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE invoices
  SET 
    amount_paid = (SELECT COALESCE(SUM(amount), 0) FROM payments WHERE invoice_id = NEW.invoice_id AND status = 'completed'),
    balance = total - (SELECT COALESCE(SUM(amount), 0) FROM payments WHERE invoice_id = NEW.invoice_id AND status = 'completed'),
    status = CASE 
      WHEN total <= (SELECT COALESCE(SUM(amount), 0) FROM payments WHERE invoice_id = NEW.invoice_id AND status = 'completed') THEN 'paid'::invoice_status
      WHEN (SELECT COALESCE(SUM(amount), 0) FROM payments WHERE invoice_id = NEW.invoice_id AND status = 'completed') > 0 THEN 'partial'::invoice_status
      ELSE status
    END,
    updated_at = NOW()
  WHERE id = NEW.invoice_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_invoice_on_payment
AFTER INSERT OR UPDATE ON payments
FOR EACH ROW EXECUTE FUNCTION update_invoice_on_payment();

-- Function to update timestamps
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to all tables
DO $$
DECLARE
  t TEXT;
BEGIN
  FOR t IN 
    SELECT table_name 
    FROM information_schema.columns 
    WHERE column_name = 'updated_at' 
    AND table_schema = 'public'
  LOOP
    EXECUTE format('
      DROP TRIGGER IF EXISTS trigger_update_updated_at ON %I;
      CREATE TRIGGER trigger_update_updated_at
      BEFORE UPDATE ON %I
      FOR EACH ROW EXECUTE FUNCTION update_updated_at();
    ', t, t);
  END LOOP;
END;
$$;

-- ===========================================
-- AUTO-CREATE PROFILE ON SIGNUP
-- ===========================================

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1))
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION handle_new_user();
