"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import ClientDate from "@/components/ui/ClientDate";
import { updateApplicationStatus } from "@/app/(protected)/post-job/[id]/applicants/actions";
import {
  APPLICATION_STATUSES,
  STATUS_LABELS,
  statusBadgeClass,
} from "@/utils/application-utils";

export interface ApplicantRow {
  id: string;
  status: string;
  appliedAt: Date;
  coverLetter: string | null;
  resumeUrl: string | null;
  applicant: {
    name: string | null;
    email: string;
  };
}

interface ApplicantsTableProps {
  jobId: string;
  applications: ApplicantRow[];
}

const ERROR_TOASTS: Record<string, string> = {
  NOT_AUTHENTICATED: "Session expired, please log in again",
  FORBIDDEN: "You can't update this application",
  NOT_FOUND: "You can't update this application",
  INVALID_STATUS: "Invalid status",
};

export function ApplicantsTable({ applications }: ApplicantsTableProps) {
  const router = useRouter();
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleStatusChange = async (appId: string, status: string) => {
    setUpdatingId(appId);
    const result = await updateApplicationStatus(appId, status);
    if ("error" in result && result.error) {
      toast.error(ERROR_TOASTS[result.error] ?? "Something went wrong");
    } else {
      toast.success("Status updated");
      startTransition(() => router.refresh());
    }
    setUpdatingId(null);
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Applicant</TableHead>
          <TableHead>Applied</TableHead>
          <TableHead>Resume</TableHead>
          <TableHead>Cover Letter</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {applications.map((app) => (
          <TableRow key={app.id}>
            <TableCell>
              <div className="font-medium">{app.applicant.name ?? "Unknown"}</div>
              <div className="text-muted-foreground text-sm">{app.applicant.email}</div>
            </TableCell>
            <TableCell>
              <ClientDate date={app.appliedAt} />
            </TableCell>
            <TableCell>
              {app.resumeUrl ? (
                <Button variant="outline" size="sm" asChild>
                  <a
                    href={app.resumeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FileText className="h-4 w-4" /> Resume
                  </a>
                </Button>
              ) : (
                "—"
              )}
            </TableCell>
            <TableCell>
              {app.coverLetter ? (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      View
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>
                        Cover letter — {app.applicant.name ?? app.applicant.email}
                      </DialogTitle>
                      <DialogDescription asChild>
                        <div className="whitespace-pre-wrap">{app.coverLetter}</div>
                      </DialogDescription>
                    </DialogHeader>
                  </DialogContent>
                </Dialog>
              ) : (
                "—"
              )}
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <span
                  className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${statusBadgeClass(app.status)}`}
                >
                  {STATUS_LABELS[app.status as keyof typeof STATUS_LABELS] ?? app.status}
                </span>
                <Select
                  value={app.status}
                  onValueChange={(value) => handleStatusChange(app.id, value)}
                  disabled={updatingId === app.id || isPending}
                >
                  <SelectTrigger size="sm" aria-label="Update application status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {APPLICATION_STATUSES.map((status) => (
                      <SelectItem key={status} value={status}>
                        {STATUS_LABELS[status]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
