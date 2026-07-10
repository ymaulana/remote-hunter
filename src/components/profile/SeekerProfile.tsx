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
  ExternalLink,
  CheckCircle2,
  Clock,
  XCircle,
} from "lucide-react";

// ============================================================
// Mock data for SEEKER role (based on Prisma schema)
// ============================================================
const mockSeekerUser = {
  id: "usr_123456789",
  email: "john.doe@example.com",
  role: "SEEKER" as const,
  createdAt: new Date("2024-01-15T10:30:00Z"),
  profile: {
    id: "prof_123456789",
    firstName: "John",
    lastName: "Doe",
    resumeUrl: "https://example.com/resume/john-doe.pdf",
    bio: "Passionate software engineer with 3+ years of experience building scalable web applications. Love working with modern technologies and solving complex problems. Always eager to learn and grow in the tech industry.",
    skills: [
      "React",
      "TypeScript",
      "Node.js",
      "Python",
      "PostgreSQL",
      "AWS",
      "Docker",
      "GraphQL",
    ],
  },
};

const mockApplications = [
  {
    id: "app_001",
    jobId: "job_001",
    job: {
      id: "job_001",
      title: "Senior Frontend Engineer",
      company: "TechCorp Inc.",
      location: "Remote - US",
      salary: "$120,000 - $150,000",
      currency: "USD",
      description: "We are looking for a Senior Frontend Engineer...",
      source: "INTERNAL" as const,
      externalId: null,
      externalLink: null,
      applyOptions: null,
      postedBy: null,
      createdAt: new Date("2024-02-01T09:00:00Z"),
      postedAt: new Date("2024-02-01T09:00:00Z"),
      updatedAt: new Date("2024-02-01T09:00:00Z"),
      tags: ["Frontend", "React", "TypeScript"],
    },
    status: "REVIEWED" as const,
    appliedAt: new Date("2024-02-02T14:30:00Z"),
    coverLetter: "I am excited to apply for this position...",
  },
  {
    id: "app_002",
    jobId: "job_002",
    job: {
      id: "job_002",
      title: "Full Stack Developer",
      company: "StartupXYZ",
      location: "Remote - Worldwide",
      salary: "$90,000 - $120,000",
      currency: "USD",
      description: "Join our fast-growing startup...",
      source: "EXTERNAL" as const,
      externalId: "ext_123",
      externalLink: "https://example.com/jobs/123",
      applyOptions: null,
      postedBy: null,
      createdAt: new Date("2024-02-05T11:00:00Z"),
      postedAt: new Date("2024-02-05T11:00:00Z"),
      updatedAt: new Date("2024-02-05T11:00:00Z"),
      tags: ["Full Stack", "Node.js", "React"],
    },
    status: "PENDING" as const,
    appliedAt: new Date("2024-02-06T10:15:00Z"),
    coverLetter: null,
  },
  {
    id: "app_003",
    jobId: "job_003",
    job: {
      id: "job_003",
      title: "Backend Engineer",
      company: "CloudScale Systems",
      location: "Remote - Europe",
      salary: "€80,000 - €100,000",
      currency: "EUR",
      description: "Build scalable backend services...",
      source: "INTERNAL" as const,
      externalId: null,
      externalLink: null,
      applyOptions: null,
      postedBy: null,
      createdAt: new Date("2024-01-20T08:00:00Z"),
      postedAt: new Date("2024-01-20T08:00:00Z"),
      updatedAt: new Date("2024-01-20T08:00:00Z"),
      tags: ["Backend", "Python", "PostgreSQL"],
    },
    status: "ACCEPTED" as const,
    appliedAt: new Date("2024-01-21T16:45:00Z"),
    coverLetter: "I believe my skills align perfectly...",
  },
  {
    id: "app_004",
    jobId: "job_004",
    job: {
      id: "job_004",
      title: "DevOps Engineer",
      company: "InfraCo",
      location: "Remote - Americas",
      salary: "$110,000 - $140,000",
      currency: "USD",
      description: "Manage cloud infrastructure...",
      source: "INTERNAL" as const,
      externalId: null,
      externalLink: null,
      applyOptions: null,
      postedBy: null,
      createdAt: new Date("2024-01-10T07:30:00Z"),
      postedAt: new Date("2024-01-10T07:30:00Z"),
      updatedAt: new Date("2024-01-10T07:30:00Z"),
      tags: ["DevOps", "AWS", "Docker"],
    },
    status: "REJECTED" as const,
    appliedAt: new Date("2024-01-11T09:00:00Z"),
    coverLetter: null,
  },
];

