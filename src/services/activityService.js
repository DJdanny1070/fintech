import { getRecentProducts } from "./productService";
import { getRecentTransactions } from "./transactionService";
import { getRecentOrdersGlobal } from "./productService";
import { getRecentHashes } from "./hashService";

/**
 * Aggregate recent activity from products, orders, transactions and hashes
 */
export async function getRecentActivity(limit = 10) {
  const [prods, ords, txs, hashes] = await Promise.all([
    getRecentProducts(limit),
    getRecentOrdersGlobal(limit),
    getRecentTransactions(limit),
    getRecentHashes(limit),
  ]);

  const items = [];

  prods.forEach(p => items.push({ type: 'product', created_at: p.created_at, title: p.title, id: p.id, meta: p }));
  ords.forEach(o => items.push({ type: 'order', created_at: o.created_at, title: o.product?.title || 'Order', id: o.id, meta: o }));
  txs.forEach(t => items.push({ type: 'transaction', created_at: t.created_at, title: t.type, id: t.id, meta: t }));
  hashes.forEach(h => items.push({ type: 'hash', created_at: h.created_at, title: h.sha256_hash.slice(0,12), id: h.id, meta: h }));

  // Sort descending by created_at
  items.sort((a,b) => new Date(b.created_at) - new Date(a.created_at));

  return items.slice(0, limit);
}

export default { getRecentActivity };
