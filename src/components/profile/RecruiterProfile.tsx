"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ClientDate from "@/components/ui/ClientDate";
import {
  Mail,
  MapPin,
  Calendar,
  Briefcase,
  FileText,
  Award,
  Building,
  Globe,
  Users,
} from "lucide-react";

// ============================================================
// Mock data for RECRUITER role
// ============================================================
const mockRecruiterUser = {
  id: "usr_987654321",
  email: "sarah.recruiter@techcorp.com",
  role: "RECRUITER" as const,
  createdAt: new Date("2024-01-05T08:00:00Z"),
  profile: {
    id: "prof_987654321",
    firstName: "Sarah",
    lastName: "Chen",
    bio: "Talent Acquisition Lead at TechCorp Inc. Helping build world-class engineering teams. Passionate about connecting the right people with the right opportunities.",
    companyName: "TechCorp Inc.",
    companyWebsite: "https://techcorp.example.com",
    jobTitle: "Senior Technical Recruiter",
  },
};

const mockPostedJobs = [
  {
    id: "job_r001",
    title: "Senior Frontend Engineer",
    location: "Remote - US",
    salary: "$120,000 - $150,000",
    createdAt: new Date("2024-02-01T09:00:00Z"),
    applicantCount: 24,
    status: "Active",
    tags: ["Frontend", "React", "TypeScript"],
  },
  {
    id: "job_r002",
    title: "Backend Engineer (Python)",
    location: "Remote - Europe",
    salary: "€80,000 - €100,000",
    createdAt: new Date("2024-01-28T10:00:00Z"),
    applicantCount: 18,
    status: "Active",
    tags: ["Backend", "Python", "PostgreSQL"],
  },
  {
    id: "job_r003",
    title: "DevOps Engineer",
    location: "Remote - Americas",
    salary: "$110,000 - $140,000",
    createdAt: new Date("2024-01-15T07:00:00Z"),
    applicantCount: 12,
    status: "Closed",
    tags: ["DevOps", "AWS", "Kubernetes"],
  },
];

// ============================================================
// Helper functions
// ============================================================
const getJobStatusBadgeClass = (status: string) => {
  switch (status) {
    case "Active":
      return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
    case "Closed":
      return "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400";
    default:
      return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
  }
};

// ============================================================
// Recruiter Profile Component
// ============================================================
export function RecruiterProfile() {
  const user = mockRecruiterUser;

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
                {user.profile.firstName[0]}
                {user.profile.lastName[0]}
              </div>
              <div className="ring-background absolute -right-1 -bottom-1 rounded-full bg-blue-500 p-2 ring-4" />
            </div>

            {/* Name & Title */}
            <div className="flex-1 pb-2">
              <h1 className="text-foreground text-3xl font-bold">
                {user.profile.firstName} {user.profile.lastName}
              </h1>
              <p className="text-muted-foreground">
                {user.profile.jobTitle} at {user.profile.companyName}
              </p>
              <div className="text-muted-foreground mt-2 flex flex-wrap items-center gap-4 text-sm">
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4" />
                  Member since <ClientDate date={user.createdAt} />
                </span>
                <span className="flex items-center gap-1.5">
                  <Award className="h-4 w-4" />
                  {user.role}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pb-2">
              <Button variant="outline" size="default">
                <Mail className="mr-2 h-4 w-4" />
                Contact
              </Button>
              <Button size="default">
                <FileText className="mr-2 h-4 w-4" />
                Edit Profile
              </Button>
            </div>
          </div>
        </div>

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
                <p className="text-muted-foreground text-sm">
                  {user.profile.bio}
                </p>
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
                    <p className="text-sm font-medium">
                      {user.profile.companyName}
                    </p>
                    <p className="text-muted-foreground text-xs">
                      Company Name
                    </p>
                  </div>
                </div>
                {user.profile.companyWebsite && (
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 rounded-lg p-2">
                      <Globe className="text-primary h-5 w-5" />
                    </div>
                    <div>
                      <a
                        href={user.profile.companyWebsite}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary text-sm font-medium hover:underline"
                      >
                        {user.profile.companyWebsite.replace(
                          /^https?:\/\//,
                          "",
                        )}
                      </a>
                      <p className="text-muted-foreground text-xs">Website</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Hiring Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-secondary/50 rounded-lg p-3 text-center">
                    <p className="text-primary text-2xl font-bold">
                      {mockPostedJobs.length}
                    </p>
                    <p className="text-muted-foreground text-xs">Jobs Posted</p>
                  </div>
                  <div className="bg-secondary/50 rounded-lg p-3 text-center">
                    <p className="text-primary text-2xl font-bold">
                      {mockPostedJobs.reduce(
                        (acc, job) => acc + job.applicantCount,
                        0,
                      )}
                    </p>
                    <p className="text-muted-foreground text-xs">
                      Total Applicants
                    </p>
                  </div>
                </div>
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
                    <CardDescription>
                      Manage your job postings and review applicants
                    </CardDescription>
                  </div>
                  <Button size="sm">
                    <Briefcase className="mr-2 h-4 w-4" />
                    Post New Job
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockPostedJobs.map((job) => (
                    <div
                      key={job.id}
                      className="group bg-card flex flex-col gap-4 rounded-xl border p-4 transition-all hover:shadow-md md:flex-row md:items-center md:justify-between"
                    >
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                          <h3 className="text-foreground font-semibold">
                            {job.title}
                          </h3>
                          <span
                            className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${getJobStatusBadgeClass(job.status)}`}
                          >
                            {job.status}
                          </span>
                        </div>
                        <div className="text-muted-foreground flex flex-wrap items-center gap-4 text-sm">
                          <span className="flex items-center gap-1.5">
                            <MapPin className="h-3.5 w-3.5" />
                            {job.location}
                          </span>
                          {job.salary && <span>{job.salary}</span>}
                          <span className="flex items-center gap-1.5">
                            <Users className="h-3.5 w-3.5" />
                            {job.applicantCount} applicants
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
                      <div className="flex gap-2 md:flex-col md:items-end">
                        <Button variant="outline" size="sm">
                          View Applicants
                        </Button>
                        <Button variant="ghost" size="sm">
                          Edit
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
