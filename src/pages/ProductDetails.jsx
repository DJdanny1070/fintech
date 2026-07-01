import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { getProduct, getRelatedProducts, createOrder } from "../services/productService";
import { useToast } from "../components/common/ToastProvider";
import LoadingSkeleton from "../components/common/LoadingSkeleton";
import NetworkError from "../components/common/NetworkError";

function shortenHash(h) {
  if (!h) return "—";
  if (h.length <= 20) return h;
  return `${h.slice(0, 8)}...${h.slice(-6)}`;
}

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const toast = useToast();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [placing, setPlacing] = useState(false);

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      setError("");
      try {
        const p = await getProduct(id);
        if (!mounted) return;
        if (!p) {
          setError("Product not found.");
          setProduct(null);
          setRelated([]);
          return;
        }
        setProduct(p);
        const rel = await getRelatedProducts(p.category, p.id);
        if (!mounted) return;
        setRelated((rel || []).slice(0, 4));
      } catch (err) {
        const message = err?.message || "Failed to load product.";
        const isNotFound = err?.code === "PGRST116" || /no rows|not found/i.test(message);
        if (!mounted) return;
        setError(isNotFound ? "Product not found." : message);
        if (/failed to fetch|network/i.test(message)) {
          toast.error("Network error");
        } else if (isNotFound) {
          toast.warning("Product not found");
        }
        setProduct(null);
        setRelated([]);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => (mounted = false);
  }, [id]);

  const handleCopy = async () => {
    if (!product?.blockchain_hash) return;
    try {
      await navigator.clipboard.writeText(product.blockchain_hash);
      toast.success("Copied to clipboard");
    } catch (err) {
      console.error("Copy failed:", err);
      toast.error("Copy failed");
    }
  };

  const handleBuy = async () => {
    if (!user) {
      toast.info("Please log in to continue.");
      navigate("/login");
      return;
    }

    if (product.seller_id === user.id) {
      toast.error("You cannot buy your own product.");
      return;
    }

    setPlacing(true);
    try {
      await createOrder({ buyerId: user.id, sellerId: product.seller_id, productId: product.id });
      toast.success("Order created successfully.");
      navigate("/dashboard");
    } catch (err) {
      toast.error("Failed to create order: " + (err?.message || err));
    } finally {
      setPlacing(false);
    }
  };

  if (loading) {
    return (
      <div className="content-card">
        <LoadingSkeleton rows={4} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="content-card">
        <NetworkError message={error} />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="content-card">
        <div style={{textAlign:"center",padding:"var(--sp-8)",color:"var(--text-muted)"}}>
          Product not available.
        </div>
      </div>
    );
  }

  const isSeller = Boolean(user && product.seller_id === user.id);
  const canBuy = Boolean(user) && !isSeller;

  return (
    <div>
      <div className="page-header">
        <div className="page-header__row">
          <div>
            <h1>{product.title}</h1>
            <p>{product.category || "—"}</p>
          </div>
          <div>
            {isSeller ? (
              <span className="status-badge status-badge--pending">Your listing</span>
            ) : (
              <button className="btn btn-primary" onClick={handleBuy} disabled={placing}>
                {placing ? "Placing Order..." : canBuy ? "Buy Now" : "Login to Buy"}
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="content-card" style={{display:"grid",gridTemplateColumns:"320px 1fr",gap:24}}>
        <div>
          {product.image_url ? (
            <img src={product.image_url} alt={product.title} style={{width:"100%",borderRadius:8}} />
          ) : (
            <div style={{width:"100%",height:200,background:"var(--bg)",borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",color:"var(--text-muted)",flexDirection:'column',gap:8}}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="14" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 21l-6-5-4 4-3-3-5 4"/></svg>
              <div style={{fontSize:13}}>Image not available</div>
            </div>
          )}
          <div style={{marginTop:12,display:"flex",gap:8,alignItems:"center"}}>
            <div style={{fontWeight:700,fontFamily:"monospace"}}>{product.price ? `₹${Number(product.price).toLocaleString('en-IN')}` : '—'}</div>
            <div style={{marginLeft:"auto",fontSize:13,color:"var(--text-muted)"}}>{new Date(product.created_at).toLocaleString()}</div>
          </div>
        </div>

        <div>
          <div style={{display:"flex",gap:12,alignItems:"center"}}>
            <div style={{fontSize:18,fontWeight:700}}>{product.title}</div>
          </div>
          <div style={{marginTop:12,color:"var(--text-muted)"}}>{product.description || "No description provided."}</div>

          <div style={{marginTop:18,display:"flex",flexDirection:"column",gap:8}}>
            <div>
              <strong>Seller:</strong> {product.seller?.full_name || 'Unknown'} {product.seller?.verification_status === 'Verified' ? <span className="status-badge status-badge--verified">Verified Seller</span> : null}
            </div>
            <div>
              <strong>Blockchain:</strong> {product.blockchain_hash ? <span className="status-badge status-badge--verified">Verified</span> : <span className="status-badge status-badge--pending">Pending</span>}
            </div>
            <div style={{display:"flex",gap:8,alignItems:"center"}}>
              <div style={{fontFamily:"monospace"}}>{shortenHash(product.blockchain_hash)}</div>
              {product.blockchain_hash && <button className="btn btn-ghost btn-sm" onClick={handleCopy}>Copy</button>}
            </div>
          </div>

          {/* Related products */}
          <div style={{marginTop:28}}>
            <div style={{fontWeight:700,marginBottom:8}}>Related Listings</div>
            {related.length === 0 ? (
              <div style={{color:"var(--text-muted)"}}>No related listings.</div>
            ) : (
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))",gap:12}}>
                {related.map(r => (
                  <Link key={r.id} to={`/marketplace/${r.id}`} className="card-link" style={{padding:12,border:"1px solid var(--border)",borderRadius:8,textDecoration:"none",color:"inherit"}}>
                    <div style={{fontWeight:700}}>{r.title}</div>
                    <div style={{fontSize:12,color:"var(--text-muted)"}}>{r.seller?.full_name || 'Unknown'}</div>
                    <div style={{marginTop:6,fontFamily:"monospace",fontWeight:700}}>{r.price ? `₹${Number(r.price).toLocaleString('en-IN')}` : '—'}</div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;
