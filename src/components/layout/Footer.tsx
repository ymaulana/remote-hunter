"use client";
import { Github, Heart, Linkedin, Twitter } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-secondary/50 border-border mt-20 border-t backdrop-blur-sm">
      <div className="container mx-auto px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4">
          <div className="space-y-4">
            <Link href="/" className="text-foreground flex items-center gap-2">
              <Image
                src="/favicon.svg"
                alt="RemoteHunter Logo"
                width={24}
                height={24}
              />
              <span className="text-xl font-semibold tracking-tight">
                RemoteHunter
              </span>
            </Link>
            <p className="text-muted-foreground">
              Find the best remote jobs for entry-level positions, all in one
              place.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-foreground text-sm font-semibold tracking-wider uppercase">
              Explore
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/jobs"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Browse Jobs
                </Link>
              </li>
              <li>
                <Link
                  href="/companies"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Companies
                </Link>
              </li>
              <li>
                <Link
                  href="/resources"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Resources
                </Link>
              </li>
              <li>
                <Link
                  href="/"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Categories
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-foreground text-sm font-semibold tracking-wider uppercase">
              Company
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  href="/"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-foreground text-sm font-semibold tracking-wider uppercase">
              Connect
            </h3>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Linkedin className="h-5 w-5" />
                <span className="sr-only">LinkedIn</span>
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Github className="h-5 w-5" />
                <span className="sr-only">GitHub</span>
              </a>
            </div>
            <p className="text-muted-foreground text-sm">
              Subscribe to our newsletter for the latest remote jobs.
            </p>
            <form className="flex gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
              />
              <button
                type="submit"
                className="bg-brand-purple hover:bg-primary/90 text-primary-foreground h-10 rounded-md px-4 py-2 transition-colors"
              >
                Join
              </button>
            </form>
          </div>
        </div>

        <div className="border-border mt-12 flex flex-col items-center justify-between border-t pt-8 md:flex-row">
          <p className="text-muted-foreground text-sm">
            {/* © <span suppressHydrationWarning>{currentYear}</span> RemoteHunter. */}
            All rights reserved.
          </p>
          <p className="text-muted-foreground mt-4 flex items-center text-sm md:mt-0">
            Made with <Heart className="mx-1 h-4 w-4 text-red-500" /> for remote
            workers
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
