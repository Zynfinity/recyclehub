"use server";
const { default: createSupabaseClientServer } = require("./server");

export default async function getSession(request) {
    const supabase = await createSupabaseClientServer();
    const { data, error } = await supabase.auth.getUser();
    if (error) {
        console.error("Error getting session:", error);
        return { isAuhenticated: false }
    }
    return { isAuhenticated: true, data };
}