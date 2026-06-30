import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { getRecentProducts, getOrdersCounts, getRecentOrders, getGlobalCounts } from "../services/productService";
import { getHashCount } from "../services/hashService";
import { getRecentProfiles } from "../services/profileService";
import { getRecentActivity } from "../services/activityService";
import "./Dashboard.css";

function MiniChart() {
  const pts = [60,50,58,40,38,28,20,14,8];
  const max = 70;
  const W = 500, H = 100;
  const ptsStr = pts.map((v, i) => {
    const x = (i / (pts.length - 1)) * (W - 20) + 10;
    const y = H - 12 - ((max - v) / max) * (H - 24);
    return `${x},${y}`;
  }).join(" ");
  const area = `10,${H} ` + ptsStr + ` ${W-10},${H}`;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{width:"100%",height:100}} preserveAspectRatio="none">
      <defs>
        <linearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#075AD8" stopOpacity="0.1"/>
          <stop offset="100%" stopColor="#075AD8" stopOpacity="0"/>
        </linearGradient>
      </defs>
      {[0,1,2,3].map(i => (
        <line key={i} x1="0" y1={20+i*22} x2={W} y2={20+i*22}
          stroke="#F3F4F6" strokeWidth="1"/>
      ))}
      <polygon points={area} fill="url(#chartFill)"/>
      <polyline points={ptsStr} fill="none" stroke="#075AD8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function formatBalance(amount) {
  if (!amount && amount !== 0) return "—";
  return "₹" + Number(amount).toLocaleString("en-IN");
}

