export type ApplicationStatusValue =
  | "PENDING"
  | "REVIEWED"
  | "REJECTED"
  | "ACCEPTED";

export interface RecruiterJobRef {
  id: string;
  title: string;
}

export interface RecruiterApplicationRef {
  jobId: string;
  status: ApplicationStatusValue;
  appliedAt: Date | string;
}

export interface RecruiterAnalytics {
  totalJobs: number;
  totalApplications: number;
  pendingReview: number;
  reviewed: number;
  accepted: number;
  rejected: number;
  /** 14 UTC-day buckets, oldest first, key = YYYY-MM-DD */
  last14Days: { date: string; count: number }[];
  topJobs: { jobId: string; title: string; applicantCount: number }[];
}

export function computeRecruiterAnalytics(
  jobs: RecruiterJobRef[],
  applications: RecruiterApplicationRef[],
  now: Date = new Date(),
): RecruiterAnalytics {
  const statusCounts: Record<ApplicationStatusValue, number> = {
    PENDING: 0,
    REVIEWED: 0,
    REJECTED: 0,
    ACCEPTED: 0,
  };
  const countsByDay = new Map<string, number>();
  const applicantCounts = new Map<string, number>();

  for (const application of applications) {
    statusCounts[application.status] += 1;

    const dayKey = new Date(application.appliedAt).toISOString().slice(0, 10);
    countsByDay.set(dayKey, (countsByDay.get(dayKey) ?? 0) + 1);

    applicantCounts.set(
      application.jobId,
      (applicantCounts.get(application.jobId) ?? 0) + 1,
    );
  }

  const last14Days: { date: string; count: number }[] = [];
  for (let i = 13; i >= 0; i--) {
    const day = new Date(now);
    day.setUTCDate(day.getUTCDate() - i);
    const key = day.toISOString().slice(0, 10);
    last14Days.push({ date: key, count: countsByDay.get(key) ?? 0 });
  }

  const topJobs = jobs
    .map((job) => ({
      jobId: job.id,
      title: job.title,
      applicantCount: applicantCounts.get(job.id) ?? 0,
    }))
    .sort((a, b) => b.applicantCount - a.applicantCount)
    .slice(0, 5);

  return {
    totalJobs: jobs.length,
    totalApplications: applications.length,
    pendingReview: statusCounts.PENDING,
    reviewed: statusCounts.REVIEWED,
    accepted: statusCounts.ACCEPTED,
    rejected: statusCounts.REJECTED,
    last14Days,
    topJobs,
  };
}
