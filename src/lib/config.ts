export type AppMode = 'saas' | 'self_hosted';

export const config = {
  appName: process.env.NEXT_PUBLIC_APP_NAME || 'Jambi School',
  appUrl: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  appMode: (process.env.NEXT_PUBLIC_APP_MODE || 'saas') as AppMode,
  
  isSaas: () => config.appMode === 'saas',
  isSelfHosted: () => config.appMode === 'self_hosted',
  
  defaultCurrency: (process.env.NEXT_PUBLIC_DEFAULT_CURRENCY || 'USD') as 'USD' | 'SSP',
  supportedCurrencies: (process.env.NEXT_PUBLIC_SUPPORTED_CURRENCIES || 'USD,SSP').split(',') as ('USD' | 'SSP')[],
  
  selfHosted: {
    licenseKey: process.env.SELF_HOSTED_LICENSE_KEY || '',
    schoolId: process.env.SELF_HOSTED_SCHOOL_ID || '',
  },
  
  storage: {
    bucketDocuments: process.env.STORAGE_BUCKET_DOCUMENTS || 'documents',
    bucketAvatars: process.env.STORAGE_BUCKET_AVATARS || 'avatars',
    bucketExports: process.env.STORAGE_BUCKET_EXPORTS || 'exports',
  },
};

export const ROLES = {
  SUPER_ADMIN: 'super_admin',
  SCHOOL_ADMIN: 'school_admin',
  HEAD_TEACHER: 'head_teacher',
  TEACHER: 'teacher',
  REGISTRAR: 'registrar',
  ACCOUNTANT: 'accountant',
  LIBRARIAN: 'librarian',
  STAFF: 'staff',
  PARENT: 'parent',
  STUDENT: 'student',
} as const;

export const ROLE_HIERARCHY: Record<string, number> = {
  super_admin: 100,
  school_admin: 90,
  head_teacher: 80,
  teacher: 70,
  registrar: 60,
  accountant: 60,
  librarian: 50,
  staff: 40,
  parent: 20,
  student: 10,
};

export const PERMISSIONS = {
  // School management
  MANAGE_SCHOOL: ['super_admin', 'school_admin'],
  VIEW_SCHOOL: ['super_admin', 'school_admin', 'head_teacher', 'teacher', 'registrar', 'accountant', 'librarian', 'staff'],
  
  // Student management
  MANAGE_STUDENTS: ['super_admin', 'school_admin', 'head_teacher', 'registrar'],
  VIEW_STUDENTS: ['super_admin', 'school_admin', 'head_teacher', 'teacher', 'registrar', 'accountant', 'librarian', 'staff'],
  
  // Attendance
  MANAGE_ATTENDANCE: ['super_admin', 'school_admin', 'head_teacher', 'teacher'],
  VIEW_ATTENDANCE: ['super_admin', 'school_admin', 'head_teacher', 'teacher', 'registrar', 'parent', 'student'],
  
  // Academics
  MANAGE_EXAMS: ['super_admin', 'school_admin', 'head_teacher'],
  ENTER_MARKS: ['super_admin', 'school_admin', 'head_teacher', 'teacher'],
  APPROVE_MARKS: ['super_admin', 'school_admin', 'head_teacher'],
  VIEW_MARKS: ['super_admin', 'school_admin', 'head_teacher', 'teacher', 'registrar', 'parent', 'student'],
  
  // Finance
  MANAGE_FEES: ['super_admin', 'school_admin', 'accountant'],
  VIEW_FEES: ['super_admin', 'school_admin', 'head_teacher', 'accountant', 'registrar'],
  RECEIVE_PAYMENTS: ['super_admin', 'school_admin', 'accountant'],
  VIEW_PAYMENTS: ['super_admin', 'school_admin', 'accountant'],
  VIEW_FINANCE_REPORTS: ['super_admin', 'school_admin', 'accountant'],
  
  // Staff
  MANAGE_STAFF: ['super_admin', 'school_admin'],
  VIEW_STAFF: ['super_admin', 'school_admin', 'head_teacher', 'registrar'],
  
  // Timetable
  MANAGE_TIMETABLE: ['super_admin', 'school_admin', 'head_teacher'],
  VIEW_TIMETABLE: ['super_admin', 'school_admin', 'head_teacher', 'teacher', 'registrar', 'staff', 'parent', 'student'],
  
  // Discipline
  MANAGE_DISCIPLINE: ['super_admin', 'school_admin', 'head_teacher', 'teacher'],
  VIEW_DISCIPLINE: ['super_admin', 'school_admin', 'head_teacher', 'teacher'],
  
  // Reports
  EXPORT_DATA: ['super_admin', 'school_admin', 'head_teacher', 'accountant'],
  VIEW_REPORTS: ['super_admin', 'school_admin', 'head_teacher', 'accountant', 'registrar'],
  
  // Admin
  MANAGE_USERS: ['super_admin', 'school_admin'],
  VIEW_AUDIT_LOGS: ['super_admin', 'school_admin'],
  BACKUP_DATA: ['super_admin', 'school_admin'],
} as const;

