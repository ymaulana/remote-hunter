"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  Search,
  Users,
  ShieldCheck,
  Building2,
} from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/utils/utils";
import Link from "next/link";
import { useEffect, useState } from "react";

interface HeroProps {
  isRecruiter: boolean;
  isAuthenticated: boolean;
}

const Hero = ({ isRecruiter, isAuthenticated }: HeroProps) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <section className="relative overflow-hidden pt-36 pb-24 md:pt-42 md:pb-32">
      {/* Background gradients */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="bg-gradient-radial from-primary/10 via-primary/5 absolute inset-0 -z-10 to-transparent"
      />

      {/* Animated blurry blobs */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="bg-primary/20 absolute top-1/4 -left-32 -z-10 h-96 w-96 rounded-full blur-[100px]"
      />
      <motion.div
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
        className="absolute -right-32 bottom-1/4 -z-10 h-96 w-96 rounded-full bg-blue-500/15 blur-[100px]"
      />

      <div className="relative container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mx-auto max-w-4xl space-y-8 text-center"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="border-primary/20 bg-primary/10 text-primary mb-6 inline-flex items-center rounded-full border px-4 py-1.5 text-sm font-medium"
          >
            <ShieldCheck className="mr-2 h-4 w-4" />
            Trusted by 500+ Remote Teams
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="text-foreground mx-auto max-w-5xl text-5xl leading-[1.1] font-bold tracking-tight md:text-7xl lg:text-8xl"
          >
            Hire the <br />
            <span className="text-primary relative inline-block">
              Best Remote
              <span className="bg-primary/20 absolute bottom-2 left-0 -z-10 h-3 w-full -rotate-1 skew-x-12 transform" />
            </span>{" "}
            Professionals
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-muted-foreground mx-auto max-w-2xl text-lg md:text-xl"
          >
            {isRecruiter
              ? "Access pre-vetted remote talent and manage your hiring pipeline efficiently all in one place."
              : "Post your job today and connect with thousands of active job seekers looking for their next remote opportunity."}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <Link
              href={
                isRecruiter
                  ? "/jobs/post"
                  : isAuthenticated && !isRecruiter
                    ? "/profile"
                    : "/auth/login"
              }
              className={cn(
                buttonVariants({ size: "lg" }),
                "bg-primary hover:bg-primary/90 w-full px-8 py-6 text-lg text-white sm:w-auto",
              )}
            >
              {isRecruiter
                ? "Post a New Job"
                : isAuthenticated && !isRecruiter
                  ? "Switch to Recruiter"
                  : "Start Hiring Today"}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            {!isRecruiter && (
              <Link
                href="/candidates" // placeholder for browsing talent later
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "w-full px-8 py-6 text-lg sm:w-auto",
                )}
              >
                Browse Candidates <Search className="ml-2 h-5 w-5" />
              </Link>
            )}
          </motion.div>

          {/* Quick stats bottom hero */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="mt-12 flex flex-wrap justify-center gap-4 md:gap-12"
          >
            <div className="flex flex-col items-center gap-1">
              <span className="text-foreground text-3xl font-bold">15k+</span>
              <span className="text-muted-foreground flex items-center text-sm">
                <Users className="mr-1.5 h-4 w-4" /> Active Candidates
              </span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <span className="text-foreground text-3xl font-bold">98%</span>
              <span className="text-muted-foreground flex items-center text-sm">
                <ShieldCheck className="mr-1.5 h-4 w-4" /> Successful Hires
              </span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <span className="text-foreground text-3xl font-bold">500+</span>
              <span className="text-muted-foreground flex items-center text-sm">
                <Building2 className="mr-1.5 h-4 w-4" /> Hiring Companies
              </span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
