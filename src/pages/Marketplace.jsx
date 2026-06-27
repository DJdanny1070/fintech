import { useState } from "react";
import "./Dashboard.css";

const LISTINGS = [
  { id:"L-001", title:"Premium Analytics Suite",      seller:"FinTechPro",   cat:"Analytics",    price:"₹2,500", rating:4.9, verified:true },
  { id:"L-002", title:"Investment Portfolio API",     seller:"CodeFinance",  cat:"Developer",    price:"₹4,000", rating:4.7, verified:true },
  { id:"L-003", title:"Business Credit Score Report", seller:"CreditPulse",  cat:"Compliance",   price:"₹999",   rating:4.8, verified:true },
  { id:"L-004", title:"Crypto Wallet Integration",    seller:"BlockDev",     cat:"Blockchain",   price:"₹6,500", rating:4.6, verified:true },
  { id:"L-005", title:"Tax Compliance Automation",    seller:"TaxPilot",     cat:"Compliance",   price:"₹3,200", rating:4.5, verified:true },
  { id:"L-006", title:"Smart Invoice Generator",      seller:"InvoiceAI",    cat:"Analytics",    price:"₹1,500", rating:4.7, verified:true },
  { id:"L-007", title:"KYC Verification Suite",       seller:"SecureVerify", cat:"Compliance",   price:"₹5,000", rating:4.8, verified:true },
  { id:"L-008", title:"Real-time FX Rate API",        seller:"FXStream",     cat:"Developer",    price:"₹2,800", rating:4.4, verified:false },
];

const CATS = ["All", "Analytics", "Developer", "Compliance", "Blockchain"];

function Marketplace() {
  const [cat, setCat] = useState("All");
  const [search, setSearch] = useState("");
  const [verifiedOnly, setVerifiedOnly] = useState(false);

  const filtered = LISTINGS.filter(l => {
    const matchCat  = cat === "All" || l.cat === cat;
    const matchSrch = l.title.toLowerCase().includes(search.toLowerCase()) || l.seller.toLowerCase().includes(search.toLowerCase());
    const matchVer  = !verifiedOnly || l.verified;
    return matchCat && matchSrch && matchVer;
  });

  return (
    <div>
      <div className="page-header">
        <div className="page-header__row">
          <div>
            <h1>Marketplace</h1>
            <p>1,200+ verified financial products and services</p>
          </div>
          <button className="btn btn-primary">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            List a Product
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="content-card" style={{marginBottom:"var(--sp-5)"}}>
        <div style={{display:"flex",gap:"var(--sp-4)",alignItems:"center",flexWrap:"wrap"}}>
          <div style={{display:"flex",alignItems:"center",gap:"var(--sp-2)",background:"var(--bg)",border:"1px solid var(--border)",borderRadius:"var(--r-md)",padding:"8px 12px",flex:1,minWidth:200}}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input style={{border:"none",outline:"none",background:"none",width:"100%",fontSize:14}} placeholder="Search products or sellers..."
              value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <div style={{display:"flex",gap:"var(--sp-2)"}}>
            {CATS.map(c => (
              <button key={c} onClick={() => setCat(c)}
                className={`btn btn-sm ${cat===c?"btn-primary":"btn-secondary"}`}>
                {c}
              </button>
            ))}
          </div>
          <label style={{display:"flex",alignItems:"center",gap:"var(--sp-2)",fontSize:14,fontWeight:500,color:"var(--text-secondary)",cursor:"pointer",whiteSpace:"nowrap"}}>
            <input type="checkbox" checked={verifiedOnly} onChange={e => setVerifiedOnly(e.target.checked)}
              style={{accentColor:"var(--blue)"}} />
            Verified only
          </label>
        </div>
      </div>

      {/* Table */}
      <div className="content-card">
        <div className="content-card__header">
          <div>
            <div className="content-card__title">Available Listings</div>
            <div className="content-card__sub">{filtered.length} results</div>
          </div>
        </div>
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th><th>Product</th><th>Seller</th>
              <th>Category</th><th>Rating</th><th>Price</th><th></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(l => (
              <tr key={l.id}>
                <td style={{fontFamily:"monospace",color:"var(--text-muted)",fontSize:12}}>{l.id}</td>
                <td style={{fontWeight:600,color:"var(--text-primary)"}}>{l.title}</td>
                <td>
                  <div style={{display:"flex",alignItems:"center",gap:"var(--sp-2)"}}>
                    <div style={{width:22,height:22,borderRadius:"50%",background:"var(--blue)",color:"#fff",fontSize:10,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                      {l.seller[0]}
                    </div>
                    {l.seller}
                    {l.verified && (
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--blue)" strokeWidth="2.5" strokeLinecap="round">
                        <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
                      </svg>
                    )}
                  </div>
                </td>
                <td><span className="badge badge-gray">{l.cat}</span></td>
                <td style={{color:"#F59E0B",fontSize:13}}>
                  {"★".repeat(Math.round(l.rating))}
                  <span style={{color:"var(--text-muted)",fontSize:12,marginLeft:4}}>{l.rating}</span>
                </td>
                <td style={{fontWeight:700,letterSpacing:"-0.02em"}}>{l.price}</td>
                <td><button className="btn btn-primary btn-sm">Buy</button></td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div style={{textAlign:"center",padding:"var(--sp-10)",color:"var(--text-muted)"}}>
            No listings match your filters.
          </div>
        )}
      </div>
    </div>
  );
}

export default Marketplace;
