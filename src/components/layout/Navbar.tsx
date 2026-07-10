"use client";
import { cn } from "@/utils/utils";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button, buttonVariants } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import { useAuth } from "@/components/providers/AuthProvider";
import { toast } from "sonner";

type NavbarVariant = "default" | "hire" | "auth" | "profile";

interface NavbarProps {
  variant?: NavbarVariant;
}

const STYLES = {
  primaryButton: cn(
    buttonVariants({ size: "sm" }),
    "bg-primary hover:bg-primary/90 rounded-full px-6 text-white shadow-md transition-all hover:shadow-lg",
  ),
  ghostButton: cn(
    buttonVariants({ variant: "ghost", size: "sm" }),
    "text-muted-foreground hover:text-foreground font-medium",
  ),
};

const VARIANT_CONFIGS: Record<
  NavbarVariant,
  { menuItems: { href: string; label: string }[]; showAuthButtons: boolean }
> = {
  default: {
    menuItems: [
      { href: "/", label: "Home" },
      { href: "/jobs", label: "Jobs" },
      { href: "/companies", label: "Companies" },
      { href: "/resources", label: "Resources" },
    ],
    showAuthButtons: true,
  },
  hire: {
    menuItems: [
      { href: "/hire#features", label: "Features" },
      { href: "/hire#how-it-works", label: "How it Works" },
      { href: "/hire#testimonials", label: "Success Stories" },
    ],
    showAuthButtons: true,
  },
  profile: {
    menuItems: [],
    showAuthButtons: true,
  },
  auth: {
    menuItems: [],
    showAuthButtons: false,
  },
};

const Navbar = ({ variant }: NavbarProps) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const pathname = usePathname();
  const { user, supabase } = useAuth();

  const isRecruiter = user?.user_metadata?.role === "RECRUITER";

  const resolvedVariant: NavbarVariant =
    variant ??
    (pathname?.startsWith("/auth")
      ? "auth"
      : pathname?.startsWith("/hire")
        ? "hire"
        : pathname?.startsWith("/profile")
          ? "profile"
          : "default");

  const config = VARIANT_CONFIGS[resolvedVariant];

  const userDisplayName =
    user?.user_metadata?.fullname ||
    user?.user_metadata?.firstName ||
    user?.email ||
    "Profile";

  useEffect(() => {
    setIsMounted(true);
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isActive = (path: string) => pathname === path;

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string,
  ) => {
    if (href.includes("#")) {
      const [path, hash] = href.split("#");
      if (!path || path === pathname) {
        e.preventDefault();
        const element = document.getElementById(hash);
        if (element) {
          element.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
          window.history.pushState(null, "", href);
        }
      }
    }
  };

  const ProfileLink = () => (
    <Link
      href="/profile"
      className={STYLES.ghostButton}
      suppressHydrationWarning
    >
      {userDisplayName}
    </Link>
  );

  const LoginLink = ({ label = "Log in" }: { label?: string } = {}) => (
    <Link
      href="/auth/login"
      className={STYLES.ghostButton}
      suppressHydrationWarning
    >
      {label}
    </Link>
  );

  const PrimaryButton = ({
    href,
    onClick,
    children,
  }: {
    href?: string;
    onClick?: () => void;
    children: React.ReactNode;
  }) => {
    if (href) {
      return (
        <Link
          href={href}
          className={STYLES.primaryButton}
          suppressHydrationWarning
        >
          {children}
        </Link>
      );
    }
    return (
      <Button onClick={onClick} className={STYLES.primaryButton}>
        {children}
      </Button>
    );
  };

  const renderActionButtons = () => {
    if (!config.showAuthButtons) return null;

    // Authenticated users - unified logic
    if (user) {
      return (
        <>
          <ProfileLink />

          <PrimaryButton
            onClick={() =>
              supabase.auth.signOut().then(() => {
                toast.success("Logged out successfully!");
              })
            }
          >
            Log out
          </PrimaryButton>
        </>
      );
    }
    // Not authenticated
    return (
      <>
        <LoginLink />
        <PrimaryButton href="/auth/register">Sign Up</PrimaryButton>
      </>
    );
  };

  return (
    <header
      className={cn(
        "fixed top-0 right-0 left-0 z-50 py-4 transition-all duration-300",
        isScrolled ? "glass shadow-sm" : "bg-transparent",
      )}
      suppressHydrationWarning
    >
      <div className="container mx-auto flex items-center justify-between px-6">
        <div className="text-foreground flex items-center gap-2">
          <Link
            href={user && isRecruiter ? "/hire" : "/"}
            className="group flex items-center gap-3"
          >
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

        {config.menuItems.length > 0 && (
          <nav
            className="hidden items-center space-x-1 md:flex md:gap-6"
            suppressHydrationWarning
          >
            {config.menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={(e) => handleNavClick(e, item.href)}
                className={cn("nav-link", isActive(item.href) && "active")}
                suppressHydrationWarning
              >
                {item.label}
              </Link>
            ))}
          </nav>
        )}

        <div
          className="hidden items-center space-x-3 md:flex"
          suppressHydrationWarning
        >
          {renderActionButtons()}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
