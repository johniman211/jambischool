export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type UserRole =
  | 'super_admin'
  | 'school_admin'
  | 'head_teacher'
  | 'teacher'
  | 'registrar'
  | 'accountant'
  | 'librarian'
  | 'staff'
  | 'parent'
  | 'student';

export type StudentStatus = 'active' | 'transferred' | 'graduated' | 'suspended' | 'withdrawn';

export type PaymentMethod = 'cash' | 'mobile_money' | 'bank_transfer' | 'check' | 'other';

export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded';

export type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'partial' | 'overdue' | 'cancelled';

export type NotificationChannel = 'email' | 'sms' | 'whatsapp' | 'push';

export type AuditAction = 'create' | 'update' | 'delete' | 'view' | 'export' | 'login' | 'logout';

export type Currency = 'USD' | 'SSP';

export interface Database {
  public: {
    Tables: {
      schools: {
        Row: {
          id: string;
          name: string;
          slug: string;
          address: string | null;
          phone: string | null;
          email: string | null;
          website: string | null;
          logo_url: string | null;
          timezone: string;
          currency: Currency;
          is_active: boolean;
          settings: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          address?: string | null;
          phone?: string | null;
          email?: string | null;
          website?: string | null;
          logo_url?: string | null;
          timezone?: string;
          currency?: Currency;
          is_active?: boolean;
          settings?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          address?: string | null;
          phone?: string | null;
          email?: string | null;
          website?: string | null;
          logo_url?: string | null;
          timezone?: string;
          currency?: Currency;
          is_active?: boolean;
          settings?: Json;
          created_at?: string;
          updated_at?: string;
        };
      };
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string;
          avatar_url: string | null;
          phone: string | null;
          is_super_admin: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name: string;
          avatar_url?: string | null;
          phone?: string | null;
          is_super_admin?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string;
          avatar_url?: string | null;
          phone?: string | null;
          is_super_admin?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      school_memberships: {
        Row: {
          id: string;
          user_id: string;
          school_id: string;
          role: UserRole;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          school_id: string;
          role: UserRole;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          school_id?: string;
          role?: UserRole;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      academic_years: {
        Row: {
          id: string;
          school_id: string;
          name: string;
          start_date: string;
          end_date: string;
          is_current: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          school_id: string;
          name: string;
          start_date: string;
          end_date: string;
          is_current?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          school_id?: string;
          name?: string;
          start_date?: string;
          end_date?: string;
          is_current?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      terms: {
        Row: {
          id: string;
          school_id: string;
          academic_year_id: string;
          name: string;
          start_date: string;
          end_date: string;
          is_current: boolean;
          sequence: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          school_id: string;
          academic_year_id: string;
          name: string;
          start_date: string;
          end_date: string;
          is_current?: boolean;
          sequence: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          school_id?: string;
          academic_year_id?: string;
          name?: string;
          start_date?: string;
          end_date?: string;
          is_current?: boolean;
          sequence?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      classes: {
        Row: {
          id: string;
          school_id: string;
          name: string;
          level: number;
          description: string | null;
          capacity: number | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          school_id: string;
          name: string;
          level: number;
          description?: string | null;
          capacity?: number | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          school_id?: string;
          name?: string;
          level?: number;
          description?: string | null;
          capacity?: number | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      streams: {
        Row: {
          id: string;
          school_id: string;
          class_id: string;
          name: string;
          capacity: number | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          school_id: string;
          class_id: string;
          name: string;
          capacity?: number | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          school_id?: string;
          class_id?: string;
          name?: string;
          capacity?: number | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      subjects: {
        Row: {
          id: string;
          school_id: string;
          name: string;
          code: string;
          description: string | null;
          is_compulsory: boolean;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          school_id: string;
          name: string;
          code: string;
          description?: string | null;
          is_compulsory?: boolean;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          school_id?: string;
          name?: string;
          code?: string;
          description?: string | null;
          is_compulsory?: boolean;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      class_subjects: {
        Row: {
          id: string;
          school_id: string;
          class_id: string;
          subject_id: string;
          teacher_id: string | null;
          periods_per_week: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          school_id: string;
          class_id: string;
          subject_id: string;
          teacher_id?: string | null;
          periods_per_week?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          school_id?: string;
          class_id?: string;
          subject_id?: string;
          teacher_id?: string | null;
          periods_per_week?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      grading_scales: {
        Row: {
          id: string;
          school_id: string;
          name: string;
          is_default: boolean;
          grades: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          school_id: string;
          name: string;
          is_default?: boolean;
          grades: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          school_id?: string;
          name?: string;
          is_default?: boolean;
          grades?: Json;
          created_at?: string;
          updated_at?: string;
        };
      };
      students: {
        Row: {
          id: string;
          school_id: string;
          admission_number: string;
          first_name: string;
          middle_name: string | null;
          last_name: string;
          gender: 'male' | 'female' | 'other';
          date_of_birth: string;
          photo_url: string | null;
          address: string | null;
          nationality: string | null;
          religion: string | null;
          blood_group: string | null;
          medical_conditions: string | null;
          status: StudentStatus;
          admission_date: string;
          graduation_date: string | null;
          previous_school: string | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          school_id: string;
          admission_number: string;
          first_name: string;
          middle_name?: string | null;
          last_name: string;
          gender: 'male' | 'female' | 'other';
          date_of_birth: string;
          photo_url?: string | null;
          address?: string | null;
          nationality?: string | null;
          religion?: string | null;
          blood_group?: string | null;
          medical_conditions?: string | null;
          status?: StudentStatus;
          admission_date: string;
          graduation_date?: string | null;
          previous_school?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          school_id?: string;
          admission_number?: string;
          first_name?: string;
          middle_name?: string | null;
          last_name?: string;
          gender?: 'male' | 'female' | 'other';
          date_of_birth?: string;
          photo_url?: string | null;
          address?: string | null;
          nationality?: string | null;
          religion?: string | null;
          blood_group?: string | null;
          medical_conditions?: string | null;
          status?: StudentStatus;
          admission_date?: string;
          graduation_date?: string | null;
          previous_school?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      guardians: {
        Row: {
          id: string;
          school_id: string;
          student_id: string;
          relationship: string;
          first_name: string;
          last_name: string;
          phone: string;
          alt_phone: string | null;
          email: string | null;
          address: string | null;
          occupation: string | null;
          is_primary: boolean;
          is_emergency_contact: boolean;
          user_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          school_id: string;
          student_id: string;
          relationship: string;
          first_name: string;
          last_name: string;
          phone: string;
          alt_phone?: string | null;
          email?: string | null;
          address?: string | null;
          occupation?: string | null;
          is_primary?: boolean;
          is_emergency_contact?: boolean;
          user_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          school_id?: string;
          student_id?: string;
          relationship?: string;
          first_name?: string;
          last_name?: string;
          phone?: string;
          alt_phone?: string | null;
          email?: string | null;
          address?: string | null;
          occupation?: string | null;
          is_primary?: boolean;
          is_emergency_contact?: boolean;
          user_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      enrollments: {
        Row: {
          id: string;
          school_id: string;
          student_id: string;
          class_id: string;
          stream_id: string | null;
          academic_year_id: string;
          roll_number: string | null;
          is_active: boolean;
          enrolled_at: string;
          withdrawn_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          school_id: string;
          student_id: string;
          class_id: string;
          stream_id?: string | null;
          academic_year_id: string;
          roll_number?: string | null;
          is_active?: boolean;
          enrolled_at?: string;
          withdrawn_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          school_id?: string;
          student_id?: string;
          class_id?: string;
          stream_id?: string | null;
          academic_year_id?: string;
          roll_number?: string | null;
          is_active?: boolean;
          enrolled_at?: string;
          withdrawn_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      attendance_records: {
        Row: {
          id: string;
          school_id: string;
          student_id: string;
          class_id: string;
          date: string;
          status: 'present' | 'absent' | 'late' | 'excused';
          remarks: string | null;
          recorded_by: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          school_id: string;
          student_id: string;
          class_id: string;
          date: string;
          status: 'present' | 'absent' | 'late' | 'excused';
          remarks?: string | null;
          recorded_by: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          school_id?: string;
          student_id?: string;
          class_id?: string;
          date?: string;
          status?: 'present' | 'absent' | 'late' | 'excused';
          remarks?: string | null;
          recorded_by?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      exams: {
        Row: {
          id: string;
          school_id: string;
          term_id: string;
          name: string;
          exam_type: 'continuous_assessment' | 'mid_term' | 'end_term' | 'mock' | 'final';
          start_date: string;
          end_date: string;
          max_score: number;
          weight_percentage: number;
          is_published: boolean;
          is_locked: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          school_id: string;
          term_id: string;
          name: string;
          exam_type: 'continuous_assessment' | 'mid_term' | 'end_term' | 'mock' | 'final';
          start_date: string;
          end_date: string;
          max_score?: number;
          weight_percentage?: number;
          is_published?: boolean;
          is_locked?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          school_id?: string;
          term_id?: string;
          name?: string;
          exam_type?: 'continuous_assessment' | 'mid_term' | 'end_term' | 'mock' | 'final';
          start_date?: string;
          end_date?: string;
          max_score?: number;
          weight_percentage?: number;
          is_published?: boolean;
          is_locked?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      marks: {
        Row: {
          id: string;
          school_id: string;
          exam_id: string;
          student_id: string;
          subject_id: string;
          class_id: string;
          score: number | null;
          grade: string | null;
          remarks: string | null;
          entered_by: string;
          approved_by: string | null;
          is_approved: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          school_id: string;
          exam_id: string;
          student_id: string;
          subject_id: string;
          class_id: string;
          score?: number | null;
          grade?: string | null;
          remarks?: string | null;
          entered_by: string;
          approved_by?: string | null;
          is_approved?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          school_id?: string;
          exam_id?: string;
          student_id?: string;
          subject_id?: string;
          class_id?: string;
          score?: number | null;
          grade?: string | null;
          remarks?: string | null;
          entered_by?: string;
          approved_by?: string | null;
          is_approved?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      report_cards: {
        Row: {
          id: string;
          school_id: string;
          student_id: string;
          term_id: string;
          class_id: string;
          total_marks: number;
          average: number;
          grade: string;
          position: number | null;
          class_size: number;
          attendance_percentage: number | null;
          teacher_remarks: string | null;
          head_teacher_remarks: string | null;
          is_published: boolean;
          published_at: string | null;
          pdf_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          school_id: string;
          student_id: string;
          term_id: string;
          class_id: string;
          total_marks?: number;
          average?: number;
          grade?: string;
          position?: number | null;
          class_size?: number;
          attendance_percentage?: number | null;
          teacher_remarks?: string | null;
          head_teacher_remarks?: string | null;
          is_published?: boolean;
          published_at?: string | null;
          pdf_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          school_id?: string;
          student_id?: string;
          term_id?: string;
          class_id?: string;
          total_marks?: number;
          average?: number;
          grade?: string;
          position?: number | null;
          class_size?: number;
          attendance_percentage?: number | null;
          teacher_remarks?: string | null;
          head_teacher_remarks?: string | null;
          is_published?: boolean;
          published_at?: string | null;
          pdf_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      fee_structures: {
        Row: {
          id: string;
          school_id: string;
          academic_year_id: string;
          term_id: string | null;
          class_id: string;
          name: string;
          amount: number;
          currency: Currency;
          is_mandatory: boolean;
          due_date: string | null;
          description: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          school_id: string;
          academic_year_id: string;
          term_id?: string | null;
          class_id: string;
          name: string;
          amount: number;
          currency?: Currency;
          is_mandatory?: boolean;
          due_date?: string | null;
          description?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          school_id?: string;
          academic_year_id?: string;
          term_id?: string | null;
          class_id?: string;
          name?: string;
          amount?: number;
          currency?: Currency;
          is_mandatory?: boolean;
          due_date?: string | null;
          description?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      invoices: {
        Row: {
          id: string;
          school_id: string;
          student_id: string;
          invoice_number: string;
          academic_year_id: string;
          term_id: string | null;
          subtotal: number;
          discount: number;
          total: number;
          amount_paid: number;
          balance: number;
          currency: Currency;
          status: InvoiceStatus;
          due_date: string;
          notes: string | null;
          created_by: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          school_id: string;
          student_id: string;
          invoice_number: string;
          academic_year_id: string;
          term_id?: string | null;
          subtotal: number;
          discount?: number;
          total: number;
          amount_paid?: number;
          balance: number;
          currency?: Currency;
          status?: InvoiceStatus;
          due_date: string;
          notes?: string | null;
          created_by: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          school_id?: string;
          student_id?: string;
          invoice_number?: string;
          academic_year_id?: string;
          term_id?: string | null;
          subtotal?: number;
          discount?: number;
          total?: number;
          amount_paid?: number;
          balance?: number;
          currency?: Currency;
          status?: InvoiceStatus;
          due_date?: string;
          notes?: string | null;
          created_by?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      invoice_items: {
        Row: {
          id: string;
          school_id: string;
          invoice_id: string;
          fee_structure_id: string | null;
          description: string;
          quantity: number;
          unit_price: number;
          amount: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          school_id: string;
          invoice_id: string;
          fee_structure_id?: string | null;
          description: string;
          quantity?: number;
          unit_price: number;
          amount: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          school_id?: string;
          invoice_id?: string;
          fee_structure_id?: string | null;
          description?: string;
          quantity?: number;
          unit_price?: number;
          amount?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      payments: {
        Row: {
          id: string;
          school_id: string;
          invoice_id: string;
          student_id: string;
          receipt_number: string;
          amount: number;
          currency: Currency;
          payment_method: PaymentMethod;
          payment_date: string;
          reference_number: string | null;
          status: PaymentStatus;
          notes: string | null;
          received_by: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          school_id: string;
          invoice_id: string;
          student_id: string;
          receipt_number: string;
          amount: number;
          currency?: Currency;
          payment_method: PaymentMethod;
          payment_date: string;
          reference_number?: string | null;
          status?: PaymentStatus;
          notes?: string | null;
          received_by: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          school_id?: string;
          invoice_id?: string;
          student_id?: string;
          receipt_number?: string;
          amount?: number;
          currency?: Currency;
          payment_method?: PaymentMethod;
          payment_date?: string;
          reference_number?: string | null;
          status?: PaymentStatus;
          notes?: string | null;
          received_by?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      staff_profiles: {
        Row: {
          id: string;
          school_id: string;
          user_id: string;
          employee_id: string;
          department: string | null;
          designation: string | null;
          date_of_joining: string;
          date_of_leaving: string | null;
          qualification: string | null;
          experience_years: number | null;
          salary: number | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          school_id: string;
          user_id: string;
          employee_id: string;
          department?: string | null;
          designation?: string | null;
          date_of_joining: string;
          date_of_leaving?: string | null;
          qualification?: string | null;
          experience_years?: number | null;
          salary?: number | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          school_id?: string;
          user_id?: string;
          employee_id?: string;
          department?: string | null;
          designation?: string | null;
          date_of_joining?: string;
          date_of_leaving?: string | null;
          qualification?: string | null;
          experience_years?: number | null;
          salary?: number | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      teacher_assignments: {
        Row: {
          id: string;
          school_id: string;
          staff_id: string;
          class_id: string;
          subject_id: string;
          academic_year_id: string;
          is_class_teacher: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          school_id: string;
          staff_id: string;
          class_id: string;
          subject_id: string;
          academic_year_id: string;
          is_class_teacher?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          school_id?: string;
          staff_id?: string;
          class_id?: string;
          subject_id?: string;
          academic_year_id?: string;
          is_class_teacher?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      timetables: {
        Row: {
          id: string;
          school_id: string;
          class_id: string;
          stream_id: string | null;
          academic_year_id: string;
          day_of_week: number;
          period_number: number;
          start_time: string;
          end_time: string;
          subject_id: string | null;
          teacher_id: string | null;
          room: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          school_id: string;
          class_id: string;
          stream_id?: string | null;
          academic_year_id: string;
          day_of_week: number;
          period_number: number;
          start_time: string;
          end_time: string;
          subject_id?: string | null;
          teacher_id?: string | null;
          room?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          school_id?: string;
          class_id?: string;
          stream_id?: string | null;
          academic_year_id?: string;
          day_of_week?: number;
          period_number?: number;
          start_time?: string;
          end_time?: string;
          subject_id?: string | null;
          teacher_id?: string | null;
          room?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      discipline_records: {
        Row: {
          id: string;
          school_id: string;
          student_id: string;
          incident_date: string;
          incident_type: string;
          description: string;
          action_taken: string | null;
          reported_by: string;
          is_resolved: boolean;
          resolved_at: string | null;
          resolved_by: string | null;
          is_confidential: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          school_id: string;
          student_id: string;
          incident_date: string;
          incident_type: string;
          description: string;
          action_taken?: string | null;
          reported_by: string;
          is_resolved?: boolean;
          resolved_at?: string | null;
          resolved_by?: string | null;
          is_confidential?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          school_id?: string;
          student_id?: string;
          incident_date?: string;
          incident_type?: string;
          description?: string;
          action_taken?: string | null;
          reported_by?: string;
          is_resolved?: boolean;
          resolved_at?: string | null;
          resolved_by?: string | null;
          is_confidential?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      student_documents: {
        Row: {
          id: string;
          school_id: string;
          student_id: string;
          document_type: string;
          file_name: string;
          file_path: string;
          file_size: number;
          mime_type: string;
          uploaded_by: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          school_id: string;
          student_id: string;
          document_type: string;
          file_name: string;
          file_path: string;
          file_size: number;
          mime_type: string;
          uploaded_by: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          school_id?: string;
          student_id?: string;
          document_type?: string;
          file_name?: string;
          file_path?: string;
          file_size?: number;
          mime_type?: string;
          uploaded_by?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      notifications_outbox: {
        Row: {
          id: string;
          school_id: string;
          channel: NotificationChannel;
          recipient: string;
          subject: string | null;
          message: string;
          template: string | null;
          template_data: Json | null;
          status: 'pending' | 'sent' | 'failed' | 'delivered';
          sent_at: string | null;
          error_message: string | null;
          retry_count: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          school_id: string;
          channel: NotificationChannel;
          recipient: string;
          subject?: string | null;
          message: string;
          template?: string | null;
          template_data?: Json | null;
          status?: 'pending' | 'sent' | 'failed' | 'delivered';
          sent_at?: string | null;
          error_message?: string | null;
          retry_count?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          school_id?: string;
          channel?: NotificationChannel;
          recipient?: string;
          subject?: string | null;
          message?: string;
          template?: string | null;
          template_data?: Json | null;
          status?: 'pending' | 'sent' | 'failed' | 'delivered';
          sent_at?: string | null;
          error_message?: string | null;
          retry_count?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      audit_logs: {
        Row: {
          id: string;
          school_id: string | null;
          user_id: string | null;
          action: AuditAction;
          table_name: string;
          record_id: string;
          old_values: Json | null;
          new_values: Json | null;
          ip_address: string | null;
          user_agent: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          school_id?: string | null;
          user_id?: string | null;
          action: AuditAction;
          table_name: string;
          record_id: string;
          old_values?: Json | null;
          new_values?: Json | null;
          ip_address?: string | null;
          user_agent?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          school_id?: string | null;
          user_id?: string | null;
          action?: AuditAction;
          table_name?: string;
          record_id?: string;
          old_values?: Json | null;
          new_values?: Json | null;
          ip_address?: string | null;
          user_agent?: string | null;
          created_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      get_user_school_role: {
        Args: {
          p_user_id: string;
          p_school_id: string;
        };
        Returns: UserRole | null;
      };
      generate_admission_number: {
        Args: {
          p_school_id: string;
        };
        Returns: string;
      };
      generate_invoice_number: {
        Args: {
          p_school_id: string;
        };
        Returns: string;
      };
      generate_receipt_number: {
        Args: {
          p_school_id: string;
        };
        Returns: string;
      };
    };
    Enums: {
      user_role: UserRole;
      student_status: StudentStatus;
      payment_method: PaymentMethod;
      payment_status: PaymentStatus;
      invoice_status: InvoiceStatus;
      notification_channel: NotificationChannel;
      audit_action: AuditAction;
      currency: Currency;
    };
  };
}

export type Tables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row'];
export type Insertable<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Insert'];
export type Updatable<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Update'];
