"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/utils/prisma";
import { createClient } from "@/utils/supabase/server";
import { RESUME_PATH_REGEX } from "@/utils/resume-utils";

const saveResumeSchema = z.object({
  storagePath: z.string().regex(RESUME_PATH_REGEX),
});

export async function saveResume(storagePath: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  if (user.user_metadata?.role?.toUpperCase() !== "SEEKER") {
    return { error: "Only job seekers can upload a resume" };
  }

  const parsed = saveResumeSchema.safeParse({ storagePath });
  if (!parsed.success || !storagePath.startsWith(`${user.id}/`)) {
    return { error: "Invalid file path" };
  }

  const { data: files } = await supabase.storage
    .from("resumes")
    .list(user.id, { limit: 100 });

  const exists = files?.some((f) => `${user.id}/${f.name}` === storagePath);
  if (!exists) return { error: "File not found in storage" };

  await prisma.profile.upsert({
    where: { userId: user.id },
    create: {
      userId: user.id,
      firstName: user.user_metadata?.firstName ?? "User",
      lastName: user.user_metadata?.lastName ?? "",
      resumeStoragePath: storagePath,
    },
    update: { resumeStoragePath: storagePath },
  });

  revalidatePath("/profile");
  return { success: true };
}