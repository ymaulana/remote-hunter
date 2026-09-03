"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  COMMON_CURRENCIES,
  jobPayloadSchema,
  MAX_DESCRIPTION_LENGTH,
  MIN_DESCRIPTION_LENGTH,
  parseTagsInput,
  type JobPayload,
} from "@/utils/job-utils";
import { KEYWORDS } from "@/utils/tag-utils";

type JobFormProps = {
  mode: "create" | "edit";
  defaultValues?: Partial<JobPayload>;
  onSubmit: (payload: JobPayload) => Promise<{ error?: string; success?: boolean; jobId?: string }>;
  companyNameFallback?: string;
};

export function JobForm({ mode, defaultValues, onSubmit, companyNameFallback }: JobFormProps) {
  const router = useRouter();

  const initialTagsString = useMemo(
    () => (defaultValues?.tags ?? []).join(", "),
    [defaultValues?.tags],
  );
  const [tagsInput, setTagsInput] = useState(initialTagsString);

  const form = useForm<JobPayload>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(jobPayloadSchema) as any,
    defaultValues: {
      title: defaultValues?.title ?? "",
      company: defaultValues?.company ?? companyNameFallback ?? "",
      location: defaultValues?.location ?? "",
      salary: defaultValues?.salary ?? "",
      currency: (defaultValues?.currency as string) ?? "USD",
      description: defaultValues?.description ?? "",
      tags: defaultValues?.tags ?? [],
    },
  });

  const descriptionValue = form.watch("description") ?? "";
  const tagsPreview = useMemo(() => parseTagsInput(tagsInput), [tagsInput]);

  const handleTagsInputChange = (value: string) => {
    setTagsInput(value);
    const parsed = parseTagsInput(value);
    form.setValue("tags", parsed, { shouldValidate: true });
  };

  const handleQuickAdd = (keyword: string) => {
    const current = parseTagsInput(tagsInput);
    const lower = new Set(current.map((t) => t.toLowerCase()));
    if (lower.has(keyword.toLowerCase())) return;
    if (current.length >= 10) {
      toast.error("At most 10 tags are allowed");
      return;
    }
    const next = current.length ? `${tagsInput.trim().replace(/,+$/, "")}, ${keyword}` : keyword;
    handleTagsInputChange(next);
  };

  const isPending = form.formState.isSubmitting;

  const submit = form.handleSubmit(async (data) => {
    const payload: JobPayload = {
      ...data,
      tags: parseTagsInput(tagsInput),
    };

    const res = await onSubmit(payload);

    if (res?.error) {
      if (res.error === "FORBIDDEN") toast.error("You don't have permission to post jobs");
      else if (res.error === "NOT_FOUND") toast.error("Job not found");
      else if (res.error === "INVALID_PAYLOAD") toast.error("Please check your inputs");
      else if (res.error === "NOT_AUTHENTICATED") toast.error("Please sign in again");
      else toast.error("Something went wrong. Please try again.");
      return;
    }

    toast.success(mode === "create" ? "Job posted successfully" : "Job updated");
    router.push("/profile");
    router.refresh();
  });

  return (
    <form onSubmit={submit} className="space-y-6">
      <FieldGroup>
        <Controller
          name="title"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="title">
                Job Title <span className="text-destructive">*</span>
              </FieldLabel>
              <Input
                id="title"
                placeholder="e.g. Senior Frontend Engineer"
                aria-invalid={fieldState.invalid}
                {...field}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>

      <FieldGroup>
        <Controller
          name="company"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="company">
                Company <span className="text-destructive">*</span>
              </FieldLabel>
              <Input
                id="company"
                placeholder="Acme Corp"
                aria-invalid={fieldState.invalid}
                {...field}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>

      <FieldGroup>
        <Controller
          name="location"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="location">
                Location <span className="text-destructive">*</span>
              </FieldLabel>
              <Input
                id="location"
                placeholder="Remote — Worldwide / New York, NY"
                aria-invalid={fieldState.invalid}
                {...field}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>

      <div className="grid gap-4 sm:grid-cols-3">
        <FieldGroup className="sm:col-span-2">
          <Controller
            name="salary"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="salary">Salary (optional)</FieldLabel>
                <Input
                  id="salary"
                  placeholder="e.g. 80k - 120k yearly"
                  aria-invalid={fieldState.invalid}
                  {...field}
                  value={field.value ?? ""}
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
        </FieldGroup>

        <FieldGroup>
          <Controller
            name="currency"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="currency">
                  Currency <span className="text-destructive">*</span>
                </FieldLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger id="currency" className="w-full" aria-invalid={fieldState.invalid}>
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    {COMMON_CURRENCIES.map((code) => (
                      <SelectItem key={code} value={code}>
                        {code}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
        </FieldGroup>
      </div>

      <FieldGroup>
        <Controller
          name="description"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <div className="flex items-center justify-between">
                <FieldLabel htmlFor="description">
                  Description <span className="text-destructive">*</span>
                </FieldLabel>
                <span
                  className={`text-xs ${descriptionValue.length < MIN_DESCRIPTION_LENGTH || descriptionValue.length > MAX_DESCRIPTION_LENGTH ? "text-destructive" : "text-muted-foreground"}`}
                >
                  {descriptionValue.length} / {MAX_DESCRIPTION_LENGTH}
                </span>
              </div>
              <Textarea
                id="description"
                placeholder="Describe the role, responsibilities, requirements..."
                rows={8}
                className="min-h-[160px] whitespace-pre-wrap"
                aria-invalid={fieldState.invalid}
                {...field}
              />
              <p className="text-muted-foreground text-xs">
                {MIN_DESCRIPTION_LENGTH}–{MAX_DESCRIPTION_LENGTH} characters.
              </p>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>

      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="tagsInput">Tags</FieldLabel>
          <Input
            id="tagsInput"
            placeholder="Comma separated: React, TypeScript, Remote"
            value={tagsInput}
            onChange={(e) => handleTagsInputChange(e.target.value)}
          />
          <p className="text-muted-foreground text-xs">Up to 10 tags, each max 30 characters.</p>
          {form.formState.errors.tags && (
            <FieldError errors={[form.formState.errors.tags as { message?: string }]} />
          )}

          {tagsPreview.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-2">
              {tagsPreview.map((tag) => (
                <span
                  key={tag.toLowerCase()}
                  className="bg-secondary text-secondary-foreground rounded-full px-2.5 py-1 text-xs font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          <div className="pt-2">
            <p className="text-muted-foreground mb-2 text-xs font-medium">Quick add:</p>
            <div className="flex flex-wrap gap-1.5">
              {KEYWORDS.slice(0, 16).map((kw) => {
                const active = tagsPreview.some((t) => t.toLowerCase() === kw.toLowerCase());
                return (
                  <button
                    key={kw}
                    type="button"
                    onClick={() => handleQuickAdd(kw)}
                    disabled={active}
                    className={`rounded-full border px-2.5 py-1 text-xs transition-colors ${
                      active
                        ? "bg-primary text-primary-foreground border-primary cursor-not-allowed opacity-60"
                        : "bg-card hover:bg-accent hover:text-accent-foreground border-input"
                    }`}
                  >
                    {kw}
                  </button>
                );
              })}
            </div>
          </div>
        </Field>
      </FieldGroup>

      <Button type="submit" disabled={isPending} className="w-full sm:w-auto">
        {isPending ? "Saving..." : mode === "create" ? "Post Job" : "Update Job"}
      </Button>
    </form>
  );
}
