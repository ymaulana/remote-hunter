"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
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
  Upload,
  Loader2,
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
import { supabase } from "@/utils/supabase/client";
import { saveResume } from "@/app/(protected)/profile/actions";
import {
  buildResumeStoragePath,
  isAllowedResumeFile,
} from "@/utils/resume-utils";

export interface SeekerApplication {
  id: string;
  status: "PENDING" | "REVIEWED" | "REJECTED" | "ACCEPTED";
  appliedAt: Date;
  coverLetter: string | null;
  job: {
    id: string;
    title: string;
    company: string;
    location: string;
    salary: string | null;
    tags: string[];
    externalLink: string | null;
  };
}

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

export function SeekerProfile({
  email,
  profile,
  resumeUrl,
  applications,
}: {
  email: string;
  profile: {
    firstName: string;
    lastName: string;
    bio: string | null;
    skills: string[];
    resumeStoragePath: string | null;
  } | null;
  resumeUrl: string | null;
  applications: SeekerApplication[];
}) {
  const router = useRouter();
  const [uploading, setUploading] = useState(false);

  const handleUpload = useCallback(
    async (file: File) => {
      if (!isAllowedResumeFile(file)) {
        toast.error("Resume must be a PDF/DOC/DOCX under 5MB");
        return;
      }
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;
      setUploading(true);
      try {
        const storagePath = buildResumeStoragePath(user.id, file.name);
        const { error: uploadError } = await supabase.storage
          .from("resumes")
          .upload(storagePath, file, { upsert: true });
        if (uploadError) throw uploadError;

        const result = await saveResume(storagePath);
        if (result?.error) throw new Error(result.error);

        toast.success("Resume uploaded");
        router.refresh();
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Upload failed");
      } finally {
        setUploading(false);
      }
    },
    [router]
  );

  const firstName = profile?.firstName ?? "";
  const lastName = profile?.lastName ?? "";
  const initials = (firstName[0] ?? "") + (lastName[0] ?? "");

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
                {initials || "U"}
              </div>
              <div className="ring-background absolute -right-1 -bottom-1 rounded-full bg-green-500 p-2 ring-4" />
            </div>

            {/* Name & Title */}
            <div className="flex-1 pb-2">
              <h1 className="text-foreground text-3xl font-bold">
                {firstName} {lastName}
              </h1>
              <p className="text-muted-foreground">{email}</p>
              <div className="text-muted-foreground mt-2 flex flex-wrap items-center gap-4 text-sm">
                <span className="flex items-center gap-1.5">
                  <Award className="h-4 w-4" />
                  SEEKER
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
                  {profile?.bio || "No bio added yet."}
                </p>
              </CardContent>
            </Card>

            {/* Skills Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Skills</CardTitle>
                <CardDescription>
                  {profile?.skills.length ?? 0} technical skills
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {(profile?.skills ?? []).map((skill) => (
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
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Resume</CardTitle>
              </CardHeader>
              <CardContent>
                {resumeUrl ? (
                  <div className="flex flex-col gap-2">
                    <Button variant="outline" className="w-full" asChild>
                      <a
                        href={resumeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <FileText className="mr-2 h-4 w-4" />
                        View Resume
                        <ExternalLink className="ml-2 h-3 w-3" />
                      </a>
                    </Button>
                    <label className="cursor-pointer text-center text-xs font-medium text-primary">
                      Replace resume
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        className="hidden"
                        disabled={uploading}
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleUpload(file);
                          e.target.value = "";
                        }}
                      />
                    </label>
                  </div>
                ) : (
                  <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed p-6 text-center">
                    {uploading ? (
                      <Loader2 className="h-6 w-6 animate-spin" />
                    ) : (
                      <Upload className="h-6 w-6 text-muted-foreground" />
                    )}
                    <span className="text-sm font-medium">
                      {uploading
                        ? "Uploading..."
                        : "Upload resume (PDF, DOC, DOCX, ≤ 5MB)"}
                    </span>
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      className="hidden"
                      disabled={uploading}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleUpload(file);
                        e.target.value = "";
                      }}
                    />
                  </label>
                )}
              </CardContent>
            </Card>
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
                      {applications.length} Total
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {applications.length === 0 ? (
                  <p className="text-muted-foreground py-6 text-center text-sm">
                    You haven&apos;t applied to any jobs yet.
                  </p>
                ) : (
                  <div className="space-y-4">
                    {applications.map((application) => (
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