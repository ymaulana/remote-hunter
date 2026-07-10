"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface FooterCTAProps {
  isRecruiter: boolean;
  isAuthenticated: boolean;
}

const FooterCTA = ({ isRecruiter, isAuthenticated }: FooterCTAProps) => {
  return (
    <section className="bg-background relative overflow-hidden py-20 lg:py-32">
      <div className="relative z-10 container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-primary mx-auto max-w-4xl overflow-hidden rounded-3xl px-6 py-16 sm:px-12 sm:py-20 md:px-16"
        >
          <div className="relative z-20 text-center">
            <h2 className="mb-6 text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
              {isRecruiter
                ? "Ready to find your next great hire?"
                : "Join 500+ companies hiring remote talent"}
            </h2>
            <p className="mx-auto mb-10 max-w-2xl text-lg text-white/80">
              {isRecruiter
                ? "Post your job today and get applications from qualified candidates worldwide."
                : "Create your recruiter account and start sourcing the best remote professionals instantly."}
            </p>

            <div className="flex flex-col flex-wrap justify-center gap-4 sm:flex-row">
              <Link
                href={
                  isRecruiter
                    ? "/jobs/post"
                    : isAuthenticated && !isRecruiter
                      ? "/profile"
                      : "/auth/login"
                }
              >
                <Button
                  size="lg"
                  className="text-primary h-14 w-full bg-white px-8 text-lg font-semibold hover:bg-white/90 sm:w-auto"
                >
                  {isRecruiter
                    ? "Post Your First Job"
                    : "Start Hiring For Free"}
                  <Sparkles className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              {!isRecruiter && (
                <Link href="/auth/login">
                  <Button
                    size="lg"
                    variant="outline"
                    className="h-14 w-full border-white/20 bg-transparent px-8 text-lg font-semibold text-white hover:bg-white/10 hover:text-white sm:w-auto"
                  >
                    Log in to existing account
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              )}
            </div>
          </div>

          {/* Decorative elements */}
          <div className="absolute top-0 right-0 -mt-16 -mr-16 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute bottom-0 left-0 -mb-16 -ml-16 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
        </motion.div>
      </div>
    </section>
  );
};

export default FooterCTA;
