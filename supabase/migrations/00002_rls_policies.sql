-- Jambi School Management System
-- Row Level Security (RLS) Policies
-- All tables are protected with strict multi-tenant isolation

-- ===========================================
-- ENABLE RLS ON ALL TABLES
-- ===========================================

ALTER TABLE schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE school_memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE academic_years ENABLE ROW LEVEL SECURITY;
ALTER TABLE terms ENABLE ROW LEVEL SECURITY;
ALTER TABLE classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE streams ENABLE ROW LEVEL SECURITY;
ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE class_subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE grading_scales ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE guardians ENABLE ROW LEVEL SECURITY;
ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE exams ENABLE ROW LEVEL SECURITY;
ALTER TABLE marks ENABLE ROW LEVEL SECURITY;
ALTER TABLE report_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE fee_structures ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoice_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE teacher_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE timetables ENABLE ROW LEVEL SECURITY;
ALTER TABLE discipline_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications_outbox ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- ===========================================
-- HELPER FUNCTION: Check school membership
-- ===========================================

CREATE OR REPLACE FUNCTION public.has_school_access(p_school_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  -- Super admins have access to all schools
  IF EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_super_admin = true) THEN
    RETURN true;
  END IF;
  
  -- Check if user has active membership in the school
  RETURN EXISTS (
    SELECT 1 FROM school_memberships 
    WHERE user_id = auth.uid() 
    AND school_id = p_school_id 
    AND is_active = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ===========================================
-- HELPER FUNCTION: Check specific role
-- ===========================================

CREATE OR REPLACE FUNCTION public.has_school_role(p_school_id UUID, p_roles user_role[])
RETURNS BOOLEAN AS $$
BEGIN
  -- Super admins have all roles
  IF EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_super_admin = true) THEN
    RETURN true;
  END IF;
  
  RETURN EXISTS (
    SELECT 1 FROM school_memberships 
    WHERE user_id = auth.uid() 
    AND school_id = p_school_id 
    AND role = ANY(p_roles)
    AND is_active = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ===========================================
-- SCHOOLS POLICIES
-- ===========================================

-- Super admins can see all schools
CREATE POLICY "Super admins can view all schools"
ON schools FOR SELECT
TO authenticated
USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_super_admin = true)
);

-- Users can see schools they belong to
CREATE POLICY "Members can view their schools"
ON schools FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM school_memberships 
    WHERE user_id = auth.uid() 
    AND school_id = schools.id 
    AND is_active = true
  )
);

-- Super admins can create schools
CREATE POLICY "Super admins can create schools"
ON schools FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_super_admin = true)
);

-- School admins and super admins can update schools
CREATE POLICY "Admins can update schools"
ON schools FOR UPDATE
TO authenticated
USING (
  public.has_school_role(id, ARRAY['school_admin'::user_role])
);

-- Only super admins can delete schools
CREATE POLICY "Super admins can delete schools"
ON schools FOR DELETE
TO authenticated
USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_super_admin = true)
);

-- ===========================================
-- PROFILES POLICIES
-- ===========================================

-- Users can view their own profile
CREATE POLICY "Users can view own profile"
ON profiles FOR SELECT
TO authenticated
USING (id = auth.uid());

-- Users can view profiles of people in their schools
CREATE POLICY "Users can view profiles in their schools"
ON profiles FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM school_memberships sm1
    JOIN school_memberships sm2 ON sm1.school_id = sm2.school_id
    WHERE sm1.user_id = auth.uid() 
    AND sm2.user_id = profiles.id
    AND sm1.is_active = true
    AND sm2.is_active = true
  )
);

-- Super admins can view all profiles
CREATE POLICY "Super admins can view all profiles"
ON profiles FOR SELECT
TO authenticated
USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_super_admin = true)
);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
ON profiles FOR UPDATE
TO authenticated
USING (id = auth.uid())
WITH CHECK (id = auth.uid() AND is_super_admin = (SELECT is_super_admin FROM profiles WHERE id = auth.uid()));