// ============================================================
// Helper functions
// ============================================================
const getStatusIcon = (status: string) => {
  switch (status) {
    case "PENDING":
      return <Clock className="h-4 w-4 text-amber-500" />;
    case "REVIEWED":
      return <CheckCircle2 className="h-4 w-4 text-blue-500" />;
    case "ACCEPTED":
      return <CheckCircle2 className="h-4 w-4 text-green-500" />;
    case "REJECTED":
      return <XCircle className="h-4 w-4 text-red-500" />;
    default:
      return null;
  }
};

const getStatusBadgeClass = (status: string) => {
  switch (status) {
    case "PENDING":
      return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400";
    case "REVIEWED":
      return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
    case "ACCEPTED":
      return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
    case "REJECTED":
      return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
    default:
      return "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400";
  }
};

// ============================================================
// Seeker Profile Component
// ============================================================
export function SeekerProfile() {
  const user = mockSeekerUser;

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
              <div className="ring-background absolute -right-1 -bottom-1 rounded-full bg-green-500 p-2 ring-4" />
            </div>

            {/* Name & Title */}
            <div className="flex-1 pb-2">
              <h1 className="text-foreground text-3xl font-bold">
                {user.profile.firstName} {user.profile.lastName}
              </h1>
              <p className="text-muted-foreground">{user.email}</p>
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
          {/* Left Column - Bio & Skills */}
          <div className="space-y-6 lg:col-span-1">
            {/* Bio Card */}
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

            {/* Skills Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Skills</CardTitle>
                <CardDescription>
                  {user.profile.skills.length} technical skills
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {user.profile.skills.map((skill) => (
                    <span
                      key={skill}
                      className="bg-secondary text-secondary-foreground hover:bg-secondary/80 inline-flex items-center rounded-full px-3 py-1 text-xs font-medium transition-colors"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Resume Card */}
            {user.profile.resumeUrl && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Resume</CardTitle>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full" asChild>
                    <a
                      href={user.profile.resumeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FileText className="mr-2 h-4 w-4" />
                      View Resume
                      <ExternalLink className="ml-2 h-3 w-3" />
                    </a>
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column - Applications */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">Job Applications</CardTitle>
                    <CardDescription>
                      Track your applications and their status
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="bg-primary/10 text-primary rounded-full px-3 py-1 text-sm font-medium">
                      {mockApplications.length} Total
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockApplications.map((application) => (
                    <div
                      key={application.id}
                      className="group bg-card flex flex-col gap-4 rounded-xl border p-4 transition-all hover:shadow-md md:flex-row md:items-center md:justify-between"
                    >
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                          <h3 className="text-foreground font-semibold">
                            {application.job.title}
                          </h3>
                          <span
                            className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${getStatusBadgeClass(application.status)}`}
                          >
                            {getStatusIcon(application.status)}
                            {application.status}
                          </span>
                        </div>
                        <div className="text-muted-foreground flex flex-wrap items-center gap-4 text-sm">
                          <span className="flex items-center gap-1.5">
                            <Briefcase className="h-3.5 w-3.5" />
                            {application.job.company}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <MapPin className="h-3.5 w-3.5" />
                            {application.job.location}
                          </span>
                          {application.job.salary && (
                            <span>{application.job.salary}</span>
                          )}
                        </div>
                        <div className="flex flex-wrap items-center gap-2 pt-1">
                          {application.job.tags.map((tag) => (
                            <span
                              key={tag}
                              className="bg-secondary/50 text-secondary-foreground rounded-md px-2 py-0.5 text-xs"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                        <div className="text-muted-foreground flex items-center gap-4 pt-2 text-xs">
                          <span>
                            Applied: <ClientDate date={application.appliedAt} />
                          </span>
                          {application.job.externalLink && (
                            <a
                              href={application.job.externalLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary flex items-center gap-1 hover:underline"
                            >
                              View Job
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2 md:flex-col md:items-end">
                        <Button variant="outline" size="sm">
                          View Details
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
