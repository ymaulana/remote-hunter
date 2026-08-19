import { z } from "zod";
import { RESUME_PATH_REGEX } from "./resume-utils";

export const MAX_COVER_LETTER_LENGTH = 5000;

export const applyPayloadSchema = z.object({
  jobId: z.string().min(1, "Job is required"),
  resumeStoragePath: z.string().regex(RESUME_PATH_REGEX).optional(),
  coverLetter: z.string().max(MAX_COVER_LETTER_LENGTH).optional(),
});

export type ApplyPayload = z.infer<typeof applyPayloadSchema>;