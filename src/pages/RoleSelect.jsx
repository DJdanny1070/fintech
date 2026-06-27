import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./RoleSelect.css";

const ROLES = [
  {
    icon: "👤",
    title: "Individual",
    desc: "Track portfolio performance, manage investments, get AI-powered market signals, and monitor returns in real time.",
    features: ["Portfolio Dashboard", "Market Analytics", "AI Signals", "Risk Assessment"],
  },
  {
    icon: "🏢",
    title: "Business",
    desc: "Manage company finances, handle B2B payments, set team roles, and access business credit and invoicing tools.",
    features: ["Team Management", "B2B Payments", "Invoice Gen", "Business Credit"],
  },
  {
    icon: "🛍️",
    title: "Buyer",
    desc: "Discover and purchase verified financial products, services, and digital assets. Every purchase is blockchain-protected.",
    features: ["Verified Listings", "Secure Escrow", "Buyer Protection", "Order Tracking"],
  },
  {
    icon: "🏪",
    title: "Seller",
    desc: "List your products, services, or digital assets on the CresoX marketplace and get paid instantly via blockchain.",
    features: ["Seller Storefront", "Instant Payouts", "Analytics Dashboard", "Blockchain Receipts"],
  },
  {
    icon: "⚙️",
    title: "Developer",
    desc: "Integrate CresoX APIs into your applications. Access wallet, payment, blockchain verification, and AI endpoints.",
    features: ["API Keys", "SDK Access", "Webhook Events", "Sandbox Testing"],
  },
];

function RoleSelect() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleContinue = () => {
    if (!selected) return;
    setLoading(true);
    setTimeout(() => { navigate("/dashboard"); }, 1000);
  };

  return (
    <div className="role-page">
      <div className="role-container">
        <div className="role-header">
          <div className="role-header__greeting">Welcome to CresoX 👋</div>
          <h1 className="role-header__title">Choose your experience</h1>
          <p className="role-header__sub">
            Select the primary role that best describes your needs. You can switch or add additional roles anytime from your dashboard.
          </p>
        </div>

        <div className="role-grid">
          {ROLES.map(role => (
            <div
              key={role.title}
              className={`role-card ${selected === role.title ? "role-card--selected" : ""}`}
              onClick={() => setSelected(role.title)}
            >
              <div className="role-card__check">
                {selected === role.title && (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                )}
              </div>
              <div className="role-card__icon">{role.icon}</div>
              <h2 className="role-card__title">{role.title}</h2>
              <p className="role-card__desc">{role.desc}</p>
              <div className="role-card__features">
                {role.features.map(f => (
                  <span key={f} className="role-card__feat">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--blue)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                    {f}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="role-actions">
          <div className="role-actions__hint">
            {selected ? `✓ ${selected} selected — ready to continue` : "Select a role to continue"}
          </div>
          <button
            className="btn btn-primary role-continue"
            onClick={handleContinue}
            disabled={!selected || loading}
          >
            {loading
              ? <><span className="spinner"></span> Setting up dashboard...</>
              : <>Enter CresoX Dashboard →</>
            }
          </button>
        </div>
      </div>
    </div>
  );
}

export default RoleSelect;
