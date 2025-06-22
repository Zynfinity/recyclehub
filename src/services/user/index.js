"use server";
const { default: createSupabaseClientServer } = require("@/lib/supabase/server");

export async function getUsers() {
    const supabase = await createSupabaseClientServer();
    const { data, error } = await supabase
        .from("profiles")
        .select(`
            id,
            full_name,
            role,
            address,
            phone_number,
            created_at,
            updated_at
        `)
        .order("full_name", { ascending: true });
    if (error) {
        return { error: true, message: 'Terjadi kesalahan saat mengambil data pengguna' };
    }
    return { error: false, data };
}

export async function deleteUser(id) {
    const supabase = await createSupabaseClientServer();
    const { data, error } = await supabase
        .from("profiles")
        .delete()
        .eq("id", id);
    if (error) {
        return { error: true, message: 'Terjadi kesalahan saat menghapus pengguna' };
    }
    return { error: false, data };
}

export async function createUser(payload) {
    const supabase = await createSupabaseClientServer();
    const { data, error } = await supabase
        .from("profiles")
        .insert(payload);
    if (error) {
        return { error: true, message: 'Terjadi kesalahan saat menambahkan pengguna' };
    }
    return { error: false, data };
}

export async function updateUser(id, payload) {
    const supabase = await createSupabaseClientServer();
    const { data, error } = await supabase
        .from("profiles")
        .update(payload)
        .eq("id", id);
    if (error) {
        return { error: true, message: 'Terjadi kesalahan saat memperbarui pengguna' };
    }
    return { error: false, data };
}

export async function getUserById(id) {
    const supabase = await createSupabaseClientServer();
    const { data, error } = await supabase
        .from("profiles")
        .select(`
            id,
            full_name,
            role,
            address,
            phone_number,
            province_id,
            city_id,
            postal_code,
            district_id,
            village_id,
            created_at,
            updated_at
        `)
        .eq("id", id)
        .single();
    if (error) {
        return { error: true, message: 'Terjadi kesalahan saat mengambil data pengguna' };
    }
    return { error: false, data };
}
