import { Link } from "react-router-dom";
import "./Hero.css";

/* Browser-frame dashboard mockup — pure HTML/CSS, no images */
function DashboardMockup() {
  return (
    <div className="hero-mockup">
      {/* Browser chrome */}
      <div className="hero-mockup__chrome">
        <div className="hero-mockup__chrome-dots">
          <span style={{background:"#FF5F57"}}></span>
          <span style={{background:"#FFBD2E"}}></span>
          <span style={{background:"#28C840"}}></span>
        </div>
        <div className="hero-mockup__chrome-url">app.cresox.in/dashboard</div>
      </div>

      {/* Dashboard inside browser */}
      <div className="hero-mockup__body">
        {/* Mini sidebar */}
        <div className="hero-mockup__sidebar">
          <div className="hero-mockup__sidebar-logo">CX</div>
          {["Overview","Wallet","Market","Chain","Analytics"].map((item, i) => (
            <div key={item} className={`hero-mockup__sidebar-item ${i === 0 ? "active" : ""}`}>
              <div className="hero-mockup__sidebar-dot"></div>
              <span>{item}</span>
            </div>
          ))}
        </div>

        {/* Content area */}
        <div className="hero-mockup__content">
          {/* Topbar */}
          <div className="hero-mockup__topbar">
            <span className="hero-mockup__topbar-title">Good Morning, Jonathan</span>
            <div className="hero-mockup__topbar-actions">
              <div className="hero-mockup__topbar-badge">
                <span style={{width:6,height:6,borderRadius:"50%",background:"#16A34A",display:"inline-block"}}></span>
                Live
              </div>
              <div className="hero-mockup__topbar-avatar">J</div>
            </div>
          </div>

          {/* KPI row */}
          <div className="hero-mockup__kpis">
            {[
              { label:"Portfolio", value:"₹12.4 Cr",  up:true,  change:"↑ 14.5%" },
              { label:"Wallet",    value:"₹2.4 L",    up:true,  change:"↑ 2.1%" },
              { label:"Txns",      value:"12,847",     up:true,  change:"↑ 234" },
              { label:"Market",    value:"7 active",  up:null,  change:"orders" },
            ].map(k => (
              <div className="hero-mockup__kpi" key={k.label}>
                <div className="hero-mockup__kpi-label">{k.label}</div>
                <div className="hero-mockup__kpi-value">{k.value}</div>
                <div className={`hero-mockup__kpi-change ${k.up ? "up" : ""}`}>{k.change}</div>
              </div>
            ))}
          </div>

          {/* Chart + Transactions */}
          <div className="hero-mockup__row">
            {/* Mini chart */}
            <div className="hero-mockup__chart-card">
              <div className="hero-mockup__card-title">Portfolio Performance</div>
              <svg viewBox="0 0 220 80" className="hero-mockup__chart">
                <defs>
                  <linearGradient id="hg" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#075AD8" stopOpacity="0.15"/>
                    <stop offset="100%" stopColor="#075AD8" stopOpacity="0"/>
                  </linearGradient>
                </defs>
                <polygon points="0,80 0,55 30,42 60,48 90,32 120,28 150,18 190,12 220,8 220,80" fill="url(#hg)"/>
                <polyline points="0,55 30,42 60,48 90,32 120,28 150,18 190,12 220,8"
                  fill="none" stroke="#075AD8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>

            {/* Mini table */}
            <div className="hero-mockup__txn-card">
              <div className="hero-mockup__card-title">Recent Transactions</div>
              {[
                { from:"Rahul K.",   amount:"+₹12,500", status:"Verified" },
                { from:"Marketplace",amount:"-₹4,000",  status:"Verified" },
                { from:"HDFC Bank",  amount:"+₹50,000", status:"Pending"  },
              ].map(tx => (
                <div className="hero-mockup__txn-row" key={tx.from}>
                  <span className="hero-mockup__txn-from">{tx.from}</span>
                  <span className={`hero-mockup__txn-amount ${tx.amount.startsWith("+")?"pos":"neg"}`}>
                    {tx.amount}
                  </span>
                  <span className={`hero-mockup__txn-badge ${tx.status === "Verified" ? "verified" : "pending"}`}>
                    {tx.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Hero() {
  return (
    <section className="hero section--white">
      <div className="container">
        <div className="hero__layout">
          {/* Left — copy */}
          <div className="hero__copy">
            <div className="tag">Trusted by 12,480+ businesses</div>

            <h1 className="h1 hero__headline">
              Financial services built for
              modern businesses and individuals.
            </h1>

            <p className="lead hero__sub">
              Manage financial operations, access verified marketplace
              services, and secure every transaction with blockchain
              — all from one platform.
            </p>

            <div className="hero__ctas">
              <Link to="/register" className="btn btn-primary btn-lg">
                Get Started Free
              </Link>
              <Link to="/dashboard" className="btn btn-secondary btn-lg">
                View Dashboard →
              </Link>
            </div>

            {/* Trust signals */}
            <div className="hero__trust">
              {[
                { icon: "✓", text: "No credit card required" },
                { icon: "✓", text: "Blockchain-verified" },
                { icon: "✓", text: "SOC2 Compliant" },
              ].map(t => (
                <div className="hero__trust-item" key={t.text}>
                  <span className="hero__trust-icon">{t.icon}</span>
                  {t.text}
                </div>
              ))}
            </div>
          </div>

          {/* Right — dashboard mockup */}
          <div className="hero__visual">
            <DashboardMockup />
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;