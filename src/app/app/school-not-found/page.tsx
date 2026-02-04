'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, Home, ArrowLeft } from 'lucide-react';

export default function SchoolNotFoundPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="shadow-xl text-center">
          <CardHeader>
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
              className="mx-auto w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-4"
            >
              <AlertTriangle className="h-8 w-8 text-yellow-600" />
            </motion.div>
            <CardTitle className="text-2xl">School Not Found</CardTitle>
            <CardDescription>
              The school you're looking for doesn't exist or you don't have access to it.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              This could happen if the school was deleted, the URL is incorrect, or your access was revoked.
            </p>
            <div className="flex flex-col gap-2">
              <Link href="/app/no-school">
                <Button className="w-full gap-2">
                  <Home className="h-4 w-4" /> Create a School
                </Button>
              </Link>
              <Link href="/">
                <Button variant="outline" className="w-full gap-2">
                  <ArrowLeft className="h-4 w-4" /> Back to Home
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
