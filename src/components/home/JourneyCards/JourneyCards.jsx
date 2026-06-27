import { useNavigate } from "react-router-dom";
import "./JourneyCards.css";

const JOURNEYS = [
  {
    icon: "👤",
    title: "I'm an Individual",
    desc: "Manage personal finances, make investments, track spending, and grow your wealth with AI-powered guidance.",
    highlights: ["Portfolio Tracking", "Smart Investing", "Tax Optimization", "Personal Wallet"],
    cta: "Start as Individual",
    role: "individual",
    color: "blue",
    gradient: "linear-gradient(135deg, rgba(37,99,235,0.15), rgba(59,130,246,0.08))",
    glow: "rgba(37,99,235,0.3)",
  },
  {
    icon: "🏢",
    title: "I'm a Business",
    desc: "Streamline B2B payments, manage company finances, access credit facilities, and get real-time analytics.",
    highlights: ["Business Payments", "Invoice Management", "Credit Lines", "Team Access"],
    cta: "Start as Business",
    role: "business",
    color: "purple",
    gradient: "linear-gradient(135deg, rgba(124,58,237,0.15), rgba(139,92,246,0.08))",
    glow: "rgba(124,58,237,0.3)",
  },
  {
    icon: "🏪",
    title: "I'm a Seller",
    desc: "List verified products and services on the marketplace, manage orders, and get paid instantly via blockchain.",
    highlights: ["Storefront Setup", "Order Management", "Instant Payouts", "Blockchain Receipts"],
    cta: "Start Selling",
    role: "seller",
    color: "green",
    gradient: "linear-gradient(135deg, rgba(16,163,74,0.15), rgba(34,197,94,0.08))",
    glow: "rgba(22,163,74,0.3)",
  },
  {
    icon: "🛍️",
    title: "I'm a Buyer",
    desc: "Discover verified financial products, services, and digital assets from trusted sellers worldwide.",
    highlights: ["Verified Listings", "Buyer Protection", "Blockchain Receipts", "Dispute Resolution"],
    cta: "Start Buying",
    role: "buyer",
    color: "orange",
    gradient: "linear-gradient(135deg, rgba(217,119,6,0.15), rgba(245,158,11,0.08))",
    glow: "rgba(217,119,6,0.3)",
  },
];

function JourneyCards() {
  const navigate = useNavigate();

  const handleSelect = (role) => {
    navigate(`/register?role=${role}`);
  };

  return (
    <section className="journey-section section">
      <div className="container">
        <div className="journey-header">
          <div className="section-badge">🎯 Choose Your Path</div>
          <h2 className="section-title">
            One platform.<br />
            <span className="gradient-text">Every financial journey.</span>
          </h2>
          <p className="section-subtitle">
            CresoX adapts to who you are. Select your role and get a
            tailored experience — from onboarding to your personalized dashboard.
          </p>
        </div>

        <div className="journey-grid">
          {JOURNEYS.map((j) => (
            <div
              className="journey-card"
              key={j.role}
              style={{
                "--journey-gradient": j.gradient,
                "--journey-glow": j.glow,
              }}
              onClick={() => handleSelect(j.role)}
            >
              <div className="journey-card__bg"></div>

              <div className="journey-card__icon">{j.icon}</div>
              <h3 className="journey-card__title">{j.title}</h3>
              <p className="journey-card__desc">{j.desc}</p>

              <ul className="journey-card__highlights">
                {j.highlights.map(h => (
                  <li key={h}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" style={{color:"var(--green-light)", flexShrink:0}}>
                      <path d="M20 6L9 17l-5-5"/>
                    </svg>
                    {h}
                  </li>
                ))}
              </ul>

              <button className="journey-card__cta">
                {j.cta}
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="5" y1="12" x2="19" y2="12"/>
                  <polyline points="12 5 19 12 12 19"/>
                </svg>
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default JourneyCards;
