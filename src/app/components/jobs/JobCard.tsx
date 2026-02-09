"use client";

import { motion } from "framer-motion";
import { Job } from "@/lib/hooks/useJobs";
import { MapPin, DollarSign, Briefcase, ExternalLink } from "lucide-react";
import Link from "next/link";

interface JobCardProps {
  job: Job;
  index?: number;
}

export default function JobCard({ job, index = 0 }: JobCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="group bg-card border-border/60 hover:border-primary/20 relative overflow-hidden rounded-xl border p-6 shadow-sm transition-all duration-300 hover:shadow-md"
    >
      <div className="relative flex h-full flex-col">
        <Link href={`/jobs/${job.id}`} className="block h-full">
          <div className="mb-5 flex items-start justify-between">
            <div className="flex-1">
              <h3 className="text-foreground group-hover:text-primary mb-1 text-lg font-bold transition-colors">
                {job.title}
              </h3>
              <p className="text-muted-foreground text-sm font-medium">
                {job.company}
              </p>
            </div>
            {job.source === "EXTERNAL" && (
              <ExternalLink className="text-muted-foreground/40 h-4 w-4" />
            )}
          </div>

          <div className="mb-5 flex flex-wrap gap-x-4 gap-y-2">
            <div className="text-muted-foreground flex items-center gap-1.5 text-xs font-medium">
              <MapPin className="h-3.5 w-3.5" />
              <span>{job.location}</span>
            </div>
            <div className="text-muted-foreground flex items-center gap-1.5 text-xs font-medium">
              <DollarSign className="h-3.5 w-3.5" />
              <span>{job.salary || "Salary not disclosed"}</span>
            </div>
          </div>

          <p className="text-muted-foreground/80 mb-5 line-clamp-2 text-sm leading-relaxed">
            {job.description}
          </p>
        </Link>
        {job.tags && job.tags.length > 0 && (
          <div className="relative flex flex-wrap gap-2">
            {job.tags.slice(0, 3).map((tag, idx) => (
              <Link
                key={idx}
                href={`/jobs?tags=${encodeURIComponent(tag)}`}
                onClick={(e) => e.stopPropagation()}
                className="bg-primary/5 text-primary hover:bg-primary/10 rounded-md px-2.5 py-1 text-xs font-medium transition-colors"
              >
                {tag}
              </Link>
            ))}
            {job.tags.length > 3 && (
              <span className="bg-muted text-muted-foreground rounded-md px-2.5 py-1 text-xs font-medium">
                +{job.tags.length - 3} more
              </span>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}
