"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";

const plans = [
  {
    name: "Pay As You Go",
    price: "$49",
    period: "/post",
    description: "Perfect for companies hiring occasionally.",
    features: [
      "1 Job Posting for 30 days",
      "Unlimited candidate applications",
      "Basic company profile",
      "Standard applicant tracking",
      "Email alerts",
    ],
    buttonText: "Post a Job Now",
    primary: false,
  },
  {
    name: "Growth Plan",
    price: "$149",
    period: "/month",
    description: "For teams actively scaling their remote workforce.",
    features: [
      "Up to 5 active job postings",
      "Featured job placement (top of list)",
      "Premium company profile",
      "Advanced applicant tracking",
      "Priority customer support",
      "Auto-refresh listings every 10 days",
    ],
    buttonText: "Subscribe Now",
    primary: true,
  },
];

const PricingSection = () => {
  return (
    <section className="bg-muted/30 relative py-20 lg:py-32">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto mb-16 max-w-2xl text-center"
        >
          <h2 className="text-foreground text-3xl font-bold tracking-tight sm:text-4xl">
            Simple, transparent pricing
          </h2>
          <p className="text-muted-foreground mt-4 text-lg">
            No hidden fees. Pay only for what you need.
          </p>
        </motion.div>

        <div className="mx-auto max-w-5xl">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:gap-12">
            {plans.map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`relative flex flex-col rounded-3xl border p-8 shadow-sm sm:p-10 ${
                  plan.primary 
                    ? "border-primary bg-primary/5 shadow-primary/20" 
                    : "bg-card border-border"
                }`}
              >
                {plan.primary && (
                  <div className="absolute top-0 right-8 -translate-y-1/2 rounded-full bg-primary px-4 py-1 text-sm font-semibold text-white shadow-sm">
                    Most Popular
                  </div>
                )}
                
                <h3 className="text-foreground mb-4 text-2xl font-bold">{plan.name}</h3>
                <p className="text-muted-foreground mb-6 text-sm">
                  {plan.description}
                </p>
                <div className="mb-8 flex items-baseline gap-2">
                  <span className="text-foreground text-5xl font-extrabold tracking-tight">
                    {plan.price}
                  </span>
                  <span className="text-muted-foreground font-semibold">{plan.period}</span>
                </div>
                
                <Button 
                  size="lg" 
                  variant={plan.primary ? "default" : "outline"} 
                  className={`mb-8 w-full ${plan.primary ? "bg-primary text-white" : ""}`}
                >
                  {plan.buttonText}
                </Button>
                
                <ul className="space-y-4 flex-1">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start">
                      <Check className="text-primary mr-3 h-5 w-5 shrink-0" />
                      <span className="text-foreground text-sm leading-tight">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
