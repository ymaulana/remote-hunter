import { createClient } from "@/utils/supabase/server";
import { prisma } from "@/utils/prisma";
import { JobForm } from "@/components/jobs/JobForm";
import { createJob } from "./actions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default async function PostJobPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const profile = await prisma.profile.findUnique({
    where: { userId: user.id },
    select: { companyName: true },
  });

  return (
    <div className="min-h-screen bg-linear-to-b from-background to-secondary/20">
      <div className="mx-auto max-w-3xl px-6 py-10 pt-24">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Post a Job</h1>
          <p className="text-muted-foreground mt-2">
            Fill in the details below. Your job will be published instantly and appear in the public
            listing.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Job details</CardTitle>
            <CardDescription>All fields marked with * are required.</CardDescription>
          </CardHeader>
          <CardContent>
            <JobForm
              mode="create"
              companyNameFallback={profile?.companyName ?? undefined}
              onSubmit={createJob}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
