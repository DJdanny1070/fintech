import { supabase } from "./supabase";
import { getWallet, updateWalletBalance } from "./walletService";
import { getProfileByEmail } from "./profileService";
import { generateAndStoreHash } from "./hashService";

/**
 * Create a transaction record and generate a blockchain hash.
 */
export async function createTransaction({ userId, type, amount, counterpartyId = null, counterpartyName = null, note = null, status = "pending" }) {
  const payload = {
    user_id: userId,
    type,
    amount,
    counterparty_id: counterpartyId,
    counterparty_name: counterpartyName,
    note,
    status,
  };

  const { data, error } = await supabase
    .from("transactions")
    .insert([payload])
    .select()
    .single();

  if (error) throw error;

  // Generate blockchain hash (non-blocking if storage fails)
  try {
    const hash = await generateAndStoreHash("transaction", data.id, payload);
    await supabase.from("transactions").update({ blockchain_hash: hash }).eq("id", data.id);
  } catch (err) {
    console.error("Failed to generate/store transaction hash:", err.message);
  }

  return data;
}

/**
 * Get transactions for a user (as owner) with optional limit.
 */
export async function getTransactionsForUser(userId, limit = 50) {
  const { data, error } = await supabase
    .from("transactions")
    .select(
      `*,
      counterparty:profiles(id,full_name,email)
    `
    )
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data ?? [];
}

/**
 * Get recent transactions across the platform
 */
export async function getRecentTransactions(limit = 10) {
  const { data, error } = await supabase
    .from("transactions")
    .select(`*, counterparty:profiles(id,full_name,email)`)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data ?? [];
}

export async function getTotalCount() {
  const { count, error } = await supabase.from("transactions").select("id", { count: "exact", head: true });
  if (error) throw error;
  return count || 0;
}

/**
 * Simulate a deposit: increase wallet balance and create verified transaction.
 */
export async function depositSimulation(userId, amount, source = "bank") {
  // Update wallet balance
  const wallet = await getWallet(userId);
  const newBalance = (wallet?.balance || 0) + Number(amount || 0);
  await updateWalletBalance(userId, newBalance);

  // Create transaction
  const tx = await createTransaction({ userId, type: "deposit", amount: Number(amount), counterpartyName: source, status: "verified" });
  return tx;
}

/**
 * Simulate a withdraw: decrease wallet balance and create verified transaction.
 */
export async function withdrawSimulation(userId, amount, destination = "bank") {
  const wallet = await getWallet(userId);
  const newBalance = (wallet?.balance || 0) - Number(amount || 0);
  if (newBalance < 0) throw new Error("Insufficient balance");
  await updateWalletBalance(userId, newBalance);

  const tx = await createTransaction({ userId, type: "withdraw", amount: -Number(amount), counterpartyName: destination, status: "verified" });
  return tx;
}

/**
 * Transfer between users (simulated): debit sender, credit recipient, create two transactions.
 * recipientIdentifier can be an email or user id.
 */
export async function transferBetweenUsers(senderId, recipientIdentifier, amount, note = null) {
  // Resolve recipient
  let recipient = null;
  if (recipientIdentifier.includes("@")) {
    recipient = await getProfileByEmail(recipientIdentifier);
  } else {
    // assume user id
    const { data, error } = await supabase.from("profiles").select("*").eq("id", recipientIdentifier).single();
    if (error && error.code !== "PGRST116") throw error;
    recipient = data ?? null;
  }

  if (!recipient) throw new Error("Recipient not found");

  const amt = Number(amount);
  if (isNaN(amt) || amt <= 0) throw new Error("Invalid amount");

  // Update balances
  const senderWallet = await getWallet(senderId);
  if ((senderWallet?.balance || 0) < amt) throw new Error("Insufficient balance");
  await updateWalletBalance(senderId, (senderWallet.balance || 0) - amt);

  const recipientWallet = await getWallet(recipient.id);
  await updateWalletBalance(recipient.id, (recipientWallet?.balance || 0) + amt);

  // Create transactions for both parties
  const sentTx = await createTransaction({ userId: senderId, type: "transfer_sent", amount: -amt, counterpartyId: recipient.id, counterpartyName: recipient.full_name, note, status: "verified" });
  const recvTx = await createTransaction({ userId: recipient.id, type: "transfer_received", amount: amt, counterpartyId: senderId, counterpartyName: (await supabase.from('profiles').select('full_name').eq('id', senderId).single()).data?.full_name || null, note, status: "verified" });

  return { sentTx, recvTx };
}
