import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { getProducts, getOrdersCounts, getRecentOrders, getGlobalCounts, getMyProducts } from "../services/productService";
import { getHashCount, getRecentHashes } from "../services/hashService";
import { getCounts, getRecentProfiles } from "../services/profileService";
import { getTotalCount, getTransactionsForUser } from "../services/transactionService";
import "./Dashboard.css";

function SummaryBarChart({ values, labels, color = "#075AD8" }) {
  const max = Math.max(1, ...values);
  const width = 320;
  const height = 110;
  const stepX = width / Math.max(1, values.length);
  const bars = values.map((value, idx) => ({
    x: 12 + idx * stepX + 8,
    y: height - 18 - (value / max) * 70,
    h: (value / max) * 70,
    label: labels[idx],
  }));

  return (
    <div style={{marginTop:12}}>
      <svg viewBox={`0 0 ${width} ${height}`} style={{width:"100%",height:110}} preserveAspectRatio="none">
        {bars.map((bar, idx) => (
          <g key={`${bar.label}-${idx}`}>
            <rect x={bar.x} y={bar.y} width={24} height={bar.h} rx="4" fill={color} opacity={0.8} />
            <text x={bar.x + 12} y={height - 4} textAnchor="middle" fontSize="10" fill="var(--text-muted)">{bar.label}</text>
          </g>
        ))}
      </svg>
    </div>
  );
}

function CategoryBarChart({ items }) {
  const max = Math.max(1, ...items.map((item) => item.value));
  return (
    <div style={{display:"grid",gap:8,marginTop:12}}>
      {items.map((item) => (
        <div key={item.label}>
          <div style={{display:"flex",justifyContent:"space-between",fontSize:12,color:"var(--text-muted)",marginBottom:4}}>
            <span>{item.label}</span>
            <span>{item.value}</span>
          </div>
          <div style={{height:8,borderRadius:999,background:"var(--bg)",overflow:"hidden"}}>
            <div style={{width:`${(item.value / max) * 100}%`,height:"100%",background:"var(--blue)"}} />
          </div>
        </div>
      ))}
    </div>
  );
}

function formatBalance(amount) {
  if (!amount && amount !== 0) return "—";
  return "₹" + Number(amount).toLocaleString("en-IN");
}

function formatLoginDate(value) {
  if (!value) return "Recently signed in";
  return new Date(value).toLocaleString("en-IN", { day: "numeric", month: "short", hour: "numeric", minute: "2-digit" });
}

