"use client";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search } from "lucide-react";
import { buttonVariants } from "@/app/components/ui/button";
import { usePathname } from "next/navigation";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsMounted(true);
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isActive = (path: string) => isMounted && pathname === path;

  return (
    <header
      className={cn(
        "fixed top-0 right-0 left-0 z-50 py-4 transition-all duration-300",
        isScrolled ? "glass shadow-sm" : "bg-transparent",
      )}
      suppressHydrationWarning
    >
      <div className="container mx-auto flex items-center justify-between px-6">
        {/* Logo */}
        <div className="text-foreground flex items-center gap-2">
          <Link href="/" className="group flex items-center gap-3">
            <Image
              src="/favicon.svg"
              alt="RemoteHunter Logo"
              width={20}
              height={20}
              className="h-5 w-auto"
            />
            <span className="text-foreground text-lg font-bold tracking-tight">
              RemoteHunter
            </span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav
          className="hidden items-center space-x-1 md:flex md:gap-6"
          suppressHydrationWarning
        >
          <Link
            href="/"
            className={cn("nav-link", isActive("/") && "active")}
            suppressHydrationWarning
          >
            Home
          </Link>
          <Link
            href="/jobs"
            className={cn("nav-link", isActive("/jobs") && "active")}
            suppressHydrationWarning
          >
            Jobs
          </Link>
          <Link
            href="/companies"
            className={cn("nav-link", isActive("/companies") && "active")}
            suppressHydrationWarning
          >
            Companies
          </Link>
          <Link
            href="/resources"
            className={cn("nav-link", isActive("/resources") && "active")}
            suppressHydrationWarning
          >
            Resources
          </Link>
        </nav>

        {/* Desktop Action Button */}
        <div className="hidden items-center space-x-3 md:flex">
          <Link
            href="/login"
            className={cn(
              buttonVariants({ variant: "ghost", size: "sm" }),
              "text-muted-foreground hover:text-foreground font-medium",
            )}
          >
            Log in
          </Link>
          <Link
            href="/register"
            className={cn(
              buttonVariants({ size: "sm" }),
              "bg-primary hover:bg-primary/90 rounded-full px-6 text-white shadow-md transition-all hover:shadow-lg",
            )}
          >
            Sign Up
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
