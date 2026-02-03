'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FadeInUp, FadeInLeft, FadeInRight } from '@/components/ui/animations';
import { GraduationCap, Mail, Phone, MapPin, MessageSquare, Send, CheckCircle } from 'lucide-react';

const contactInfo = [
  { icon: Mail, title: 'Email', value: 'hello@jambischool.com', href: 'mailto:hello@jambischool.com' },
  { icon: Phone, title: 'Phone', value: '+1 (555) 123-4567', href: 'tel:+15551234567' },
  { icon: MapPin, title: 'Address', value: 'San Francisco, CA', href: '#' },
];

const faqs = [
  { q: 'How long is the free trial?', a: 'Our free trial lasts 14 days with full access to all features.' },
  { q: 'Do I need a credit card to start?', a: 'No credit card required for the free trial.' },
  { q: 'Can I import my existing data?', a: 'Yes, we support bulk import from Excel and CSV files.' },
  { q: 'Is training included?', a: 'Yes, we provide free onboarding and training for all plans.' },
];

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    setLoading(false);
    setSubmitted(true);
  };

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
              <Link key={item} href={`/${item.toLowerCase()}`} className={`text-sm font-medium ${item === 'Contact' ? 'text-primary' : 'text-muted-foreground hover:text-primary'}`}>{item}</Link>
            ))}
          </nav>
          <div className="flex items-center space-x-4">
            <Link href="/login"><Button variant="ghost">Log in</Button></Link>
            <Link href="/signup"><Button>Get Started</Button></Link>
          </div>
        </div>
      </motion.header>

      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-background" />
        <div className="container px-4 relative">
          <FadeInUp className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm mb-6">
              <MessageSquare className="h-4 w-4" /><span>Get in Touch</span>
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl mb-6">
              We'd Love to <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/60">Hear From You</span>
            </h1>
            <p className="text-lg text-muted-foreground">Have questions? Want a demo? We're here to help.</p>
          </FadeInUp>

          <div className="grid lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
            <FadeInLeft>
              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl font-bold mb-6">Contact Information</h2>
                  <div className="space-y-4">
                    {contactInfo.map((info) => (
                      <motion.a key={info.title} href={info.href} whileHover={{ x: 5 }} className="flex items-center gap-4 p-4 bg-card/50 rounded-xl border hover:border-primary/50 transition-colors">
                        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                          <info.icon className="h-6 w-6" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">{info.title}</p>
                          <p className="font-medium">{info.value}</p>
                        </div>
                      </motion.a>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-bold mb-4">Frequently Asked Questions</h3>
                  <div className="space-y-3">
                    {faqs.map((faq, i) => (
                      <motion.div key={i} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="p-4 bg-muted/50 rounded-lg">
                        <p className="font-medium mb-1">{faq.q}</p>
                        <p className="text-sm text-muted-foreground">{faq.a}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </FadeInLeft>

            <FadeInRight>
              <motion.div whileHover={{ y: -5 }} className="p-8 bg-card rounded-2xl border shadow-lg">
                {submitted ? (
                  <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-12">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
                      <CheckCircle className="h-8 w-8 text-green-600" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">Message Sent!</h3>
                    <p className="text-muted-foreground mb-6">We'll get back to you within 24 hours.</p>
                    <Button variant="outline" onClick={() => setSubmitted(false)}>Send Another</Button>
                  </motion.div>
                ) : (
                  <>
                    <h2 className="text-2xl font-bold mb-6">Send us a Message</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Name</Label>
                          <Input id="name" placeholder="John Doe" required />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <Input id="email" type="email" placeholder="john@school.edu" required />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="school">School/Organization</Label>
                        <Input id="school" placeholder="Your School Name" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="subject">Subject</Label>
                        <Input id="subject" placeholder="How can we help?" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="message">Message</Label>
                        <textarea id="message" rows={4} placeholder="Tell us more about your needs..." required className="w-full px-3 py-2 rounded-md border bg-background text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary" />
                      </div>
                      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Button type="submit" className="w-full gap-2" disabled={loading}>
                          {loading ? 'Sending...' : <><Send className="h-4 w-4" /> Send Message</>}
                        </Button>
                      </motion.div>
                    </form>
                  </>
                )}
              </motion.div>
            </FadeInRight>
          </div>
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
