import { createClient } from "@/utils/supabase/server";
import { prisma } from "@/utils/prisma";
import { SeekerProfile } from "@/components/profile/SeekerProfile";
import { RecruiterProfile } from "@/components/profile/RecruiterProfile";

/**
 * Main Profile Route - Renders role-specific profile page
 * - SEEKER → Renders SeekerProfile
 * - RECRUITER → Renders RecruiterProfile
 */
export default async function ProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null; // Middleware will handle redirect to login
  }

  const role = (user.user_metadata?.role as string)?.toUpperCase() ?? "SEEKER";

  // Render role-specific profile page
  if (role === "RECRUITER") {
    return <RecruiterProfile />;
  }

  const [profile, applications] = await Promise.all([
    prisma.profile.findUnique({ where: { userId: user.id } }),
    prisma.application.findMany({
      where: { userId: user.id },
      include: { job: true },
      orderBy: { appliedAt: "desc" },
    }),
  ]);

  let resumeUrl: string | null = null;
  if (profile?.resumeStoragePath) {
    const { data } = await supabase.storage
      .from("resumes")
      .createSignedUrl(profile.resumeStoragePath, 3600);
    resumeUrl = data?.signedUrl ?? null;
  }

  return (
    <SeekerProfile
      email={user.email ?? ""}
      profile={profile}
      resumeUrl={resumeUrl}
      applications={applications}
    />
  );
}