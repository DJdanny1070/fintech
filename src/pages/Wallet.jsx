import { useState } from "react";
import "./Dashboard.css";

const HISTORY = [
  { id:"W-091", type:"Received", party:"Rahul Kumar",     amount:"+₹12,500",  status:"verified", date:"27 Jun 2026" },
  { id:"W-090", type:"Purchase", party:"FinTechPro",      amount:"-₹2,500",   status:"verified", date:"27 Jun 2026" },
  { id:"W-089", type:"Deposit",  party:"HDFC Bank",       amount:"+₹50,000",  status:"pending",  date:"26 Jun 2026" },
  { id:"W-088", type:"Sent",     party:"Priya Sharma",    amount:"-₹8,000",   status:"verified", date:"25 Jun 2026" },
  { id:"W-087", type:"Deposit",  party:"SBI Savings",     amount:"+₹1,00,000",status:"verified", date:"23 Jun 2026" },
  { id:"W-086", type:"Purchase", party:"CreditPulse",     amount:"-₹999",     status:"verified", date:"21 Jun 2026" },
];

const ACTIONS = [
  { label:"Send",     icon:<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg> },
  { label:"Receive",  icon:<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/></svg> },
  { label:"Deposit",  icon:<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg> },
  { label:"Withdraw", icon:<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg> },
];

