"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { Loader2, Upload, FileText, CheckCircle2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/utils/supabase/client";
import {
  buildResumeStoragePath,
  isAllowedResumeFile,
} from "@/utils/resume-utils";
import { getApplyContext, applyToJob } from "@/app/(public)/jobs/[id]/actions";

export function ApplyDialog({ jobId, jobTitle }: { jobId: string; jobTitle: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [ctx, setCtx] = useState<Awaited<ReturnType<typeof getApplyContext>> | null>(null);
  const [coverLetter, setCoverLetter] = useState("");
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      getApplyContext(jobId).then(setCtx);
    }
  }, [open, jobId]);

  const handleUpload = useCallback(async (file: File) => {
    if (!isAllowedResumeFile(file)) {
      toast.error("Resume must be a PDF/DOC/DOCX under 5MB");
      return null;
    }
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return null;
    setUploading(true);
    try {
      const storagePath = buildResumeStoragePath(user.id, file.name);
      const { error } = await supabase.storage
        .from("resumes")
        .upload(storagePath, file, { upsert: true });
      if (error) throw error;
      toast.success("Resume uploaded");
      return storagePath;
    } catch {
      toast.error("Resume upload failed");
      return null;
    } finally {
      setUploading(false);
    }
  }, []);

  const handleSubmit = useCallback(
    async (resumeStoragePath?: string) => {
      setSubmitting(true);
      try {
        const res = await applyToJob({
          jobId,
          resumeStoragePath,
          coverLetter: coverLetter.trim() || undefined,
        });
        if (res?.error) {
          if (res.error === "ALREADY_APPLIED") toast.error("You already applied to this job");
          else if (res.error === "RESUME_REQUIRED") toast.error("Please upload your resume first");
          else toast.error("Unable to apply. Please try again.");
          return;
        }
        toast.success("Application submitted");
        setOpen(false);
        router.refresh();
      } finally {
        setSubmitting(false);
      }
    },
    [jobId, coverLetter, router]
  );

  if (ctx && !ctx.authenticated) {
    return (
      <Button asChild className="w-full">
        <Link href={`/auth/login?redirect=/jobs/${jobId}`}>Sign in to apply</Link>
      </Button>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full">Apply Now</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Apply to {jobTitle}</DialogTitle>
          <DialogDescription>
            Your resume on file will be sent. You can replace it below.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {ctx?.alreadyApplied ? (
            <div className="flex items-center gap-2 text-sm text-green-600">
              <CheckCircle2 className="h-4 w-4" /> You have already applied to this job.
            </div>
          ) : (
            <>
              {/* Resume state */}
              {ctx?.resumeUrl ? (
                <div className="flex items-center justify-between rounded-lg border p-3">
                  <a
                    href={ctx.resumeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm font-medium"
                  >
                    <FileText className="h-4 w-4" /> View current resume
                  </a>
                  <label className="cursor-pointer text-xs font-medium text-primary">
                    Replace
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      className="hidden"
                      disabled={uploading}
                      onChange={async (e) => {
                        const f = e.target.files?.[0];
                        if (f) {
                          const path = await handleUpload(f);
                          if (path) await handleSubmit(path);
                        }
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
                    {uploading ? "Uploading..." : "Upload resume (PDF, DOC, DOCX, ≤ 5MB)"}
                  </span>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    className="hidden"
                    disabled={uploading}
                    onChange={async (e) => {
                      const f = e.target.files?.[0];
                      if (f) {
                        const path = await handleUpload(f);
                        if (path) await handleSubmit(path);
                      }
                      e.target.value = "";
                    }}
                  />
                </label>
              )}

              {/* Cover letter */}
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="coverLetter">
                  Cover letter (optional)
                </label>
                <Textarea
                  id="coverLetter"
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  placeholder="Introduce yourself..."
                  maxLength={5000}
                  rows={4}
                />
              </div>
            </>
          )}
        </div>

        {!ctx?.alreadyApplied && (
          <DialogFooter>
            <Button
              onClick={() => handleSubmit()}
              disabled={uploading || submitting}
            >
              {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Submit application
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}