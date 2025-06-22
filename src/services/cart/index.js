"use server";
const { default: createSupabaseClientServer } = require("@/lib/supabase/server");

export async function addToCart(payload) {
    console.log(payload)
    const supabase = await createSupabaseClientServer();
    const user = await supabase.auth.getUser();
    const { data, error } = await supabase
        .from("cart_items")
        .insert({
            user_id: user.data.user.id,
            material_id: payload.id,
            quantity: payload.quantity
        })
    if (error) {
        console.log(error)
        if (error.code == 23505) return { error: true, message: 'Produk sudah ada di keranjang', errorText: error };
        return { error: true, message: 'Terjadi kesalahan saat menambahkan produk ke keranjang', errorText: error };
    }
    return { error: false, data };
}

export async function getCartItems() {
    const supabase = await createSupabaseClientServer();
    const user = await supabase.auth.getUser();
    const { data, error } = await supabase
        .from("cart_items")
        .select(`
            *,
            material_listings(title, image_urls, price)
        `)
        .eq("user_id", user.data.user.id);
    if (error) {
        console.log(error)
        return { error: true, message: 'Terjadi kesalahan saat mengambil data keranjang', errorText: error };
    }
    return { error: false, data };
}

export async function removeCartItem(id) {
    const supabase = await createSupabaseClientServer();
    const { data, error } = await supabase
        .from("cart_items")
        .delete()
        .eq("id", id);
    if (error) {
        console.log(error)
        return { error: true, message: 'Terjadi kesalahan saat menghapus produk dari keranjang', errorText: error };
    }
    return { error: false, data };
}
