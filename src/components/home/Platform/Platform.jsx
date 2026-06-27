import "./Platform.css";

const FEATURES = [
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="5" width="20" height="14" rx="2"/><path d="M16 12h.01"/>
      </svg>
    ),
    color: "blue",
    title: "Smart Wallet",
    desc: "Send, receive, deposit and withdraw funds instantly. Track every rupee with real-time balance updates and spending insights.",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/>
      </svg>
    ),
    color: "slate",
    title: "Verified Marketplace",
    desc: "Buy and sell financial services, digital tools, and business products from verified sellers. Every listing is blockchain-authenticated.",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
      </svg>
    ),
    color: "red",
    title: "Blockchain Verification",
    desc: "Every transaction is written to an immutable ledger. Cryptographic proofs eliminate fraud and give buyers and sellers full transparency.",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>
      </svg>
    ),
    color: "blue",
    title: "Analytics & Reporting",
    desc: "Portfolio performance, marketplace volume, revenue trends, and tax summaries — in one clean, exportable dashboard.",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/>
      </svg>
    ),
    color: "green",
    title: "Instant Settlements",
    desc: "Payments clear in under 3 seconds. No waiting for bank clearances. Sellers get paid the moment a transaction is verified on-chain.",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/>
      </svg>
    ),
    color: "amber",
    title: "Role-Based Access",
    desc: "One platform, five distinct experiences — Individual, Business, Buyer, Seller, and Developer. Each role gets a tailored interface.",
  },
];

function Platform() {
  return (
    <section className="platform section" id="platform">
      <div className="container">
        <div className="section-header">
          <div className="tag">The Platform</div>
          <h2 className="h2">Everything your financial operations need</h2>
          <p className="lead">
            CresoX combines wallet, marketplace, blockchain, and analytics into
            one unified platform. No switching between tools.
          </p>
        </div>

        <div className="platform__grid">
          {FEATURES.map(f => (
            <div className="platform__card card card--interactive" key={f.title}>
              <div className={`icon-box icon-box--${f.color}`}>{f.icon}</div>
              <h3 className="h3" style={{marginTop:"var(--sp-4)"}}>{f.title}</h3>
              <p style={{fontSize:15,color:"var(--text-secondary)",lineHeight:1.65,marginTop:"var(--sp-2)"}}>
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Platform;
