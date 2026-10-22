import { describe, it, expect } from "vitest";
import {
  APPLICATION_STATUSES,
  applicationStatusSchema,
  STATUS_LABELS,
  statusBadgeClass,
} from "../application-utils";

describe("APPLICATION_STATUSES", () => {
  it("mirrors the Prisma ApplicationStatus enum (contents and order)", () => {
    expect(APPLICATION_STATUSES).toEqual([
      "PENDING",
      "REVIEWED",
      "REJECTED",
      "ACCEPTED",
    ]);
  });
});

describe("applicationStatusSchema", () => {
  it("accepts each valid status", () => {
    for (const status of APPLICATION_STATUSES) {
      expect(applicationStatusSchema.safeParse(status).success).toBe(true);
    }
  });

  it("rejects an unknown status", () => {
    expect(applicationStatusSchema.safeParse("MAYBE").success).toBe(false);
    expect(applicationStatusSchema.safeParse("pending").success).toBe(false);
  });
});

describe("STATUS_LABELS", () => {
  it("has a label for every status", () => {
    expect(Object.keys(STATUS_LABELS).sort()).toEqual(
      [...APPLICATION_STATUSES].sort(),
    );
  });

  it("maps statuses to their display labels", () => {
    expect(STATUS_LABELS.PENDING).toBe("Pending");
    expect(STATUS_LABELS.REVIEWED).toBe("Reviewed");
    expect(STATUS_LABELS.REJECTED).toBe("Rejected");
    expect(STATUS_LABELS.ACCEPTED).toBe("Accepted");
  });
});

describe("statusBadgeClass", () => {
  it("returns amber classes for PENDING", () => {
    expect(statusBadgeClass("PENDING")).toContain("bg-amber-100");
    expect(statusBadgeClass("PENDING")).toContain("text-amber-700");
  });

  it("returns blue classes for REVIEWED", () => {
    expect(statusBadgeClass("REVIEWED")).toContain("bg-blue-100");
    expect(statusBadgeClass("REVIEWED")).toContain("text-blue-700");
  });

  it("returns green classes for ACCEPTED", () => {
    expect(statusBadgeClass("ACCEPTED")).toContain("bg-green-100");
    expect(statusBadgeClass("ACCEPTED")).toContain("text-green-700");
  });

  it("returns red classes for REJECTED", () => {
    expect(statusBadgeClass("REJECTED")).toContain("bg-red-100");
    expect(statusBadgeClass("REJECTED")).toContain("text-red-700");
  });

  it("returns gray fallback for unknown values", () => {
    expect(statusBadgeClass("SOMETHING_ELSE")).toContain("bg-gray-100");
    expect(statusBadgeClass("SOMETHING_ELSE")).toContain("text-gray-700");
  });
});
