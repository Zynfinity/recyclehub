// src/middleware.js
import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';

// --- Helper Functions ---
const isAuthPath = (pathname) =>
    pathname.startsWith('/login') ||
    pathname.startsWith('/auth/login') ||
    pathname.startsWith('/auth/callback');

const isCompleteProfilePath = (pathname) => pathname === '/complete-profile';
const isDashboardPath = (pathname) => pathname.startsWith('/dashboard');

// --- Main Middleware Function ---
export async function middleware(request) {
    const response = NextResponse.next({
        request: { headers: request.headers },
    });

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        {
            cookies: {
                get(name) {
                    return request.cookies.get(name)?.value;
                },
                set(name, value, options) {
                    request.cookies.set({ name, value, ...options });
                    response.cookies.set({ name, value, ...options });
                },
                remove(name, options) {
                    request.cookies.set({ name, value: '', ...options, expires: new Date(0) });
                    response.cookies.set({ name, value: '', ...options, expires: new Date(0) });
                },
            },
        }
    );

    const { pathname } = request.nextUrl;
    const currentUrl = request.nextUrl.clone();
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    const isAuthenticated = !!user;
    const isOnAuthPage = isAuthPath(pathname);
    const isOnCompleteProfilePage = isCompleteProfilePath(pathname);
    const isOnDashboardPage = isDashboardPath(pathname);

    // If the user is authenticated
    if (isAuthenticated) {
        const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('full_name, address, phone_number, role')
            .eq('id', user.id)
            .single();
        const isAdmin = profile?.role === 'admin';

        if (profileError && profileError.code !== 'PGRST116') {
            console.error('Error fetching user profile in middleware:', profileError.message);
            return NextResponse.redirect(new URL('/error', request.url));
        }

        const hasBiodata = profile && profile.full_name && profile.address && profile.phone_number;

        // Redirect to home if the user is on the dashboard but not an admin
        if (isOnDashboardPage && !isAdmin) {
            return NextResponse.redirect(new URL('/', request.url));
        }

        // Redirect to complete-profile if biodata is missing
        if (!hasBiodata && !isOnCompleteProfilePage) {
            return NextResponse.redirect(new URL('/complete-profile', request.url));
        }

        // Redirect to home if user has completed profile but is on the complete-profile page
        if (hasBiodata && isOnCompleteProfilePage) {
            currentUrl.pathname = '/';
            return NextResponse.redirect(currentUrl);
        }

        // Redirect to home if user is on the auth page
        if (isOnAuthPage) {
            currentUrl.pathname = '/';
            return NextResponse.redirect(currentUrl);
        }

        return response;
    }

    // If the user is not authenticated
    if (!isOnAuthPage) {
        currentUrl.pathname = '/auth/login';
        return NextResponse.redirect(currentUrl);
    }

    return response;
}

// --- Matcher Configuration ---
export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
};
