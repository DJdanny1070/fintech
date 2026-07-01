import { useState, useEffect, useMemo } from "react";
import { findHashesBySha, getRecentHashes, getHashesByEntity, searchHashes } from "../services/hashService";
import { getProduct, getProducts } from "../services/productService";
import { getProfileByEmail } from "../services/profileService";
import "./Dashboard.css";
import { useToast } from "../components/common/ToastProvider";

function shorten(h) {
  if (!h) return "—";
  return `${h.slice(0,8)}...${h.slice(-8)}`;
}

async function copyToClipboard(text) {
  if (!text) return false;
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

function Blockchain() {
  const [query, setQuery] = useState("");
  const [type, setType] = useState("hash"); // 'hash' | 'product' | 'order' | 'user'
  const [results, setResults] = useState([]);
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 6;

  useEffect(() => {
    let mounted = true;
    getRecentHashes(8)
      .then((r) => { if (mounted) setRecent(r || []); })
      .catch((err) => {
        console.error("Recent hashes load failed:", err);
      });
    return () => { mounted = false; };
  }, []);

  const performSearch = async () => {
    setLoading(true);
    setError("");
    setResults([]);
    setPage(1);
    try {
      if (type === "hash") {
        const res = await searchHashes(query, 50);
        setResults(res || []);
      } else if (type === "product") {
        // Try id first
        let prod = null;
        if (query.includes("-")) {
          try {
            prod = await getProduct(query);
          } catch (err) {
            console.warn("Product ID lookup error:", err?.message || err);
          }
        }
        if (!prod) {
          // search by title
          const list = await getProducts({ search: query });
          prod = list && list.length ? list[0] : null;
        }
        if (!prod) {
          setError("No product found for that query.");
          setResults([]);
        } else {
          const hashes = await getHashesByEntity("product", prod.id);
          setResults(hashes || []);
        }
      } else if (type === "order") {
        // treat query as order id
        const orderId = query.trim();
        if (!orderId) { setError("Enter order id"); setResults([]); }
        else {
          const hashes = await getHashesByEntity("order", orderId);
          setResults(hashes || []);
        }
      } else if (type === "user") {
        // support email or id
        let profile = null;
        if (query.includes("@")) {
          profile = await getProfileByEmail(query.trim());
        } else {
          try {
            const { supabase } = await import("../services/supabase");
            const { data, error } = await supabase.from('profiles').select('*').eq('id', query.trim()).single();
            if (!error) profile = data;
          } catch (err) {
            console.warn("Blockchain user lookup failed:", err);
          }
        }
        if (!profile) { setError('User not found'); setResults([]); }
        else {
          const hashes = await getHashesByEntity('profile', profile.id);
          setResults(hashes || []);
        }
      }
    } catch (err) {
      setError(err.message || String(err));
    } finally {
      setLoading(false);
    }
  };

  const toast = useToast();

  const totalPages = Math.max(1, Math.ceil(results.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const visibleResults = useMemo(() => {
    const start = (safePage - 1) * PAGE_SIZE;
    return results.slice(start, start + PAGE_SIZE);
  }, [results, safePage]);

  return (
    <div>
      <div className="page-header">
        <div className="page-header__row">
          <div>
            <h1>Blockchain Explorer</h1>
            <p>Search and verify SHA-256 records stored by CresoX</p>
          </div>
          <span className="badge badge-green"><span className="dot-live"></span> Network live</span>
        </div>
      </div>

      <div className="content-card" style={{marginBottom:"var(--sp-5)"}}>
        <div style={{display:"flex",gap:12,alignItems:"center"}}>
          <select className="input" value={type} onChange={e => setType(e.target.value)} style={{width:160}}>
            <option value="hash">Hash</option>
            <option value="product">Product</option>
            <option value="order">Order</option>
            <option value="user">User</option>
          </select>
          <input className="input" placeholder={type === 'hash' ? 'Enter hash or part of hash' : `Search ${type} by id/title/email`} value={query} onChange={e => setQuery(e.target.value)} style={{flex:1}} />
          <button className="btn btn-primary" onClick={performSearch} disabled={loading}>{loading ? 'Searching...' : 'Search'}</button>
        </div>
        {error && <div style={{marginTop:12,color:"var(--red)"}}>{error}</div>}
      </div>

      <div className="two-col" style={{alignItems:"start",marginBottom:"var(--sp-5)"}}>
        <div className="content-card">
          <div className="content-card__header">
            <div className="content-card__title">Search Results</div>
            <div className="content-card__sub">{results.length} record(s)</div>
          </div>
          {loading ? (
            <div style={{textAlign:"center",padding:"var(--sp-6)",color:"var(--text-muted)"}}>Searching...</div>
          ) : results.length === 0 ? (
            <div style={{textAlign:"center",padding:"var(--sp-6)",color:"var(--text-muted)"}}>No matching records.</div>
          ) : (
            <>
              <table className="data-table">
                <thead>
                  <tr><th>Hash</th><th>Entity Type</th><th>Entity ID</th><th>Timestamp</th><th></th></tr>
                </thead>
                <tbody>
                  {visibleResults.map(r => (
                    <tr key={r.id}>
                      <td style={{fontFamily:'monospace',fontSize:13}}>{shorten(r.sha256_hash)}</td>
                      <td>
                        <span className="badge badge-gray">{r.entity_type}</span>
                      </td>
                      <td style={{fontFamily:'monospace'}}>{r.entity_id}</td>
                      <td style={{color:'var(--text-muted)'}}>{new Date(r.created_at).toLocaleString()}</td>
                      <td style={{textAlign:'right', display:'flex', justifyContent:'flex-end', gap:8}}>
                        <span className="status-badge status-badge--verified">Verified</span>
                        <button className="btn btn-ghost btn-sm" onClick={async () => {
                          const ok = await copyToClipboard(r.sha256_hash);
                          toast.success(ok ? 'Hash copied' : 'Copy failed');
                        }}>Copy</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginTop:'var(--sp-4)',flexWrap:'wrap',gap:'var(--sp-3)'}}>
                <div style={{color:'var(--text-muted)',fontSize:13}}>
                  Showing {((safePage - 1) * PAGE_SIZE) + 1}-{Math.min(safePage * PAGE_SIZE, results.length)} of {results.length}
                </div>
                <div style={{display:'flex',gap:'var(--sp-2)'}}>
                  <button className="btn btn-ghost btn-sm" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={safePage === 1}>Previous</button>
                  <button className="btn btn-ghost btn-sm" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={safePage === totalPages}>Next</button>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="content-card">
          <div className="content-card__header">
            <div className="content-card__title">Recent Hash Records</div>
            <div className="content-card__sub">Latest stored SHA-256 records</div>
          </div>
          {recent.length === 0 ? (
            <div style={{textAlign:'center',padding:'var(--sp-6)',color:'var(--text-muted)'}}>No hash records.</div>
          ) : (
            <div style={{display:'grid',gap:8}}>
              {recent.map(h => (
                <div key={h.id} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:10,border:'1px solid var(--border)',borderRadius:8,gap:8}}>
                  <div style={{display:'flex',flexDirection:'column',minWidth:0}}>
                    <div style={{fontFamily:'monospace',fontSize:13}}>{shorten(h.sha256_hash)}</div>
                    <div style={{fontSize:12,color:'var(--text-muted)',marginTop:4}}>{h.entity_type} · {h.entity_id}</div>
                    <div style={{fontSize:12,color:'var(--text-muted)',marginTop:4}}>{new Date(h.created_at).toLocaleString()}</div>
                  </div>
                  <div style={{display:'flex',gap:8,alignItems:'center',flexShrink:0}}>
                    <span className="status-badge status-badge--verified">Verified</span>
                    <button className="btn btn-ghost btn-sm" onClick={async () => {
                      const ok = await copyToClipboard(h.sha256_hash);
                      toast.success(ok ? 'Hash copied' : 'Copy failed');
                    }}>Copy</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Blockchain;
