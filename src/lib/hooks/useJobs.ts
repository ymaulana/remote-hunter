import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase/client";

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  salaryMin: number | null;
  salaryMax: number | null;
  currency: string;
  description: string;
  source: "INTERNAL" | "EXTERNAL";
  externalId: string | null;
  externalLink: string | null;
  applyOptions: any;
  postedBy: string | null;
  createdAt: string;
  postedAt: string;
  updatedAt: string;
  tags: string[];
}

export interface JobFilters {
  search?: string;
  location?: string;
  tags?: string[];
  salaryMin?: number;
  salaryMax?: number;
}

export function useJobs(filters?: JobFilters) {
  return useQuery({
    queryKey: ["jobs", filters],
    queryFn: async () => {
      let query = supabase
        .from("Job")
        .select("*")
        .order("postedAt", { ascending: false });

      if (filters?.search) {
        query = query.or(
          `title.ilike.%${filters.search}%,company.ilike.%${filters.search}%,description.ilike.%${filters.search}%`,
        );
      }

      if (filters?.location) {
        query = query.ilike("location", `%${filters.location}%`);
      }

      if (filters?.tags && filters.tags.length > 0) {
        query = query.contains("tags", filters.tags);
      }

      if (filters?.salaryMin) {
        query = query.gte("salaryMin", filters.salaryMin);
      }

      if (filters?.salaryMax) {
        query = query.lte("salaryMax", filters.salaryMax);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as Job[];
    },
  });
}

export function useJob(id: string) {
  return useQuery({
    queryKey: ["job", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("Job")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      return data as Job;
    },
    enabled: !!id,
  });
}
