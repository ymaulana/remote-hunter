import { describe, it, expect } from "vitest";
import {
  jobPayloadSchema,
  parseTagsInput,
  slugifyTitle,
  jobSlug,
  jobIdFromSlug,
} from "../job-utils";

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

describe("slugifyTitle", () => {
  it("lowercases and joins words with single dashes", () => {
    expect(slugifyTitle("Senior Frontend Engineer")).toBe(
      "senior-frontend-engineer"
    );
  });

  it("folds runs of punctuation/whitespace into one dash", () => {
    expect(slugifyTitle("C++ / DevOps  &   Platform (Remote)")).toBe(
      "c-devops-platform-remote"
    );
  });

  it("trims leading and trailing dashes", () => {
    expect(slugifyTitle("  --Hello World--  ")).toBe("hello-world");
  });

  it("returns empty string for titles with no ASCII alphanumerics", () => {
    expect(slugifyTitle("高级前端工程师")).toBe("");
    expect(slugifyTitle("!!!")).toBe("");
    expect(slugifyTitle("")).toBe("");
  });

  it("keeps digits", () => {
    expect(slugifyTitle("React 19 & Next.js 16")).toBe("react-19-next-js-16");
  });
});

describe("jobSlug", () => {
  const id = "550e8400-e29b-41d4-a716-446655440000";

  it("builds uuid-prefixed slug from the title", () => {
    expect(jobSlug({ id, title: "Senior Frontend Engineer" })).toBe(
      `${id}-senior-frontend-engineer`
    );
  });

  it("falls back to the bare id when the title slugifies to empty", () => {
    expect(jobSlug({ id, title: "高级前端工程师" })).toBe(id);
  });
});

describe("jobIdFromSlug", () => {
  const id = "550E8400-E29B-41D4-A716-446655440000";

  it("extracts the leading uuid from a full slug", () => {
    expect(jobIdFromSlug(`${id.toLowerCase()}-senior-frontend-engineer`)).toBe(
      id.toLowerCase()
    );
  });

  it("accepts a bare uuid (legacy /jobs/<id> URLs)", () => {
    expect(jobIdFromSlug(id.toLowerCase())).toBe(id.toLowerCase());
  });

  it("matches uppercase uuids", () => {
    expect(jobIdFromSlug(id)).toBe(id.toLowerCase());
  });

  it("returns null for slugs without a leading uuid", () => {
    expect(jobIdFromSlug("senior-frontend-engineer")).toBeNull();
    expect(jobIdFromSlug("")).toBeNull();
  });

  it("round-trips through jobSlug", () => {
    const job = { id: id.toLowerCase(), title: "Senior Frontend Engineer" };
    expect(jobIdFromSlug(jobSlug(job))).toBe(job.id);
  });
});