-- ===========================================
-- SCHOOL MEMBERSHIPS POLICIES
-- ===========================================

-- Users can view memberships in their schools
CREATE POLICY "Users can view memberships in their schools"
ON school_memberships FOR SELECT
TO authenticated
USING (
  user_id = auth.uid() OR public.has_school_access(school_id)
);

-- School admins can manage memberships
CREATE POLICY "School admins can insert memberships"
ON school_memberships FOR INSERT
TO authenticated
WITH CHECK (
  public.has_school_role(school_id, ARRAY['school_admin'::user_role])
);

CREATE POLICY "School admins can update memberships"
ON school_memberships FOR UPDATE
TO authenticated
USING (
  public.has_school_role(school_id, ARRAY['school_admin'::user_role])
);

CREATE POLICY "School admins can delete memberships"
ON school_memberships FOR DELETE
TO authenticated
USING (
  public.has_school_role(school_id, ARRAY['school_admin'::user_role])
);

-- ===========================================
-- ACADEMIC YEARS POLICIES
-- ===========================================

CREATE POLICY "Members can view academic years"
ON academic_years FOR SELECT
TO authenticated
USING (public.has_school_access(school_id));

CREATE POLICY "Admins can insert academic years"
ON academic_years FOR INSERT
TO authenticated
WITH CHECK (
  public.has_school_role(school_id, ARRAY['school_admin'::user_role, 'head_teacher'::user_role])
);

CREATE POLICY "Admins can update academic years"
ON academic_years FOR UPDATE
TO authenticated
USING (
  public.has_school_role(school_id, ARRAY['school_admin'::user_role, 'head_teacher'::user_role])
);

CREATE POLICY "Admins can delete academic years"
ON academic_years FOR DELETE
TO authenticated
USING (
  public.has_school_role(school_id, ARRAY['school_admin'::user_role])
);

-- ===========================================
-- TERMS POLICIES
-- ===========================================

CREATE POLICY "Members can view terms"
ON terms FOR SELECT
TO authenticated
USING (public.has_school_access(school_id));

CREATE POLICY "Admins can insert terms"
ON terms FOR INSERT
TO authenticated
WITH CHECK (
  public.has_school_role(school_id, ARRAY['school_admin'::user_role, 'head_teacher'::user_role])
);

CREATE POLICY "Admins can update terms"
ON terms FOR UPDATE
TO authenticated
USING (
  public.has_school_role(school_id, ARRAY['school_admin'::user_role, 'head_teacher'::user_role])
);

CREATE POLICY "Admins can delete terms"
ON terms FOR DELETE
TO authenticated
USING (
  public.has_school_role(school_id, ARRAY['school_admin'::user_role])
);

-- ===========================================
-- CLASSES POLICIES
-- ===========================================

CREATE POLICY "Members can view classes"
ON classes FOR SELECT
TO authenticated
USING (public.has_school_access(school_id));

CREATE POLICY "Admins can insert classes"
ON classes FOR INSERT
TO authenticated
WITH CHECK (
  public.has_school_role(school_id, ARRAY['school_admin'::user_role, 'head_teacher'::user_role])
);

CREATE POLICY "Admins can update classes"
ON classes FOR UPDATE
TO authenticated
USING (
  public.has_school_role(school_id, ARRAY['school_admin'::user_role, 'head_teacher'::user_role])
);

CREATE POLICY "Admins can delete classes"
ON classes FOR DELETE
TO authenticated
USING (
  public.has_school_role(school_id, ARRAY['school_admin'::user_role])
);

-- ===========================================
-- STREAMS POLICIES
-- ===========================================

CREATE POLICY "Members can view streams"
ON streams FOR SELECT
TO authenticated
USING (public.has_school_access(school_id));

CREATE POLICY "Admins can insert streams"
ON streams FOR INSERT
TO authenticated
WITH CHECK (
  public.has_school_role(school_id, ARRAY['school_admin'::user_role, 'head_teacher'::user_role])
);

