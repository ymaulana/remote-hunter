-- Fix: Supabase Data API returns 401 / 42501 "permission denied for schema public"
-- Cause: tables were (re)created via Prisma migrations outside Supabase's managed
-- flow, so the anon/authenticated roles never received their role grants.
--
-- This restores Data API access and pairs it with RLS ownership policies.
-- It is idempotent-safe for normal reruns (grants and policies are additive).

-- 1) Schema usage (the actual root cause of the 42501 error)
grant usage on schema public to anon, authenticated;

-- 2) Table grants
--    Job is public-read (used by the app's useJobs/useJob client queries)
grant select on public."Job" to anon, authenticated;
--    Profile / Application are owner-scoped (enforced by RLS below)
grant select, insert, update, delete on public."Profile" to authenticated;
grant select, insert, update, delete on public."Application" to authenticated;

-- 3) Default privileges so future table re-creations keep working
alter default privileges in schema public
  grant select on tables to anon;
alter default privileges in schema public
  grant select, insert, update, delete on tables to authenticated;
alter default privileges in schema public
  grant usage on sequences to anon, authenticated;

-- 4) RLS + policies
alter table public."Job" enable row level security;
drop policy if exists "job_public_read" on public."Job";
create policy "job_public_read" on public."Job"
  for select to anon, authenticated
  using (true);

alter table public."Profile" enable row level security;
drop policy if exists "profile_owner_all" on public."Profile";
create policy "profile_owner_all" on public."Profile"
  for all to authenticated
  using ( (select auth.uid())::text = "userId" )
  with check ( (select auth.uid())::text = "userId" );

alter table public."Application" enable row level security;
drop policy if exists "application_owner_all" on public."Application";
create policy "application_owner_all" on public."Application"
  for all to authenticated
  using ( (select auth.uid())::text = "userId" )
  with check ( (select auth.uid())::text = "userId" );