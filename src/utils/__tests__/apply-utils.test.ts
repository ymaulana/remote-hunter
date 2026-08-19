import { describe, it, expect } from "vitest";
import { applyPayloadSchema } from "../apply-utils";

describe("applyPayloadSchema", () => {
  it("accepts a minimal valid payload", () => {
    expect(applyPayloadSchema.safeParse({ jobId: "job-1" }).success).toBe(true);
  });
  it("accepts an optional cover letter under 5000 chars", () => {
    const res = applyPayloadSchema.safeParse({ jobId: "job-1", coverLetter: "Hello" });
    expect(res.success).toBe(true);
  });
  it("rejects cover letters over 5000 chars", () => {
    const res = applyPayloadSchema.safeParse({ jobId: "job-1", coverLetter: "x".repeat(5001) });
    expect(res.success).toBe(false);
  });
  it("rejects invalid resume paths", () => {
    const res = applyPayloadSchema.safeParse({ jobId: "job-1", resumeStoragePath: "nope.txt" });
    expect(res.success).toBe(false);
  });
  it("rejects missing jobId", () => {
    expect(applyPayloadSchema.safeParse({}).success).toBe(false);
  });
});