CREATE POLICY "Admins can update streams"
ON streams FOR UPDATE
TO authenticated
USING (
  public.has_school_role(school_id, ARRAY['school_admin'::user_role, 'head_teacher'::user_role])
);

CREATE POLICY "Admins can delete streams"
ON streams FOR DELETE
TO authenticated
USING (
  public.has_school_role(school_id, ARRAY['school_admin'::user_role])
);

-- ===========================================
-- SUBJECTS POLICIES
-- ===========================================

CREATE POLICY "Members can view subjects"
ON subjects FOR SELECT
TO authenticated
USING (public.has_school_access(school_id));

CREATE POLICY "Admins can insert subjects"
ON subjects FOR INSERT
TO authenticated
WITH CHECK (
  public.has_school_role(school_id, ARRAY['school_admin'::user_role, 'head_teacher'::user_role])
);

CREATE POLICY "Admins can update subjects"
ON subjects FOR UPDATE
TO authenticated
USING (
  public.has_school_role(school_id, ARRAY['school_admin'::user_role, 'head_teacher'::user_role])
);

CREATE POLICY "Admins can delete subjects"
ON subjects FOR DELETE
TO authenticated
USING (
  public.has_school_role(school_id, ARRAY['school_admin'::user_role])
);

-- ===========================================
-- CLASS SUBJECTS POLICIES
-- ===========================================

CREATE POLICY "Members can view class subjects"
ON class_subjects FOR SELECT
TO authenticated
USING (public.has_school_access(school_id));

CREATE POLICY "Admins can manage class subjects"
ON class_subjects FOR ALL
TO authenticated
USING (
  public.has_school_role(school_id, ARRAY['school_admin'::user_role, 'head_teacher'::user_role])
);

-- ===========================================
-- GRADING SCALES POLICIES
-- ===========================================

CREATE POLICY "Members can view grading scales"
ON grading_scales FOR SELECT
TO authenticated
USING (public.has_school_access(school_id));

CREATE POLICY "Admins can manage grading scales"
ON grading_scales FOR ALL
TO authenticated
USING (
  public.has_school_role(school_id, ARRAY['school_admin'::user_role, 'head_teacher'::user_role])
);

-- ===========================================
-- STUDENTS POLICIES
-- ===========================================

CREATE POLICY "Staff can view students"
ON students FOR SELECT
TO authenticated
USING (public.has_school_access(school_id));

CREATE POLICY "Registrars can insert students"
ON students FOR INSERT
TO authenticated
WITH CHECK (
  public.has_school_role(school_id, ARRAY['school_admin'::user_role, 'head_teacher'::user_role, 'registrar'::user_role])
);

CREATE POLICY "Registrars can update students"
ON students FOR UPDATE
TO authenticated
USING (
  public.has_school_role(school_id, ARRAY['school_admin'::user_role, 'head_teacher'::user_role, 'registrar'::user_role])
);

CREATE POLICY "Admins can delete students"
ON students FOR DELETE
TO authenticated
USING (
  public.has_school_role(school_id, ARRAY['school_admin'::user_role])
);

-- ===========================================
-- GUARDIANS POLICIES
-- ===========================================

CREATE POLICY "Staff can view guardians"
ON guardians FOR SELECT
TO authenticated
USING (public.has_school_access(school_id));

-- Guardians can view their own record
CREATE POLICY "Guardians can view own record"
ON guardians FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Registrars can manage guardians"
ON guardians FOR ALL
TO authenticated
USING (
  public.has_school_role(school_id, ARRAY['school_admin'::user_role, 'head_teacher'::user_role, 'registrar'::user_role])
);

-- ===========================================
-- ENROLLMENTS POLICIES
-- ===========================================

CREATE POLICY "Staff can view enrollments"
ON enrollments FOR SELECT
TO authenticated
USING (public.has_school_access(school_id));