function Dashboard() {
  const { profile, wallet, user } = useAuth();
  const [allProducts, setAllProducts] = useState([]);
  const [recentProducts, setRecentProducts] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [ordersSummary, setOrdersSummary] = useState({ received: 0, purchased: 0 });
  const [hashRecords, setHashRecords] = useState(0);
  const [globalCounts, setGlobalCounts] = useState({ products: 0, orders: 0 });
  const [recentUsers, setRecentUsers] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [recentHashes, setRecentHashes] = useState([]);
  const [myProductsCount, setMyProductsCount] = useState(0);
  const [profileCounts, setProfileCounts] = useState({ users: 0, verified_sellers: 0 });
  const [loadingData, setLoadingData] = useState(true);
  const [dashboardError, setDashboardError] = useState("");

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
      setLoadingData(true);
      setDashboardError("");

      try {
        const [myProducts, productsData, recentOrds, counts, hashCount, globalCountsData, recentUsersData, txs, hashRecordsData, profileMetrics, transactionCount] = await Promise.all([
          getMyProducts(user.id),
          getProducts({}),
          getRecentOrders(user.id, 8),
          getOrdersCounts(user.id),
          getHashCount(),
          getGlobalCounts(),
          getRecentProfiles(6),
          getTransactionsForUser(user.id, 10),
          getRecentHashes(8),
          getCounts(),
          getTotalCount(),
        ]);

        const sortedProducts = (productsData || []).sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));

        setMyProductsCount(myProducts?.length || 0);
        setAllProducts(sortedProducts);
        setRecentProducts(sortedProducts.slice(0, 4));
        setRecentOrders(recentOrds || []);
        setRecentUsers(recentUsersData || []);
        setTransactions(txs || []);
        setRecentHashes(hashRecordsData || []);
        setOrdersSummary(counts || { received: 0, purchased: 0 });
        setHashRecords(hashCount || 0);
        setGlobalCounts(globalCountsData || { products: 0, orders: 0 });
        setProfileCounts(profileMetrics || { users: 0, verified_sellers: 0 });
        setDashboardError("");
        setHashRecords((hashCount || 0) + (transactionCount || 0));
      } catch (err) {
        console.error("Dashboard load error:", err.message);
        setDashboardError(err.message || "We couldn’t load your dashboard data right now.");
      } finally {
        setLoadingData(false);
      }
    };

    load();
  }, [user]);

  const walletBalance = wallet?.balance ?? 0;
  const marketplaceValue = useMemo(() => allProducts.reduce((sum, product) => sum + (Number(product.price) || 0), 0), [allProducts]);
  const ordersTrend = useMemo(() => {
    const months = Array.from({ length: 6 }, (_, idx) => {
      const date = new Date();
      date.setMonth(date.getMonth() - (5 - idx));
      return { label: date.toLocaleString("en-IN", { month: "short" }), count: 0 };
    });

    recentOrders.forEach((order) => {
      const created = new Date(order.created_at);
      const monthIndex = months.findIndex((entry) => entry.label === created.toLocaleString("en-IN", { month: "short" }));
      if (monthIndex >= 0) months[monthIndex].count += 1;
    });

    return months;
  }, [recentOrders]);

  const transactionsTrend = useMemo(() => {
    const months = Array.from({ length: 6 }, (_, idx) => {
      const date = new Date();
      date.setMonth(date.getMonth() - (5 - idx));
      return { label: date.toLocaleString("en-IN", { month: "short" }), count: 0 };
    });

    transactions.forEach((tx) => {
      const created = new Date(tx.created_at);
      const monthIndex = months.findIndex((entry) => entry.label === created.toLocaleString("en-IN", { month: "short" }));
      if (monthIndex >= 0) months[monthIndex].count += 1;
    });

    return months;
  }, [transactions]);

  const categoryBreakdown = useMemo(() => {
    const counts = allProducts.reduce((acc, product) => {
      const category = product.category || "Other";
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(counts)
      .map(([label, value]) => ({ label, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);
  }, [allProducts]);

  const activityItems = [
    ...recentProducts.map((p) => ({
      type: "product",
      id: `product-${p.id}`,
      created_at: p.created_at,
      title: `New listing: ${p.title}`,
      meta: p,
    })),
    ...recentOrders.map((o) => ({
      type: "order",
      id: `order-${o.id}`,
      created_at: o.created_at,
      title: `Order: ${o.product?.title || "Order"}`,
      meta: o,
    })),
    ...transactions.map((t) => ({
      type: "transaction",
      id: `transaction-${t.id}`,
      created_at: t.created_at,
      title: `Tx: ${t.type}`,
      meta: t,
    })),
    ...recentUsers
      .filter((u) => u.verification_status)
      .map((u) => ({
        type: "verification",
        id: `verification-${u.id}`,
        created_at: u.updated_at || u.created_at,
        title: `Verification update: ${u.full_name || "User"} · ${u.verification_status}`,
        meta: u,
      })),
    ...recentHashes.map((h) => ({
      type: "hash",
      id: `hash-${h.id}`,
      created_at: h.created_at,
      title: `Hash: ${h.sha256_hash?.slice(0, 12) || "Hash"}`,
      meta: h,
    })),
  ]
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 8);

  return (
    <div>
      <div className="page-header">
        <div className="page-header__row">
          <div>
            <h1>{greeting}, {firstName} 👋</h1>
            <p>Here's what's happening with your portfolio today.</p>
          </div>
          <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
            <Link to="/dashboard/wallet" className="btn btn-primary">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              Add Funds
            </Link>
            <Link to="/dashboard/marketplace" className="btn btn-ghost btn-sm">Marketplace</Link>
            <Link to="/dashboard/wallet" className="btn btn-ghost btn-sm">Wallet</Link>
            <Link to="/dashboard/blockchain" className="btn btn-ghost btn-sm">Blockchain</Link>
            <Link to="/dashboard/profile" className="btn btn-ghost btn-sm">Profile</Link>
          </div>
        </div>
      </div>

      {dashboardError && (
        <div className="auth-error" style={{marginBottom:12,display:"flex",justifyContent:"space-between",alignItems:"center",gap:12}}>
          <span>{dashboardError}</span>
          <button className="btn btn-ghost btn-sm" onClick={() => { if (user) { setLoadingData(true); setDashboardError(""); } }}>Retry</button>
        </div>
      )}

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
            value: loadingData ? "Loading..." : String(profile ? myProductsCount : 0),
            change: "Latest listings",
            up: null,
            icon: "📦",
            bg: "var(--blue-light)",
          },
          {
            label: "Orders",
            value: loadingData ? "Loading..." : String((ordersSummary.received || 0) + (ordersSummary.purchased || 0)),
            change: `${ordersSummary.received || 0} received · ${ordersSummary.purchased || 0} purchased`,
            up: null,
            icon: "🏪",
            bg: "var(--bg-section)",
          },
          {
            label: "Account Role",
            value: loadingData ? "Loading..." : profile?.role
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
        {/* Analytics charts */}
        <div className="content-card">
          <div className="content-card__header">
            <div>
              <div className="content-card__title">Lightweight Analytics</div>
              <div className="content-card__sub">Orders, transactions and category trends</div>
            </div>
            <span className="badge badge-green">Live</span>
          </div>
          <div style={{display:"grid",gap:"var(--sp-4)"}}>
            <div>
              <div style={{fontWeight:700,marginBottom:4}}>Orders over time</div>
              <SummaryBarChart values={ordersTrend.map((item) => item.count)} labels={ordersTrend.map((item) => item.label)} />
            </div>
            <div>
              <div style={{fontWeight:700,marginBottom:4}}>Transactions over time</div>
              <SummaryBarChart values={transactionsTrend.map((item) => item.count)} labels={transactionsTrend.map((item) => item.label)} color="#16a34a" />
            </div>
            <div>
              <div style={{fontWeight:700,marginBottom:4}}>Products by category</div>
              <CategoryBarChart items={categoryBreakdown} />
            </div>
          </div>
        </div>

        {/* Quick stats + network status */}
        <div className="content-card">
          <div className="content-card__header">
            <div>
              <div className="content-card__title">Quick Statistics</div>
              <div className="content-card__sub">Snapshot of your current account</div>
            </div>
            <span className="badge badge-green"><span className="dot-live"></span> Live</span>
          </div>
          {[
            { label:"Verified Seller", value: profile?.verification_status === "Verified" ? "Verified" : profile?.verification_status || "Pending" },
            { label:"Wallet Balance", value: loadingData ? "Loading..." : formatBalance(walletBalance) },
            { label:"Marketplace Value", value: loadingData ? "Loading..." : formatBalance(marketplaceValue) },
            { label:"Recent Login", value: loadingData ? "Loading..." : formatLoginDate(user?.last_sign_in_at || profile?.updated_at || profile?.created_at) },
          ].map(s => (
            <div key={s.label} style={{display:"flex",justifyContent:"space-between",padding:"10px 0",borderBottom:"1px solid var(--border)",alignItems:"center"}}>
              <span style={{fontSize:13,color:"var(--text-muted)",fontWeight:500}}>{s.label}</span>
              <span style={{fontSize:14,fontWeight:700,color:"var(--text-primary)",letterSpacing:"-0.01em"}}>{s.value}</span>
            </div>
          ))}
          <div style={{marginTop:12,display:"grid",gap:8}}>
            {[
              { label:"Blockchain Records", value: loadingData ? "Loading..." : String(hashRecords) },
              { label:"Products Listed", value: loadingData ? "Loading..." : String(myProductsCount) },
              { label:"Orders Received", value: loadingData ? "Loading..." : String(ordersSummary.received || 0) },
              { label:"Orders Purchased", value: loadingData ? "Loading..." : String(ordersSummary.purchased || 0) },
              { label:"Total Transactions", value: loadingData ? "Loading..." : String(transactions.length) },
            ].map(s => (
              <div key={s.label} style={{display:"flex",justifyContent:"space-between",fontSize:13,color:"var(--text-muted)"}}>
                <span>{s.label}</span>
                <span style={{fontWeight:700,color:"var(--text-primary)"}}>{s.value}</span>
              </div>
            ))}
          </div>
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
          {loadingData ? (
            <div style={{textAlign:'center',padding:'var(--sp-6)',color:'var(--text-muted)'}}>Loading recent activity...</div>
          ) : activityItems.length === 0 ? (
            <div style={{textAlign:'center',padding:'var(--sp-6)',color:'var(--text-muted)'}}>No recent activity yet.</div>
          ) : (
            <ul style={{listStyle:'none',padding:0,margin:0}}>
              {activityItems.map(a => (
                <li key={`${a.type}-${a.id}`} style={{padding:'8px 0',borderBottom:'1px solid var(--border)'}}>
                  <div style={{display:'flex',justifyContent:'space-between',gap:12}}>
                    <div style={{fontWeight:700}}>{a.title}</div>
                    <div style={{fontSize:12,color:'var(--text-muted)',whiteSpace:'nowrap'}}>{new Date(a.created_at).toLocaleString()}</div>
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
