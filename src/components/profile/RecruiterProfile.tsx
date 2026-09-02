"use client";

import Link from "next/link";
import {
  Briefcase,
  Building,
  CheckCircle2,
  Clock,
  Globe,
  Mail,
  MapPin,
  Users,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ClientDate from "@/components/ui/ClientDate";
import type { RecruiterAnalytics } from "@/utils/recruiter-analytics";

export interface RecruiterPostedJob {
  id: string;
  title: string;
  location: string;
  salary: string | null;
  currency: string;
  tags: string[];
  createdAt: Date | string;
  _count: { applications: number };
}

export function RecruiterProfile({
  email,
  profile,
  postedJobs,
  analytics,
}: {
  email: string;
  profile: {
    firstName: string;
    lastName: string;
    bio: string | null;
    companyName: string | null;
    companyWebsite: string | null;
  } | null;
  postedJobs: RecruiterPostedJob[];
  analytics: RecruiterAnalytics;
}) {
  const firstName = profile?.firstName ?? "";
  const lastName = profile?.lastName ?? "";
  const initials = (firstName[0] ?? "") + (lastName[0] ?? "");
  const companyName = profile?.companyName ?? null;
  const companyWebsite = profile?.companyWebsite ?? null;
  const bio = profile?.bio ?? null;

  const maxDaily = Math.max(...analytics.last14Days.map((d) => d.count), 1);
  const pct = (count: number, total: number) =>
    total === 0 ? 0 : Math.round((count / total) * 100);

  return (
    <div className="from-background to-secondary/20 min-h-screen bg-linear-to-b">
      {/* Header Section */}
      <div className="from-primary/20 via-primary/10 relative h-48 w-full bg-linear-to-r to-transparent">
        <div className="absolute inset-0 opacity-20" />
      </div>

      <div className="relative mx-auto max-w-5xl px-6">
        {/* Profile Header */}
        <div className="-mt-24 mb-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-end">
            {/* Avatar */}
            <div className="relative">
              <div className="from-primary to-primary/70 text-primary-foreground ring-background flex h-32 w-32 items-center justify-center rounded-2xl bg-linear-to-br text-4xl font-bold shadow-lg ring-4">
                {initials || "R"}
              </div>
              <div className="ring-background absolute -right-1 -bottom-1 rounded-full bg-blue-500 p-2 ring-4" />
            </div>

            {/* Name & Title */}
            <div className="flex-1 pb-2">
              <h1 className="text-foreground text-3xl font-bold">
                {firstName || lastName ? `${firstName} ${lastName}`.trim() : "there"}
              </h1>
              <p className="text-muted-foreground">
                {companyName ? `Recruiter at ${companyName}` : email}
              </p>
              {profile === null && (
                <p className="text-muted-foreground mt-2 text-sm">
                  Complete your company profile —{" "}
                  <Link href="/onboarding/complete-profile" className="text-primary hover:underline">
                    add your company name and website
                  </Link>
                </p>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-3 pb-2">
              <Button variant="outline" size="default">
                <Mail className="mr-2 h-4 w-4" />
                Contact
              </Button>
              <Button size="default" asChild>
                <Link href="/onboarding/complete-profile">Edit Profile</Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Analytics — Tier 1 */}
        <section className="mb-8">
          {/* 4 stat cards: 1 col mobile / 2 col sm / 4 col lg */}
          <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard icon={Briefcase} label="Active Postings" value={analytics.totalJobs} />
            <StatCard icon={Users} label="Total Applicants" value={analytics.totalApplications} />
            <StatCard icon={Clock} label="Pending Review" value={analytics.pendingReview} highlight />
            <StatCard icon={CheckCircle2} label="Accepted" value={analytics.accepted} />
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Pipeline Overview</CardTitle>
              <CardDescription>Applications — last 14 days & status funnel</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* 14-day bar strip: height proportional to max; native tooltip = date + count */}
              <div className="flex h-24 items-end gap-1">
                {analytics.last14Days.map((day) => (
                  <div
                    key={day.date}
                    title={`${day.date}: ${day.count} application(s)`}
                    style={{ height: `${(day.count / maxDaily) * 100}%` }}
                    className="bg-primary/70 min-h-1 flex-1 rounded-t"
                  />
                ))}
              </div>

              {/* Status funnel: horizontal proportional bars */}
              {(
                [
                  ["Pending", analytics.pendingReview, "bg-amber-500"],
                  ["Reviewed", analytics.reviewed, "bg-blue-500"],
                  ["Accepted", analytics.accepted, "bg-green-500"],
                  ["Rejected", analytics.rejected, "bg-red-500"],
                ] as const
              ).map(([label, count, color]) => (
                <div key={label} className="flex items-center gap-3">
                  <span className="text-muted-foreground w-20 text-sm">{label}</span>
                  <div className="bg-secondary h-2 flex-1 overflow-hidden rounded-full">
                    <div
                      className={`${color} h-full rounded-full`}
                      style={{ width: `${pct(count, analytics.totalApplications)}%` }}
                    />
                  </div>
                  <span className="w-8 text-right text-sm font-medium">{count}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </section>

        {/* Main Content Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left Column - About & Company Info */}
          <div className="space-y-6 lg:col-span-1">
            {/* About Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">About</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">{bio ?? "No bio added yet."}</p>
              </CardContent>
            </Card>

            {/* Company Info Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Company</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 rounded-lg p-2">
                    <Building className="text-primary h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{companyName ?? "No company set"}</p>
                    <p className="text-muted-foreground text-xs">Company Name</p>
                  </div>
                </div>
                {companyWebsite && (
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 rounded-lg p-2">
                      <Globe className="text-primary h-5 w-5" />
                    </div>
                    <div>
                      <a
                        href={companyWebsite}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary text-sm font-medium hover:underline"
                      >
                        {companyWebsite.replace(/^https?:\/\//, "")}
                      </a>
                      <p className="text-muted-foreground text-xs">Website</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Posted Jobs */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">Posted Jobs</CardTitle>
                    <CardDescription>Manage your job postings and review applicants</CardDescription>
                  </div>
                  <Button size="sm" asChild>
                    <Link href="/jobs/post">
                      <Briefcase className="mr-2 h-4 w-4" />
                      Post New Job
                    </Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {postedJobs.length === 0 ? (
                  <div className="py-8 text-center">
                    <p className="text-muted-foreground mb-4 text-sm">
                      You haven&apos;t posted any jobs yet
                    </p>
                    <Button asChild>
                      <Link href="/jobs/post">Post New Job</Link>
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {postedJobs.map((job) => (
                      <div
                        key={job.id}
                        className="group bg-card flex flex-col gap-4 rounded-xl border p-4 transition-all hover:shadow-md md:flex-row md:items-center md:justify-between"
                      >
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-2">
                            <h3 className="text-foreground font-semibold">{job.title}</h3>
                            <span className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium">
                              Active
                            </span>
                          </div>
                          <div className="text-muted-foreground flex flex-wrap items-center gap-4 text-sm">
                            <span className="flex items-center gap-1.5">
                              <MapPin className="h-3.5 w-3.5" />
                              {job.location}
                            </span>
                            {job.salary && (
                              <span>
                                {job.salary} {job.currency}
                              </span>
                            )}
                            <span className="flex items-center gap-1.5">
                              <Users className="h-3.5 w-3.5" />
                              {job._count.applications} applicants
                            </span>
                          </div>
                          <div className="flex flex-wrap items-center gap-2 pt-1">
                            {job.tags.map((tag) => (
                              <span
                                key={tag}
                                className="bg-secondary/50 text-secondary-foreground rounded-md px-2 py-0.5 text-xs"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                          <div className="text-muted-foreground pt-2 text-xs">
                            <span>
                              Posted: <ClientDate date={job.createdAt} />
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  highlight,
}: {
  icon: React.ElementType;
  label: string;
  value: number;
  highlight?: boolean;
}) {
  return (
    <Card className={highlight ? "ring-primary/20 ring-1" : undefined}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardDescription className="text-xs font-medium">{label}</CardDescription>
        <Icon className="text-muted-foreground h-4 w-4" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );
}