function Dashboard() {
  const { profile, wallet, user } = useAuth();
  const [recentProducts, setRecentProducts] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [ordersSummary, setOrdersSummary] = useState({ received: 0, purchased: 0 });
  const [hashRecords, setHashRecords] = useState(0);
  const [globalCounts, setGlobalCounts] = useState({ products: 0, orders: 0 });
  const [recentUsers, setRecentUsers] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [loadingData, setLoadingData] = useState(true);

  const greeting = (() => {
    const h = new Date().getHours();
    if (h < 12) return "Good Morning";
    if (h < 17) return "Good Afternoon";
    return "Good Evening";
  })();

  const firstName = profile?.full_name?.split(" ")[0] || "there";

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      try {
        const [recentProds, recentOrds, counts, hashCount, globalCounts, recentUsersData, activity] = await Promise.all([
          getRecentProducts(3),
          getRecentOrders(user.id, 5),
          getOrdersCounts(user.id),
          getHashCount(),
          getGlobalCounts(),
          getRecentProfiles(5),
          getRecentActivity(8),
        ]);

        setRecentProducts(recentProds || []);
        setRecentOrders(recentOrds || []);
        setRecentUsers(recentUsersData || []);
        setRecentActivity(activity || []);
        setOrdersSummary(counts || { received: 0, purchased: 0 });
        setHashRecords(hashCount || 0);
        setGlobalCounts(globalCounts || { products: 0, orders: 0 });
      } catch (err) {
        console.error("Dashboard load error:", err.message);
      } finally {
        setLoadingData(false);
      }
    };
    load();
  }, [user]);

  const walletBalance = wallet?.balance ?? 0;

  return (
    <div>
      <div className="page-header">
        <div className="page-header__row">
          <div>
            <h1>{greeting}, {firstName} 👋</h1>
            <p>Here's what's happening with your portfolio today.</p>
          </div>
          <Link to="/dashboard/wallet" className="btn btn-primary">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Add Funds
          </Link>
        </div>
      </div>

      {/* KPIs */}
      <div className="kpi-grid">
        {[
          {
            label: "Wallet Balance",
            value: formatBalance(walletBalance),
            change: "Initial deposit",
            up: true,
            icon: "💳",
            bg: "var(--green-light)",
          },
          {
            label: "My Products",
            value: String(profile ? (recentProducts.length) : 0),
            change: "Latest listings",
            up: null,
            icon: "📦",
            bg: "var(--blue-light)",
          },
          {
            label: "Orders",
            value: String((ordersSummary.received || 0) + (ordersSummary.purchased || 0)),
            change: `${ordersSummary.received || 0} received · ${ordersSummary.purchased || 0} purchased`,
            up: null,
            icon: "🏪",
            bg: "var(--bg-section)",
          },
          {
            label: "Account Role",
            value: profile?.role
              ? profile.role.charAt(0).toUpperCase() + profile.role.slice(1)
              : "—",
            change: profile?.verification_status
              ? `Status: ${profile.verification_status}`
              : "Active",
            up: null,
            icon: "👤",
            bg: "var(--amber-light)",
          },
        ].map(k => (
          <div className="kpi-card" key={k.label}>
            <div className="kpi-card__top">
              <span className="kpi-card__label">{k.label}</span>
              <div className="kpi-card__icon" style={{background:k.bg}}>{k.icon}</div>
            </div>
            <div className="kpi-card__value">{k.value}</div>
            <div className={`kpi-card__change ${k.up===true?"up":k.up===false?"down":"neutral"}`}>
              {k.change}
            </div>
          </div>
        ))}
      </div>

      {/* Main row */}
      <div className="two-col" style={{marginBottom:"var(--sp-5)"}}>
        {/* Chart */}
        <div className="content-card">
          <div className="content-card__header">
            <div>
              <div className="content-card__title">Portfolio Performance</div>
              <div className="content-card__sub">YTD growth · Jan – Jun 2026</div>
            </div>
            <span className="badge badge-green">↑ 14.5%</span>
          </div>
          <MiniChart/>
          <div style={{display:"flex",justifyContent:"space-between",marginTop:"var(--sp-3)"}}>
            {["Jan","Feb","Mar","Apr","May","Jun"].map(m => (
              <span key={m} style={{fontSize:11,color:"var(--text-subtle)"}}>{m}</span>
            ))}
          </div>
        </div>

        {/* Blockchain status */}
        <div className="content-card">
          <div className="content-card__header">
            <div>
              <div className="content-card__title">Network Status</div>
              <div className="content-card__sub">CresoX Blockchain</div>
            </div>
            <span className="badge badge-green"><span className="dot-live"></span> Live</span>
          </div>
          {[
            { label:"Blockchain Records", value: String(hashRecords) },
            { label:"Total Products", value: String((globalCounts?.products) ?? "—") },
            { label:"Total Orders", value: String((globalCounts?.orders) ?? "—") },
            { label:"Your Wallet",     value: formatBalance(walletBalance) },
          ].map(s => (
            <div key={s.label} style={{display:"flex",justifyContent:"space-between",padding:"10px 0",borderBottom:"1px solid var(--border)",alignItems:"center"}}>
              <span style={{fontSize:13,color:"var(--text-muted)",fontWeight:500}}>{s.label}</span>
              <span style={{fontSize:14,fontWeight:700,color:"var(--text-primary)",letterSpacing:"-0.01em"}}>{s.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Products */}
      <div className="content-card" style={{marginBottom:"var(--sp-5)"}}>
        <div className="content-card__header">
          <div>
            <div className="content-card__title">Recent Products</div>
            <div className="content-card__sub">Latest listings in the marketplace</div>
          </div>
          <Link to="/dashboard/marketplace" className="btn btn-ghost btn-sm">View all →</Link>
        </div>
        {loadingData ? (
          <div style={{textAlign:"center",padding:"var(--sp-8)",color:"var(--text-muted)"}}>
            Loading...
          </div>
        ) : recentProducts.length === 0 ? (
          <div style={{textAlign:"center",padding:"var(--sp-8)",color:"var(--text-muted)"}}>
            No products listed yet.{" "}
            <Link to="/dashboard/marketplace" className="auth-link">Browse marketplace →</Link>
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Product</th><th>Category</th><th>Price</th><th>Verified</th>
              </tr>
            </thead>
            <tbody>
              {recentProducts.map(p => (
                <tr key={p.id}>
                  <td style={{fontWeight:600,color:"var(--text-primary)"}}>{p.title}</td>
                  <td><span className="badge badge-gray">{p.category || "—"}</span></td>
                  <td style={{fontFamily:"monospace",fontWeight:700}}>
                    {p.price ? `₹${Number(p.price).toLocaleString("en-IN")}` : "—"}
                  </td>
                  <td>
                    <div style={{display:'flex',flexDirection:'column',gap:6}}>
                      <div>
                        {p.blockchain_hash ? (
                          <span className="status-badge status-badge--verified">✔ Blockchain Verified</span>
                        ) : (
                          <span className="status-badge status-badge--pending">⏳ Pending</span>
                        )}
                      </div>
                      {p.seller?.verification_status === 'Verified' ? (
                        <div><span className="status-badge status-badge--verified">Verified Seller</span></div>
                      ) : null}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Recent Users + Activity */}
      <div className="two-col" style={{marginBottom:"var(--sp-5)"}}>
        <div className="content-card">
          <div className="content-card__header">
            <div>
              <div className="content-card__title">Recently Registered Users</div>
              <div className="content-card__sub">Newest accounts on the platform</div>
            </div>
            <Link to="/dashboard/profile" className="btn btn-ghost btn-sm">View all →</Link>
          </div>
          {recentUsers.length === 0 ? (
            <div style={{textAlign:'center',padding:'var(--sp-6)',color:'var(--text-muted)'}}>No recent users.</div>
          ) : (
            <ul style={{listStyle:'none',padding:0,margin:0}}>
              {recentUsers.map(u => (
                <li key={u.id} style={{display:'flex',alignItems:'center',gap:12,padding:'8px 0',borderBottom:'1px solid var(--border)'}}>
                  <div style={{width:36,height:36,borderRadius:8,background:'var(--bg)',display:'flex',alignItems:'center',justifyContent:'center'}}>{(u.full_name||'?')[0]}</div>
                  <div style={{flex:1}}>
                    <div style={{fontWeight:700}}>{u.full_name}</div>
                    <div style={{fontSize:12,color:'var(--text-muted)'}}>{u.email}</div>
                  </div>
                  <div style={{fontSize:12,color:'var(--text-muted)'}}>{new Date(u.created_at).toLocaleDateString()}</div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="content-card">
          <div className="content-card__header">
            <div>
              <div className="content-card__title">Recent Activity</div>
              <div className="content-card__sub">Latest actions across the platform</div>
            </div>
            <Link to="/dashboard/analytics" className="btn btn-ghost btn-sm">More →</Link>
          </div>
          {recentActivity.length === 0 ? (
            <div style={{textAlign:'center',padding:'var(--sp-6)',color:'var(--text-muted)'}}>No recent activity.</div>
          ) : (
            <ul style={{listStyle:'none',padding:0,margin:0}}>
              {recentActivity.map(a => (
                <li key={`${a.type}-${a.id}`} style={{padding:'8px 0',borderBottom:'1px solid var(--border)'}}>
                  <div style={{display:'flex',justifyContent:'space-between'}}>
                    <div style={{fontWeight:700}}>{a.type === 'product' ? `New listing: ${a.title}` : a.type === 'order' ? `Order: ${a.title}` : a.type === 'transaction' ? `Tx: ${a.title}` : `Hash: ${a.title}`}</div>
                    <div style={{fontSize:12,color:'var(--text-muted)'}}>{new Date(a.created_at).toLocaleString()}</div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Recent Orders */}
      <div className="content-card">
        <div className="content-card__header">
          <div>
            <div className="content-card__title">Recent Orders</div>
            <div className="content-card__sub">Last {recentOrders.length} orders</div>
          </div>
        </div>
        {loadingData ? (
          <div style={{textAlign:"center",padding:"var(--sp-8)",color:"var(--text-muted)"}}>
            Loading...
          </div>
        ) : recentOrders.length === 0 ? (
          <div style={{textAlign:"center",padding:"var(--sp-8)",color:"var(--text-muted)"}}>
            No orders yet.
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Product</th><th>Role</th><th>Price</th><th>Status</th><th>Date</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map(o => (
                <tr key={o.id}>
                  <td style={{fontWeight:600,color:"var(--text-primary)"}}>{o.product?.title || "—"}</td>
                  <td>{o.buyer_id === user?.id ? "Buyer" : "Seller"}</td>
                  <td style={{fontFamily:"monospace",fontWeight:700}}>
                    {o.product?.price ? `₹${Number(o.product.price).toLocaleString("en-IN")}` : "—"}
                  </td>
                  <td>
                    <span className={`status-badge status-badge--${o.status}`}>
                      {o.status === "verified" ? "✓ Verified" : o.status === "pending" ? "⏳ Pending" : o.status}
                    </span>
                  </td>
                  <td style={{color:"var(--text-muted)"}}>
                    {new Date(o.created_at).toLocaleDateString("en-IN", { day:"2-digit", month:"short", year:"numeric" })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
