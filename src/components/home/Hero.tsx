"use client";

import { motion } from "framer-motion";
import { ChevronRight, Briefcase, Globe, Users } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/utils/utils";
import Link from "next/link";

const Hero = () => {
  return (
    <section className="relative overflow-hidden pt-36 pb-24 md:pt-42 md:pb-32">
      {/* Background gradient with Framer Motion */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="bg-gradient-radial from-primary/10 via-primary/5 absolute inset-0 -z-10 to-transparent"
      />

      {/* Animated background elements */}
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
        className="bg-primary/20 absolute top-1/4 left-1/4 -z-10 h-64 w-64 rounded-full blur-3xl"
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
        className="bg-primary/15 absolute right-1/3 bottom-1/3 -z-10 h-96 w-96 rounded-full blur-3xl"
      />

      <div className="relative container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mx-auto max-w-3xl space-y-6 text-center"
        >
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="text-foreground mx-auto mb-8 max-w-4xl text-5xl leading-[1.1] font-bold tracking-tight md:text-7xl lg:text-8xl"
          >
            Find your dream <br />
            <span className="text-primary relative inline-block">
              remote job
              <span className="bg-primary/10 absolute bottom-2 left-0 -z-10 h-3 w-full -rotate-1 skew-x-12 transform" />
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-muted-foreground mx-auto max-w-2xl text-lg md:text-xl"
          >
            Discover entry-level remote opportunities from leading companies
            worldwide, all in one place.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-8 md:mt-10"
          >
            <Link
              href="/jobs"
              className={cn(
                buttonVariants({ size: "lg" }),
                "bg-primary hover:bg-primary/90 px-8 py-6 text-lg text-white",
              )}
            >
              Browse Jobs <ChevronRight className="ml-2 h-5 w-5" />
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="text-muted-foreground mt-6 flex flex-wrap justify-center gap-3 text-sm md:gap-6"
          >
            <span className="flex items-center">
              <Briefcase className="mr-1.5 h-4 w-4" />
              <span className="font-medium">1,200+ Jobs</span>
            </span>
            <span className="flex items-center">
              <Globe className="mr-1.5 h-4 w-4" />
              <span className="font-medium">100% Remote</span>
            </span>
            <span className="flex items-center">
              <Users className="mr-1.5 h-4 w-4" />
              <span className="font-medium">Entry-Level Friendly</span>
            </span>
          </motion.div>
        </motion.div>

        <div className="mx-auto mt-12 grid max-w-4xl grid-cols-1 gap-6 md:mt-16 md:grid-cols-3">
          {[
            {
              icon: Briefcase,
              title: "Latest Remote Jobs",
              description:
                "Curated entry-level positions updated daily from top companies.",
              link: "/jobs",
              linkText: "Browse Jobs",
            },
            {
              icon: Users,
              title: "Remote Companies",
              description:
                "Discover companies with strong remote cultures and opportunities.",
              link: "#",
              linkText: "View Companies",
            },
            {
              icon: Globe,
              title: "Career Resources",
              description:
                "Guides and tips to help you succeed in your remote career.",
              link: "#",
              linkText: "Access Resources",
            },
          ].map((card, index) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1 + index * 0.15 }}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              className="glass-card bg-card/50 rounded-xl border p-6 backdrop-blur-sm"
            >
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ duration: 0.3 }}
                className="bg-primary/10 mb-4 flex h-12 w-12 items-center justify-center rounded-full"
              >
                <card.icon className="text-primary h-6 w-6" />
              </motion.div>
              <h3 className="mb-2 text-lg font-medium">{card.title}</h3>
              <p className="text-muted-foreground mb-4 text-sm">
                {card.description}
              </p>
              <Link
                href={card.link}
                className={cn(
                  buttonVariants({ variant: "link" }),
                  "text-primary flex h-auto items-center gap-1 p-0 transition-all hover:gap-2",
                )}
              >
                {card.linkText} <ChevronRight className="h-4 w-4" />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;
