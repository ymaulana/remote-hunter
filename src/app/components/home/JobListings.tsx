"use client";

import { motion } from "framer-motion";
import { useJobs } from "@/lib/hooks/useJobs";
import JobCard from "@/app/components/jobs/JobCard";
import { ChevronRight } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import Link from "next/link";

const JobListings = () => {
  const { data: jobs, isLoading } = useJobs();
  console.log(jobs);
  const displayJobs = jobs?.slice(0, 6) || [];

  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-6">
        <div className="mb-12 flex flex-col items-start justify-between gap-4 md:mb-16 md:flex-row md:items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-foreground mb-4 text-2xl font-bold md:text-3xl">
              Latest Remote Jobs
            </h2>
            <p className="text-muted-foreground max-w-2xl">
              Fresh entry-level opportunities updated daily from companies that
              value remote work
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Link href="/jobs">
              <Button variant="outline" className="gap-1">
                View All Jobs <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
          </motion.div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-muted h-64 animate-pulse rounded-xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {displayJobs.map((job, index) => (
              <JobCard key={job.id} job={job} index={index} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default JobListings;
