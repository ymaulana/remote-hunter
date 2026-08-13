import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/utils/supabase/session";

const publicPaths = [
    "/",
    "/jobs",
    "/hire",
    "/auth/login",
    "/auth/register",
    "/auth/forgot-password",
    "/auth/callback",
    "/auth/verify-email",
];

// Guest-only pages: authenticated users are redirected away.
// /auth/update-password is NOT here — it is protected (guests blocked) instead.
const authOnlyPaths = ["/auth/login", "/auth/register", "/auth/forgot-password"];

const seekerOnlyPaths = ["/applications", "/saved-jobs"];
const recruiterOnlyPaths = ["/jobs/post", "/candidates"];
const adminOnlyPaths = ["/admin"];

function isPublicPath(pathname: string): boolean {
    return publicPaths.some(
        (path) => pathname === path || pathname.startsWith(`${path}/`)
    );
}

function isAuthOnlyPath(pathname: string): boolean {
    return authOnlyPaths.some(
        (path) => pathname === path || pathname.startsWith(`${path}/`)
    );
}

function getRoleHome(role: string | undefined): string {
    return role?.toUpperCase() === "RECRUITER" ? "/hire" : "/jobs";
}

function isJobDetailPath(pathname: string): boolean {
    // /jobs/:id is public but /jobs/post is recruiter-only
    return /^\/jobs\/[^/]+$/.test(pathname) && pathname !== "/jobs/post";
}

export async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Always refresh session first (even for public paths)
    const { response, user } = await updateSession(request);

    // Authenticated users visiting guest-only auth pages → role home
    if (user && isAuthOnlyPath(pathname)) {
        const url = request.nextUrl.clone();
        url.pathname = getRoleHome(user.user_metadata?.role as string);
        return NextResponse.redirect(url);
    }

    // Allow public paths and job detail pages (guests AND users)
    if (
        (isPublicPath(pathname) && pathname !== "/jobs/post") ||
        isJobDetailPath(pathname)
    ) {
        return response;
    }

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
        url.pathname = getRoleHome(role);
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
