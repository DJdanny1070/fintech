import { supabase } from "./supabase";

/**
 * Fetch all products with optional filters.
 * @param {{ search?: string, category?: string }} filters
 */
export async function getProducts({ search = "", category = "" } = {}) {
  let query = supabase
    .from("products")
    .select(
      `
      *,
      seller:profiles(full_name, email, verification_status)
    `
    )
    .order("created_at", { ascending: false });

  if (category && category !== "All") {
    query = query.eq("category", category);
  }

  if (search) {
    query = query.or(
      `title.ilike.%${search}%,description.ilike.%${search}%,category.ilike.%${search}%`
    );
  }

  const { data, error } = await query;
  if (error) throw error;
  return data ?? [];
}

/**
 * Create a new product. Also stores blockchain_hash.
 */
export async function createProduct(productData) {
  const { data, error } = await supabase
    .from("products")
    .insert([productData])
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Update an existing product (sellers can only update their own — enforced by RLS).
 */
export async function updateProduct(id, fields) {
  const { data, error } = await supabase
    .from("products")
    .update(fields)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Delete a product (RLS ensures only the seller can do this).
 */
export async function deleteProduct(id) {
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) throw error;
}

/**
 * Upload a product image to Supabase Storage.
 * Returns the public URL.
 */
export async function uploadProductImage(file, userId) {
  const ext = file.name.split(".").pop();
  const fileName = `${userId}/${Date.now()}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from("product-images")
    .upload(fileName, file, { upsert: false });

  if (uploadError) throw uploadError;

  const { data } = supabase.storage
    .from("product-images")
    .getPublicUrl(fileName);

  return data.publicUrl;
}

/**
 * Create an order when a buyer purchases a product.
 */
export async function createOrder({ buyerId, sellerId, productId }) {
  const { data, error } = await supabase
    .from("orders")
    .insert([
      {
        buyer_id: buyerId,
        seller_id: sellerId,
        product_id: productId,
        status: "pending",
      },
    ])
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Get orders for the current user (as buyer or seller).
 */
export async function getMyOrders(userId) {
  const { data, error } = await supabase
    .from("orders")
    .select(
      `
      *,
      product:products(title, price),
      buyer:profiles!orders_buyer_id_fkey(full_name),
      seller:profiles!orders_seller_id_fkey(full_name)
    `
    )
    .or(`buyer_id.eq.${userId},seller_id.eq.${userId}`)
    .order("created_at", { ascending: false })
    .limit(5);

  if (error) throw error;
  return data ?? [];
}

/**
 * Get the user's own products (for seller dashboard).
 */
export async function getMyProducts(sellerId) {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("seller_id", sellerId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data ?? [];
}

/**
 * Fetch recent products with optional limit.
 */
export async function getRecentProducts(limit = 3) {
  const { data, error } = await supabase
    .from("products")
    .select(
      `
      *,
      seller:profiles(full_name, verification_status)
    `
    )
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data ?? [];
}

/**
 * Fetch recent orders across the platform (admin/dashboard view)
 */
export async function getRecentOrdersGlobal(limit = 5) {
  const { data, error } = await supabase
    .from("orders")
    .select(
      `
      *,
      product:products(id,title,price,image_url),
      buyer:profiles!orders_buyer_id_fkey(full_name),
      seller:profiles!orders_seller_id_fkey(full_name)
    `
    )
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data ?? [];
}

/**
 * Get counts of orders for a user (received as seller, purchased as buyer).
 */
export async function getOrdersCounts(userId) {
  const [receivedRes, purchasedRes] = await Promise.all([
    supabase.from("orders").select("id", { count: "exact", head: true }).eq("seller_id", userId),
    supabase.from("orders").select("id", { count: "exact", head: true }).eq("buyer_id", userId),
  ]);

  if (receivedRes.error) throw receivedRes.error;
  if (purchasedRes.error) throw purchasedRes.error;

  return {
    received: receivedRes.count || 0,
    purchased: purchasedRes.count || 0,
  };
}

/**
 * Fetch recent orders related to the user (buyer or seller).
 */
export async function getRecentOrders(userId, limit = 5) {
  const { data, error } = await supabase
    .from("orders")
    .select(
      `
      *,
      product:products(id,title,price,image_url),
      buyer:profiles!orders_buyer_id_fkey(full_name),
      seller:profiles!orders_seller_id_fkey(full_name)
    `
    )
    .or(`buyer_id.eq.${userId},seller_id.eq.${userId}`)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data ?? [];
}

/**
 * Get total counts for products and orders in the marketplace.
 */
export async function getGlobalCounts() {
  const [productsRes, ordersRes] = await Promise.all([
    supabase.from("products").select("id", { count: "exact", head: true }),
    supabase.from("orders").select("id", { count: "exact", head: true }),
  ]);

  if (productsRes.error) throw productsRes.error;
  if (ordersRes.error) throw ordersRes.error;

  return {
    products: productsRes.count || 0,
    orders: ordersRes.count || 0,
  };
}

/**
 * Fetch a single product by id with seller info.
 */
export async function getProduct(id) {
  const { data, error } = await supabase
    .from("products")
    .select(
      `
      *,
      seller:profiles(full_name, email, verification_status)
    `
    )
    .eq("id", id)
    .single();

  if (error) throw error;
  return data ?? null;
}

/**
 * Fetch related products by category excluding a product id.
 */
export async function getRelatedProducts(category, excludeId) {
  if (!category) return [];
  const { data, error } = await supabase
    .from("products")
    .select(
      `*, seller:profiles(full_name, email, verification_status)`
    )
    .eq("category", category)
    .neq("id", excludeId)
    .order("created_at", { ascending: false })
    .limit(6);

  if (error) throw error;
  return data ?? [];
}
