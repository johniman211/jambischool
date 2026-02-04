'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookOpen, FileText, Award, Plus, Calendar } from 'lucide-react';

export default function AcademicsPage() {
  const [activeTab, setActiveTab] = useState('exams');

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold">Academics</h1>
          <p className="text-muted-foreground">Manage exams, marks, and report cards</p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" /> Create Exam
        </Button>
      </motion.div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="exams" className="gap-2">
            <Calendar className="h-4 w-4" /> Exams
          </TabsTrigger>
          <TabsTrigger value="marks" className="gap-2">
            <FileText className="h-4 w-4" /> Marks Entry
          </TabsTrigger>
          <TabsTrigger value="reports" className="gap-2">
            <Award className="h-4 w-4" /> Report Cards
          </TabsTrigger>
        </TabsList>

        <TabsContent value="exams" className="mt-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" /> Examinations
                </CardTitle>
                <CardDescription>Schedule and manage exams for all classes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Exams Scheduled</h3>
                  <p className="text-muted-foreground mb-4">
                    Create your first exam to start tracking academic performance
                  </p>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" /> Schedule Exam
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="marks" className="mt-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" /> Marks Entry
                </CardTitle>
                <CardDescription>Enter and manage student marks</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Marks to Enter</h3>
                  <p className="text-muted-foreground mb-4">
                    Schedule an exam first, then you can enter marks here
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="reports" className="mt-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" /> Report Cards
                </CardTitle>
                <CardDescription>Generate and print student report cards</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Award className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Report Cards</h3>
                  <p className="text-muted-foreground mb-4">
                    Report cards will be available after marks are entered
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
