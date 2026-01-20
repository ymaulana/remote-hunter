import Footer from '@/components/layout/Footer';
import Hero from '@/components/home/Hero';
import JobListings from '@/components/home/JobListings';
import CategorySection from '@/components/home/CategorySection';
import CompanySpotlight from '@/components/home/CompanySpotlight';
import { Button } from '@/components/ui/button';
import { ChevronRight, MessageSquare, Users, Briefcase } from 'lucide-react';

const Index = () => {
return (

<div className="flex min-h-screen flex-col gap-16 pb-16">

        <Hero />
        <JobListings />
        <CategorySection />
        <CompanySpotlight />

        {/* Testimonials section */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-6">
            <div className="text-center mb-12 md:mb-16">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4 appear-up" style={{ '--index': '1' } as React.CSSProperties}>
                What Job Seekers Say
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto appear-up" style={{ '--index': '2' } as React.CSSProperties}>
                Real stories from people who found their remote entry-level jobs through our platform
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              <div className="bg-card rounded-xl border border-border p-6 md:p-8 relative appear-up" style={{ '--index': '3' } as React.CSSProperties}>
                <MessageSquare className="w-12 h-12 text-brand-purple/10 absolute top-6 right-6" />
                <p className="text-foreground mb-6 relative z-10">
                  "After struggling to find entry-level positions that didn't require years of experience, RemoteNest was a game-changer. I found and landed a remote developer role within 3 weeks!"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                    <Users className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div>
                    <h4 className="font-medium">Alex Rivera</h4>
                    <p className="text-sm text-muted-foreground">Junior Web Developer</p>
                  </div>
                </div>
              </div>

              <div className="bg-card rounded-xl border border-border p-6 md:p-8 relative appear-up" style={{ '--index': '4' } as React.CSSProperties}>
                <MessageSquare className="w-12 h-12 text-brand-purple/10 absolute top-6 right-6" />
                <p className="text-foreground mb-6 relative z-10">
                  "The resources section helped me prepare for remote interviews and improve my portfolio. The job listings were current and relevant to my skill level. Highly recommend!"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                    <Users className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div>
                    <h4 className="font-medium">Jordan Taylor</h4>
                    <p className="text-sm text-muted-foreground">Marketing Coordinator</p>
                  </div>
                </div>
              </div>

              <div className="bg-card rounded-xl border border-border p-6 md:p-8 relative appear-up" style={{ '--index': '5' } as React.CSSProperties}>
                <MessageSquare className="w-12 h-12 text-brand-purple/10 absolute top-6 right-6" />
                <p className="text-foreground mb-6 relative z-10">
                  "As someone looking for my first job after college, I was intimidated by remote work. The company profiles and detailed job descriptions made it easy to find positions that matched my experience level."
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                    <Users className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div>
                    <h4 className="font-medium">Casey Wilson</h4>
                    <p className="text-sm text-muted-foreground">Customer Support Specialist</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA section */}
        <section className="py-12 md:py-16 bg-muted/30">
          <div className="container mx-auto px-6">
            <div className="bg-card rounded-xl border border-border overflow-hidden appear-up" style={{ '--index': '6' } as React.CSSProperties}>
              <div className="grid grid-cols-1 md:grid-cols-2">
                <div className="p-8 md:p-10 lg:p-12">
                  <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                    Ready to Start Your Remote Career?
                  </h2>
                  <p className="text-muted-foreground mb-6 md:mb-8">
                    Join thousands of job seekers who found their perfect entry-level remote positions through RemoteNest. New opportunities are added daily.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button className="bg-brand-purple hover:bg-brand-dark text-white">
                      Browse Jobs
                    </Button>
                    <Button variant="outline" className="gap-1">
                      Create Account <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="bg-muted hidden md:flex items-center justify-center p-10">
                  <div className="relative w-full max-w-xs">
                    <div className="w-28 h-28 rounded-lg bg-brand-purple/10 flex items-center justify-center absolute -top-4 -left-4 animate-float" style={{ animationDelay: '0.2s' }}>
                      <Briefcase className="w-12 h-12 text-brand-purple/50" />
                    </div>
                    <div className="w-36 h-36 rounded-lg bg-brand-light/10 flex items-center justify-center absolute bottom-4 right-0 animate-float" style={{ animationDelay: '0.5s' }}>
                      <Briefcase className="w-16 h-16 text-brand-light/50" />
                    </div>
                    <div className="w-20 h-20 rounded-lg bg-brand-dark/10 flex items-center justify-center absolute bottom-12 -left-8 animate-float" style={{ animationDelay: '0.8s' }}>
                      <Briefcase className="w-8 h-8 text-brand-dark/50" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
    </div>

);
};

export default Index;
