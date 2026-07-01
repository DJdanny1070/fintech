import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import {
  getProducts,
  createProduct,
  deleteProduct,
  uploadProductImage,
  createOrder,
} from "../services/productService";
import { generateAndStoreHash } from "../services/hashService";
import { updateProduct } from "../services/productService";
import "./Dashboard.css";
import { useToast } from "../components/common/ToastProvider";
import LoadingSkeleton from "../components/common/LoadingSkeleton";
import EmptyState from "../components/common/EmptyState";
import NetworkError from "../components/common/NetworkError";

const CATS = ["All", "Real Estate", "Renewable Energy", "Infrastructure", "Receivables", "Arts & Collectibles", "Other"];
const PAGE_SIZE = 8;

const EMPTY_FORM = { title:"", description:"", category:"Real Estate", price:"", image:null };

function formatDate(value) {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

function Marketplace() {
  const { user, profile } = useAuth();
  const isBusiness = profile?.role === "business";
  const toast = useToast();

  const [cat, setCat] = useState("All");
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [page, setPage] = useState(1);
  const [products, setProducts] = useState([]);
  const [loadingList, setLoadingList] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [failedImages, setFailedImages] = useState({});
  const lastRequestKey = useRef("");

  // Create/Edit modal
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [modalError, setModalError] = useState("");

  const loadProducts = useCallback(async (nextSearch = search, nextCategory = cat) => {
    const requestKey = `${nextCategory || "All"}::${(nextSearch || "").trim().toLowerCase()}`;
    if (lastRequestKey.current === requestKey) return;

    lastRequestKey.current = requestKey;
    setLoadingList(true);
    setLoadError("");
    try {
      const data = await getProducts({ search: nextSearch, category: nextCategory });
      setProducts(data || []);
    } catch (err) {
      setProducts([]);
      const message = err?.message?.includes("Failed to fetch") || err?.message?.includes("fetch")
        ? "We couldn’t reach the marketplace right now. Please try again in a moment."
        : err.message || "Failed to load products.";
      setLoadError(message);
      toast.error("Network error");
    } finally {
      setLoadingList(false);
    }
  }, [cat, search, toast]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setSearch(searchInput.trim());
      setPage(1);
    }, 250);

    return () => window.clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    let mounted = true;
    const loadCurrent = async () => {
      if (!mounted) return;
      await loadProducts(search, cat);
      if (mounted) setPage(1);
    };
    loadCurrent();
    return () => { mounted = false; };
  }, [cat, search, loadProducts]);

  const filteredProducts = useMemo(() => {
    const normalized = search.trim().toLowerCase();
    let result = [...products];

    if (normalized) {
      result = result.filter((product) => {
        const sellerName = product.seller?.full_name || "";
        const haystack = `${product.title || ""} ${product.description || ""} ${sellerName} ${product.category || ""}`.toLowerCase();
        return haystack.includes(normalized);
      });
    }

    switch (sortBy) {
      case "price-asc":
        result.sort((a, b) => (Number(a.price) || 0) - (Number(b.price) || 0));
        break;
      case "price-desc":
        result.sort((a, b) => (Number(b.price) || 0) - (Number(a.price) || 0));
        break;
      case "oldest":
        result.sort((a, b) => new Date(a.created_at || 0) - new Date(b.created_at || 0));
        break;
      case "newest":
      default:
        result.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
        break;
    }

    return result;
  }, [products, search, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const visibleProducts = useMemo(() => {
    const start = (safePage - 1) * PAGE_SIZE;
    return filteredProducts.slice(start, start + PAGE_SIZE);
  }, [filteredProducts, safePage]);

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  // ── Product CRUD ─────────────────────────────────────────────

  const openCreate = () => {
    setEditId(null);
    setForm(EMPTY_FORM);
    setModalError("");
    setShowModal(true);
  };

  const openEdit = (product) => {
    setEditId(product.id);
    setForm({
      title: product.title,
      description: product.description || "",
      category: product.category || "Real Estate",
      price: product.price ?? "",
      image: null,
    });
    setModalError("");
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setModalError("");
    try {
      let imageUrl = null;
      if (form.image) {
        try {
          imageUrl = await uploadProductImage(form.image, user.id);
        } catch (err) {
          toast.error("Image upload failed");
          throw err;
        }
      }

      const payload = {
        title: form.title,
        description: form.description,
        category: form.category,
        price: parseFloat(form.price) || 0,
        seller_id: user.id,
        ...(imageUrl && { image_url: imageUrl }),
      };

      if (editId) {
        // Update
        const updated = await updateProduct(editId, payload);
        const hash = await generateAndStoreHash("product", updated.id, payload);
        await updateProduct(updated.id, { blockchain_hash: hash });
        toast.success("Product updated");
      } else {
        // Create
        const created = await createProduct(payload);
        const hash = await generateAndStoreHash("product", created.id, payload);
        await updateProduct(created.id, { blockchain_hash: hash });
        toast.success("Product listed");
      }

      setShowModal(false);
      await loadProducts(search, cat);
    } catch (err) {
      setModalError(err.message || "Failed to save product.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    try {
      await deleteProduct(id);
      setProducts(prev => prev.filter(p => p.id !== id));
      toast.success("Product deleted");
    } catch (err) {
      toast.error("Failed to delete: " + err.message);
    }
  };

  const handleBuy = async (product) => {
    if (!user) return;
    try {
      await createOrder({
        buyerId: user.id,
        sellerId: product.seller_id,
        productId: product.id,
      });
      toast.success("Order placed");
    } catch (err) {
      toast.error("Failed to place order: " + err.message);
    }
  };

  const handleImageError = (productId) => {
    setFailedImages(prev => ({ ...prev, [productId]: true }));
  };

  const clearFilters = () => {
    setSearchInput("");
    setSearch("");
    setCat("All");
    setSortBy("newest");
    setPage(1);
  };

  const hasActiveFilters = Boolean(search.trim() || cat !== "All" || sortBy !== "newest");
  const isEmptyState = !loadingList && filteredProducts.length === 0;

  return (
    <div>
      <div className="page-header">
        <div className="page-header__row">
          <div>
            <h1>Marketplace</h1>
            <p>{products.length} verified tokenized asset listings</p>
          </div>
          {isBusiness && (
            <button className="btn btn-primary" onClick={openCreate}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              List a Product
            </button>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="content-card" style={{marginBottom:"var(--sp-5)"}}>
        <div style={{display:"flex",gap:"var(--sp-4)",alignItems:"center",flexWrap:"wrap"}}>
          <div style={{display:"flex",alignItems:"center",gap:"var(--sp-2)",background:"var(--bg)",border:"1px solid var(--border)",borderRadius:"var(--r-md)",padding:"8px 12px",flex:1,minWidth:200}}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input style={{border:"none",outline:"none",background:"none",width:"100%",fontSize:14}} placeholder="Search title, description, seller or category..."
              value={searchInput} onChange={e => setSearchInput(e.target.value)} />
          </div>
          <select className="input" value={sortBy} onChange={(e) => { setSortBy(e.target.value); setPage(1); }} style={{minWidth:160}}>
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="price-asc">Lowest price</option>
            <option value="price-desc">Highest price</option>
          </select>
          <div style={{display:"flex",gap:"var(--sp-2)",flexWrap:"wrap"}}>
            {CATS.map(c => (
              <button key={c} onClick={() => { setCat(c); setPage(1); }}
                className={`btn btn-sm ${cat===c?"btn-primary":"btn-secondary"}`}>
                {c}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="content-card">
        <div className="content-card__header">
          <div>
            <div className="content-card__title">Available Listings</div>
            <div className="content-card__sub">{loadingList ? "Loading..." : `${filteredProducts.length} results`}</div>
          </div>
        </div>
        {loadError ? (
          <div style={{marginBottom:"var(--sp-4)"}}>
            <NetworkError message={loadError} />
          </div>
        ) : null}
        <table className="data-table">
          <thead>
            <tr>
              <th>Product</th><th>Seller</th><th>Category</th>
              <th>Price</th><th>Verified</th><th></th>
            </tr>
          </thead>
          <tbody>
            {loadingList ? (
              <tr>
                <td colSpan="6">
                  <div style={{padding:"var(--sp-4) 0"}}><LoadingSkeleton rows={4} /></div>
                </td>
              </tr>
            ) : (
              visibleProducts.map(l => (
              <tr key={l.id}>
                <td style={{fontWeight:600,color:"var(--text-primary)"}}>
                  <div style={{display:"flex",alignItems:"center",gap:"var(--sp-3)"}}>
                    <div style={{width:48,height:48,borderRadius:8,overflow:"hidden",background:"var(--bg)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                      {l.image_url && !failedImages[l.id] ? (
                        <img
                          src={l.image_url}
                          alt={l.title}
                          loading="lazy"
                          decoding="async"
                          style={{width:"100%",height:"100%",objectFit:"cover"}}
                          onError={() => handleImageError(l.id)}
                        />
                      ) : (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{color:"var(--text-muted)"}}>
                          <rect x="3" y="3" width="18" height="14" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 21l-6-5-4 4-3-3-5 4"/></svg>
                      )}
                    </div>
                    <div>
                      <Link to={`/marketplace/product/${l.id}`} style={{textDecoration:"none",color:"inherit"}}>{l.title}</Link>
                      <div style={{fontSize:12,color:"var(--text-muted)",marginTop:4}}>{formatDate(l.created_at)}</div>
                      <div style={{display:"flex",gap:6,marginTop:6,flexWrap:"wrap"}}>
                        {l.seller?.verification_status === "Verified" ? <span className="status-badge status-badge--verified">Verified Seller</span> : null}
                        {l.blockchain_hash ? <span className="status-badge status-badge--verified">Blockchain Verified</span> : null}
                      </div>
                    </div>
                  </div>
                </td>
                <td>
                  <div style={{display:"flex",alignItems:"center",gap:"var(--sp-2)"}}>
                    <div style={{width:22,height:22,borderRadius:"50%",background:"var(--blue)",color:"#fff",fontSize:10,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                      {(l.seller?.full_name || "?")[0].toUpperCase()}
                    </div>
                    <div style={{display:'flex',alignItems:'center',gap:8}}>
                      <div>{l.seller?.full_name || "Unknown"}</div>
                    </div>
                  </div>
                </td>
                <td><span className="badge badge-gray">{l.category || "—"}</span></td>
                <td style={{fontFamily:"monospace",fontWeight:700}}>
                  {l.price ? `₹${Number(l.price).toLocaleString("en-IN")}` : "—"}
                </td>
                <td>
                  {l.blockchain_hash ? (
                    <span className="status-badge status-badge--verified">✔ Blockchain Verified</span>
                  ) : (
                    <span className="status-badge status-badge--pending">⏳ Pending</span>
                  )}
                </td>
                <td style={{display:"flex",gap:"var(--sp-2)",alignItems:"center"}}>
                  {l.seller_id === user?.id ? (
                    <>
                      <button className="btn btn-ghost btn-sm" onClick={() => openEdit(l)}>Edit</button>
                      <button className="btn btn-ghost btn-sm" style={{color:"var(--red)"}} onClick={() => handleDelete(l.id)}>Delete</button>
                    </>
                  ) : (
                    <button className="btn btn-primary btn-sm" onClick={() => handleBuy(l)}>Buy</button>
                  )}
                </td>
              </tr>
              ))
            )}
          </tbody>
        </table>
        {isEmptyState && (
          <EmptyState
            title={products.length === 0 ? "No products available" : "No search results"}
            description={products.length === 0 ? "There are no marketplace listings yet. Try again later or list the first product." : "Try a different keyword or clear the active filters to see more listings."}
            action={
              <div style={{display:"flex",gap:"var(--sp-2)",justifyContent:"center",flexWrap:"wrap"}}>
                <button className="btn btn-secondary btn-sm" onClick={clearFilters}>Clear filters</button>
                {isBusiness && <button className="btn btn-primary btn-sm" onClick={openCreate}>List a Product</button>}
              </div>
            }
          />
        )}
        {!loadingList && filteredProducts.length > 0 && (
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:"var(--sp-4)",flexWrap:"wrap",gap:"var(--sp-3)"}}>
            <div style={{color:"var(--text-muted)",fontSize:13}}>
              Showing {((safePage - 1) * PAGE_SIZE) + 1}-{Math.min(safePage * PAGE_SIZE, filteredProducts.length)} of {filteredProducts.length}
            </div>
            <div style={{display:"flex",gap:"var(--sp-2)"}}>
              <button className="btn btn-ghost btn-sm" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={safePage === 1}>Previous</button>
              <button className="btn btn-ghost btn-sm" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={safePage === totalPages}>Next</button>
            </div>
          </div>
        )}
      </div>

      {/* Create/Edit Product Modal */}
      {showModal && (
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.4)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:200}}
          onClick={() => setShowModal(false)}>
          <div className="content-card animate-fade-up" style={{width:520,maxWidth:"95vw",margin:0}}
            onClick={e => e.stopPropagation()}>
            <div className="content-card__header">
              <div className="content-card__title">{editId ? "Edit Product" : "List a New Product"}</div>
              <button className="btn btn-ghost btn-sm" onClick={() => setShowModal(false)}>✕</button>
            </div>

            {modalError && <div className="auth-error" style={{marginBottom:"var(--sp-4)"}}>{modalError}</div>}

            <form onSubmit={handleSave}>
              <div style={{display:"flex",flexDirection:"column",gap:"var(--sp-4)"}}>
                <div className="auth-field">
                  <label className="input-label">Product Title *</label>
                  <input className="input" required value={form.title}
                    onChange={e => setForm({...form, title:e.target.value})} placeholder="e.g. Commercial Property Token" />
                </div>
                <div className="auth-field">
                  <label className="input-label">Description</label>
                  <textarea className="input" rows={3} value={form.description}
                    onChange={e => setForm({...form, description:e.target.value})}
                    placeholder="Brief description of the asset..." style={{resize:"vertical"}} />
                </div>
                <div className="auth-form-row">
                  <div className="auth-field">
                    <label className="input-label">Category *</label>
                    <select className="input" value={form.category}
                      onChange={e => setForm({...form, category:e.target.value})}>
                      {CATS.filter(c => c !== "All").map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                  <div className="auth-field">
                    <label className="input-label">Price (₹) *</label>
                    <input className="input" type="number" min="0" required value={form.price}
                      onChange={e => setForm({...form, price:e.target.value})} placeholder="0" />
                  </div>
                </div>
                <div className="auth-field">
                  <label className="input-label">Product Image</label>
                  <input className="input" type="file" accept="image/*"
                    onChange={e => setForm({...form, image: e.target.files[0] || null})} />
                  <p style={{fontSize:12,color:"var(--text-muted)",marginTop:4}}>
                    Uploaded to Supabase Storage. Leave blank to keep existing.
                  </p>
                </div>
                <button type="submit" className="btn btn-primary auth-submit" disabled={saving}>
                  {saving ? <><span className="spinner"/> Saving...</> : editId ? "Save Changes" : "List Product →"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Marketplace;
