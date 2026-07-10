"use client";
import { useEffect, useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Mail } from "lucide-react";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { supabase } from "@/utils/supabase/client";
import { checkEmailExists } from "./actions";
import { useRouter } from "next/navigation";

const forgotPasswordSchema = z.object({
  email: z.email({ message: "Please enter a valid email address." }),
});

type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;

const ForgotPassword = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isAccountNotFound, setIsAccountNotFound] = useState(false);
  const [countDown, setCountDown] = useState<number>(5);

  const router = useRouter();

  useEffect(() => {
    if (isSuccess && countDown > 0) {
      const timer = setTimeout(() => {
        setCountDown((c) => c - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
    if (countDown === 0) {
      router.push("/auth/login");
    }
  }, [isSuccess, countDown, router]);

  const form = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = async (data: ForgotPasswordValues) => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      const check = await checkEmailExists(data.email);
      if (check?.error) {
        toast.error("No account found with this email.");
        setIsAccountNotFound(true);
        setIsLoading(false);
        return;
      }

      const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
        redirectTo: `${window.location.origin}/auth/callback?next=/auth/update-password`,
      });

      if (error) {
        toast.error(error.message);
      } else {
        setIsSuccess(true);
        toast.success("Password reset link sent to your email!");
      }
    } catch (err) {
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <main className="grow pt-24 pb-16">
        <div className="container mx-auto max-w-md px-6">
          <div className="animate-slideUp">
            <div className="mb-8 text-center">
              <h1 className="mb-2 text-2xl font-bold">Reset Password</h1>
              <p className="text-muted-foreground">
                Enter your email and we&apos;ll send you a link to reset your
                password
              </p>
            </div>

            <div className="bg-card rounded-xl border p-6 shadow-sm md:p-8">
              {isSuccess ? (
                <div className="space-y-4 text-center">
                  <div className="rounded-lg bg-green-100 p-4 text-green-800">
                    Check your email for a link to reset your password. If it
                    doesn&apos;t appear within a few minutes, check your spam
                    folder.
                  </div>
                  {/* redirect to login automatically after 5 seconds*/}
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => setIsSuccess(false)}
                  >
                    Redirect to Login in {`${countDown} seconds`}
                  </Button>
                </div>
              ) : (
                <>
                  {isAccountNotFound && (
                    <div className="rounded-lg bg-red-100 p-4 text-red-800">
                      No account found with this email. Please check your email
                      address or{" "}
                      <Link
                        href="/auth/register"
                        className="text-primary hover:text-primary/80 font-medium"
                      >
                        register an account
                      </Link>
                    </div>
                  )}
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-4"
                  >
                    <FieldGroup>
                      <Controller
                        name="email"
                        control={form.control}
                        render={({ field, fieldState }) => (
                          <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor="email">Email</FieldLabel>
                            <div className="relative">
                              <Mail className="text-muted-foreground absolute top-3 left-3 h-4 w-4" />
                              <Input
                                id="email"
                                aria-invalid={fieldState.invalid}
                                type="email"
                                placeholder="name@example.com"
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
                      className="bg-primary hover:bg-primary/80 h-11 w-full"
                      disabled={isLoading}
                    >
                      {isLoading ? "Sending link..." : "Send Reset Link"}
                    </Button>
                  </form>
                </>
              )}
            </div>

            <div className="mt-6 text-center">
              <p className="text-muted-foreground text-sm">
                Remember your password?{" "}
                <Link
                  href="/auth/login"
                  className="text-primary hover:text-primary/80 font-medium"
                >
                  Log in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ForgotPassword;
