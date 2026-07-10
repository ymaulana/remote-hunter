"use client";
import { useState, useEffect } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Lock } from "lucide-react";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { supabase } from "@/utils/supabase/client";

const updatePasswordSchema = z
  .object({
    password: z.string().min(6, { message: "Password must be at least 6 characters." }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type UpdatePasswordValues = z.infer<typeof updatePasswordSchema>;

const UpdatePassword = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error("Your session has expired. Please request a new password reset link.");
        router.push("/auth/forgot-password");
      } else {
        setIsCheckingSession(false);
      }
    };
    
    checkSession();
  }, [router]);

  const form = useForm<UpdatePasswordValues>({
    resolver: zodResolver(updatePasswordSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  const onSubmit = async (data: UpdatePasswordValues) => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: data.password,
      });

      if (error) {
        toast.error(error.message);
        setIsLoading(false);
      } else {
        toast.success("Password updated successfully!");
        router.push("/auth/login");
      }
    } catch (err) {
      toast.error("An error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  if (isCheckingSession) {
    return <div className="min-h-screen flex items-center justify-center">Verifying session...</div>;
  }

  return (
    <div className="flex min-h-screen flex-col">
      <main className="grow pt-24 pb-16">
        <div className="container mx-auto max-w-md px-6">
          <div className="animate-slideUp">
            <div className="mb-8 text-center">
              <h1 className="mb-2 text-2xl font-bold">Update Password</h1>
              <p className="text-muted-foreground">
                Enter your new password below
              </p>
            </div>

            <div className="bg-card rounded-xl border p-6 shadow-sm md:p-8">
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FieldGroup>
                  <Controller
                    name="password"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="password">New Password</FieldLabel>
                        <div className="relative">
                          <Lock className="text-muted-foreground absolute top-3 left-3 h-4 w-4" />
                          <Input
                            id="password"
                            aria-invalid={fieldState.invalid}
                            type="password"
                            placeholder="********"
                            className="pl-10"
                            {...field}
                          />
                          {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </div>
                      </Field>
                    )}
                  />
                </FieldGroup>

                <FieldGroup>
                  <Controller
                    name="confirmPassword"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="confirmPassword">Confirm Password</FieldLabel>
                        <div className="relative">
                          <Lock className="text-muted-foreground absolute top-3 left-3 h-4 w-4" />
                          <Input
                            id="confirmPassword"
                            aria-invalid={fieldState.invalid}
                            type="password"
                            placeholder="********"
                            className="pl-10"
                            {...field}
                          />
                          {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </div>
                      </Field>
                    )}
                  />
                </FieldGroup>

                <Button
                  type="submit"
                  className="bg-primary hover:bg-primary/80 h-11 w-full mt-6"
                  disabled={isLoading}
                >
                  {isLoading ? "Updating..." : "Update Password"}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default UpdatePassword;
