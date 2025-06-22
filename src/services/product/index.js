"use server";
const { default: createSupabaseClientServer } = require("@/lib/supabase/server");

export async function getAllProducts() {
    const supabase = await createSupabaseClientServer();
    const { data, error } = await supabase
        .from("material_listings")
        .select(`
            *,
            material_categories(name)
        `)
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Terjadi kesalahan saat mengambil data product:", error);
        return { error: true, message: 'Terjadi kesalahan saat mengambil data product' };
    }
    return { error: false, data };
}

export async function getProductCategories() {
    const supabase = await createSupabaseClientServer();
    const { data, error } = await supabase
        .from("material_categories")
        .select("id, name")
        .order("name", { ascending: true });

    if (error) {
        console.error("Terjadi kesalahan saat mengambil data kategori product:", error);
        return { error: true, message: 'Terjadi kesalahan saat mengambil data kategori product' };
    }
    return { error: false, data };
}

export async function createProduct(data) {
    const supabase = await createSupabaseClientServer();
    let imageUrls = [];

    if (data.images && data.images.file) {
        const { data: fileData, error: fileError } = await supabase.storage
            .from('materialimages')
            .upload(data.images.file.name, data.images.file, {
                cacheControl: '3600',
                upsert: false
            });

        if (fileError && fileError.statusCode != 409) {
            console.error("Terjadi kesalahan saat mengupload gambar:", fileError);
            return { error: true, message: "Gagal mengupload gambar." };
        }

        if (!fileError || fileError.statusCode == 409) {
            const { data: urlData } = supabase.storage.from('materialimages').getPublicUrl(data.images.file.name);

            if (urlData?.publicUrl) {
                imageUrls.push(urlData.publicUrl);
            }
        }
    }
    delete data.images;
    data.image_urls = imageUrls;

    const { data: existingProduct, error: existingProductError } = await supabase
        .from("material_listings")
        .select("id")
        .eq("title", data.title)
        .single();
    if (existingProduct) {
        return { error: true, message: "Produk dengan judul yang sama sudah ada" };
    }

    const { data: sessionData } = await supabase.auth.getSession();

    const { data: createdData, error: insertError } = await supabase
        .from("material_listings")
        .insert([data])
        .select("*")
        .single();

    if (insertError) {
        console.error("Terjadi kesalahan saat membuat product:", insertError);
        return { error: true, message: insertError.message };
    }

    return { error: false, data: createdData };
}

export async function getProductById(id) {
    const supabase = await createSupabaseClientServer();
    const { data, error } = await supabase
        .from("material_listings")
        .select(`
            *,
            material_categories(name)
        `)
        .eq("id", id)
        .single();

    if (error) {
        console.error("Terjadi kesalahan saat mengambil data product:", error);
        return { error: true, message: 'Terjadi kesalahan saat mengambil data product' };
    }
    return { error: false, data };
}

export async function deleteProduct(id) {
    const supabase = await createSupabaseClientServer();
    const { error } = await supabase
        .from("material_listings")
        .delete()
        .in("id", id);

    if (error) {
        console.error("Terjadi kesalahan saat menghapus product:", error);
        return { error: true, message: 'Terjadi kesalahan saat menghapus product' };
    }
    return { error: false, message: 'Product berhasil dihapus' };
}

export async function updateProduct(id, data) {
    const supabase = await createSupabaseClientServer();
    let imageUrls = [];

    if (data.images && data.images.file) {
        const { data: fileData, error: fileError } = await supabase.storage
            .from('materialimages')
            .upload(data.images.file.name, data.images.file, {
                cacheControl: '3600',
                upsert: false
            });

        if (fileError && fileError.statusCode != 409) {
            console.error("Terjadi kesalahan saat mengupload gambar:", fileError);
            return { error: true, message: "Gagal mengupload gambar." };
        }

        if (!fileError || fileError.statusCode == 409) {
            const { data: urlData } = supabase.storage.from('materialimages').getPublicUrl(data.images.file.name);

            if (urlData?.publicUrl) {
                imageUrls.push(urlData.publicUrl);
            }
        }
    }
    delete data.images;
    data.image_urls = imageUrls;

    const { data: updatedData, error } = await supabase
        .from("material_listings")
        .update(data)
        .eq("id", id)
        .select("*")
        .single();

    if (error) {
        console.error("Terjadi kesalahan saat mengubah data product:", error);
        return { error: true, message: 'Terjadi kesalahan saat mengubah data product' };
    }
    return { error: false, data: updatedData };
}

