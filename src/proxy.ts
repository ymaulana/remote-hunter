import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/utils/supabase/middleware";
import { createServerClient } from "@supabase/ssr";

const publicPaths = [
    "/",
    "/jobs",
    "/hire",
    "/auth/login",
    "/auth/register",
    "/auth/forgot-password",
    "/auth/update-password",
    "/auth/callback",
    "/auth/verify-email",
    "/onboarding",
];

// /profile is accessible to ALL authenticated users (both roles)
const protectedPaths = ["/profile", "/settings"];

const seekerOnlyPaths = ["/applications", "/saved-jobs"];
const recruiterOnlyPaths = ["/jobs/post", "/candidates"];
const adminOnlyPaths = ["/admin"];

// Profile is accessible to all authenticated users (role-specific content rendered server-side)
// So we don't need to add it to seekerOnlyPaths or recruiterOnlyPaths

function isPublicPath(pathname: string): boolean {
    return publicPaths.some(
        (path) => pathname === path || pathname.startsWith(`${path}/`)
    );
}

function isJobDetailPath(pathname: string): boolean {
    // /jobs/:id is public but /jobs/post is recruiter-only
    return /^\/jobs\/[^/]+$/.test(pathname) && pathname !== "/jobs/post";
}

export async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Always refresh session first (even for public paths)
    const response = await updateSession(request);

    // Allow public paths and job detail pages
    if (isPublicPath(pathname) || isJobDetailPath(pathname)) {
        return response;
    }

    // Get user from Supabase Auth (Edge-compatible, no Prisma)
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll();
                },
                setAll() {
                    // cookies are already handled by updateSession
                },
            },
        }
    );

    const {
        data: { user },
    } = await supabase.auth.getUser();

    // No user → redirect to login with return URL
    if (!user) {
        const url = request.nextUrl.clone();
        url.pathname = "/auth/login";
        url.searchParams.set("redirect", pathname);
        return NextResponse.redirect(url);
    }

    // Get role from JWT metadata (no DB query)
    const role = (
        (user.user_metadata?.role as string) ?? "SEEKER"
    ).toUpperCase();

    // Onboarding guard: if user already has a role, skip onboarding
    if (pathname.startsWith("/onboarding")) {
        if (user.user_metadata?.role) {
            const url = request.nextUrl.clone();
            url.pathname = "/profile";
            return NextResponse.redirect(url);
        }
        return response;
    }

    // Role-based access control
    const isSeeker = role === "SEEKER";
    const isRecruiter = role === "RECRUITER";
    const isAdmin = role === "ADMIN";

    const accessDenied =
        (seekerOnlyPaths.some((p) => pathname.startsWith(p)) && !isSeeker) ||
        (recruiterOnlyPaths.some((p) => pathname.startsWith(p)) &&
            !isRecruiter &&
            !isAdmin) ||
        (adminOnlyPaths.some((p) => pathname.startsWith(p)) && !isAdmin);

    if (accessDenied) {
        // Redirect to the user's home page based on role
        const url = request.nextUrl.clone();
        url.pathname = isRecruiter ? "/hire" : "/jobs";
        return NextResponse.redirect(url);
    }

    return response;
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - Static assets (svg, png, jpg, jpeg, gif, webp)
         */
        "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
    ],
};
