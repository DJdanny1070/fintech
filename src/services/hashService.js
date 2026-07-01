import { supabase } from "./supabase";
import { generateSHA256 } from "../utils/hashGenerator";

/**
 * Generate a SHA-256 hash of data and persist it to hash_records.
 *
 * @param {string} entityType - e.g. "profile" | "product"
 * @param {string} entityId   - UUID of the record being hashed
 * @param {object} data       - The data object to hash
 * @returns {string} The hex hash string
 *
 * NOTE: Swap generateSHA256 with a real on-chain call when blockchain
 * integration is ready — the rest of this function stays the same.
 */
export async function generateAndStoreHash(entityType, entityId, data) {
  const hash = generateSHA256({
    entityType,
    entityId,
    ...data,
    timestamp: new Date().toISOString(),
  });

  const { error } = await supabase.from("hash_records").insert([
    {
      entity_type: entityType,
      entity_id: entityId,
      sha256_hash: hash,
    },
  ]);

  if (error) {
    console.error("Failed to store hash record:", error.message);
    // Non-fatal — don't block the main operation
  }

  return hash;
}

export async function getHashCount() {
  const { count, error } = await supabase.from("hash_records").select("id", { count: "exact", head: true });
  if (error) throw error;
  return count || 0;
}

export async function getRecentHashes(limit = 5) {
  const { data, error } = await supabase
    .from("hash_records")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return data ?? [];
}

/**
 * Find hashes by (partial) sha string.
 */
export async function findHashesBySha(query, limit = 50) {
  if (!query) return [];
  const { data, error } = await supabase
    .from("hash_records")
    .select("*")
    .ilike("sha256_hash", `%${query}%`)
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return data ?? [];
}

/**
 * Search hash records by record id or SHA-256 hash.
 */
export async function searchHashes(query, limit = 20) {
  const trimmed = (query || "").trim();
  if (!trimmed) return [];

  const numericMatch = Number(trimmed);
  if (!Number.isNaN(numericMatch) && String(numericMatch) === trimmed) {
    const { data, error } = await supabase
      .from("hash_records")
      .select("*")
      .eq("id", numericMatch)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data ?? [];
  }

  const { data, error } = await supabase
    .from("hash_records")
    .select("*")
    .ilike("sha256_hash", `%${trimmed}%`)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data ?? [];
}

/**
 * Get hashes for a specific entity type + id.
 */
export async function getHashesByEntity(entityType, entityId, limit = 50) {
  if (!entityType || !entityId) return [];
  const { data, error } = await supabase
    .from("hash_records")
    .select("*")
    .eq("entity_type", entityType)
    .eq("entity_id", entityId)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data ?? [];
}

/**
 * Search hashes by entity type and a free-text identifier (id, title, email)
 * Uses productService/profileService where appropriate in the caller.
 */
