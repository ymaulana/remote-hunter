"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";
import { prisma } from "@/utils/prisma";
import { applicationStatusSchema } from "@/utils/application-utils";

function isPrismaKnownError(err: unknown): err is { code: string } {
  return (
    typeof err === "object" &&
    err !== null &&
    "code" in err &&
    typeof (err as { code: unknown }).code === "string"
  );
}

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

export async function updateApplicationStatus(
  applicationId: string,
  status: string,
) {
  const { user } = await getUser();
  if (!user) return { error: "NOT_AUTHENTICATED" as const };

  const role = (user.user_metadata?.role as string | undefined)?.toUpperCase();
  if (!isRecruiterOrAdmin(role)) return { error: "FORBIDDEN" as const };

  const parsed = applicationStatusSchema.safeParse(status);
  if (!parsed.success) return { error: "INVALID_STATUS" as const };

  const app = await prisma.application.findUnique({
    where: { id: applicationId },
    select: { jobId: true, job: { select: { postedBy: true } } },
  });
  if (!app || app.job.postedBy !== user.id) {
    return { error: "NOT_FOUND" as const };
  }

  try {
    await prisma.application.update({
      where: { id: applicationId },
      data: { status: parsed.data },
    });
  } catch (err: unknown) {
    if (isPrismaKnownError(err) && err.code === "P2025") {
      return { error: "NOT_FOUND" as const };
    }
    throw err;
  }

  revalidatePath("/profile");
  revalidatePath("/post-job/[id]/applicants", "page");

  return { success: true as const, status: parsed.data };
}