CREATE POLICY "Registrars can manage enrollments"
ON enrollments FOR ALL
TO authenticated
USING (
  public.has_school_role(school_id, ARRAY['school_admin'::user_role, 'head_teacher'::user_role, 'registrar'::user_role])
);

-- ===========================================
-- ATTENDANCE RECORDS POLICIES
-- ===========================================

CREATE POLICY "Staff can view attendance"
ON attendance_records FOR SELECT
TO authenticated
USING (public.has_school_access(school_id));

CREATE POLICY "Teachers can insert attendance"
ON attendance_records FOR INSERT
TO authenticated
WITH CHECK (
  public.has_school_role(school_id, ARRAY['school_admin'::user_role, 'head_teacher'::user_role, 'teacher'::user_role])
);

CREATE POLICY "Teachers can update attendance"
ON attendance_records FOR UPDATE
TO authenticated
USING (
  public.has_school_role(school_id, ARRAY['school_admin'::user_role, 'head_teacher'::user_role, 'teacher'::user_role])
);

CREATE POLICY "Admins can delete attendance"
ON attendance_records FOR DELETE
TO authenticated
USING (
  public.has_school_role(school_id, ARRAY['school_admin'::user_role, 'head_teacher'::user_role])
);

-- ===========================================
-- EXAMS POLICIES
-- ===========================================

CREATE POLICY "Staff can view exams"
ON exams FOR SELECT
TO authenticated
USING (public.has_school_access(school_id));

CREATE POLICY "Admins can manage exams"
ON exams FOR ALL
TO authenticated
USING (
  public.has_school_role(school_id, ARRAY['school_admin'::user_role, 'head_teacher'::user_role])
);

-- ===========================================
-- MARKS POLICIES
-- ===========================================

CREATE POLICY "Staff can view marks"
ON marks FOR SELECT
TO authenticated
USING (public.has_school_access(school_id));

CREATE POLICY "Teachers can insert marks"
ON marks FOR INSERT
TO authenticated
WITH CHECK (
  public.has_school_role(school_id, ARRAY['school_admin'::user_role, 'head_teacher'::user_role, 'teacher'::user_role])
);

CREATE POLICY "Teachers can update unapproved marks"
ON marks FOR UPDATE
TO authenticated
USING (
  public.has_school_role(school_id, ARRAY['school_admin'::user_role, 'head_teacher'::user_role, 'teacher'::user_role])
  AND (is_approved = false OR public.has_school_role(school_id, ARRAY['school_admin'::user_role, 'head_teacher'::user_role]))
);

CREATE POLICY "Admins can delete marks"
ON marks FOR DELETE
TO authenticated
USING (
  public.has_school_role(school_id, ARRAY['school_admin'::user_role, 'head_teacher'::user_role])
);

-- ===========================================
-- REPORT CARDS POLICIES
-- ===========================================

CREATE POLICY "Staff can view report cards"
ON report_cards FOR SELECT
TO authenticated
USING (public.has_school_access(school_id));

CREATE POLICY "Admins can manage report cards"
ON report_cards FOR ALL
TO authenticated
USING (
  public.has_school_role(school_id, ARRAY['school_admin'::user_role, 'head_teacher'::user_role])
);

-- ===========================================
-- FEE STRUCTURES POLICIES
-- ===========================================

CREATE POLICY "Staff can view fee structures"
ON fee_structures FOR SELECT
TO authenticated
USING (public.has_school_access(school_id));

CREATE POLICY "Accountants can manage fee structures"
ON fee_structures FOR ALL
TO authenticated
USING (
  public.has_school_role(school_id, ARRAY['school_admin'::user_role, 'accountant'::user_role])
);

-- ===========================================
-- INVOICES POLICIES
-- ===========================================

CREATE POLICY "Finance staff can view invoices"
ON invoices FOR SELECT
TO authenticated
USING (
  public.has_school_role(school_id, ARRAY['school_admin'::user_role, 'head_teacher'::user_role, 'accountant'::user_role, 'registrar'::user_role])
);

