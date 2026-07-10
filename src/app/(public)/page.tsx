"use client";

import { motion } from "framer-motion";
import Hero from "../../components/home/Hero";
import JobListings from "../../components/home/JobListings";
import CategorySection from "../../components/home/CategorySection";
import CompanySpotlight from "../../components/home/CompanySpotlight";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/utils/utils";
import { ChevronRight, MessageSquare, Users, Briefcase } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <>
      <Hero />
      <JobListings />
      <CategorySection />
      <CompanySpotlight />

      {/* Testimonials section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-12 text-center md:mb-16"
          >
            <h2 className="text-foreground mb-4 text-2xl font-bold md:text-3xl">
              What Job Seekers Say
            </h2>
            <p className="text-muted-foreground mx-auto max-w-2xl">
              Real stories from people who found their remote entry-level jobs
              through our platform
            </p>
          </motion.div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-8">
            {[
              {
                quote:
                  "After struggling to find entry-level positions that didn't require years of experience, RemoteHunter was a game-changer. I found and landed a remote developer role within 3 weeks!",
                name: "Alex Rivera",
                role: "Junior Web Developer",
              },
              {
                quote:
                  "The resources section helped me prepare for remote interviews and improve my portfolio. The job listings were current and relevant to my skill level. Highly recommend!",
                name: "Jordan Taylor",
                role: "Marketing Coordinator",
              },
              {
                quote:
                  "As someone looking for my first job after college, I was intimidated by remote work. The company profiles and detailed job descriptions made it easy to find positions that matched my experience level.",
                name: "Casey Wilson",
                role: "Customer Support Specialist",
              },
            ].map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="bg-card relative rounded-xl border p-6 md:p-8"
              >
                <MessageSquare className="text-primary/10 absolute top-6 right-6 h-12 w-12" />
                <p className="text-foreground relative z-10 mb-6">
                  &quot;{testimonial.quote}&quot;
                </p>
                <div className="flex items-center gap-3">
                  <div className="bg-secondary flex h-10 w-10 items-center justify-center rounded-full">
                    <Users className="text-muted-foreground h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-medium">{testimonial.name}</h4>
                    <p className="text-muted-foreground text-sm">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA section */}
      <section className="bg-muted/30 py-12 md:py-16">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-card relative overflow-hidden rounded-xl border"
          >
            {/* Ambient Background Animation */}
            <div className="absolute inset-0 z-0 overflow-hidden">
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 90, 0],
                  opacity: [0.5, 0.8, 0.5],
                }}
                transition={{
                  duration: 15,
                  repeat: Infinity,
                  ease: "linear",
                }}
                className="bg-primary/30 absolute -top-1/2 -left-1/2 h-full w-full rounded-full blur-[100px]"
              />
              <motion.div
                animate={{
                  scale: [1, 1.3, 1],
                  rotate: [0, -60, 0],
                  opacity: [0.4, 0.7, 0.4],
                }}
                transition={{
                  duration: 18,
                  repeat: Infinity,
                  ease: "linear",
                  delay: 2,
                }}
                className="bg-secondary/30 absolute -right-1/2 -bottom-1/2 h-full w-full rounded-full blur-[100px]"
              />
              <motion.div
                animate={{
                  x: ["0%", "20%", "0%"],
                  y: ["0%", "-20%", "0%"],
                  opacity: [0.2, 0.5, 0.2],
                }}
                transition={{
                  duration: 20,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="bg-primary/20 absolute top-1/2 left-1/2 h-[120%] w-[120%] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[120px]"
              />
            </div>

            <div className="relative z-10 grid grid-cols-1 md:grid-cols-1">
              <div className="flex flex-col items-center justify-center p-8 text-center md:p-14 lg:p-20">
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="text-foreground mb-6 max-w-2xl text-2xl font-bold md:text-3xl lg:text-4xl"
                >
                  Ready to Start Your Remote Career?
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="text-muted-foreground mb-8 max-w-xl text-lg"
                >
                  Join thousands of job seekers who found their perfect
                  entry-level remote positions through RemoteHunter. New
                  opportunities are added daily.
                </motion.p>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="flex flex-col gap-4 sm:flex-row"
                >
                  <Link
                    href="/jobs"
                    className={cn(
                      buttonVariants({ size: "lg" }),
                      "bg-primary hover:bg-primary/90 px-8 text-white",
                    )}
                  >
                    Browse Jobs
                  </Link>
                  <Link
                    href="/auth/signup"
                    className={cn(
                      buttonVariants({ variant: "outline", size: "lg" }),
                      "gap-2 px-8",
                    )}
                  >
                    Create Account <ChevronRight className="h-4 w-4" />
                  </Link>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
