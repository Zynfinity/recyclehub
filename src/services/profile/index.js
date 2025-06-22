"use server";
const { default: createSupabaseClientServer } = require("@/lib/supabase/server");

export default async function submitCompleteProfile(formData) {
    const supabase = await createSupabaseClientServer();
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError) {
        console.error("Error fetching user:", userError);
        return { error: "Failed to fetch user" };
    }

    const fullName = formData.full_name;
    const address = formData.address;
    const phoneNumber = formData.phone_number;

    if (!fullName || !address || !phoneNumber) {
        return { error: "All fields are required" };
    }
    const { data, error } = await supabase
        .from('profiles')
        .insert({
            id: user.id,
            full_name: fullName,
            address: address,
            phone_number: phoneNumber,
            province_id: formData.province_id,
            city_id: formData.regency_id,
            district_id: formData.district_id,
            village_id: formData.village_id,
            postal_code: formData.postal_code,
            role: 'user'
        }, {
            onConflict: ['id']
        });

    if (error) {
        console.error("Error updating profile:", error);
        return { error: "Failed to update profile" };
    }

    return { success: true, data };
}
