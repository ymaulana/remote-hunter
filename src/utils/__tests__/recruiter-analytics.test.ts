import { describe, it, expect } from "vitest";
import { computeRecruiterAnalytics } from "../recruiter-analytics";

const NOW = new Date("2026-08-27T12:00:00Z");

const jobs = [
  { id: "job-1", title: "Frontend Engineer" },
  { id: "job-2", title: "Backend Engineer" },
];

const app = (jobId: string, status: string, daysAgo = 0) => ({
  jobId,
  status: status as "PENDING" | "REVIEWED" | "REJECTED" | "ACCEPTED",
  appliedAt: new Date(NOW.getTime() - daysAgo * 86400000),
});

describe("computeRecruiterAnalytics", () => {
  it("returns zeros for empty input", () => {
    const a = computeRecruiterAnalytics([], [], NOW);
    expect(a.totalJobs).toBe(0);
    expect(a.totalApplications).toBe(0);
    expect(a.last14Days).toHaveLength(14);
    expect(a.last14Days.every((d) => d.count === 0)).toBe(true);
  });

  it("counts the status funnel", () => {
    const a = computeRecruiterAnalytics(jobs, [
      app("job-1", "PENDING"),
      app("job-1", "PENDING"),
      app("job-1", "REVIEWED"),
      app("job-2", "ACCEPTED"),
      app("job-2", "REJECTED"),
    ], NOW);
    expect(a.totalApplications).toBe(5);
    expect(a.pendingReview).toBe(2);
    expect(a.reviewed).toBe(1);
    expect(a.accepted).toBe(1);
    expect(a.rejected).toBe(1);
  });

  it("buckets applications into the 14-day window (oldest first)", () => {
    const a = computeRecruiterAnalytics(jobs, [
      app("job-1", "PENDING", 0),
      app("job-1", "PENDING", 0),
      app("job-2", "REVIEWED", 13),
      app("job-2", "REVIEWED", 20), // outside window → ignored
    ], NOW);
    expect(a.last14Days[13].count).toBe(2);
    expect(a.last14Days[0].count).toBe(1);
  });

  it("ranks top jobs by applicant count", () => {
    const a = computeRecruiterAnalytics(jobs, [
      app("job-2", "PENDING"),
      app("job-2", "PENDING"),
      app("job-2", "PENDING"),
      app("job-1", "PENDING"),
    ], NOW);
    expect(a.topJobs[0]).toEqual({ jobId: "job-2", title: "Backend Engineer", applicantCount: 3 });
    expect(a.topJobs[1].applicantCount).toBe(1);
  });

  it("includes jobs with zero applicants in topJobs", () => {
    const a = computeRecruiterAnalytics(jobs, [app("job-1", "PENDING")], NOW);
    expect(a.topJobs).toHaveLength(2);
    expect(a.topJobs[1].applicantCount).toBe(0);
  });
});