export function hasPermission(userRole: string, permission: keyof typeof PERMISSIONS): boolean {
  const allowedRoles = PERMISSIONS[permission];
  return allowedRoles.includes(userRole as any);
}

export function hasMinimumRole(userRole: string, minimumRole: string): boolean {
  const userLevel = ROLE_HIERARCHY[userRole] || 0;
  const requiredLevel = ROLE_HIERARCHY[minimumRole] || 0;
  return userLevel >= requiredLevel;
}

export const STUDENT_STATUSES = [
  { value: 'active', label: 'Active', color: 'success' },
  { value: 'transferred', label: 'Transferred', color: 'warning' },
  { value: 'graduated', label: 'Graduated', color: 'primary' },
  { value: 'suspended', label: 'Suspended', color: 'destructive' },
  { value: 'withdrawn', label: 'Withdrawn', color: 'muted' },
] as const;

export const PAYMENT_METHODS = [
  { value: 'cash', label: 'Cash' },
  { value: 'mobile_money', label: 'Mobile Money' },
  { value: 'bank_transfer', label: 'Bank Transfer' },
  { value: 'check', label: 'Check' },
  { value: 'other', label: 'Other' },
] as const;

export const INVOICE_STATUSES = [
  { value: 'draft', label: 'Draft', color: 'muted' },
  { value: 'sent', label: 'Sent', color: 'primary' },
  { value: 'paid', label: 'Paid', color: 'success' },
  { value: 'partial', label: 'Partial', color: 'warning' },
  { value: 'overdue', label: 'Overdue', color: 'destructive' },
  { value: 'cancelled', label: 'Cancelled', color: 'muted' },
] as const;

export const EXAM_TYPES = [
  { value: 'continuous_assessment', label: 'Continuous Assessment' },
  { value: 'mid_term', label: 'Mid-Term Exam' },
  { value: 'end_term', label: 'End of Term Exam' },
  { value: 'mock', label: 'Mock Exam' },
  { value: 'final', label: 'Final Exam' },
] as const;

export const DAYS_OF_WEEK = [
  { value: 0, label: 'Sunday' },
  { value: 1, label: 'Monday' },
  { value: 2, label: 'Tuesday' },
  { value: 3, label: 'Wednesday' },
  { value: 4, label: 'Thursday' },
  { value: 5, label: 'Friday' },
  { value: 6, label: 'Saturday' },
] as const;

export const DEFAULT_GRADING_SCALE = {
  name: 'Standard Grading Scale',
  grades: [
    { grade: 'A', minScore: 80, maxScore: 100, points: 4.0, description: 'Excellent' },
    { grade: 'B', minScore: 70, maxScore: 79, points: 3.0, description: 'Very Good' },
    { grade: 'C', minScore: 60, maxScore: 69, points: 2.0, description: 'Good' },
    { grade: 'D', minScore: 50, maxScore: 59, points: 1.0, description: 'Fair' },
    { grade: 'E', minScore: 40, maxScore: 49, points: 0.5, description: 'Pass' },
    { grade: 'F', minScore: 0, maxScore: 39, points: 0.0, description: 'Fail' },
  ],
};

export const CURRENCY_CONFIG = {
  USD: { symbol: '$', name: 'US Dollar', locale: 'en-US' },
  SSP: { symbol: 'SSP', name: 'South Sudanese Pound', locale: 'en-SS' },
} as const;

export function formatCurrency(amount: number, currency: 'USD' | 'SSP' = 'USD'): string {
  const config = CURRENCY_CONFIG[currency];
  if (currency === 'USD') {
    return new Intl.NumberFormat(config.locale, {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  }
  return `${config.symbol} ${new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)}`;
}
