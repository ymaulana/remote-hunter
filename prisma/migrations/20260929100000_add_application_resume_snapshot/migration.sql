-- Add resume snapshot to Application (nullable, additive).
-- Snapshot of the resume submitted with the application; falls back to
-- Profile.resumeStoragePath for legacy rows at read time.
ALTER TABLE "Application" ADD COLUMN "resumeStoragePath" TEXT;
