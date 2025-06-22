import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { CookieOptions, createServerClient } from '@supabase/ssr'

export async function GET(request) {
    const { searchParams, origin } = new URL(request.url)
    const code = searchParams.get('code')
    // if "next" is in param, use it as the redirect URL
    const next = searchParams.get('next') ?? '/dashboard'

    if (code) {
        const cookieStore = await cookies()
        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
            {
                cookies: {
                    get(name) {
                        return cookieStore.get(name)?.value
                    },
                    set(name, value, options) {
                        cookieStore.set({ name, value, ...options })
                    },
                    remove(name, options) {
                        cookieStore.delete({ name, ...options })
                    },
                },
            }
        )
        console.log("Exchanging code for session", code)
        const { error } = await supabase.auth.exchangeCodeForSession(code)
        if (!error) {
            return NextResponse.redirect(`${origin}${next}`)
        }
    }

    // return the user to an error page with instructions
    return NextResponse.redirect(`${origin}/auth/auth-code-error`)
}