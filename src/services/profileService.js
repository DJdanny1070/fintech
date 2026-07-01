import { supabase } from "./supabase";

/**
 * Create a new profile row for a newly registered user.
 */
export async function createProfile(userId, { full_name, email, role }) {
  const verification_status = role === "business" ? "Pending" : null;

  const { data, error } = await supabase
    .from("profiles")
    .insert([
      {
        id: userId,
        full_name,
        email,
        role,
        verification_status,
      },
    ])
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Fetch a user's profile by their auth user ID.
 */
export async function getProfile(userId) {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (error && error.code !== "PGRST116") throw error; // PGRST116 = no rows
  return data ?? null;
}

/**
 * Fetch a profile by email address.
 */
export async function getProfileByEmail(email) {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("email", email)
    .single();

  if (error && error.code !== "PGRST116") throw error;
  return data ?? null;
}

/**
 * Get recent profiles (most recently registered users)
 */
export async function getRecentProfiles(limit = 5) {
  const { data, error } = await supabase
    .from("profiles")
    .select("id, full_name, email, role, created_at, verification_status, avatar_url")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data ?? [];
}

/**
 * Search profiles by full name or business name.
 */
export async function searchSellers(query, { limit = 6 } = {}) {
  const trimmed = (query || "").trim();
  if (!trimmed) return [];

  const { data, error } = await supabase
    .from("profiles")
    .select("id, full_name, company_name, role, email, verification_status, avatar_url")
    .or(`full_name.ilike.%${trimmed}%,company_name.ilike.%${trimmed}%`)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data ?? [];
}

/**
 * Get simple counts: users and verified sellers
 */
export async function getCounts() {
  const [usersRes, verifiedRes] = await Promise.all([
    supabase.from("profiles").select("id", { count: "exact", head: true }),
    supabase.from("profiles").select("id", { count: "exact", head: true }).eq("verification_status", "Verified"),
  ]);

  if (usersRes.error) throw usersRes.error;
  if (verifiedRes.error) throw verifiedRes.error;

  return {
    users: usersRes.count || 0,
    verified_sellers: verifiedRes.count || 0,
  };
}

/**
 * Update profile fields.
 */
export async function updateProfile(userId, fields) {
  const { data, error } = await supabase
    .from("profiles")
    .update(fields)
    .eq("id", userId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Upload an avatar image to Supabase Storage and return public URL.
 */
export async function uploadAvatar(file, userId) {
  const ext = file.name.split(".").pop();
  const fileName = `${userId}/avatar-${Date.now()}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from("avatars")
    .upload(fileName, file, { upsert: true });

  if (uploadError) throw uploadError;

  const { data } = supabase.storage.from("avatars").getPublicUrl(fileName);
  return data.publicUrl;
}

/**
 * Upload a company/business document to Supabase Storage and return public URL.
 */
export async function uploadBusinessDocument(file, userId) {
  const ext = file.name.split(".").pop();
  const fileName = `${userId}/company-docs/${Date.now()}-${Math.random().toString(36).slice(2,8)}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from("company-docs")
    .upload(fileName, file, { upsert: false });

  if (uploadError) throw uploadError;

  const { data } = supabase.storage.from("company-docs").getPublicUrl(fileName);
  return data.publicUrl;
}

/**
 * Request business verification: upload provided document files and update the profile row
 * with verification details and status = 'Pending'.
 */
export async function requestBusinessVerification(userId, { gst_number, pan_number, company_address, documents = [] }) {
  // Upload documents first
  const uploaded = [];
  for (const f of documents) {
    if (!f) continue;
    const url = await uploadBusinessDocument(f, userId);
    uploaded.push(url);
  }

  const fields = {
    gst_number: gst_number || null,
    pan_number: pan_number || null,
    company_address: company_address || null,
    verification_documents: uploaded.length ? uploaded : null,
    verification_status: "Pending",
  };

  const updated = await updateProfile(userId, fields);
  return updated;
}
