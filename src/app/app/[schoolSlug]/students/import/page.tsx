'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Upload, FileSpreadsheet, Download, CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function ImportStudentsPage() {
  const params = useParams();
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    // TODO: Implement file upload logic
    setTimeout(() => setUploading(false), 2000);
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-4"
      >
        <Link href={`/app/${params.schoolSlug}/students`}>
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Import Students</h1>
          <p className="text-muted-foreground">Bulk import students from a spreadsheet</p>
        </div>
      </motion.div>

      <div className="grid gap-6 md:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" /> Upload File
              </CardTitle>
              <CardDescription>Upload a CSV or Excel file with student data</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed rounded-lg p-8 text-center">
                <input
                  type="file"
                  accept=".csv,.xlsx,.xls"
                  onChange={handleFileChange}
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <FileSpreadsheet className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  {file ? (
                    <div className="flex items-center justify-center gap-2 text-green-600">
                      <CheckCircle className="h-5 w-5" />
                      <span>{file.name}</span>
                    </div>
                  ) : (
                    <>
                      <p className="text-lg font-medium mb-2">Drop your file here</p>
                      <p className="text-sm text-muted-foreground mb-4">
                        or click to browse
                      </p>
                    </>
                  )}
                </label>
              </div>
              <Button
                className="w-full mt-4 gap-2"
                onClick={handleUpload}
                disabled={!file || uploading}
              >
                <Upload className="h-4 w-4" />
                {uploading ? 'Uploading...' : 'Upload & Import'}
              </Button>
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
              <CardTitle className="flex items-center gap-2">
                <Download className="h-5 w-5" /> Download Template
              </CardTitle>
              <CardDescription>Get the template file with required columns</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Download our template file to ensure your data is formatted correctly.
                  The template includes all required and optional columns.
                </p>
                <div className="bg-muted p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Required Columns:</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• First Name</li>
                    <li>• Last Name</li>
                    <li>• Date of Birth</li>
                    <li>• Gender</li>
                    <li>• Class</li>
                  </ul>
                </div>
                <Button variant="outline" className="w-full gap-2">
                  <Download className="h-4 w-4" /> Download Template
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
