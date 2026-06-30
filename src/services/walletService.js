import { supabase } from "./supabase";

/**
 * Create a wallet for a new user. Initial balance ₹1,00,000.
 */
export async function createWallet(userId) {
  const { data, error } = await supabase
    .from("wallets")
    .insert([{ user_id: userId, balance: 100000 }])
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Get the wallet for a user.
 */
export async function getWallet(userId) {
  const { data, error } = await supabase
    .from("wallets")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (error && error.code !== "PGRST116") throw error;
  return data ?? null;
}

/**
 * Update wallet balance.
 */
export async function updateWalletBalance(userId, newBalance) {
  const { data, error } = await supabase
    .from("wallets")
    .update({ balance: newBalance, updated_at: new Date().toISOString() })
    .eq("user_id", userId)
    .select()
    .single();

  if (error) throw error;
  return data;
}
