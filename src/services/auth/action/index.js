"use server";

import createSupabaseClientServer from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function signInWithOAuth() {
    const supabase = await createSupabaseClientServer();
    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google', options: {
            redirectTo: '/dashboard',
        }
    })
}

export async function signOut() {
    const supabase = await createSupabaseClientServer();
    const { error } = await supabase.auth.signOut();
    // if (error) throw error;
    redirect('/auth/login');
}

