import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { 
  GraduationCap, 
  Users, 
  Calendar, 
  CreditCard, 
  BarChart3, 
  Shield,
  CheckCircle,
  ArrowRight,
  Building2,
  Globe
} from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <GraduationCap className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold">Jambi School</span>
          </Link>
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/features" className="text-sm font-medium hover:text-primary">Features</Link>
            <Link href="/pricing" className="text-sm font-medium hover:text-primary">Pricing</Link>
            <Link href="/about" className="text-sm font-medium hover:text-primary">About</Link>
            <Link href="/contact" className="text-sm font-medium hover:text-primary">Contact</Link>
          </nav>
          <div className="flex items-center space-x-4">
            <Link href="/login">
              <Button variant="ghost">Log in</Button>
            </Link>
            <Link href="/signup">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 md:py-32">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-8 text-center">
            <div className="space-y-4 max-w-3xl">
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
                Complete School Management System for{' '}
                <span className="text-primary">Modern Education</span>
              </h1>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                Manage students, attendance, academics, fees, and staff all in one place. 
                Built for schools and education NGOs of all sizes.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/signup">
                <Button size="lg" className="gap-2">
                  Start Free Trial <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/contact">
                <Button size="lg" variant="outline">
                  Request Demo
                </Button>
              </Link>
            </div>
            <p className="text-sm text-muted-foreground">
              No credit card required • 14-day free trial • Cancel anytime
            </p>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-muted/50">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
              Everything You Need to Run Your School
            </h2>
            <p className="mt-4 text-muted-foreground md:text-lg">
              Comprehensive tools designed specifically for educational institutions
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <FeatureCard
              icon={<Users className="h-10 w-10 text-primary" />}
              title="Student Management"
              description="Complete student profiles, enrollment tracking, guardian management, and document storage."
            />
            <FeatureCard
              icon={<Calendar className="h-10 w-10 text-primary" />}
              title="Attendance Tracking"
              description="Daily attendance recording, reports by class/term, and offline draft support."
            />
            <FeatureCard
              icon={<GraduationCap className="h-10 w-10 text-primary" />}
              title="Academic Management"
              description="Exams, marks entry, report cards, transcripts, and promotion tools."
            />
            <FeatureCard
              icon={<CreditCard className="h-10 w-10 text-primary" />}
              title="Fees & Finance"
              description="Fee structures, invoices, payments, receipts, and financial reports."
            />
            <FeatureCard
              icon={<BarChart3 className="h-10 w-10 text-primary" />}
              title="Reports & Analytics"
              description="Comprehensive reports, CSV/Excel exports, and PDF generation."
            />
            <FeatureCard
              icon={<Shield className="h-10 w-10 text-primary" />}
              title="Security & Roles"
              description="Role-based access control, audit logs, and data protection."
            />
          </div>
        </div>
      </section>

      {/* Deployment Options */}
      <section className="py-20">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
              Choose Your Deployment
            </h2>
            <p className="mt-4 text-muted-foreground md:text-lg">
              Flexible options to suit your needs and budget
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-2 max-w-4xl mx-auto">
            <div className="relative p-8 bg-card rounded-xl border shadow-sm">
              <div className="flex items-center gap-4 mb-4">
                <Globe className="h-10 w-10 text-primary" />
                <div>
                  <h3 className="text-xl font-bold">Cloud (SaaS)</h3>
                  <p className="text-sm text-muted-foreground">Hosted by us</p>
                </div>
              </div>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-success" />
                  <span>No server management</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-success" />
                  <span>Automatic updates</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-success" />
                  <span>Multi-school support</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-success" />
                  <span>Starting at $25/month</span>
                </li>
              </ul>
              <Link href="/pricing">
                <Button className="w-full">View Plans</Button>
              </Link>
            </div>
            <div className="relative p-8 bg-card rounded-xl border shadow-sm">
              <div className="flex items-center gap-4 mb-4">
                <Building2 className="h-10 w-10 text-primary" />
                <div>
                  <h3 className="text-xl font-bold">Self-Hosted</h3>
                  <p className="text-sm text-muted-foreground">Your servers</p>
                </div>
              </div>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-success" />
                  <span>Full data ownership</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-success" />
                  <span>One-time payment</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-success" />
                  <span>No recurring fees</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-success" />
                  <span>Starting at $499</span>
                </li>
              </ul>
              <Link href="/pricing">
                <Button variant="outline" className="w-full">Learn More</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-muted/50">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
              Trusted by Schools Worldwide
            </h2>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            <TestimonialCard
              quote="Jambi School has transformed how we manage our student records. The fee management system alone has saved us countless hours."
              author="Sarah K."
              role="School Administrator"
            />
            <TestimonialCard
              quote="The report card generation is fantastic. Parents love receiving professional-looking reports, and teachers save so much time."
              author="James M."
              role="Head Teacher"
            />
            <TestimonialCard
              quote="As an education NGO, the self-hosted option was perfect. Full control over our data with a one-time investment."
              author="Maria L."
              role="NGO Director"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-6 text-center">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
              Ready to Transform Your School Management?
            </h2>
            <p className="max-w-[600px] text-muted-foreground md:text-lg">
              Join hundreds of schools already using Jambi School to streamline their operations.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/signup">
                <Button size="lg">Start Free Trial</Button>
              </Link>
              <Link href="/contact">
                <Button size="lg" variant="outline">Schedule a Demo</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12">
        <div className="container px-4 md:px-6">
          <div className="grid gap-8 md:grid-cols-4">
            <div>
              <Link href="/" className="flex items-center space-x-2 mb-4">
                <GraduationCap className="h-6 w-6 text-primary" />
                <span className="font-bold">Jambi School</span>
              </Link>
              <p className="text-sm text-muted-foreground">
                Complete School Management System for Schools & Education NGOs
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/features" className="hover:text-primary">Features</Link></li>
                <li><Link href="/pricing" className="hover:text-primary">Pricing</Link></li>
                <li><Link href="/contact" className="hover:text-primary">Request Demo</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/about" className="hover:text-primary">About</Link></li>
                <li><Link href="/contact" className="hover:text-primary">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/privacy" className="hover:text-primary">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-primary">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
            <p>© {new Date().getFullYear()} Jambi School. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="flex flex-col items-center text-center p-6 bg-card rounded-xl border shadow-sm">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}

function TestimonialCard({ quote, author, role }: { quote: string; author: string; role: string }) {
  return (
    <div className="p-6 bg-card rounded-xl border shadow-sm">
      <p className="text-muted-foreground mb-4">"{quote}"</p>
      <div>
        <p className="font-semibold">{author}</p>
        <p className="text-sm text-muted-foreground">{role}</p>
      </div>
    </div>
  );
}
