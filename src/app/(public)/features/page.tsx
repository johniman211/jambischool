'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { FadeInUp, StaggerContainer, StaggerItem } from '@/components/ui/animations';
import { 
  GraduationCap, Users, Calendar, CreditCard, BarChart3, Shield,
  Bell, Clock, Globe, Smartphone, Database, Zap, CheckCircle, ArrowRight
} from 'lucide-react';

const features = [
  {
    icon: Users, title: 'Student Management', gradient: 'from-blue-500 to-cyan-500',
    description: 'Comprehensive student profiles with photos, documents, and complete academic history.',
    items: ['Student profiles & photos', 'Guardian management', 'Document storage', 'Enrollment tracking'],
  },
  {
    icon: Calendar, title: 'Attendance Tracking', gradient: 'from-green-500 to-emerald-500',
    description: 'Effortless daily attendance with offline support and comprehensive reports.',
    items: ['Daily attendance', 'Offline draft support', 'Class-wise reports', 'Absence alerts'],
  },
  {
    icon: GraduationCap, title: 'Academic Management', gradient: 'from-purple-500 to-pink-500',
    description: 'Complete academic cycle management from exams to report cards.',
    items: ['Exam management', 'Marks entry', 'Report cards', 'Transcripts'],
  },
  {
    icon: CreditCard, title: 'Fees & Finance', gradient: 'from-yellow-500 to-orange-500',
    description: 'Streamlined fee collection with invoices, payments, and financial reporting.',
    items: ['Fee structures', 'Invoice generation', 'Payment tracking', 'Financial reports'],
  },
  {
    icon: BarChart3, title: 'Reports & Analytics', gradient: 'from-red-500 to-rose-500',
    description: 'Powerful insights with customizable reports and data exports.',
    items: ['Dashboard analytics', 'Custom reports', 'CSV/Excel export', 'PDF generation'],
  },
  {
    icon: Shield, title: 'Security & Access', gradient: 'from-indigo-500 to-violet-500',
    description: 'Enterprise-grade security with role-based permissions.',
    items: ['Role-based access', 'Audit logs', 'Data encryption', 'GDPR compliant'],
  },
];

const extras = [
  { icon: Bell, title: 'Notifications', desc: 'SMS, email & in-app alerts' },
  { icon: Clock, title: 'Timetable', desc: 'Class scheduling made easy' },
  { icon: Globe, title: 'Multi-language', desc: 'Multiple language support' },
  { icon: Smartphone, title: 'Mobile Ready', desc: 'Works on all devices' },
  { icon: Database, title: 'Data Import', desc: 'Bulk import from Excel' },
  { icon: Zap, title: 'Fast & Reliable', desc: 'Optimized performance' },
];

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-background">
      <motion.header initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-xl">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <GraduationCap className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold">Jambi School</span>
          </Link>
          <nav className="hidden md:flex items-center space-x-8">
            {['Features', 'Pricing', 'About', 'Contact'].map((item) => (
              <Link key={item} href={`/${item.toLowerCase()}`} className={`text-sm font-medium ${item === 'Features' ? 'text-primary' : 'text-muted-foreground hover:text-primary'}`}>{item}</Link>
            ))}
          </nav>
          <div className="flex items-center space-x-4">
            <Link href="/login"><Button variant="ghost">Log in</Button></Link>
            <Link href="/signup"><Button>Get Started</Button></Link>
          </div>
        </div>
      </motion.header>

      <section className="py-20 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-background" />
        <div className="container px-4 relative">
          <FadeInUp className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm mb-6">
              <Zap className="h-4 w-4" /><span>Powerful Features</span>
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl mb-6">
              Everything You Need to <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/60">Run Your School</span>
            </h1>
            <p className="text-lg text-muted-foreground">Comprehensive tools designed specifically for educational institutions of all sizes.</p>
          </FadeInUp>

          <StaggerContainer className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <StaggerItem key={f.title}>
                <motion.div whileHover={{ y: -5 }} className="h-full p-6 bg-card/50 backdrop-blur-sm rounded-2xl border shadow-lg">
                  <div className={`w-14 h-14 mb-4 rounded-xl bg-gradient-to-br ${f.gradient} flex items-center justify-center text-white`}>
                    <f.icon className="h-7 w-7" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{f.title}</h3>
                  <p className="text-muted-foreground text-sm mb-4">{f.description}</p>
                  <ul className="space-y-2">
                    {f.items.map((item) => (
                      <li key={item} className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-green-500" />{item}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      <section className="py-20 bg-muted/30">
        <div className="container px-4">
          <FadeInUp className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">And Much More</h2>
            <p className="text-muted-foreground">Additional features to make your school management effortless</p>
          </FadeInUp>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-4xl mx-auto">
            {extras.map((e, i) => (
              <motion.div key={e.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="flex items-center gap-4 p-4 bg-card rounded-xl border">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  <e.icon className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-semibold">{e.title}</h4>
                  <p className="text-sm text-muted-foreground">{e.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container px-4">
          <FadeInUp className="text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-muted-foreground mb-8 max-w-lg mx-auto">Join hundreds of schools already using Jambi School.</p>
            <div className="flex justify-center gap-4 flex-wrap">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link href="/signup"><Button size="lg" className="gap-2">Start Free Trial <ArrowRight className="h-4 w-4" /></Button></Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link href="/contact"><Button size="lg" variant="outline">Contact Sales</Button></Link>
              </motion.div>
            </div>
          </FadeInUp>
        </div>
      </section>

      <footer className="border-t py-8">
        <div className="container px-4 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Jambi School. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
