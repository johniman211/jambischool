'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { DashboardMockup } from '@/components/ui/dashboard-mockup';
import { 
  FadeInUp, 
  FadeInLeft, 
  FadeInRight, 
  StaggerContainer, 
  StaggerItem,
  GlowCard 
} from '@/components/ui/animations';
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
  Globe,
  Sparkles,
  Menu
} from 'lucide-react';
import { useState } from 'react';

export default function HomePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* Animated background gradient */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-background" />
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-primary/10 rounded-full blur-3xl"
        />
      </div>

      {/* Navigation */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60"
      >
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <motion.div whileHover={{ rotate: 10, scale: 1.1 }} transition={{ type: 'spring', stiffness: 400 }}>
              <GraduationCap className="h-8 w-8 text-primary" />
            </motion.div>
            <span className="text-xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">Jambi School</span>
          </Link>
          <nav className="hidden md:flex items-center space-x-8">
            {['Features', 'Pricing', 'About', 'Contact'].map((item, i) => (
              <motion.div
                key={item}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * i }}
              >
                <Link 
                  href={`/${item.toLowerCase()}`} 
                  className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors relative group"
                >
                  {item}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full" />
                </Link>
              </motion.div>
            ))}
          </nav>
          <div className="flex items-center space-x-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
              <Link href="/login">
                <Button variant="ghost" className="hidden sm:inline-flex">Log in</Button>
              </Link>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }} 
              animate={{ opacity: 1, scale: 1 }} 
              transition={{ delay: 0.4 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link href="/signup">
                <Button className="shadow-lg shadow-primary/25">Get Started</Button>
              </Link>
            </motion.div>
            <button className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
        {/* Mobile menu */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t bg-background/95 backdrop-blur-xl"
          >
            <nav className="container py-4 flex flex-col space-y-4">
              {['Features', 'Pricing', 'About', 'Contact'].map((item) => (
                <Link 
                  key={item}
                  href={`/${item.toLowerCase()}`} 
                  className="text-sm font-medium py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item}
                </Link>
              ))}
              <Link href="/login" className="text-sm font-medium py-2">Log in</Link>
            </nav>
          </motion.div>
        )}
      </motion.header>

      {/* Hero Section */}
      <section className="py-16 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left side - Text content */}
            <div className="flex flex-col space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm w-fit"
              >
                <Sparkles className="h-4 w-4" />
                <span>Trusted by 500+ schools worldwide</span>
              </motion.div>
              
              <div className="space-y-4">
                <motion.h1 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl"
                >
                  Complete School{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/60">
                    Management
                  </span>{' '}
                  System
                </motion.h1>
                <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="text-lg text-muted-foreground md:text-xl max-w-lg"
                >
                  Manage students, attendance, academics, fees, and staff all in one powerful platform. 
                  Built for modern education.
                </motion.p>
              </div>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Link href="/signup">
                    <Button size="lg" className="gap-2 shadow-lg shadow-primary/25 w-full sm:w-auto">
                      Start Free Trial <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Link href="/contact">
                    <Button size="lg" variant="outline" className="w-full sm:w-auto">
                      Request Demo
                    </Button>
                  </Link>
                </motion.div>
              </motion.div>
              
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="text-sm text-muted-foreground flex items-center gap-4 flex-wrap"
              >
                <span className="flex items-center gap-1"><CheckCircle className="h-4 w-4 text-green-500" /> No credit card</span>
                <span className="flex items-center gap-1"><CheckCircle className="h-4 w-4 text-green-500" /> 14-day trial</span>
                <span className="flex items-center gap-1"><CheckCircle className="h-4 w-4 text-green-500" /> Cancel anytime</span>
              </motion.p>
            </div>

            {/* Right side - Dashboard mockup */}
            <div className="lg:pl-8">
              <DashboardMockup />
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-muted/30 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        <div className="container px-4 md:px-6 relative">
          <FadeInUp className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Everything You Need to{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/60">
                Run Your School
              </span>
            </h2>
            <p className="mt-4 text-muted-foreground md:text-lg max-w-2xl mx-auto">
              Comprehensive tools designed specifically for educational institutions
            </p>
          </FadeInUp>
          <StaggerContainer className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <StaggerItem>
              <FeatureCard
                icon={<Users className="h-8 w-8" />}
                title="Student Management"
                description="Complete student profiles, enrollment tracking, guardian management, and document storage."
                gradient="from-blue-500 to-cyan-500"
              />
            </StaggerItem>
            <StaggerItem>
              <FeatureCard
                icon={<Calendar className="h-8 w-8" />}
                title="Attendance Tracking"
                description="Daily attendance recording, reports by class/term, and offline draft support."
                gradient="from-green-500 to-emerald-500"
              />
            </StaggerItem>
            <StaggerItem>
              <FeatureCard
                icon={<GraduationCap className="h-8 w-8" />}
                title="Academic Management"
                description="Exams, marks entry, report cards, transcripts, and promotion tools."
                gradient="from-purple-500 to-pink-500"
              />
            </StaggerItem>
            <StaggerItem>
              <FeatureCard
                icon={<CreditCard className="h-8 w-8" />}
                title="Fees & Finance"
                description="Fee structures, invoices, payments, receipts, and financial reports."
                gradient="from-yellow-500 to-orange-500"
              />
            </StaggerItem>
            <StaggerItem>
              <FeatureCard
                icon={<BarChart3 className="h-8 w-8" />}
                title="Reports & Analytics"
                description="Comprehensive reports, CSV/Excel exports, and PDF generation."
                gradient="from-red-500 to-rose-500"
              />
            </StaggerItem>
            <StaggerItem>
              <FeatureCard
                icon={<Shield className="h-8 w-8" />}
                title="Security & Roles"
                description="Role-based access control, audit logs, and data protection."
                gradient="from-indigo-500 to-violet-500"
              />
            </StaggerItem>
          </StaggerContainer>
        </div>
      </section>

      {/* Deployment Options */}
      <section className="py-20">
        <div className="container px-4 md:px-6">
          <FadeInUp className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Choose Your{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/60">
                Deployment
              </span>
            </h2>
            <p className="mt-4 text-muted-foreground md:text-lg">
              Flexible options to suit your needs and budget
            </p>
          </FadeInUp>
          <div className="grid gap-8 md:grid-cols-2 max-w-4xl mx-auto">
            <FadeInLeft delay={0.2}>
              <motion.div 
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                className="relative p-8 bg-card rounded-2xl border shadow-lg hover:shadow-xl transition-shadow h-full"
              >
                <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-bl-lg rounded-tr-xl">
                  Popular
                </div>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                    <Globe className="h-7 w-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Cloud (SaaS)</h3>
                    <p className="text-sm text-muted-foreground">Hosted by us</p>
                  </div>
                </div>
                <ul className="space-y-3 mb-6">
                  {['No server management', 'Automatic updates', 'Multi-school support', 'Starting at $25/month'].map((item, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Link href="/pricing">
                    <Button className="w-full shadow-lg shadow-primary/25">View Plans</Button>
                  </Link>
                </motion.div>
              </motion.div>
            </FadeInLeft>
            <FadeInRight delay={0.3}>
              <motion.div 
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                className="relative p-8 bg-card rounded-2xl border shadow-lg hover:shadow-xl transition-shadow h-full"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                    <Building2 className="h-7 w-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Self-Hosted</h3>
                    <p className="text-sm text-muted-foreground">Your servers</p>
                  </div>
                </div>
                <ul className="space-y-3 mb-6">
                  {['Full data ownership', 'One-time payment', 'No recurring fees', 'Starting at $499'].map((item, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Link href="/pricing">
                    <Button variant="outline" className="w-full">Learn More</Button>
                  </Link>
                </motion.div>
              </motion.div>
            </FadeInRight>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-muted/30 relative overflow-hidden">
        <div className="container px-4 md:px-6">
          <FadeInUp className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Trusted by Schools{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/60">
                Worldwide
              </span>
            </h2>
            <p className="mt-4 text-muted-foreground md:text-lg">See what educators are saying about Jambi School</p>
          </FadeInUp>
          <StaggerContainer className="grid gap-6 md:grid-cols-3">
            <StaggerItem>
              <TestimonialCard
                quote="Jambi School has transformed how we manage our student records. The fee management system alone has saved us countless hours."
                author="Sarah K."
                role="School Administrator"
                avatar="SK"
              />
            </StaggerItem>
            <StaggerItem>
              <TestimonialCard
                quote="The report card generation is fantastic. Parents love receiving professional-looking reports, and teachers save so much time."
                author="James M."
                role="Head Teacher"
                avatar="JM"
              />
            </StaggerItem>
            <StaggerItem>
              <TestimonialCard
                quote="As an education NGO, the self-hosted option was perfect. Full control over our data with a one-time investment."
                author="Maria L."
                role="NGO Director"
                avatar="ML"
              />
            </StaggerItem>
          </StaggerContainer>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10" />
        <motion.div
          animate={{ x: ['-100%', '100%'] }}
          transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
        />
        <div className="container px-4 md:px-6 relative">
          <FadeInUp className="flex flex-col items-center space-y-6 text-center">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Ready to Transform Your{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/60">
                School Management?
              </span>
            </h2>
            <p className="max-w-[600px] text-muted-foreground md:text-lg">
              Join hundreds of schools already using Jambi School to streamline their operations.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link href="/signup">
                  <Button size="lg" className="shadow-lg shadow-primary/25">Start Free Trial</Button>
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link href="/contact">
                  <Button size="lg" variant="outline">Schedule a Demo</Button>
                </Link>
              </motion.div>
            </div>
          </FadeInUp>
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

function FeatureCard({ icon, title, description, gradient }: { icon: React.ReactNode; title: string; description: string; gradient?: string }) {
  return (
    <motion.div 
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className="group flex flex-col p-6 bg-card/50 backdrop-blur-sm rounded-2xl border border-border/50 shadow-lg hover:shadow-xl transition-all h-full"
    >
      <div className={`w-14 h-14 mb-4 rounded-xl bg-gradient-to-br ${gradient || 'from-primary to-primary/60'} flex items-center justify-center text-white shadow-lg`}>
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">{title}</h3>
      <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
    </motion.div>
  );
}

function TestimonialCard({ quote, author, role, avatar }: { quote: string; author: string; role: string; avatar?: string }) {
  return (
    <motion.div 
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className="p-6 bg-card/50 backdrop-blur-sm rounded-2xl border border-border/50 shadow-lg hover:shadow-xl transition-all h-full flex flex-col"
    >
      <div className="flex-1">
        <div className="flex gap-1 mb-4">
          {[...Array(5)].map((_, i) => (
            <svg key={i} className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
        </div>
        <p className="text-muted-foreground italic mb-4">"{quote}"</p>
      </div>
      <div className="flex items-center gap-3 pt-4 border-t border-border/50">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-white font-semibold text-sm">
          {avatar || author.split(' ').map(n => n[0]).join('')}
        </div>
        <div>
          <p className="font-semibold">{author}</p>
          <p className="text-sm text-muted-foreground">{role}</p>
        </div>
      </div>
    </motion.div>
  );
}
