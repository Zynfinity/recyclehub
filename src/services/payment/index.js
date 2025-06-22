export async function addTransaction(transactionData) {
    const supabase = await createSupabaseClientServer();

    const {
        listing_id,
        buyer_id,
        transaction_type,
        quantity,
        agreed_price,
        status
    } = transactionData;

    // Insert the new transaction
    const { data, error } = await supabase
        .from("transactions")
        .insert([
            {
                listing_id,
                buyer_id,
                transaction_type,
                quantity,
                agreed_price,
                status,
                created_at: new Date().toISOString(), // Automatically set current time for creation
            }
        ])
        .single(); // We only want to insert one transaction

    if (error) {
        return { error: true, message: 'Terjadi kesalahan saat menambahkan transaksi', details: error };
    }

    return { error: false, data };
}

export async function updateTransaction(transactionId, updatedData) {
    const supabase = await createSupabaseClientServer();

    // Update the transaction with the new data
    const { data, error } = await supabase
        .from("transactions")
        .update(updatedData)  // Pass in the updated data
        .match({ id: transactionId }); // Match the transaction by ID

    if (error) {
        return { error: true, message: 'Terjadi kesalahan saat memperbarui transaksi', details: error };
    }

    return { error: false, data };
}