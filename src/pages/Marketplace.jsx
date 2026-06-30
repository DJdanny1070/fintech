import { useState, useEffect, useCallback } from "react";
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

const CATS = ["All", "Real Estate", "Renewable Energy", "Infrastructure", "Receivables", "Arts & Collectibles", "Other"];

const EMPTY_FORM = { title:"", description:"", category:"Real Estate", price:"", image:null };

function Marketplace() {
  const { user, profile } = useAuth();
  const isBusiness = profile?.role === "business";
  const toast = useToast();

  const [cat, setCat] = useState("All");
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState([]);
  const [loadingList, setLoadingList] = useState(true);

  // Create/Edit modal
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [modalError, setModalError] = useState("");

  const loadProducts = useCallback(async () => {
    setLoadingList(true);
    try {
      const data = await getProducts({ search, category: cat });
      setProducts(data);
    } catch (err) {
      console.error("Failed to load products:", err.message);
    } finally {
      setLoadingList(false);
    }
  }, [search, cat]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

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
        imageUrl = await uploadProductImage(form.image, user.id);
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
      } else {
        // Create
        const created = await createProduct(payload);
        const hash = await generateAndStoreHash("product", created.id, payload);
        await updateProduct(created.id, { blockchain_hash: hash });
      }

      setShowModal(false);
      loadProducts();
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
      toast.success("Order placed successfully!");
    } catch (err) {
      toast.error("Failed to place order: " + err.message);
    }
  };

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
            <input style={{border:"none",outline:"none",background:"none",width:"100%",fontSize:14}} placeholder="Search products..."
              value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <div style={{display:"flex",gap:"var(--sp-2)",flexWrap:"wrap"}}>
            {CATS.map(c => (
              <button key={c} onClick={() => setCat(c)}
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
            <div className="content-card__sub">{loadingList ? "Loading..." : `${products.length} results`}</div>
          </div>
        </div>
        <table className="data-table">
          <thead>
            <tr>
              <th>Product</th><th>Seller</th><th>Category</th>
              <th>Price</th><th>Verified</th><th></th>
            </tr>
          </thead>
          <tbody>
            {!loadingList && products.map(l => (
              <tr key={l.id}>
                <td style={{fontWeight:600,color:"var(--text-primary)"}}>
                  <Link to={`/marketplace/${l.id}`} style={{textDecoration:"none",color:"inherit"}}>{l.title}</Link>
                </td>
                <td>
                  <div style={{display:"flex",alignItems:"center",gap:"var(--sp-2)"}}>
                    <div style={{width:22,height:22,borderRadius:"50%",background:"var(--blue)",color:"#fff",fontSize:10,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                      {(l.seller?.full_name || "?")[0].toUpperCase()}
                    </div>
                    <div style={{display:'flex',alignItems:'center',gap:8}}>
                      <div>{l.seller?.full_name || "Unknown"}</div>
                      {l.seller?.verification_status === 'Verified' ? <span className="status-badge status-badge--verified">Verified Seller</span> : null}
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
            ))}
          </tbody>
        </table>
        {!loadingList && products.length === 0 && (
          <EmptyState title="No listings" description={<span>No listings match your filters. <Link to="/dashboard/marketplace" className="auth-link">Browse marketplace →</Link></span>} />
        )}
        {loadingList && (
          <div style={{padding:"var(--sp-4) 0"}}><LoadingSkeleton rows={4} /></div>
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
