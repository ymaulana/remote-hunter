"use client";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search } from "lucide-react";
import { Button } from "@/app/components/ui/button";
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
        <nav className="hidden items-center space-x-1 md:flex md:gap-6">
          <Link href="/" className={cn("nav-link", isActive("/") && "active")}>
            Home
          </Link>
          <Link
            href="/jobs"
            className={cn("nav-link", isActive("/jobs") && "active")}
          >
            Jobs
          </Link>
          <Link
            href="/companies"
            className={cn("nav-link", isActive("/companies") && "active")}
          >
            Companies
          </Link>
          <Link
            href="/resources"
            className={cn("nav-link", isActive("/resources") && "active")}
          >
            Resources
          </Link>
        </nav>

        {/* Desktop Action Button */}
        <div className="hidden items-center space-x-3 md:flex">
          <Link href="/login">
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-foreground font-medium"
            >
              Log in
            </Button>
          </Link>
          <Link href="/register">
            <Button
              type="button"
              size="sm"
              className="bg-primary hover:bg-primary/90 rounded-full px-6 text-white shadow-md transition-all hover:shadow-lg"
            >
              Sign Up
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
