import { z } from "zod";

// Mirrors the Prisma ApplicationStatus enum; kept in sync by a test
// asserting contents and order.
export const APPLICATION_STATUSES = [
  "PENDING",
  "REVIEWED",
  "REJECTED",
  "ACCEPTED",
] as const;

export type ApplicationStatusValue = (typeof APPLICATION_STATUSES)[number];

// Zod 4 accepts readonly tuples in z.enum.
export const applicationStatusSchema = z.enum(APPLICATION_STATUSES);

export const STATUS_LABELS: Record<ApplicationStatusValue, string> = {
  PENDING: "Pending",
  REVIEWED: "Reviewed",
  REJECTED: "Rejected",
  ACCEPTED: "Accepted",
};

// Badge classes per status; unknown values fall back to gray.
export const statusBadgeClass = (status: string): string => {
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
