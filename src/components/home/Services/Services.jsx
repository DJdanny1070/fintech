import "./Services.css";

const SERVICES = [
  {
    icon: "💳",
    title: "Smart Wallet",
    desc: "Multi-currency wallet with instant transfers, QR payments, and real-time balance tracking.",
    color: "blue",
    tag: "Core"
  },
  {
    icon: "🏪",
    title: "Marketplace",
    desc: "Buy and sell verified digital assets and financial services with blockchain-backed trust.",
    color: "purple",
    tag: "Popular"
  },
  {
    icon: "📊",
    title: "Analytics",
    desc: "Real-time portfolio analytics, performance charts, and AI-powered market insights.",
    color: "green",
    tag: "Smart"
  },
  {
    icon: "⛓",
    title: "Blockchain",
    desc: "Every transaction verified and stored on an immutable blockchain ledger for maximum security.",
    color: "orange",
    tag: "Secure"
  },
  {
    icon: "🤖",
    title: "AI Insights",
    desc: "Get personalized financial recommendations powered by machine learning and market data.",
    color: "pink",
    tag: "New"
  },
];

function Services() {
  return (
    <section className="services-section section" id="solutions">
      <div className="container">
        <div className="services-header">
          <div className="section-badge">🌐 The Ecosystem</div>
          <h2 className="section-title">
            Everything connected.<br />
            <span className="gradient-text">Everything integrated.</span>
          </h2>
          <p className="section-subtitle">
            CresoX isn't five tools — it's one unified ecosystem where every component
            communicates in real-time to give you unprecedented control.
          </p>
        </div>

        {/* Connected ecosystem flow */}
        <div className="services-grid">
          {SERVICES.map((svc, i) => (
            <div className="service-card" key={svc.title} data-color={svc.color}>
              {/* Connector line (not last) */}
              {i < SERVICES.length - 1 && (
                <div className="service-connector">
                  <svg viewBox="0 0 40 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0 10 L32 10" stroke="url(#connGrad)" strokeWidth="1.5" strokeDasharray="4 3"/>
                    <path d="M28 6 L34 10 L28 14" stroke="url(#connGrad)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <defs>
                      <linearGradient id="connGrad" x1="0" y1="0" x2="40" y2="0">
                        <stop offset="0%" stopColor="#2563eb" stopOpacity="0.3"/>
                        <stop offset="100%" stopColor="#7c3aed" stopOpacity="0.6"/>
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
              )}

              <div className="service-card__inner">
                <div className="service-card__top">
                  <div className="service-card__icon">{svc.icon}</div>
                  <span className="badge badge-blue service-card__tag">{svc.tag}</span>
                </div>
                <h3 className="service-card__title">{svc.title}</h3>
                <p className="service-card__desc">{svc.desc}</p>
                <div className="service-card__learn">
                  Learn more <span>→</span>
                </div>
              </div>

              {/* Number indicator */}
              <div className="service-card__num">{String(i + 1).padStart(2,"0")}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Services;
