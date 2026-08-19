-- AlterTable
ALTER TABLE "Profile" ADD COLUMN "resumeStoragePath" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Application_jobId_userId_key" ON "Application"("jobId", "userId");

-- Resumes storage bucket (private) + owner RLS (idempotent)
insert into storage.buckets (id, name, public)
values ('resumes', 'resumes', false)
on conflict (id) do nothing;

drop policy if exists "resumes_owner_all" on storage.objects;

create policy "resumes_owner_all"
on storage.objects
for all
to authenticated
using (
  bucket_id = 'resumes'
  and (storage.foldername(name))[1] = auth.uid()::text
)
with check (
  bucket_id = 'resumes'
  and (storage.foldername(name))[1] = auth.uid()::text
);