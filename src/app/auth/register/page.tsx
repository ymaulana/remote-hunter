"use client";
import { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Mail, Lock, User } from "lucide-react";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/app/components/ui/field";
import { Separator } from "@/app/components/ui/separator";
import { toast } from "sonner";
import { Button } from "@/app/components/ui/button";
import { Checkbox } from "@/app/components/ui/checkbox";
import { useRouter } from "next/navigation";
import { Input } from "@/app/components/ui/input";
import Link from "next/link";

// Define the form validation schema
const registerFormSchema = z
  .object({
    fullname: z
      .string()
      .min(3, { message: "Full name must be at least 3 characters." }),
    email: z.string().email({ message: "Please enter a valid email address." }),
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters." }),
    confirmPassword: z
      .string()
      .min(6, { message: "Confirm password must be at least 6 characters." }),
    termsAndConditions: z.boolean().refine((value) => value === true, {
      message: "You must accept the terms and conditions.",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

type registerFormValues = z.infer<typeof registerFormSchema>;

const Register = () => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Initialize form
  const form = useForm<registerFormValues>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      fullname: "",
      email: "",
      password: "",
      confirmPassword: "",
      termsAndConditions: false,
    },
  });

  // Form submission handler
  const onSubmit = (data: registerFormValues) => {
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      console.log("register data:", data);
      toast.success("register successful!");
      setIsLoading(false);
      // handle authentication and redirection here using useRouter
      router.push("/jobs");
    }, 1500);
  };

  // Google login handler
  const handleGoogleLogin = () => {
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      toast.success("Google login successful!");
      setIsLoading(false);
      // handle authentication and redirection here using useRouter
      router.push("/jobs");
    }, 1500);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <main className="grow pt-24 pb-16">
        <div className="container mx-auto max-w-md px-6">
          <div className="animate-slideUp">
            <div className="mb-8 text-center">
              <h1 className="mb-2 text-2xl font-bold">Create Your Account</h1>
              <p className="text-muted-foreground">
                Join thousands of remote job seekers on RemoteHunter
              </p>
            </div>

            <div className="bg-card rounded-xl border p-6 shadow-sm md:p-8">
              {/* Google register */}
              <Button
                variant="outline"
                className="mb-6 h-11 w-full"
                onClick={handleGoogleLogin}
                disabled={isLoading}
              >
                <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                Continue with Google
              </Button>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <Separator className="w-full" />
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-card text-muted-foreground px-2 text-xs">
                    OR
                  </span>
                </div>
              </div>

              {/* Email/Password Registration Form */}
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FieldGroup>
                  <Controller
                    name="fullname"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="fullname">Full Name</FieldLabel>
                        <div className="relative">
                          <User className="text-muted-foreground absolute top-3 left-3 h-4 w-4" />
                          <Input
                            id="fullname"
                            aria-invalid={fieldState.invalid}
                            type="text"
                            placeholder="Full Name"
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

                <FieldGroup>
                  <Controller
                    name="password"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="password">Password</FieldLabel>
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
                        </div>
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
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
                        <FieldLabel htmlFor="confirmPassword">
                          Confirm Password
                        </FieldLabel>
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
                        </div>
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                </FieldGroup>

                <FieldGroup>
                  <Controller
                    name="termsAndConditions"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field
                        data-invalid={fieldState.invalid}
                        className="mt-2"
                        orientation="horizontal"
                      >
                        <Checkbox
                          id="termsAndConditions"
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          className="mt-0.5"
                        />
                        <FieldLabel
                          htmlFor="termsAndConditions"
                          className="text-muted-foreground flex cursor-pointer flex-wrap gap-1 text-[0.8rem] leading-relaxed font-normal"
                        >
                          I agree to the{" "}
                          <Link
                            href="/terms-and-conditions"
                            className="text-primary hover:text-primary/80 font-medium underline-offset-4 hover:underline"
                          >
                            Terms of Service
                          </Link>{" "}
                          and{" "}
                          <Link
                            href="/privacy-policy"
                            className="text-primary hover:text-primary/80 font-medium underline-offset-4 hover:underline"
                          >
                            Privacy Policy
                          </Link>
                        </FieldLabel>

                        {fieldState.invalid && (
                          <FieldError
                            errors={[fieldState.error]}
                            className="mt-1 ml-6"
                          />
                        )}
                      </Field>
                    )}
                  />
                </FieldGroup>
                <Button
                  type="submit"
                  className="bg-primary hover:bg-primary/80 h-11 w-full"
                  disabled={isLoading}
                >
                  {isLoading ? "Creating account..." : "Create Account"}
                </Button>
              </form>
            </div>

            <div className="mt-6 text-center">
              <p className="text-muted-foreground text-sm">
                Already have an account?{" "}
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

export default Register;
