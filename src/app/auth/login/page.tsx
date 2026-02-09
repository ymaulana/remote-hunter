"use client";
import { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Mail, Lock } from "lucide-react";
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
const loginFormSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters." }),
  rememberMe: z.boolean().optional(),
});

type LoginFormValues = z.infer<typeof loginFormSchema>;

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);

  // Initialize form
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  // Form submission handler
  const onSubmit = (data: LoginFormValues) => {
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      console.log("Login data:", data);
      toast.success("Login successful!");
      setIsLoading(false);
      // handle authentication and redirection here using useRouter
      const router = useRouter();
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
      const router = useRouter();
      router.push("/jobs");
    }, 1500);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <main className="grow pt-24 pb-16">
        <div className="container mx-auto max-w-md px-6">
          <div className="animate-slideUp">
            <div className="mb-8 text-center">
              <h1 className="mb-2 text-2xl font-bold">Welcome Back</h1>
              <p className="text-muted-foreground">
                Log in to access your account and job applications
              </p>
            </div>

            <div className="bg-card rounded-xl border p-6 shadow-sm md:p-8">
              {/* Google Login */}
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

              {/* Email/Password Login Form */}
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

                <FieldGroup className="flex flex-row items-center justify-between">
                  <Controller
                    name="rememberMe"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field
                        data-invalid={fieldState.invalid}
                        className="flex-1"
                      >
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="rememberMe"
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                          <FieldLabel
                            htmlFor="rememberMe"
                            className="text-muted-foreground cursor-pointer text-sm"
                          >
                            Remember me
                          </FieldLabel>
                          {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </div>
                      </Field>
                    )}
                  />
                  <Link
                    href="/auth/forgot-password"
                    className="text-primary hover:text-primary/80 text-sm"
                  >
                    Forgot password?
                  </Link>
                </FieldGroup>
                <Button
                  type="submit"
                  className="bg-primary hover:bg-primary/80 h-11 w-full"
                  disabled={isLoading}
                >
                  {isLoading ? "Logging in..." : "Log in"}
                </Button>
              </form>
            </div>

            <div className="mt-6 text-center">
              <p className="text-muted-foreground text-sm">
                Don't have an account?{" "}
                <Link
                  href="/register"
                  className="text-primary hover:text-primary/80 font-medium"
                >
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Login;
