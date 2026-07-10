import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { SeekerProfile } from "@/components/profile/SeekerProfile";
import { RecruiterProfile } from "@/components/profile/RecruiterProfile";

/**
 * Main Profile Route - Renders role-specific profile page
 * - SEEKER → Renders SeekerProfile
 * - RECRUITER → Renders RecruiterProfile
 */
export default async function ProfilePage() {
  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            cookieStore.set(name, value)
          );
        },
      },
    }
  );

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

  return <SeekerProfile />;
}
