"use client";

import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import { ReactElement } from "react";

const testimonials = [
  {
    quote:
      "RemoteHunter fundamentally changed how we build our engineering team. We hired three senior developers in under a month.",
    author: "Sarah Jenkins",
    role: "VP of Engineering at CloudScale",
    avatar: "S",
    bg: "bg-blue-500",
  },
  {
    quote:
      "The quality of candidates is unmatched. Unlike other platforms, we don't have to sift through hundreds of unqualified resumes.",
    author: "Michael Chang",
    role: "Founder & CEO at Innovate.io",
    avatar: "M",
    bg: "bg-emerald-500",
  },
  {
    quote:
      "As a fully remote company, finding talent that understands remote culture is hard. RemoteHunter makes it incredibly easy.",
    author: "Elena Rodriguez",
    role: "Head of Talent at RemoteFirst",
    avatar: "E",
    bg: "bg-purple-500",
  },
];

const TestimonialsSection = () => {
  return (
    <section
      id="testimonials"
      className="bg-background relative py-20 lg:py-32"
    >
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto mb-16 max-w-2xl text-center"
        >
          <h2 className="text-foreground text-3xl font-bold tracking-tight sm:text-4xl">
            Trusted by top remote teams
          </h2>
          <p className="text-muted-foreground mt-4 text-lg">
            Don't just take our word for it. Here's what engineering leaders and
            founders are saying.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.author}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
            >
              <div className="bg-card flex h-full flex-col justify-between rounded-2xl border p-8 shadow-sm">
                <div>
                  <Quote className="text-primary/20 mb-6 h-10 w-10" />
                  <p className="text-foreground mb-8 text-lg leading-relaxed">
                    "{testimonial.quote}"
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-full text-lg font-bold text-white ${testimonial.bg}`}
                  >
                    {testimonial.avatar}
                  </div>
                  <div>
                    <h4 className="text-foreground font-semibold">
                      {testimonial.author}
                    </h4>
                    <p className="text-muted-foreground text-sm">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