function MiniLineChart() {
  const pts = [40,55,48,62,70,65,80,74,88,82,95,91];
  const W=500, H=80, max=100;
  const s = pts.map((v,i) => `${(i/(pts.length-1))*(W-20)+10},${H-8-((v/max)*(H-16))}`).join(" ");
  const area = `10,${H} ` + s + ` ${W-10},${H}`;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{width:"100%",height:80}} preserveAspectRatio="none">
      <defs>
        <linearGradient id="wfill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#075AD8" stopOpacity="0.12"/>
          <stop offset="100%" stopColor="#075AD8" stopOpacity="0"/>
        </linearGradient>
      </defs>
      <polygon points={area} fill="url(#wfill)"/>
      <polyline points={s} fill="none" stroke="#075AD8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function Wallet() {
  const [modal, setModal] = useState(null);

  return (
    <div>
      <div className="page-header">
        <h1>Wallet</h1>
        <p>Manage your funds and transaction history</p>
      </div>

      <div className="two-col" style={{marginBottom:"var(--sp-5)"}}>
        {/* Balance card */}
        <div className="content-card" style={{borderLeft:"3px solid var(--blue)"}}>
          <div className="content-card__header">
            <div>
              <div className="content-card__title">Available Balance</div>
              <div className="content-card__sub">CresoX Wallet · Individual</div>
            </div>
            <span className="badge badge-green"><span className="dot-live"></span> Active</span>
          </div>
          <div style={{fontSize:38,fontWeight:800,letterSpacing:"-0.04em",color:"var(--text-primary)",marginBottom:"var(--sp-1)"}}>
            ₹2,41,320
          </div>
          <div style={{fontSize:13,color:"var(--text-muted)",marginBottom:"var(--sp-6)"}}>
            ↑ ₹12,500 received today
          </div>
          <MiniLineChart/>
          <div style={{display:"flex",gap:"var(--sp-3)",marginTop:"var(--sp-5)",flexWrap:"wrap"}}>
            {ACTIONS.map(a => (
              <button key={a.label} className="btn btn-secondary"
                onClick={() => setModal(a.label)}>
                {a.icon} {a.label}
              </button>
            ))}
          </div>
        </div>

        {/* Quick stats */}
        <div style={{display:"flex",flexDirection:"column",gap:"var(--sp-4)"}}>
          {[
            { label:"Total Received (Jun)",  value:"₹1,62,500",  up:true  },
            { label:"Total Sent (Jun)",       value:"₹48,999",    up:false },
            { label:"Marketplace Spend",      value:"₹12,199",    up:false },
            { label:"Blockchain Tx Fees",     value:"₹312",       up:null  },
          ].map(s => (
            <div className="kpi-card" key={s.label} style={{padding:"var(--sp-4) var(--sp-5)"}}>
              <div className="kpi-card__label">{s.label}</div>
              <div style={{display:"flex",alignItems:"baseline",justifyContent:"space-between",marginTop:"var(--sp-2)"}}>
                <span className="kpi-card__value" style={{fontSize:18}}>{s.value}</span>
                {s.up !== null && (
                  <span style={{fontSize:12,fontWeight:600,color:s.up?"var(--green)":"var(--red)"}}>
                    {s.up ? "↑ Received" : "↓ Outgoing"}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* History */}
      <div className="content-card">
        <div className="content-card__header">
          <div>
            <div className="content-card__title">Transaction History</div>
            <div className="content-card__sub">June 2026</div>
          </div>
          <button className="btn btn-ghost btn-sm">Export CSV</button>
        </div>
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th><th>Type</th><th>Party</th>
              <th>Amount</th><th>Status</th><th>Date</th>
            </tr>
          </thead>
          <tbody>
            {HISTORY.map(tx => (
              <tr key={tx.id}>
                <td style={{fontFamily:"monospace",color:"var(--text-muted)",fontSize:12}}>{tx.id}</td>
                <td>{tx.type}</td>
                <td style={{fontWeight:600,color:"var(--text-primary)"}}>{tx.party}</td>
                <td style={{fontWeight:700,fontFamily:"monospace",color:tx.amount.startsWith("+")?"var(--green)":"var(--text-primary)"}}>
                  {tx.amount}
                </td>
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

      {/* Modal */}
      {modal && (
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.35)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:200}}
          onClick={() => setModal(null)}>
          <div className="content-card animate-fade-up" style={{width:420,maxWidth:"90vw",margin:0}}
            onClick={e => e.stopPropagation()}>
            <div className="content-card__header">
              <div className="content-card__title">{modal}</div>
              <button className="btn btn-ghost btn-sm" onClick={() => setModal(null)}>✕</button>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:"var(--sp-4)"}}>
              {modal === "Send" && (
                <>
                  <div className="auth-field">
                    <label className="input-label">Recipient Email or User ID</label>
                    <input className="input" placeholder="user@example.com or USR-12345"/>
                  </div>
                  <div className="auth-field">
                    <label className="input-label">Amount (₹)</label>
                    <input className="input" type="number" placeholder="0.00"/>
                  </div>
                  <div className="auth-field">
                    <label className="input-label">Note (optional)</label>
                    <input className="input" placeholder="Invoice #123..."/>
                  </div>
                </>
              )}
              {modal === "Receive" && (
                <div style={{textAlign:"center",padding:"var(--sp-4)"}}>
                  <div style={{fontFamily:"monospace",fontSize:14,color:"var(--blue)",background:"var(--blue-light)",padding:"var(--sp-4)",borderRadius:"var(--r-md)",border:"1px solid var(--border-focus)",wordBreak:"break-all"}}>
                    USR-JM-4821-CRESOX
                  </div>
                  <p style={{fontSize:13,color:"var(--text-muted)",marginTop:"var(--sp-3)"}}>
                    Share this ID with the sender. Funds arrive instantly.
                  </p>
                </div>
              )}
              {(modal === "Deposit" || modal === "Withdraw") && (
                <>
                  <div className="auth-field">
                    <label className="input-label">Bank Account</label>
                    <select className="input">
                      <option>HDFC Bank •••• 4521</option>
                      <option>SBI Savings •••• 9012</option>
                    </select>
                  </div>
                  <div className="auth-field">
                    <label className="input-label">Amount (₹)</label>
                    <input className="input" type="number" placeholder="Minimum ₹100"/>
                  </div>
                </>
              )}
              <button className="btn btn-primary auth-submit" onClick={() => setModal(null)}>
                Confirm {modal}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Wallet;
