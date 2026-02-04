'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Layers, 
  Plus, 
  Search, 
  DollarSign,
  GraduationCap,
  Settings
} from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

interface FeeStructure {
  id: string;
  name: string;
  amount: number;
  frequency: string;
  is_mandatory: boolean;
  classes?: { id: string; name: string };
  academic_years?: { name: string };
}

export default function FeeStructuresPage() {
  const params = useParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [structures, setStructures] = useState<FeeStructure[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStructures = async () => {
      const supabase = createClient();
      const { data: school } = await supabase
        .from('schools')
        .select('id')
        .eq('slug', params.schoolSlug)
        .single();

      if (school) {
        const { data } = await supabase
          .from('fee_structures')
          .select('*, classes(id, name), academic_years(name)')
          .eq('school_id', school.id)
          .order('created_at', { ascending: false });

        if (data) setStructures(data as FeeStructure[]);
      }
      setLoading(false);
    };
    fetchStructures();
  }, [params.schoolSlug]);

  const filteredStructures = structures.filter(s =>
    s.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const uniqueClasses = new Set(structures.map(s => s.classes?.id).filter(Boolean));
  const avgFee = structures.length > 0 ? structures.reduce((sum, s) => sum + Number(s.amount), 0) / structures.length : 0;

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold">Fee Structures</h1>
          <p className="text-muted-foreground">Define fee categories and amounts for each class</p>
        </div>
        <Link href={`/app/${params.schoolSlug}/fees/structures/new`}>
          <Button className="gap-2">
            <Plus className="h-4 w-4" /> Add Fee Structure
          </Button>
        </Link>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid gap-4 md:grid-cols-3"
      >
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-blue-100 text-blue-500">
                <Layers className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold">{structures.length}</p>
                <p className="text-sm text-muted-foreground">Fee Categories</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-green-100 text-green-500">
                <GraduationCap className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold">{uniqueClasses.size}</p>
                <p className="text-sm text-muted-foreground">Classes Configured</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-purple-100 text-purple-500">
                <DollarSign className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold">${avgFee.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Avg. Annual Fee</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Fee Structures by Class</CardTitle>
                <CardDescription>Configure fees for each class and term</CardDescription>
              </div>
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search structures..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-12">Loading...</div>
            ) : filteredStructures.length === 0 ? (
              <div className="text-center py-12">
                <Settings className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No Fee Structures Defined</h3>
                <p className="text-muted-foreground mb-4">
                  Create fee structures to define tuition, boarding, and other fees
                </p>
                <Link href={`/app/${params.schoolSlug}/fees/structures/new`}>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" /> Create Fee Structure
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredStructures.map((structure) => (
                  <div key={structure.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50">
                    <div>
                      <p className="font-medium">{structure.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {structure.classes?.name || 'All Classes'} • {structure.frequency?.replace('_', ' ')}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <p className="font-bold">${Number(structure.amount).toLocaleString()}</p>
                      {structure.is_mandatory && <Badge>Mandatory</Badge>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
