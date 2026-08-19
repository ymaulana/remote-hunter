"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/utils/prisma";
import { createClient } from "@/utils/supabase/server";
import { applyPayloadSchema } from "@/utils/apply-utils";
import { isValidResumeStoragePath } from "@/utils/resume-utils";

export async function getApplyContext(jobId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { authenticated: false };

  const job = await prisma.job.findUnique({ where: { id: jobId } });
  if (!job || job.source === "EXTERNAL") {
    return { authenticated: true, external: true };
  }

  const [profile, existing] = await Promise.all([
    prisma.profile.findUnique({ where: { userId: user.id } }),
    prisma.application.findUnique({
      where: { jobId_userId: { jobId, userId: user.id } },
    }),
  ]);

  let resumeUrl: string | null = null;
  if (profile?.resumeStoragePath) {
    const { data } = await supabase.storage
      .from("resumes")
      .createSignedUrl(profile.resumeStoragePath, 3600);
    resumeUrl = data?.signedUrl ?? null;
  }

  return {
    authenticated: true,
    hasResume: !!profile?.resumeStoragePath,
    resumeUrl,
    alreadyApplied: !!existing,
  };
}

export async function applyToJob(payload: {
  jobId: string;
  resumeStoragePath?: string;
  coverLetter?: string;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "NOT_AUTHENTICATED" };

  const parsed = applyPayloadSchema.safeParse(payload);
  if (!parsed.success) return { error: "INVALID_PAYLOAD" };

  const { jobId, resumeStoragePath, coverLetter } = parsed.data;

  const job = await prisma.job.findUnique({ where: { id: jobId } });
  if (!job) return { error: "JOB_NOT_FOUND" };
  if (job.source === "EXTERNAL") return { error: "EXTERNAL_JOB" };

  const profile = await prisma.profile.findUnique({ where: { userId: user.id } });

  let finalPath = profile?.resumeStoragePath ?? null;
  if (resumeStoragePath) {
    if (
      !isValidResumeStoragePath(resumeStoragePath) ||
      !resumeStoragePath.startsWith(`${user.id}/`)
    ) {
      return { error: "INVALID_RESUME_PATH" };
    }
    finalPath = resumeStoragePath;
  }
  if (!finalPath) return { error: "RESUME_REQUIRED" };

  const { data: files } = await supabase.storage
    .from("resumes")
    .list(user.id, { limit: 100 });
  const exists = files?.some((f) => `${user.id}/${f.name}` === finalPath);
  if (!exists) return { error: "RESUME_REQUIRED" };

  try {
    await prisma.application.create({
      data: {
        jobId,
        userId: user.id,
        status: "PENDING",
        coverLetter: coverLetter || null,
      },
    });
  } catch (err: any) {
    if (err?.code === "P2002") return { error: "ALREADY_APPLIED" };
    throw err;
  }

  revalidatePath("/profile");
  return { success: true };
}