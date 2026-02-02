-- Jambi School Demo Seed Data
-- Run this after migrations to populate demo data
-- Must be run with service_role key or via Supabase Dashboard SQL Editor

-- Temporarily disable RLS for seeding
ALTER TABLE schools DISABLE ROW LEVEL SECURITY;
ALTER TABLE academic_years DISABLE ROW LEVEL SECURITY;
ALTER TABLE terms DISABLE ROW LEVEL SECURITY;
ALTER TABLE classes DISABLE ROW LEVEL SECURITY;
ALTER TABLE subjects DISABLE ROW LEVEL SECURITY;
ALTER TABLE fee_structures DISABLE ROW LEVEL SECURITY;
ALTER TABLE guardians DISABLE ROW LEVEL SECURITY;
ALTER TABLE students DISABLE ROW LEVEL SECURITY;

-- Insert demo school
INSERT INTO schools (id, name, slug, address, phone, email, currency, timezone, is_active)
VALUES (
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  'Demo Primary School',
  'demo-primary',
  '123 Education Street, Juba',
  '+211 912 345 678',
  'admin@demoprimary.edu.ss',
  'USD',
  'Africa/Juba',
  true
);

-- Insert academic year
INSERT INTO academic_years (id, school_id, name, start_date, end_date, is_current)
VALUES (
  'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22',
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  '2024-2025',
  '2024-01-15',
  '2024-12-15',
  true
);

-- Insert terms
INSERT INTO terms (id, school_id, academic_year_id, name, start_date, end_date, is_current, sequence) VALUES
('c1eebc99-9c0b-4ef8-bb6d-6bb9bd380a31', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'Term 1', '2024-01-15', '2024-04-15', false, 1),
('c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a32', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'Term 2', '2024-05-01', '2024-08-15', true, 2),
('c3eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'Term 3', '2024-09-01', '2024-12-15', false, 3);

-- Insert classes
INSERT INTO classes (id, school_id, name, level, capacity) VALUES
('d1eebc99-9c0b-4ef8-bb6d-6bb9bd380a41', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Primary 1', 1, 40),
('d2eebc99-9c0b-4ef8-bb6d-6bb9bd380a42', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Primary 2', 2, 40),
('d3eebc99-9c0b-4ef8-bb6d-6bb9bd380a43', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Primary 3', 3, 40),
('d4eebc99-9c0b-4ef8-bb6d-6bb9bd380a44', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Primary 4', 4, 40),
('d5eebc99-9c0b-4ef8-bb6d-6bb9bd380a45', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Primary 5', 5, 40),
('d6eebc99-9c0b-4ef8-bb6d-6bb9bd380a46', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Primary 6', 6, 40);

-- Insert subjects
INSERT INTO subjects (id, school_id, name, code, description) VALUES
('e1eebc99-9c0b-4ef8-bb6d-6bb9bd380a51', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'English', 'ENG', 'English Language'),
('e2eebc99-9c0b-4ef8-bb6d-6bb9bd380a52', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Mathematics', 'MATH', 'Mathematics'),
('e3eebc99-9c0b-4ef8-bb6d-6bb9bd380a53', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Science', 'SCI', 'General Science'),
('e4eebc99-9c0b-4ef8-bb6d-6bb9bd380a54', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Social Studies', 'SST', 'Social Studies');

-- Insert fee structures (one per class)
INSERT INTO fee_structures (id, school_id, academic_year_id, class_id, name, amount, description, is_active) VALUES
('f1eebc99-9c0b-4ef8-bb6d-6bb9bd380a61', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'd1eebc99-9c0b-4ef8-bb6d-6bb9bd380a41', 'Tuition Fee', 150.00, 'Regular tuition fee', true),
('f2eebc99-9c0b-4ef8-bb6d-6bb9bd380a62', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'd1eebc99-9c0b-4ef8-bb6d-6bb9bd380a41', 'Exam Fee', 25.00, 'Examination fee', true),
('f3eebc99-9c0b-4ef8-bb6d-6bb9bd380a63', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'd1eebc99-9c0b-4ef8-bb6d-6bb9bd380a41', 'Development Fee', 50.00, 'Annual development levy', true);

-- Insert sample students first (guardians reference students)
INSERT INTO students (id, school_id, admission_number, first_name, last_name, date_of_birth, gender, admission_date, status) VALUES
('51eebc99-9c0b-4ef8-bb6d-6bb9bd380a81', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'DPS-2024-001', 'Akech', 'Deng', '2016-03-15', 'female', '2024-01-15', 'active'),
('52eebc99-9c0b-4ef8-bb6d-6bb9bd380a82', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'DPS-2024-002', 'Dut', 'Deng', '2015-07-20', 'male', '2024-01-15', 'active'),
('53eebc99-9c0b-4ef8-bb6d-6bb9bd380a83', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'DPS-2024-003', 'Nyibol', 'Akol', '2016-11-08', 'female', '2024-01-15', 'active');

-- Insert sample guardians (reference students)
INSERT INTO guardians (id, school_id, student_id, relationship, first_name, last_name, phone, email, address, is_primary) VALUES
('61eebc99-9c0b-4ef8-bb6d-6bb9bd380a71', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '51eebc99-9c0b-4ef8-bb6d-6bb9bd380a81', 'father', 'John', 'Deng', '+211912111001', 'john@email.com', 'Juba', true),
('62eebc99-9c0b-4ef8-bb6d-6bb9bd380a72', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '52eebc99-9c0b-4ef8-bb6d-6bb9bd380a82', 'father', 'John', 'Deng', '+211912111001', 'john@email.com', 'Juba', true),
('63eebc99-9c0b-4ef8-bb6d-6bb9bd380a73', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '53eebc99-9c0b-4ef8-bb6d-6bb9bd380a83', 'mother', 'Mary', 'Akol', '+211912111002', 'mary@email.com', 'Juba', true);

-- Re-enable RLS after seeding
ALTER TABLE schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE academic_years ENABLE ROW LEVEL SECURITY;
ALTER TABLE terms ENABLE ROW LEVEL SECURITY;
ALTER TABLE classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE fee_structures ENABLE ROW LEVEL SECURITY;
ALTER TABLE guardians ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
