import { z } from "zod";
import { isValidCurrency } from "./currency-utils";

// Field constraints (shared by the form UI and the server action)
export const MAX_TITLE_LENGTH = 120;
export const MAX_COMPANY_LENGTH = 100;
export const MAX_LOCATION_LENGTH = 100;
export const MAX_SALARY_LENGTH = 100;
export const MIN_DESCRIPTION_LENGTH = 50;
export const MAX_DESCRIPTION_LENGTH = 20000;
export const MAX_TAGS = 10;
export const MAX_TAG_LENGTH = 30;

// Curated currency list for the post-a-job dropdown (validated ISO 4217 codes)
export const COMMON_CURRENCIES = [
  "USD",
  "EUR",
  "GBP",
  "CAD",
  "AUD",
  "NZD",
  "SGD",
  "JPY",
  "INR",
  "IDR",
  "MYR",
  "PHP",
  "VND",
  "THB",
  "HKD",
  "KRW",
  "BRL",
  "MXN",
  "ZAR",
  "CHF",
] as const;

const currencySchema = z
  .string()
  .refine((code) => isValidCurrency(code), { message: "Unsupported currency" });

export const jobPayloadSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title is required")
    .max(MAX_TITLE_LENGTH, `Title must be at most ${MAX_TITLE_LENGTH} characters`),
  company: z
    .string()
    .trim()
    .min(1, "Company is required")
    .max(MAX_COMPANY_LENGTH, `Company must be at most ${MAX_COMPANY_LENGTH} characters`),
  location: z
    .string()
    .trim()
    .min(1, "Location is required")
    .max(MAX_LOCATION_LENGTH, `Location must be at most ${MAX_LOCATION_LENGTH} characters`),
  salary: z
    .string()
    .trim()
    .max(MAX_SALARY_LENGTH, `Salary must be at most ${MAX_SALARY_LENGTH} characters`)
    .optional(),
  currency: currencySchema,
  description: z
    .string()
    .trim()
    .min(
      MIN_DESCRIPTION_LENGTH,
      `Description must be at least ${MIN_DESCRIPTION_LENGTH} characters`
    )
    .max(
      MAX_DESCRIPTION_LENGTH,
      `Description must be at most ${MAX_DESCRIPTION_LENGTH} characters`
    ),
  tags: z
    .array(
      z
        .string()
        .trim()
        .min(1, "Tags cannot be blank")
        .max(MAX_TAG_LENGTH, `Each tag must be at most ${MAX_TAG_LENGTH} characters`)
    )
    .max(MAX_TAGS, `At most ${MAX_TAGS} tags are allowed`)
    .default([]),
});

export type JobPayload = z.infer<typeof jobPayloadSchema>;

/**
 * Parses a free-form comma-separated tags input into a normalized tag list:
 * trims each segment, drops empties, dedupes case-insensitively (keeping the
 * first occurrence), and caps the result at MAX_TAGS entries.
 */
export function parseTagsInput(raw: string): string[] {
  if (!raw) return [];
  const seen = new Set<string>();
  const tags: string[] = [];
  for (const segment of raw.split(",")) {
    const tag = segment.trim();
    if (!tag) continue;
    const key = tag.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    tags.push(tag);
    if (tags.length >= MAX_TAGS) break;
  }
  return tags;
}
