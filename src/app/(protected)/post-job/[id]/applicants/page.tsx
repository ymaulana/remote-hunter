import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Users } from "lucide-react";
import { createClient } from "@/utils/supabase/server";
import { prisma } from "@/utils/prisma";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ApplicantsTable, type ApplicantRow } from "@/components/jobs/ApplicantsTable";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function ApplicantsPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const job = await prisma.job.findFirst({
    where: { id, postedBy: user.id },
    select: { id: true, title: true, company: true, location: true },
  });

  if (!job) notFound();

  const applications = await prisma.application.findMany({
    where: { jobId: job.id },
    orderBy: { appliedAt: "desc" },
    include: {
      user: {
        select: {
          email: true,
          profile: {
            select: { firstName: true, lastName: true, resumeStoragePath: true },
          },
        },
      },
    },
  });

  // Snapshot first, legacy profile fallback. Signed URLs only ever leave the
  // server — storage paths never ship to the client.
  const rows: ApplicantRow[] = await Promise.all(
    applications.map(async (app) => {
      const path = app.resumeStoragePath ?? app.user.profile?.resumeStoragePath ?? null;
      let resumeUrl: string | null = null;
      if (path) {
        const { data } = await supabase.storage
          .from("resumes")
          .createSignedUrl(path, 3600);
        resumeUrl = data?.signedUrl ?? null;
      }

      const firstName = app.user.profile?.firstName ?? "";
      const lastName = app.user.profile?.lastName ?? "";
      const name = [firstName, lastName].filter(Boolean).join(" ");

      return {
        id: app.id,
        status: app.status,
        appliedAt: app.appliedAt,
        coverLetter: app.coverLetter,
        resumeUrl,
        applicant: {
          name: name || null,
          email: app.user.email,
        },
      };
    }),
  );

  return (
    <div className="min-h-screen bg-linear-to-b from-background to-secondary/20">
      <div className="mx-auto max-w-5xl px-6 py-10 pt-24">
        <Button variant="ghost" size="sm" asChild className="mb-6 -ml-2">
          <Link href="/profile">
            <ArrowLeft className="h-4 w-4" /> Back to workspace
          </Link>
        </Button>

        <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="flex items-center gap-2 text-3xl font-bold tracking-tight">
              <Users className="h-7 w-7 text-primary" /> Applicants
            </h1>
            <p className="text-muted-foreground mt-2">
              {job.title} &middot; {job.company} &middot; {job.location}
            </p>
          </div>
          <span className="inline-flex items-center rounded-full bg-secondary px-3 py-1 text-sm font-medium text-secondary-foreground">
            {rows.length} {rows.length === 1 ? "applicant" : "applicants"}
          </span>
        </div>

        {rows.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center gap-3 py-12 text-center">
              <Users className="h-10 w-10 text-muted-foreground" />
              <p className="text-lg font-medium">No applications yet</p>
              <p className="text-muted-foreground max-w-sm text-sm">
                When job seekers apply to this position, their applications will
                appear here for review.
              </p>
              <Button variant="outline" asChild className="mt-2">
                <Link href="/profile">Back to workspace</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="px-0 py-0">
              <ApplicantsTable jobId={job.id} applications={rows} />
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
