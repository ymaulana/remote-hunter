"use client";

import { useState, useEffect, Suspense } from "react";
import { motion } from "framer-motion";
import { useJobs, JobFilters } from "@/components/hooks/useJobs";
import SearchBar from "@/components/jobs/SearchBar";
import FilterPanel from "@/components/jobs/FilterPanel";
import JobCard from "@/components/jobs/JobCard";
import { Loader2 } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";

function JobsPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [filters, setFilters] = useState<JobFilters>({});

  useEffect(() => {
    const search = searchParams.get("search") || undefined;
    const location = searchParams.get("location") || undefined;
    const tagsParam = searchParams.get("tags");
    const tags = tagsParam ? tagsParam.split(",") : undefined;

    setFilters({
      search,
      location,
      tags,
    });
  }, [searchParams]);

  const updateUrl = (newFilters: JobFilters) => {
    const params = new URLSearchParams();
    if (newFilters.search) params.set("search", newFilters.search);
    if (newFilters.location) params.set("location", newFilters.location);
    if (newFilters.tags && newFilters.tags.length > 0)
      params.set("tags", newFilters.tags.join(","));

    router.push(`/jobs?${params.toString()}`, { scroll: false });
  };

  const { data: jobs, isLoading, error } = useJobs(filters);

  const handleSearch = (search: string, location: string) => {
    const newFilters = {
      ...filters,
      search: search || undefined,
      location: location || undefined,
    };
    setFilters(newFilters);
    updateUrl(newFilters);
  };

  const handleFilterChange = (newFilters: { tags: string[] }) => {
    const updatedFilters = {
      ...filters,
      tags: newFilters.tags.length > 0 ? newFilters.tags : undefined,
    };
    setFilters(updatedFilters);
    updateUrl(updatedFilters);
  };

  return (
    <div className="bg-background min-h-screen">
      {/* Header Section */}
      <section className="from-primary/5 mt-12 bg-linear-to-b to-transparent py-12 md:mt-16 md:py-16">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8 text-center"
          >
            <h1 className="text-foreground mb-4 text-3xl font-bold md:text-4xl lg:text-5xl">
              Find Your Dream Remote Job
            </h1>
            <p className="text-muted-foreground mx-auto max-w-2xl text-lg">
              Discover thousands of remote opportunities from companies around
              the world
            </p>
          </motion.div>

          <SearchBar onSearch={handleSearch} />
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
            {/* Filters Sidebar */}
            <aside className="lg:col-span-1">
              <FilterPanel
                onFilterChange={handleFilterChange}
                initialFilters={filters}
              />
            </aside>

            {/* Job Listings */}
            <div className="lg:col-span-3">
              {isLoading && (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="text-primary h-8 w-8 animate-spin" />
                </div>
              )}

              {error && (
                <div className="border-destructive/50 bg-destructive/10 rounded-lg border p-6 text-center">
                  <p className="text-destructive">
                    Failed to load jobs. Please try again later.
                  </p>
                </div>
              )}

              {!isLoading && !error && jobs && jobs.length === 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-card rounded-lg border p-12 text-center"
                >
                  <p className="text-muted-foreground text-lg">
                    No jobs found matching your criteria. Try adjusting your
                    filters.
                  </p>
                </motion.div>
              )}

              {!isLoading && !error && jobs && jobs.length > 0 && (
                <>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mb-6"
                  >
                    <p className="text-muted-foreground text-sm">
                      Showing {jobs.length} job{jobs.length !== 1 ? "s" : ""}
                    </p>
                  </motion.div>

                  <div className="grid gap-6">
                    {jobs.map((job, index) => (
                      <JobCard key={job.id} job={job} index={index} />
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default function JobsPage() {
  return (
    <Suspense>
      <JobsPageContent />
    </Suspense>
  );
}
