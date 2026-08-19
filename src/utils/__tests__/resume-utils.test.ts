import { describe, it, expect } from "vitest";
import {
  MAX_RESUME_SIZE_BYTES,
  isAllowedResumeFile,
  buildResumeStoragePath,
  isValidResumeStoragePath,
} from "../resume-utils";

describe("isAllowedResumeFile", () => {
  it("accepts a 1MB PDF", () => {
    expect(isAllowedResumeFile({ name: "cv.pdf", type: "application/pdf", size: 1024 * 1024 })).toBe(true);
  });
  it("accepts docx", () => {
    expect(isAllowedResumeFile({ name: "cv.docx", type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document", size: 1000 })).toBe(true);
  });
  it("rejects txt files", () => {
    expect(isAllowedResumeFile({ name: "cv.txt", type: "text/plain", size: 1000 })).toBe(false);
  });
  it("rejects oversized files", () => {
    expect(isAllowedResumeFile({ name: "cv.pdf", type: "application/pdf", size: MAX_RESUME_SIZE_BYTES + 1 })).toBe(false);
  });
});

describe("buildResumeStoragePath", () => {
  it("uses the user id and keeps the extension", () => {
    const path = buildResumeStoragePath("user-123", "resume.pdf");
    expect(path.startsWith("user-123/resume-")).toBe(true);
    expect(path.endsWith(".pdf")).toBe(true);
  });
});

describe("isValidResumeStoragePath", () => {
  it("validates a proper uuid owner path", () => {
    const uuid = "11111111-1111-1111-1111-111111111111";
    expect(isValidResumeStoragePath(`${uuid}/resume-abc123.pdf`)).toBe(true);
  });
  it("rejects wrong owner prefix or extension", () => {
    expect(isValidResumeStoragePath("not-a-uuid/resume-a.pdf")).toBe(false);
    expect(isValidResumeStoragePath("11111111-1111-1111-1111-111111111111/resume-a.exe")).toBe(false);
  });
});
