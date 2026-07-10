import { Building2, MapPin, Users, ChevronRight } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/utils/utils";

const companies = [
  {
    id: 1,
    name: "TechStart Inc",
    industry: "Technology",
    location: "San Francisco, CA",
    employees: "50-200",
    openPositions: 8,
    description:
      "Building the future of remote collaboration tools for distributed teams.",
    remote: "Fully Remote",
  },
  {
    id: 2,
    name: "CloudBase",
    industry: "SaaS",
    location: "New York, NY",
    employees: "200-500",
    openPositions: 12,
    description:
      "Cloud infrastructure made simple for startups and enterprises.",
    remote: "Remote First",
  },
  {
    id: 3,
    name: "ContentFlow",
    industry: "Media & Content",
    location: "Austin, TX",
    employees: "10-50",
    openPositions: 5,
    description: "Empowering content creators with AI-powered workflow tools.",
    remote: "Fully Remote",
  },
  {
    id: 4,
    name: "DataDriven Co",
    industry: "Analytics",
    location: "London, UK",
    employees: "100-200",
    openPositions: 6,
    description:
      "Making data analytics accessible for businesses of all sizes.",
    remote: "Hybrid Remote",
  },
];

const CompanySpotlight = () => {
  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-6">
        <div className="mb-12 flex flex-col items-start justify-between gap-4 md:mb-16 md:flex-row md:items-center">
          <div>
            <h2
              className="appear-up text-foreground mb-4 text-2xl font-bold md:text-3xl"
              style={{ "--index": "1" } as React.CSSProperties}
            >
              Featured Remote Companies
            </h2>
            <p
              className="appear-up text-muted-foreground max-w-2xl"
              style={{ "--index": "2" } as React.CSSProperties}
            >
              Companies with strong remote-first cultures hiring entry-level
              talent
            </p>
          </div>
          <Link
            href="/companies"
            className={cn(
              buttonVariants({ variant: "outline" }),
              "appear-up gap-1",
            )}
            style={{ "--index": "2" } as React.CSSProperties}
          >
            View All Companies <ChevronRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {companies.map((company, index) => (
            <div
              key={company.id}
              className="appear-up bg-card hover:border-primary/50 group cursor-pointer rounded-xl border p-6 transition-all hover:shadow-lg"
              style={{ "--index": String(index + 3) } as React.CSSProperties}
            >
              <div className="mb-4 flex items-start gap-4">
                <div className="bg-secondary flex h-16 w-16 shrink-0 items-center justify-center rounded-xl">
                  <Building2 className="text-muted-foreground h-8 w-8" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="mb-1 flex items-center justify-between">
                    <h3 className="group-hover:text-primary text-lg font-semibold transition-colors">
                      {company.name}
                    </h3>
                    <span className="bg-primary/10 text-primary shrink-0 rounded-full px-2.5 py-1 text-xs font-medium">
                      {company.remote}
                    </span>
                  </div>
                  <p className="text-muted-foreground text-sm">
                    {company.industry}
                  </p>
                </div>
              </div>

              <p className="text-muted-foreground mb-4 line-clamp-2 text-sm">
                {company.description}
              </p>

              <div className="text-muted-foreground mb-4 flex flex-wrap gap-4 text-sm">
                <span className="flex items-center gap-1.5">
                  <MapPin className="h-4 w-4" />
                  {company.location}
                </span>
                <span className="flex items-center gap-1.5">
                  <Users className="h-4 w-4" />
                  {company.employees} employees
                </span>
              </div>

              <div className="border-border flex items-center justify-between border-t pt-4">
                <span className="text-primary text-sm font-medium">
                  {company.openPositions} open positions
                </span>
                <Button
                  variant="link"
                  className="text-primary h-auto gap-1 p-0 transition-all hover:gap-2"
                >
                  View Jobs <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CompanySpotlight;
