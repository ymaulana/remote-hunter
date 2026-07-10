"use client";

import { motion } from "framer-motion";
import { Plus, Users, Eye, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { useState, useEffect } from "react";

// Mock data until API is fully wired
const initialJobs = [
  {
    id: 1,
    title: "Senior Frontend Engineer",
    status: "Active",
    applicants: 45,
    views: 1200,
  },
  {
    id: 2,
    title: "Product Designer",
    status: "Active",
    applicants: 28,
    views: 890,
  },
  {
    id: 3,
    title: "Backend Developer",
    status: "Closed",
    applicants: 112,
    views: 3400,
  },
];

const JobPostingsPreview = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <section id="job-postings" className="bg-background py-20 lg:py-24">
      <div className="container mx-auto px-6">
        <div className="mb-12 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-foreground text-3xl font-bold tracking-tight sm:text-4xl">
              Your Dashboard Preview
            </h2>
            <p className="text-muted-foreground mt-2">
              A quick glance at your recent job postings and applicant pipeline.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Link href="/jobs/post">
              <Button size="lg" className="bg-primary px-8">
                <Plus className="mr-2 h-5 w-5" /> Post New Job
              </Button>
            </Link>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {initialJobs.map((job, i) => (
            <motion.div
              key={job.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <Card className="hover:border-primary/50 relative overflow-hidden transition-all hover:shadow-md">
                <div
                  className={`absolute top-0 left-0 h-1 w-full ${job.status === "Closed" ? "bg-muted" : "bg-primary"}`}
                />
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="mb-2 flex items-center gap-2">
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                            job.status === "Active"
                              ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                              : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
                          }`}
                        >
                          {job.status}
                        </span>
                      </div>
                      <CardTitle className="text-xl font-bold">
                        {job.title}
                      </CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="bg-muted/50 my-6 grid grid-cols-2 gap-4 rounded-xl p-4">
                    <div className="flex flex-col">
                      <span className="text-muted-foreground text-sm font-medium">
                        Applicants
                      </span>
                      <span className="text-foreground mt-1 flex items-center text-2xl font-bold">
                        <Users className="mr-2 h-5 w-5 text-blue-500" />
                        {job.applicants}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-muted-foreground text-sm font-medium">
                        Views
                      </span>
                      <span className="text-foreground mt-1 flex items-center text-2xl font-bold">
                        <Eye className="mr-2 h-5 w-5 text-purple-500" />
                        {job.views}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Button variant="outline" className="w-full flex-1">
                      <Edit className="mr-2 h-4 w-4" /> Edit
                    </Button>
                    <Button
                      className="w-full flex-1"
                      disabled={job.applicants === 0}
                    >
                      Review <Users className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default JobPostingsPreview;
