# Jambi School Management System

A comprehensive, modern school management system built with Next.js 14, Supabase, and TypeScript. Supports both SaaS multi-tenant and self-hosted deployment modes.

## Features

- **Student Management** - Enrollment, profiles, guardians, documents
- **Attendance Tracking** - Daily attendance with class-wise recording
- **Fee Management** - Invoices, payments, fee structures, reports
- **Academic Management** - Classes, subjects, grades, report cards
- **Staff Management** - Teachers, administrators, roles
- **Dashboard** - Real-time statistics and insights
- **Multi-tenant** - SaaS mode with multiple schools
- **Offline Support** - Works without internet connection
- **Role-based Access** - Super admin, admin, teacher, accountant, parent

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript
- **Styling**: Tailwind CSS, Radix UI, class-variance-authority
- **Backend**: Supabase (PostgreSQL, Auth, Storage, Edge Functions)
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account (for SaaS) or Docker (for self-hosted)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/your-org/jambi-school.git
cd jambi-school
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

4. Configure your `.env.local`:
```env
NEXT_PUBLIC_APP_MODE=saas
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-key
```

5. Run database migrations:
```bash
npx supabase db push
```

6. (Optional) Seed demo data:
```bash
npx supabase db seed
```

7. Start development server:
```bash
npm run dev
```

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── (auth)/            # Authentication pages
│   ├── (public)/          # Public website pages
│   └── app/               # Main application
│       └── [schoolSlug]/  # School-specific pages
├── components/
│   ├── app/               # Application components
│   └── ui/                # Reusable UI components
├── hooks/                 # Custom React hooks
└── lib/
    ├── supabase/          # Supabase clients
    ├── config.ts          # App configuration
    ├── database.types.ts  # TypeScript types
    └── utils.ts           # Utility functions

supabase/
├── migrations/            # Database migrations
└── seed.sql              # Demo seed data
```

## Deployment Modes

### SaaS Mode (Multi-tenant)
- Multiple schools on single instance
- Subscription-based billing
- Centralized super admin panel
- Set `NEXT_PUBLIC_APP_MODE=saas`

### Self-hosted Mode
- Single school per instance
- One-time license or free
- Full data ownership
- Set `NEXT_PUBLIC_APP_MODE=self-hosted`

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_APP_MODE` | `saas` or `self-hosted` | Yes |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key | Yes |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key | Yes |
| `NEXT_PUBLIC_APP_URL` | Application URL | Yes |
| `SMTP_*` | Email configuration | Optional |

## User Roles

- **Super Admin** - Platform management (SaaS only)
- **Admin** - Full school access
- **Teacher** - Classes, attendance, grades
- **Accountant** - Fees and finance
- **Parent** - View child's information

## Database Schema

Key tables:
- `schools` - School information
- `profiles` - User profiles
- `memberships` - User-school relationships
- `students` - Student records
- `guardians` - Parent/guardian info
- `classes` - Class definitions
- `subjects` - Subject catalog
- `attendance_records` - Daily attendance
- `fee_invoices` - Fee invoices
- `fee_payments` - Payment records

## Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run supabase:gen # Generate TypeScript types
```

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing`)
5. Open a Pull Request

## License

MIT License - see LICENSE file for details.

## Support

- Documentation: [docs.jambischool.com](https://docs.jambischool.com)
- Issues: GitHub Issues
- Email: support@jambischool.com
