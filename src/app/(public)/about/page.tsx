'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { FadeInUp, FadeInLeft, FadeInRight, StaggerContainer, StaggerItem } from '@/components/ui/animations';
import { GraduationCap, Target, Heart, Users, Globe, Award, ArrowRight, Sparkles } from 'lucide-react';

const stats = [
  { value: '500+', label: 'Schools Worldwide' },
  { value: '50K+', label: 'Students Managed' },
  { value: '99.9%', label: 'Uptime' },
  { value: '24/7', label: 'Support' },
];

const values = [
  { icon: Target, title: 'Mission-Driven', description: 'We believe every school deserves access to powerful management tools, regardless of size or budget.' },
  { icon: Heart, title: 'Education First', description: 'Our decisions are guided by what\'s best for educators and students, not just profits.' },
  { icon: Users, title: 'Community Focused', description: 'We build in partnership with schools, incorporating feedback to create tools that truly serve.' },
  { icon: Globe, title: 'Global Impact', description: 'From urban schools to rural education NGOs, we\'re making a difference worldwide.' },
];

const team = [
  { name: 'David Chen', role: 'CEO & Founder', avatar: 'DC', bio: 'Former educator with 15 years in EdTech' },
  { name: 'Sarah Williams', role: 'CTO', avatar: 'SW', bio: 'Engineering leader from top tech companies' },
  { name: 'Michael Okonkwo', role: 'Head of Product', avatar: 'MO', bio: 'Product expert passionate about education' },
  { name: 'Emily Rodriguez', role: 'Customer Success', avatar: 'ER', bio: 'Dedicated to helping schools succeed' },
];

export default function AboutPage() {
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
              <Link key={item} href={`/${item.toLowerCase()}`} className={`text-sm font-medium ${item === 'About' ? 'text-primary' : 'text-muted-foreground hover:text-primary'}`}>{item}</Link>
            ))}
          </nav>
          <div className="flex items-center space-x-4">
            <Link href="/login"><Button variant="ghost">Log in</Button></Link>
            <Link href="/signup"><Button>Get Started</Button></Link>
          </div>
        </div>
      </motion.header>

      {/* Hero */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-background" />
        <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }} transition={{ duration: 8, repeat: Infinity }} className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/10 rounded-full blur-3xl" />
        <div className="container px-4 relative">
          <FadeInUp className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm mb-6">
              <Sparkles className="h-4 w-4" /><span>Our Story</span>
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl mb-6">
              Empowering <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/60">Education</span> Worldwide
            </h1>
            <p className="text-lg text-muted-foreground">We started Jambi School with a simple mission: make powerful school management accessible to every educational institution, from large urban schools to small rural NGOs.</p>
          </FadeInUp>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-muted/30">
        <div className="container px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-primary mb-2">{stat.value}</div>
                <div className="text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20">
        <div className="container px-4">
          <FadeInUp className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/60">Values</span></h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">The principles that guide everything we do</p>
          </FadeInUp>
          <StaggerContainer className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {values.map((v) => (
              <StaggerItem key={v.title}>
                <motion.div whileHover={{ y: -5 }} className="h-full p-6 bg-card/50 backdrop-blur-sm rounded-2xl border shadow-lg text-center">
                  <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                    <v.icon className="h-7 w-7" />
                  </div>
                  <h3 className="text-lg font-bold mb-2">{v.title}</h3>
                  <p className="text-sm text-muted-foreground">{v.description}</p>
                </motion.div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 bg-muted/30">
        <div className="container px-4">
          <FadeInUp className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Meet the <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/60">Team</span></h2>
            <p className="text-muted-foreground">Passionate people dedicated to transforming education</p>
          </FadeInUp>
          <StaggerContainer className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 max-w-4xl mx-auto">
            {team.map((member) => (
              <StaggerItem key={member.name}>
                <motion.div whileHover={{ y: -5 }} className="p-6 bg-card rounded-2xl border shadow-lg text-center">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-white text-2xl font-bold">
                    {member.avatar}
                  </div>
                  <h3 className="font-bold">{member.name}</h3>
                  <p className="text-sm text-primary mb-2">{member.role}</p>
                  <p className="text-xs text-muted-foreground">{member.bio}</p>
                </motion.div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="container px-4">
          <FadeInUp className="text-center">
            <h2 className="text-3xl font-bold mb-4">Join Our Mission</h2>
            <p className="text-muted-foreground mb-8 max-w-lg mx-auto">Be part of the education revolution. Start using Jambi School today.</p>
            <div className="flex justify-center gap-4 flex-wrap">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link href="/signup"><Button size="lg" className="gap-2">Get Started <ArrowRight className="h-4 w-4" /></Button></Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link href="/contact"><Button size="lg" variant="outline">Contact Us</Button></Link>
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
