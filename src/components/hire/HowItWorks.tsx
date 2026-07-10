"use client";

import { motion } from "framer-motion";
import { CopyPlus, FileSearch, Handshake } from "lucide-react";

const steps = [
  {
    title: "Post a Job",
    description:
      "Create a detailed job listing highlighting your company culture, requirements, and benefits.",
    icon: CopyPlus,
    color: "bg-primary text-primary-foreground",
  },
  {
    title: "Review Applications",
    description:
      "Easily filter through candidate profiles, resumes, and portfolios all from your dashboard.",
    icon: FileSearch,
    color: "bg-blue-500 text-white",
  },
  {
    title: "Connect & Hire",
    description:
      "Schedule interviews with top matches and welcome your new remote team member aboard.",
    icon: Handshake,
    color: "bg-emerald-500 text-white",
  },
];

const HowItWorks = () => {
  return (
    <section
      id="how-it-works"
      className="bg-muted/30 relative overflow-hidden py-20 lg:py-32"
    >
      <div className="relative z-10 container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto mb-20 max-w-2xl text-center"
        >
          <h2 className="text-foreground text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            How remote hiring works
          </h2>
          <p className="text-muted-foreground mt-4 text-lg">
            A simple, intuitive, and effective process from posting to
            onboarding.
          </p>
        </motion.div>

        <div className="relative mx-auto max-w-5xl">
          {/* Connector Line (Desktop) */}
          <div className="border-primary/20 absolute top-12 left-0 hidden w-full border-t-2 border-dashed md:block" />

          <div className="grid grid-cols-1 gap-12 md:grid-cols-3 md:gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="relative flex flex-col items-center text-center"
              >
                <div
                  className={`ring-background mb-6 flex h-24 w-24 items-center justify-center rounded-2xl shadow-lg ring-8 ${step.color}`}
                >
                  <step.icon className="h-10 w-10" />
                </div>
                <div className="bg-primary/10 text-primary mb-2 inline-flex items-center justify-center rounded-full px-3 py-1 text-xs font-bold">
                  STEP {index + 1}
                </div>
                <h3 className="text-foreground mb-3 text-2xl font-bold">
                  {step.title}
                </h3>
                <p className="text-muted-foreground px-4 leading-relaxed">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
