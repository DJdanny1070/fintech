import { Link } from "react-router-dom";
import "./Dashboard.css";

const TRANSACTIONS = [
  { id:"#4821", type:"Incoming", party:"Rahul Kumar",     amount:"+₹12,500", status:"verified", date:"27 Jun 2026" },
  { id:"#4820", type:"Purchase", party:"FinTechPro Suite", amount:"-₹2,500",  status:"verified", date:"27 Jun 2026" },
  { id:"#4819", type:"Deposit",  party:"HDFC Bank",        amount:"+₹50,000", status:"pending",  date:"26 Jun 2026" },
  { id:"#4818", type:"Outgoing", party:"Priya Sharma",     amount:"-₹8,000",  status:"verified", date:"25 Jun 2026" },
  { id:"#4817", type:"Purchase", party:"CreditPulse",      amount:"-₹999",    status:"verified", date:"24 Jun 2026" },
];

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

function Dashboard() {
  return (
    <div>
      <div className="page-header">
        <div className="page-header__row">
          <div>
            <h1>Good Morning, Jonathan 👋</h1>
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
          { label:"Portfolio Value", value:"₹12.4 Cr",   change:"↑ 14.5% this month",  up:true,    icon:"📈", bg:"var(--blue-light)" },
          { label:"Wallet Balance",  value:"₹2,41,320",  change:"↑ ₹12,500 today",      up:true,    icon:"💳", bg:"var(--green-light)" },
          { label:"Transactions",    value:"12,847",      change:"↑ 234 this week",       up:true,    icon:"⚡", bg:"var(--amber-light)" },
          { label:"Marketplace",     value:"7 Orders",   change:"2 pending review",      up:null,   icon:"🏪", bg:"var(--bg-section)" },
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
            { label:"Latest Block",    value:"#91,432" },
            { label:"Transactions/s",  value:"142 TPS" },
            { label:"Hash Rate",       value:"84.2 GH/s" },
            { label:"Avg. Block Time", value:"1.18s" },
            { label:"Active Nodes",    value:"1,284" },
            { label:"Your Verified",   value:"12,847 txns" },
          ].map(s => (
            <div key={s.label} style={{display:"flex",justifyContent:"space-between",padding:"10px 0",borderBottom:"1px solid var(--border)",alignItems:"center"}}>
              <span style={{fontSize:13,color:"var(--text-muted)",fontWeight:500}}>{s.label}</span>
              <span style={{fontSize:14,fontWeight:700,color:"var(--text-primary)",letterSpacing:"-0.01em"}}>{s.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Transactions */}
      <div className="content-card">
        <div className="content-card__header">
          <div>
            <div className="content-card__title">Recent Transactions</div>
            <div className="content-card__sub">Last 5 transactions</div>
          </div>
          <Link to="/dashboard/wallet" className="btn btn-ghost btn-sm">View all →</Link>
        </div>
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th><th>Type</th><th>Party</th>
              <th>Amount</th><th>Status</th><th>Date</th>
            </tr>
          </thead>
          <tbody>
            {TRANSACTIONS.map(tx => (
              <tr key={tx.id}>
                <td style={{fontFamily:"monospace",color:"var(--text-muted)"}}>{tx.id}</td>
                <td>{tx.type}</td>
                <td style={{fontWeight:600,color:"var(--text-primary)"}}>{tx.party}</td>
                <td style={{fontFamily:"monospace",fontWeight:700,color:tx.amount.startsWith("+")?'var(--green)':'var(--text-primary)'}}>{tx.amount}</td>
                <td>
                  <span className={`status-badge status-badge--${tx.status}`}>
                    {tx.status === "verified" ? "✓ Verified" : "⏳ Pending"}
                  </span>
                </td>
                <td style={{color:"var(--text-muted)"}}>{tx.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Dashboard;
