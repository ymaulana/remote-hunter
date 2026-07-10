"use client";

import { motion } from "framer-motion";
import { useJob } from "@/components/hooks/useJobs";
import { useParams } from "next/navigation";
import {
  MapPin,
  DollarSign,
  Calendar,
  ExternalLink,
  Loader2,
  ArrowLeft,
  Briefcase,
} from "lucide-react";
import Link from "next/link";
import ClientDate from "@/components/ui/ClientDate";

export default function JobDetailPage() {
  const params = useParams();
  const jobId = params.id as string;
  const { data: job, isLoading, error } = useJob(jobId);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="text-primary h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="container mx-auto px-6 py-12">
        <div className="border-destructive/50 bg-destructive/10 rounded-lg border p-6 text-center">
          <p className="text-destructive">
            Job not found or failed to load. Please try again later.
          </p>
          <Link
            href="/jobs"
            className="text-primary mt-4 inline-block hover:underline"
          >
            Back to Jobs
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen">
      {/* Header */}
      <section className="from-primary/5 border-b bg-linear-to-b to-transparent py-8">
        <div className="container mx-auto mt-16 px-6">
          <Link
            href="/jobs"
            className="text-muted-foreground hover:text-primary mb-6 inline-flex items-center gap-2 text-sm transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Jobs
          </Link>

          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <h1 className="text-foreground mb-4 text-3xl font-bold md:text-4xl">
                  {job.title}
                </h1>
                <p className="text-muted-foreground mb-4 text-xl">
                  {job.company}
                </p>

                <div className="text-muted-foreground flex flex-wrap gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <span>{job.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    <span>{job.salary || "Salary not disclosed"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span suppressHydrationWarning>
                      Posted <ClientDate date={job.postedAt} />
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Briefcase className="h-4 w-4" />
                    <span className="capitalize">
                      {job.source.toLowerCase()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-1">
                {job.source === "EXTERNAL" && job.externalLink && (
                  <a
                    href={job.externalLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-primary hover:bg-primary/90 flex max-w-fit items-center justify-center gap-2 rounded-lg px-6 py-3 font-semibold text-white transition-colors"
                  >
                    Apply Now
                    <ExternalLink className="h-4 w-4" />
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section>
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Job Description */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="lg:col-span-2"
            >
              <div className="bg-card rounded-xl border p-8">
                <h2 className="text-foreground mb-4 text-2xl font-semibold">
                  Job Description
                </h2>
                <div className="prose prose-sm text-muted-foreground max-w-none">
                  <p className="whitespace-pre-wrap">{job.description}</p>
                </div>
              </div>
            </motion.div>

            {/* Sidebar */}
            <motion.aside
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="lg:col-span-1"
            >
              {/* Tags */}
              {job.tags && job.tags.length > 0 && (
                <div className="bg-card mb-6 rounded-xl border p-6">
                  <h3 className="text-foreground mb-4 text-lg font-semibold">
                    Skills & Tags
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {job.tags.map((tag, idx) => (
                      <Link
                        key={idx}
                        href={`/jobs?tags=${encodeURIComponent(tag)}`}
                        className="bg-primary/10 text-primary hover:bg-primary/20 rounded-full px-3 py-1.5 text-sm font-medium transition-colors"
                      >
                        {tag}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Apply Section */}
              <div className="bg-card rounded-xl border p-6">
                <h3 className="text-foreground mb-4 text-lg font-semibold">
                  How to Apply
                </h3>
                {job.source === "EXTERNAL" && job.externalLink ? (
                  <a
                    href={job.externalLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-primary hover:bg-primary/90 flex w-full items-center justify-center gap-2 rounded-lg px-6 py-3 font-semibold text-white transition-colors"
                  >
                    Apply on External Site
                    <ExternalLink className="h-4 w-4" />
                  </a>
                ) : (
                  <button className="bg-primary hover:bg-primary/90 w-full rounded-lg px-6 py-3 font-semibold text-white transition-colors">
                    Apply Now
                  </button>
                )}
                <p className="text-muted-foreground mt-4 text-xs">
                  By applying, you agree to our terms and conditions.
                </p>
              </div>
            </motion.aside>
          </div>
        </div>
      </section>
    </div>
  );
}
