"use client";

import { motion } from "framer-motion";
import {
  Code,
  Megaphone,
  Palette,
  Headphones,
  FileText,
  BarChart3,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";

const categories = [
  {
    id: 1,
    name: "Development",
    icon: Code,
    count: 342,
    description: "Frontend, Backend, Mobile development roles",
  },
  {
    id: 2,
    name: "Marketing",
    icon: Megaphone,
    count: 186,
    description: "Digital marketing, SEO, and growth roles",
  },
  {
    id: 3,
    name: "Design",
    icon: Palette,
    count: 124,
    description: "UI/UX, Graphic design, and creative roles",
  },
  {
    id: 4,
    name: "Customer Support",
    icon: Headphones,
    count: 278,
    description: "Customer success and support roles",
  },
  {
    id: 5,
    name: "Writing",
    icon: FileText,
    count: 156,
    description: "Content writing, copywriting, and editing",
  },
  {
    id: 6,
    name: "Data & Analytics",
    icon: BarChart3,
    count: 98,
    description: "Data analysis, business intelligence roles",
  },
];

const CategorySection = () => {
  return (
    <section className="bg-muted/30 py-16 md:py-24">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center md:mb-16"
        >
          <h2 className="text-foreground mb-4 text-2xl font-bold md:text-3xl">
            Browse by Category
          </h2>
          <p className="text-muted-foreground mx-auto max-w-2xl">
            Find entry-level remote jobs in your area of expertise
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
            >
              <Link
                href={`/jobs?category=${category.name.toLowerCase()}`}
                className="bg-card hover:border-primary/50 group flex items-center gap-4 rounded-xl border p-6 transition-all hover:shadow-lg"
              >
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ duration: 0.3 }}
                  className="bg-primary/10 group-hover:bg-primary/20 flex h-14 w-14 shrink-0 items-center justify-center rounded-xl transition-colors"
                >
                  <category.icon className="text-primary h-7 w-7" />
                </motion.div>
                <div className="min-w-0 flex-1">
                  <div className="mb-1 flex items-center justify-between">
                    <h3 className="group-hover:text-primary font-semibold transition-colors">
                      {category.name}
                    </h3>
                    <ChevronRight className="text-muted-foreground group-hover:text-primary h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </div>
                  <p className="text-muted-foreground mb-1 line-clamp-1 text-sm">
                    {category.description}
                  </p>
                  <span className="text-muted-foreground text-xs">
                    {category.count} jobs available
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategorySection;
