import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { getMyOrders } from "../services/productService";
import "./Dashboard.css";

function Orders() {
  const { user, profile } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      setError("");
      try {
        if (!user) {
          setOrders([]);
          return;
        }
        const data = await getMyOrders(user.id);
        if (!mounted) return;
        setOrders(data || []);
      } catch (err) {
        if (!mounted) return;
        setError(err.message || "Failed to load orders.");
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => (mounted = false);
  }, [user]);

  const isBusiness = profile?.role === "business";
  const visibleOrders = orders.filter(o => isBusiness ? o.seller_id === user.id : o.buyer_id === user.id);

  const byStatus = (status) => visibleOrders.filter(o => (o.status || "").toLowerCase() === status);

  if (loading) {
    return (
      <div className="content-card">
        <div className="content-card__header">
          <div>
            <div className="content-card__title">Orders</div>
            <div className="content-card__sub">Loading your orders...</div>
          </div>
        </div>
        <div style={{padding:"var(--sp-6)",display:"grid",gap:12}}>
          <div style={{height:72,background:"#f3f3f3",borderRadius:8}} />
          <div style={{height:72,background:"#f3f3f3",borderRadius:8}} />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="content-card">
        <div style={{padding:"var(--sp-6)",color:"var(--red)"}}>{error}</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="content-card">
        <div style={{padding:"var(--sp-6)",color:"var(--text-muted)"}}>Please log in to view orders.</div>
      </div>
    );
  }

  const sections = [
    { key: "pending", title: "Pending Orders" },
    { key: "completed", title: "Completed Orders" },
    { key: "cancelled", title: "Cancelled Orders" },
  ];

  return (
    <div>
      <div className="page-header">
        <div className="page-header__row">
          <div>
            <h1>Orders</h1>
            <p>{visibleOrders.length} {isBusiness ? "orders received" : "purchases"}</p>
          </div>
        </div>
      </div>

      {sections.map(sec => {
        const list = byStatus(sec.key);
        return (
          <div key={sec.key} className="content-card" style={{marginBottom:"var(--sp-5)"}}>
            <div className="content-card__header">
              <div>
                <div className="content-card__title">{sec.title}</div>
                <div className="content-card__sub">{list.length} results</div>
              </div>
            </div>

            {list.length === 0 ? (
              <div style={{padding:"var(--sp-6)",color:"var(--text-muted)"}}>No {sec.title.toLowerCase()}.</div>
            ) : (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Buyer</th>
                    <th>Seller</th>
                    <th>Price</th>
                    <th>Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {list.map(o => (
                    <tr key={o.id}>
                      <td style={{display:"flex",alignItems:"center",gap:12}}>
                        {o.product?.image_url ? (
                          <img src={o.product.image_url} alt={o.product?.title} style={{width:44,height:44,objectFit:"cover",borderRadius:6}} />
                        ) : (
                          <div style={{width:44,height:44,background:"var(--bg)",borderRadius:6}} />
                        )}
                        <div style={{fontWeight:700}}>{o.product?.title || "Unknown"}</div>
                      </td>
                      <td>{o.buyer?.full_name || 'Unknown'}</td>
                      <td>{o.seller?.full_name || 'Unknown'}</td>
                      <td style={{fontFamily:"monospace",fontWeight:700}}>{o.product?.price ? `₹${Number(o.product.price).toLocaleString('en-IN')}` : '—'}</td>
                      <td>{new Date(o.created_at).toLocaleString()}</td>
                      <td>
                        <span className={`status-badge ${o.status === 'completed' ? 'status-badge--success' : o.status === 'cancelled' ? 'status-badge--danger' : 'status-badge--pending'}`}>
                          {o.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default Orders;
