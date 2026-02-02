import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { GraduationCap, Check, ArrowRight } from 'lucide-react';

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <GraduationCap className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold">Jambi School</span>
          </Link>
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/features" className="text-sm font-medium hover:text-primary">Features</Link>
            <Link href="/pricing" className="text-sm font-medium text-primary">Pricing</Link>
            <Link href="/about" className="text-sm font-medium hover:text-primary">About</Link>
            <Link href="/contact" className="text-sm font-medium hover:text-primary">Contact</Link>
          </nav>
          <div className="flex items-center space-x-4">
            <Link href="/login"><Button variant="ghost">Log in</Button></Link>
            <Link href="/signup"><Button>Get Started</Button></Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="py-16">
        <div className="container px-4 md:px-6 text-center">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl mb-4">
            Simple, Transparent Pricing
          </h1>
          <p className="text-muted-foreground md:text-lg max-w-2xl mx-auto">
            Choose the plan that works for your school. Start with a 14-day free trial, no credit card required.
          </p>
        </div>
      </section>

      {/* SaaS Plans */}
      <section className="py-12">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold mb-2">Cloud (SaaS) Plans</h2>
            <p className="text-muted-foreground">Hosted by us, managed for you. Monthly subscription.</p>
          </div>
          <div className="grid gap-8 md:grid-cols-3 max-w-5xl mx-auto">
            {/* Starter */}
            <div className="relative p-8 bg-card rounded-xl border shadow-sm">
              <h3 className="text-xl font-bold mb-2">Starter</h3>
              <p className="text-muted-foreground mb-4">Perfect for small schools</p>
              <div className="mb-6">
                <span className="text-4xl font-bold">$25</span>
                <span className="text-muted-foreground">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                <PricingFeature>Up to 200 students</PricingFeature>
                <PricingFeature>5 staff accounts</PricingFeature>
                <PricingFeature>Student management</PricingFeature>
                <PricingFeature>Attendance tracking</PricingFeature>
                <PricingFeature>Basic fee management</PricingFeature>
                <PricingFeature>Email support</PricingFeature>
              </ul>
              <Link href="/signup?plan=starter">
                <Button className="w-full">Start Free Trial</Button>
              </Link>
            </div>

            {/* Growth - Popular */}
            <div className="relative p-8 bg-card rounded-xl border-2 border-primary shadow-lg">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium">
                Most Popular
              </div>
              <h3 className="text-xl font-bold mb-2">Growth</h3>
              <p className="text-muted-foreground mb-4">For growing institutions</p>
              <div className="mb-6">
                <span className="text-4xl font-bold">$50</span>
                <span className="text-muted-foreground">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                <PricingFeature>Up to 500 students</PricingFeature>
                <PricingFeature>15 staff accounts</PricingFeature>
                <PricingFeature>All Starter features</PricingFeature>
                <PricingFeature>Full academics module</PricingFeature>
                <PricingFeature>Report card generation</PricingFeature>
                <PricingFeature>Financial reports</PricingFeature>
                <PricingFeature>Priority email support</PricingFeature>
              </ul>
              <Link href="/signup?plan=growth">
                <Button className="w-full">Start Free Trial</Button>
              </Link>
            </div>

            {/* Enterprise */}
            <div className="relative p-8 bg-card rounded-xl border shadow-sm">
              <h3 className="text-xl font-bold mb-2">Enterprise</h3>
              <p className="text-muted-foreground mb-4">For large schools & NGOs</p>
              <div className="mb-6">
                <span className="text-4xl font-bold">$99</span>
                <span className="text-muted-foreground">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                <PricingFeature>Unlimited students</PricingFeature>
                <PricingFeature>Unlimited staff</PricingFeature>
                <PricingFeature>All Growth features</PricingFeature>
                <PricingFeature>Multi-school management</PricingFeature>
                <PricingFeature>Custom branding</PricingFeature>
                <PricingFeature>API access</PricingFeature>
                <PricingFeature>24/7 phone support</PricingFeature>
              </ul>
              <Link href="/signup?plan=enterprise">
                <Button className="w-full">Start Free Trial</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Self-Hosted Plans */}
      <section className="py-12 bg-muted/50">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold mb-2">Self-Hosted Licenses</h2>
            <p className="text-muted-foreground">One-time payment. Full ownership. No recurring fees.</p>
          </div>
          <div className="grid gap-8 md:grid-cols-3 max-w-5xl mx-auto">
            {/* Single School */}
            <div className="relative p-8 bg-card rounded-xl border shadow-sm">
              <h3 className="text-xl font-bold mb-2">Single School</h3>
              <p className="text-muted-foreground mb-4">One school license</p>
              <div className="mb-6">
                <span className="text-4xl font-bold">$499</span>
                <span className="text-muted-foreground"> one-time</span>
              </div>
              <ul className="space-y-3 mb-8">
                <PricingFeature>Single school setup</PricingFeature>
                <PricingFeature>Unlimited students</PricingFeature>
                <PricingFeature>Unlimited staff</PricingFeature>
                <PricingFeature>All core features</PricingFeature>
                <PricingFeature>1 year of updates</PricingFeature>
                <PricingFeature>Email support (1 year)</PricingFeature>
              </ul>
              <Link href="/contact?license=single">
                <Button variant="outline" className="w-full">Buy License</Button>
              </Link>
            </div>

            {/* Multi-School */}
            <div className="relative p-8 bg-card rounded-xl border-2 border-primary shadow-lg">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium">
                Best Value
              </div>
              <h3 className="text-xl font-bold mb-2">Multi-School / NGO</h3>
              <p className="text-muted-foreground mb-4">Up to 5 schools</p>
              <div className="mb-6">
                <span className="text-4xl font-bold">$999</span>
                <span className="text-muted-foreground"> one-time</span>
              </div>
              <ul className="space-y-3 mb-8">
                <PricingFeature>Up to 5 schools</PricingFeature>
                <PricingFeature>Unlimited students</PricingFeature>
                <PricingFeature>Unlimited staff</PricingFeature>
                <PricingFeature>All features included</PricingFeature>
                <PricingFeature>2 years of updates</PricingFeature>
                <PricingFeature>Priority support (2 years)</PricingFeature>
              </ul>
              <Link href="/contact?license=multi">
                <Button className="w-full">Buy License</Button>
              </Link>
            </div>

            {/* Enterprise */}
            <div className="relative p-8 bg-card rounded-xl border shadow-sm">
              <h3 className="text-xl font-bold mb-2">Enterprise / Unlimited</h3>
              <p className="text-muted-foreground mb-4">Unlimited schools</p>
              <div className="mb-6">
                <span className="text-4xl font-bold">$1499</span>
                <span className="text-muted-foreground"> one-time</span>
              </div>
              <ul className="space-y-3 mb-8">
                <PricingFeature>Unlimited schools</PricingFeature>
                <PricingFeature>Unlimited everything</PricingFeature>
                <PricingFeature>White-label option</PricingFeature>
                <PricingFeature>Custom integrations</PricingFeature>
                <PricingFeature>Lifetime updates</PricingFeature>
                <PricingFeature>Dedicated support</PricingFeature>
              </ul>
              <Link href="/contact?license=enterprise">
                <Button variant="outline" className="w-full">Contact Sales</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16">
        <div className="container px-4 md:px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">Need a Custom Solution?</h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            We offer custom implementations for large organizations with specific requirements.
          </p>
          <Link href="/contact">
            <Button size="lg" className="gap-2">
              Request Demo <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container px-4 md:px-6 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Jambi School. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

function PricingFeature({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-center gap-2">
      <Check className="h-5 w-5 text-success flex-shrink-0" />
      <span>{children}</span>
    </li>
  );
}
