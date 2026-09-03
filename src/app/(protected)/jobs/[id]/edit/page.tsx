import { notFound } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { prisma } from "@/utils/prisma";
import { JobForm } from "@/components/jobs/JobForm";
import { updateJob } from "../../actions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function EditJobPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const job = await prisma.job.findUnique({
    where: { id, postedBy: user.id, source: "INTERNAL" },
  });

  if (!job) notFound();

  return (
    <div className="min-h-screen bg-linear-to-b from-background to-secondary/20">
      <div className="mx-auto max-w-3xl px-6 py-10 pt-24">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Edit Job</h1>
          <p className="text-muted-foreground mt-2">Update the details for &ldquo;{job.title}&rdquo;.</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Job details</CardTitle>
            <CardDescription>All fields marked with * are required.</CardDescription>
          </CardHeader>
          <CardContent>
            <JobForm
              mode="edit"
              defaultValues={{
                title: job.title,
                company: job.company,
                location: job.location,
                salary: job.salary ?? "",
                currency: job.currency,
                description: job.description,
                tags: job.tags,
              }}
              onSubmit={async (payload) => updateJob(id, payload)}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
