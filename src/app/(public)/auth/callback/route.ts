import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url)
    const code = searchParams.get('code')
    // if "next" is in param, use it as the redirect URL
    let next = searchParams.get('next') ?? '/'
    if (!next.startsWith('/')) {
        // if "next" is not a relative URL, use the default
        next = '/'
    }

    if (code) {
        const supabase = await createClient();
        const { error } = await supabase.auth.exchangeCodeForSession(code);

        if (!error) {
            // Get the user to check their role
            const {
                data: { user },
            } = await supabase.auth.getUser();

            const forwardedHost = request.headers.get("x-forwarded-host");
            const isLocalEnv = process.env.NODE_ENV === "development";
            const baseUrl = isLocalEnv
                ? origin
                : forwardedHost
                    ? `https://${forwardedHost}`
                    : origin;

            // Check if OAuth user has a role set in user_metadata
            const role = user?.user_metadata?.role;

            if (!role) {
                // First-time OAuth user — needs to pick a role
                return NextResponse.redirect(`${baseUrl}/onboarding/complete-profile`);
            }

            // Existing user with role — send to their home page
            if (next && next !== '/') {
                return NextResponse.redirect(`${baseUrl}${next}`);
            }
            
            const home = role === "RECRUITER" ? "/hire" : "/jobs";
            return NextResponse.redirect(`${baseUrl}${home}`);
        }
    }

    // Return the user to an error page with instructions
    return NextResponse.redirect(`${origin}/auth/auth-code-error`);
}