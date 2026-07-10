"use client";

import { motion } from "framer-motion";
import { Globe2, Layers, SearchCheck, Zap } from "lucide-react";
import { cn } from "@/utils/utils";

const features = [
  {
    title: "Access Global Talent",
    description:
      "Connect with skilled professionals from around the world. No borders, just pure talent.",
    icon: Globe2,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
  },
  {
    title: "Streamlined Hiring",
    description:
      "Manage applications, review resumes, and track candidate progress all in one dashboard.",
    icon: Zap,
    color: "text-amber-500",
    bg: "bg-amber-500/10",
  },
  {
    title: "Cost-Effective Sourcing",
    description:
      "Reduce hiring costs significantly compared to traditional recruiting agencies.",
    icon: Layers,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
  },
  {
    title: "High-Quality Matches",
    description:
      "Our platform ensures you meet candidates who align perfectly with your requirements.",
    icon: SearchCheck,
    color: "text-purple-500",
    bg: "bg-purple-500/10",
  },
];

const FeaturesSection = () => {
  return (
    <section id="features" className="bg-background relative py-20 lg:py-32">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto mb-16 max-w-2xl text-center"
        >
          <h2 className="text-foreground text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            Why recruit with RemoteHunter?
          </h2>
          <p className="text-muted-foreground mt-4 text-lg">
            Built specifically for remote-first companies to scale their
            engineering and operational teams efficiently.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -8, transition: { duration: 0.2 } }}
              className="bg-card group rounded-2xl border p-8 shadow-sm transition-all hover:shadow-md"
            >
              <div
                className={cn(
                  "mb-6 inline-flex h-14 w-14 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110",
                  feature.bg,
                )}
              >
                <feature.icon className={cn("h-7 w-7", feature.color)} />
              </div>
              <h3 className="text-foreground mb-3 text-xl font-semibold">
                {feature.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