CREATE POLICY "Accountants can manage invoices"
ON invoices FOR ALL
TO authenticated
USING (
  public.has_school_role(school_id, ARRAY['school_admin'::user_role, 'accountant'::user_role])
);

-- ===========================================
-- INVOICE ITEMS POLICIES
-- ===========================================

CREATE POLICY "Finance staff can view invoice items"
ON invoice_items FOR SELECT
TO authenticated
USING (public.has_school_access(school_id));

CREATE POLICY "Accountants can manage invoice items"
ON invoice_items FOR ALL
TO authenticated
USING (
  public.has_school_role(school_id, ARRAY['school_admin'::user_role, 'accountant'::user_role])
);

-- ===========================================
-- PAYMENTS POLICIES
-- ===========================================

CREATE POLICY "Finance staff can view payments"
ON payments FOR SELECT
TO authenticated
USING (
  public.has_school_role(school_id, ARRAY['school_admin'::user_role, 'accountant'::user_role])
);

CREATE POLICY "Accountants can insert payments"
ON payments FOR INSERT
TO authenticated
WITH CHECK (
  public.has_school_role(school_id, ARRAY['school_admin'::user_role, 'accountant'::user_role])
);

CREATE POLICY "Accountants can update payments"
ON payments FOR UPDATE
TO authenticated
USING (
  public.has_school_role(school_id, ARRAY['school_admin'::user_role, 'accountant'::user_role])
);

-- Payments should generally not be deleted, only refunded
CREATE POLICY "Only super admins can delete payments"
ON payments FOR DELETE
TO authenticated
USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_super_admin = true)
);

-- ===========================================
-- STAFF PROFILES POLICIES
-- ===========================================

CREATE POLICY "Staff can view staff profiles"
ON staff_profiles FOR SELECT
TO authenticated
USING (
  public.has_school_access(school_id) OR user_id = auth.uid()
);

CREATE POLICY "Admins can manage staff profiles"
ON staff_profiles FOR ALL
TO authenticated
USING (
  public.has_school_role(school_id, ARRAY['school_admin'::user_role])
);

-- ===========================================
-- TEACHER ASSIGNMENTS POLICIES
-- ===========================================

CREATE POLICY "Staff can view teacher assignments"
ON teacher_assignments FOR SELECT
TO authenticated
USING (public.has_school_access(school_id));

CREATE POLICY "Admins can manage teacher assignments"
ON teacher_assignments FOR ALL
TO authenticated
USING (
  public.has_school_role(school_id, ARRAY['school_admin'::user_role, 'head_teacher'::user_role])
);

-- ===========================================
-- TIMETABLES POLICIES
-- ===========================================

CREATE POLICY "Members can view timetables"
ON timetables FOR SELECT
TO authenticated
USING (public.has_school_access(school_id));

CREATE POLICY "Admins can manage timetables"
ON timetables FOR ALL
TO authenticated
USING (
  public.has_school_role(school_id, ARRAY['school_admin'::user_role, 'head_teacher'::user_role])
);

-- ===========================================
-- DISCIPLINE RECORDS POLICIES
-- ===========================================

CREATE POLICY "Authorized staff can view discipline records"
ON discipline_records FOR SELECT
TO authenticated
USING (
  public.has_school_role(school_id, ARRAY['school_admin'::user_role, 'head_teacher'::user_role, 'teacher'::user_role])
);

CREATE POLICY "Teachers can insert discipline records"
ON discipline_records FOR INSERT
TO authenticated
WITH CHECK (
  public.has_school_role(school_id, ARRAY['school_admin'::user_role, 'head_teacher'::user_role, 'teacher'::user_role])
);

CREATE POLICY "Admins can update discipline records"
ON discipline_records FOR UPDATE
TO authenticated
USING (
  public.has_school_role(school_id, ARRAY['school_admin'::user_role, 'head_teacher'::user_role])
);

