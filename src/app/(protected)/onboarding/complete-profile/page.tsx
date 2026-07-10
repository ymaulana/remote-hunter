"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { Search, Briefcase, Building, LinkIcon, User } from "lucide-react";
import { completeProfile } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { toast } from "sonner";
import { useEffect } from "react";

// Create a submit button component to use the useFormStatus hook
function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      className="bg-primary hover:bg-primary/80 h-11 w-full"
      disabled={pending}
    >
      {pending ? "Saving..." : "Continue"}
    </Button>
  );
}

export default function CompleteProfile() {
  const [role, setRole] = useState<"SEEKER" | "RECRUITER">("SEEKER");
  const [state, formAction] = useActionState(completeProfile, null);

  useEffect(() => {
    if (state?.error) {
      toast.error(state.error);
    }
  }, [state?.error]);

  return (
    <div className="flex min-h-screen flex-col">
      <main className="grow pt-24 pb-16">
        <div className="container mx-auto max-w-md px-6">
          <div className="animate-slideUp">
            <div className="mb-8 text-center">
              <h1 className="mb-2 text-2xl font-bold">
                Welcome to RemoteHunter! 🎉
              </h1>
              <p className="text-muted-foreground">
                You're almost there. Tell us how you plan to use the platform.
              </p>
            </div>

            <div className="bg-card rounded-xl border p-6 shadow-sm md:p-8">
              <form action={formAction} className="space-y-6">
                <div>
                  <FieldLabel className="mb-3 block text-base">
                    I want to:
                  </FieldLabel>

                  {/* Hidden input to ensure role is submitted with the form */}
                  <input type="hidden" name="role" value={role} />

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <button
                      type="button"
                      onClick={() => setRole("SEEKER")}
                      className={`flex flex-col items-center justify-center gap-3 rounded-xl border-2 p-5 text-center transition-all ${
                        role === "SEEKER"
                          ? "border-primary bg-primary/5 text-primary"
                          : "border-border text-muted-foreground hover:border-primary/50 hover:bg-muted/50"
                      }`}
                    >
                      <div
                        className={`rounded-full p-3 ${role === "SEEKER" ? "bg-primary/10" : "bg-muted"}`}
                      >
                        <Search
                          className={`h-6 w-6 ${role === "SEEKER" ? "text-primary" : "text-muted-foreground"}`}
                        />
                      </div>
                      <div>
                        <span className="block font-semibold">Find a Job</span>
                        <span className="mt-1 block text-xs opacity-80">
                          Browse and apply
                        </span>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setRole("RECRUITER")}
                      className={`flex flex-col items-center justify-center gap-3 rounded-xl border-2 p-5 text-center transition-all ${
                        role === "RECRUITER"
                          ? "border-primary bg-primary/5 text-primary"
                          : "border-border text-muted-foreground hover:border-primary/50 hover:bg-muted/50"
                      }`}
                    >
                      <div
                        className={`rounded-full p-3 ${role === "RECRUITER" ? "bg-primary/10" : "bg-muted"}`}
                      >
                        <Briefcase
                          className={`h-6 w-6 ${role === "RECRUITER" ? "text-primary" : "text-muted-foreground"}`}
                        />
                      </div>
                      <div>
                        <span className="block font-semibold">Hire Talent</span>
                        <span className="mt-1 block text-xs opacity-80">
                          Post open roles
                        </span>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Seeker specific fields */}
                {role === "SEEKER" && (
                  <div className="animate-in fade-in slide-in-from-top-4 space-y-4 duration-300">
                    <Field data-invalid={!!state?.errors?.firstName}>
                      <FieldLabel htmlFor="firstName">
                        First Name <span className="text-destructive">*</span>
                      </FieldLabel>
                      <div className="relative">
                        <User className="text-muted-foreground absolute top-3 left-3 h-4 w-4" />
                        <Input
                          id="firstName"
                          name="firstName"
                          placeholder="John"
                          className="pl-10"
                          aria-invalid={!!state?.errors?.firstName}
                        />
                        {state?.errors?.firstName && (
                          <FieldError
                            errors={[{ message: state.errors.firstName[0] }]}
                          />
                        )}
                      </div>
                      <Field data-invalid={!!state?.errors?.lastName}>
                        <FieldLabel htmlFor="lastName">
                          Last Name <span className="text-destructive">*</span>
                        </FieldLabel>
                        <div className="relative">
                          <User className="text-muted-foreground absolute top-3 left-3 h-4 w-4" />
                          <Input
                            id="lastName"
                            name="lastName"
                            placeholder="Doe"
                            className="pl-10"
                            aria-invalid={!!state?.errors?.lastName}
                          />
                          {state?.errors?.lastName && (
                            <FieldError
                              errors={[{ message: state.errors.lastName[0] }]}
                            />
                          )}
                        </div>
                      </Field>
                    </Field>
                  </div>
                )}

                {/* Recruiter specific fields */}
                {role === "RECRUITER" && (
                  <div className="animate-in fade-in slide-in-from-top-4 space-y-4 duration-300">
                    <Field data-invalid={!!state?.errors?.companyName}>
                      <FieldLabel htmlFor="companyName">
                        Company Name <span className="text-destructive">*</span>
                      </FieldLabel>
                      <div className="relative">
                        <Building className="text-muted-foreground absolute top-3 left-3 h-4 w-4" />
                        <Input
                          id="companyName"
                          name="companyName"
                          placeholder="Acme Corp"
                          className="pl-10"
                          aria-invalid={!!state?.errors?.companyName}
                        />
                        {state?.errors?.companyName && (
                          <FieldError
                            errors={[{ message: state.errors.companyName[0] }]}
                          />
                        )}
                      </div>
                    </Field>

                    <Field data-invalid={!!state?.errors?.companyWebsite}>
                      <FieldLabel htmlFor="companyWebsite">
                        Company Website (Optional)
                      </FieldLabel>
                      <div className="relative">
                        <LinkIcon className="text-muted-foreground absolute top-3 left-3 h-4 w-4" />
                        <Input
                          id="companyWebsite"
                          name="companyWebsite"
                          type="url"
                          placeholder="https://example.com"
                          className="pl-10"
                          aria-invalid={!!state?.errors?.companyWebsite}
                        />
                        {state?.errors?.companyWebsite && (
                          <FieldError
                            errors={[
                              { message: state.errors.companyWebsite[0] },
                            ]}
                          />
                        )}
                      </div>
                    </Field>
                  </div>
                )}

                <div className="pt-2">
                  <SubmitButton />
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
