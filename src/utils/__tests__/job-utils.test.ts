import { describe, it, expect } from "vitest";
import { jobPayloadSchema, parseTagsInput } from "../job-utils";

const validPayload = {
  title: "Senior Frontend Engineer",
  company: "Acme Corp",
  location: "Remote — Worldwide",
  salary: "80k - 120k yearly",
  currency: "USD",
  description:
    "We are looking for a senior frontend engineer to join our fully remote team and build delightful products.",
  tags: ["React", "TypeScript"],
};

describe("jobPayloadSchema", () => {
  it("accepts a fully valid payload", () => {
    expect(jobPayloadSchema.safeParse(validPayload).success).toBe(true);
  });

  it("accepts a payload without optional salary and tags", () => {
    const { salary: _salary, tags: _tags, ...required } = validPayload;
    const res = jobPayloadSchema.safeParse(required);
    expect(res.success).toBe(true);
  });

  it("rejects missing or blank title", () => {
    expect(jobPayloadSchema.safeParse({ ...validPayload, title: "" }).success).toBe(false);
    const { title: _title, ...noTitle } = validPayload;
    expect(jobPayloadSchema.safeParse(noTitle).success).toBe(false);
  });

  it("rejects titles over 120 chars", () => {
    const res = jobPayloadSchema.safeParse({ ...validPayload, title: "x".repeat(121) });
    expect(res.success).toBe(false);
  });

  it("rejects missing or blank company", () => {
    expect(jobPayloadSchema.safeParse({ ...validPayload, company: "" }).success).toBe(false);
  });

  it("rejects missing or blank location", () => {
    expect(jobPayloadSchema.safeParse({ ...validPayload, location: "  " }).success).toBe(false);
  });

  it("rejects descriptions shorter than 50 chars", () => {
    const res = jobPayloadSchema.safeParse({ ...validPayload, description: "Too short." });
    expect(res.success).toBe(false);
  });

  it("rejects descriptions over 20000 chars", () => {
    const res = jobPayloadSchema.safeParse({
      ...validPayload,
      description: "x".repeat(20001),
    });
    expect(res.success).toBe(false);
  });

  it("accepts a description of exactly 50 chars", () => {
    const res = jobPayloadSchema.safeParse({ ...validPayload, description: "x".repeat(50) });
    expect(res.success).toBe(true);
  });

  it("rejects salary strings over 100 chars", () => {
    const res = jobPayloadSchema.safeParse({ ...validPayload, salary: "x".repeat(101) });
    expect(res.success).toBe(false);
  });

  it("accepts known ISO currency codes", () => {
    expect(jobPayloadSchema.safeParse({ ...validPayload, currency: "USD" }).success).toBe(true);
    expect(jobPayloadSchema.safeParse({ ...validPayload, currency: "IDR" }).success).toBe(true);
  });

  it("rejects unknown currency codes", () => {
    expect(jobPayloadSchema.safeParse({ ...validPayload, currency: "GGG" }).success).toBe(false);
  });

  it("rejects more than 10 tags", () => {
    const tags = Array.from({ length: 11 }, (_, i) => `tag-${i}`);
    expect(jobPayloadSchema.safeParse({ ...validPayload, tags }).success).toBe(false);
  });

  it("rejects individual tags over 30 chars", () => {
    expect(
      jobPayloadSchema.safeParse({ ...validPayload, tags: ["x".repeat(31)] }).success
    ).toBe(false);
  });

  it("rejects blank tags mixed with valid ones", () => {
    expect(jobPayloadSchema.safeParse({ ...validPayload, tags: ["React", "   "] }).success).toBe(
      false
    );
  });
});

describe("parseTagsInput", () => {
  it("splits a comma-separated string and trims each tag", () => {
    expect(parseTagsInput("React, TypeScript , Node.js")).toEqual([
      "React",
      "TypeScript",
      "Node.js",
    ]);
  });

  it("drops empty segments", () => {
    expect(parseTagsInput("  React ,,, Design , ")).toEqual(["React", "Design"]);
  });

  it("deduplicates tags case-insensitively, keeping the first occurrence", () => {
    expect(parseTagsInput("React, react, REACT, TypeScript")).toEqual(["React", "TypeScript"]);
  });

  it("returns an empty array for blank input", () => {
    expect(parseTagsInput("")).toEqual([]);
    expect(parseTagsInput("   ")).toEqual([]);
  });

  it("truncates results to 10 tags", () => {
    const input = Array.from({ length: 14 }, (_, i) => `tag-${i}`).join(", ");
    expect(parseTagsInput(input)).toHaveLength(10);
  });
});
