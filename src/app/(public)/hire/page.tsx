import {
  Hero,
  FeaturesSection,
  HowItWorks,
  JobPostingsPreview,
  TestimonialsSection,
  FooterCTA,
} from "@/components/hire";
import { createClient } from "@/utils/supabase/server";

export const metadata = {
  title: "Hire Remote Talent | RemoteHunter",
  description:
    "Find and hire the best remote professionals. Post jobs and connect with thousands of active tech and non-tech job seekers.",
};

export default async function HirePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isAuthenticated = !!user;
  const isRecruiter = user?.user_metadata?.role === "RECRUITER";

  return (
    <main className="flex min-h-screen flex-col">
      <Hero isRecruiter={isRecruiter} isAuthenticated={isAuthenticated} />

      <FeaturesSection />

      <HowItWorks />

      {isAuthenticated && isRecruiter && <JobPostingsPreview />}

      <TestimonialsSection />

      <FooterCTA isRecruiter={isRecruiter} isAuthenticated={isAuthenticated} />
    </main>
  );
}
