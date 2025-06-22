"use server";
const { default: createSupabaseClientServer } = require("@/lib/supabase/server");

export async function getCategories() {
    const supabase = await createSupabaseClientServer();
    const { data, error } = await supabase
        .from("material_categories")
        .select(`
            *
        `)
        .order("name", { ascending: true });
    if (error) {
        return { error: true, message: 'Terjadi kesalahan saat mengambil data kategori material' };
    }
    return { error: false, data };
}

export async function deleteCategory(id) {
    const supabase = await createSupabaseClientServer();
    const { data, error } = await supabase
        .from("material_categories")
        .delete()
        .eq("id", id);
    if (error) {
        return { error: true, message: 'Terjadi kesalahan saat menghapus kategori material' };
    }
    return { error: false, data };
}

export async function createCategory(payload) {
    const supabase = await createSupabaseClientServer();
    const { data, error } = await supabase
        .from("material_categories")
        .insert(payload);
    if (error) {
        return { error: true, message: 'Terjadi kesalahan saat menambahkan kategori material' };
    }
    return { error: false, data };
}

export async function updateCategory(id, payload) {
    const supabase = await createSupabaseClientServer();
    const { data, error } = await supabase
        .from("material_categories")
        .update(payload)
        .eq("id", id);
    if (error) {
        return { error: true, message: 'Terjadi kesalahan saat memperbarui kategori material' };
    }
    return { error: false, data };
}

export async function getCategoryById(id) {
    const supabase = await createSupabaseClientServer();
    const { data, error } = await supabase
        .from("material_categories")
        .select(`
            *
        `)
        .eq("id", id)
        .single();
    if (error) {
        return { error: true, message: 'Terjadi kesalahan saat mengambil data kategori material' };
    }
    return { error: false, data };
}