CREATE POLICY "Admins can delete discipline records"
ON discipline_records FOR DELETE
TO authenticated
USING (
  public.has_school_role(school_id, ARRAY['school_admin'::user_role])
);

-- ===========================================
-- STUDENT DOCUMENTS POLICIES
-- ===========================================

CREATE POLICY "Staff can view student documents"
ON student_documents FOR SELECT
TO authenticated
USING (
  public.has_school_role(school_id, ARRAY['school_admin'::user_role, 'head_teacher'::user_role, 'registrar'::user_role, 'teacher'::user_role])
);

CREATE POLICY "Registrars can manage student documents"
ON student_documents FOR ALL
TO authenticated
USING (
  public.has_school_role(school_id, ARRAY['school_admin'::user_role, 'head_teacher'::user_role, 'registrar'::user_role])
);

-- ===========================================
-- NOTIFICATIONS OUTBOX POLICIES
-- ===========================================

CREATE POLICY "Admins can view notifications"
ON notifications_outbox FOR SELECT
TO authenticated
USING (
  public.has_school_role(school_id, ARRAY['school_admin'::user_role])
);

CREATE POLICY "System can manage notifications"
ON notifications_outbox FOR ALL
TO authenticated
USING (
  public.has_school_role(school_id, ARRAY['school_admin'::user_role, 'head_teacher'::user_role, 'accountant'::user_role])
);

-- ===========================================
-- AUDIT LOGS POLICIES (read-only for admins)
-- ===========================================

CREATE POLICY "Admins can view audit logs"
ON audit_logs FOR SELECT
TO authenticated
USING (
  school_id IS NULL AND EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_super_admin = true)
  OR public.has_school_role(school_id, ARRAY['school_admin'::user_role])
);

-- Only service role can insert audit logs
CREATE POLICY "Service role can insert audit logs"
ON audit_logs FOR INSERT
TO service_role
WITH CHECK (true);

-- Audit logs should never be updated or deleted
-- No UPDATE or DELETE policies

-- ===========================================
-- STORAGE POLICIES (for Supabase Storage)
-- ===========================================

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('avatars', 'avatars', false),
  ('documents', 'documents', false),
  ('exports', 'exports', false)
ON CONFLICT (id) DO NOTHING;

-- Avatars bucket policies
CREATE POLICY "Users can upload own avatar"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'avatars' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can view avatars in their schools"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'avatars'
);

CREATE POLICY "Users can update own avatar"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'avatars' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can delete own avatar"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'avatars' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Documents bucket policies (school-scoped)
CREATE POLICY "Staff can upload documents to their school"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'documents' AND
  EXISTS (
    SELECT 1 FROM school_memberships 
    WHERE user_id = auth.uid() 
    AND school_id::text = (storage.foldername(name))[1]
    AND role IN ('school_admin', 'head_teacher', 'registrar', 'teacher')
    AND is_active = true
  )
);

CREATE POLICY "Staff can view documents in their school"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'documents' AND
  EXISTS (
    SELECT 1 FROM school_memberships 
    WHERE user_id = auth.uid() 
    AND school_id::text = (storage.foldername(name))[1]
    AND is_active = true
  )
);

CREATE POLICY "Admins can delete documents in their school"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'documents' AND
  EXISTS (
    SELECT 1 FROM school_memberships 
    WHERE user_id = auth.uid() 
    AND school_id::text = (storage.foldername(name))[1]
    AND role IN ('school_admin', 'head_teacher')
    AND is_active = true
  )
);

-- Exports bucket policies (admin only)
CREATE POLICY "Admins can manage exports"
ON storage.objects FOR ALL
TO authenticated
USING (
  bucket_id = 'exports' AND
  EXISTS (
    SELECT 1 FROM school_memberships 
    WHERE user_id = auth.uid() 
    AND school_id::text = (storage.foldername(name))[1]
    AND role IN ('school_admin', 'head_teacher', 'accountant')
    AND is_active = true
  )
);
