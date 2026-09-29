"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";
import { prisma } from "@/utils/prisma";
import { jobPayloadSchema, type JobPayload } from "@/utils/job-utils";

async function getUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return { supabase, user };
}

function isRecruiterOrAdmin(role: string | undefined): boolean {
  const r = (role ?? "").toUpperCase();
  return r === "RECRUITER" || r === "ADMIN";
}

function normalizePayload(data: JobPayload): JobPayload & { salary: string | undefined } {
  const salary = data.salary?.trim() ? data.salary.trim() : undefined;
  const tags = data.tags ?? [];
  return { ...data, salary, tags };
}

export async function createJob(payload: JobPayload) {
  const { user } = await getUser();
  if (!user) return { error: "NOT_AUTHENTICATED" as const };

  const role = (user.user_metadata?.role as string | undefined)?.toUpperCase();
  if (!isRecruiterOrAdmin(role)) return { error: "FORBIDDEN" as const };

  const parsed = jobPayloadSchema.safeParse(payload);
  if (!parsed.success) return { error: "INVALID_PAYLOAD" as const };

  const data = normalizePayload(parsed.data);

  const job = await prisma.job.create({
    data: {
      title: data.title,
      company: data.company,
      location: data.location,
      salary: data.salary ?? null,
      currency: data.currency,
      description: data.description,
      tags: data.tags ?? [],
      source: "INTERNAL",
      postedBy: user.id,
      postedAt: new Date(),
    },
    select: { id: true },
  });

  revalidatePath("/profile");
  revalidatePath("/jobs");

  return { success: true as const, jobId: job.id };
}

export async function updateJob(jobId: string, payload: JobPayload) {
  const { user } = await getUser();
  if (!user) return { error: "NOT_AUTHENTICATED" as const };

  const role = (user.user_metadata?.role as string | undefined)?.toUpperCase();
  if (!isRecruiterOrAdmin(role)) return { error: "FORBIDDEN" as const };

  const parsed = jobPayloadSchema.safeParse(payload);
  if (!parsed.success) return { error: "INVALID_PAYLOAD" as const };

  const data = normalizePayload(parsed.data);

  try {
    await prisma.job.update({
      where: { id: jobId, postedBy: user.id },
      data: {
        title: data.title,
        company: data.company,
        location: data.location,
        salary: data.salary ?? null,
        currency: data.currency,
        description: data.description,
        tags: data.tags ?? [],
      },
    });
  } catch (err: unknown) {
    if (
      err &&
      typeof err === "object" &&
      "code" in err &&
      (err as { code: string }).code === "P2025"
    ) {
      return { error: "NOT_FOUND" as const };
    }
    throw err;
  }

  revalidatePath("/profile");
  revalidatePath("/jobs");
  revalidatePath("/jobs/[slug]", "page");

  return { success: true as const };
}

export async function deleteJob(jobId: string) {
  const { user } = await getUser();
  if (!user) return { error: "NOT_AUTHENTICATED" as const };

  const role = (user.user_metadata?.role as string | undefined)?.toUpperCase();
  if (!isRecruiterOrAdmin(role)) return { error: "FORBIDDEN" as const };

  const job = await prisma.job.findUnique({
    where: { id: jobId },
    select: { id: true, postedBy: true },
  });

  if (!job || job.postedBy !== user.id) {
    return { error: "NOT_FOUND" as const };
  }

  await prisma.$transaction([
    prisma.application.deleteMany({ where: { jobId } }),
    prisma.job.delete({ where: { id: jobId } }),
  ]);

  revalidatePath("/profile");
  revalidatePath("/jobs");

  return { success: true as const };
}
