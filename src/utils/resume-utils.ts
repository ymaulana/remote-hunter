export const MAX_RESUME_SIZE_BYTES = 5 * 1024 * 1024;

export const ALLOWED_RESUME_MIME = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]);

export const RESUME_EXTENSIONS = new Set(["pdf", "doc", "docx"]);

export const RESUME_PATH_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\/resume-[a-zA-Z0-9-]+\.(pdf|docx?)$/;

export function isAllowedResumeFile(file: {
  name: string;
  type: string;
  size: number;
}): boolean {
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
  return (
    RESUME_EXTENSIONS.has(ext) &&
    ALLOWED_RESUME_MIME.has(file.type) &&
    file.size <= MAX_RESUME_SIZE_BYTES
  );
}

export function buildResumeStoragePath(userId: string, fileName: string): string {
  const ext = fileName.split(".").pop()?.toLowerCase() ?? "pdf";
  return `${userId}/resume-${crypto.randomUUID()}.${ext}`;
}

export function isValidResumeStoragePath(path: string): boolean {
  return RESUME_PATH_REGEX.test(path);
}