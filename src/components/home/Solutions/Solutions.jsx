import { Link } from "react-router-dom";
import "./Solutions.css";

const SOLUTIONS = [
  {
    icon: "👤",
    role: "individual",
    title: "Individual",
    subtitle: "Personal Finance",
    desc: "Track your investments, manage personal finances, and grow your wealth with AI-powered insights and a real-time portfolio.",
    features: ["Portfolio tracking", "Smart investing", "Tax optimization", "Personal wallet & transfers"],
  },
  {
    icon: "🏢",
    role: "business",
    title: "Business",
    subtitle: "B2B & Operations",
    desc: "Manage company payments, generate invoices, set team permissions, and access business credit — all from one dashboard.",
    features: ["B2B payment processing", "Invoice generation", "Multi-user access", "Business credit lines"],
  },
  {
    icon: "🏪",
    role: "seller",
    title: "Seller",
    subtitle: "Marketplace & Revenue",
    desc: "List verified products and services on the CresoX Marketplace. Get paid instantly with blockchain-confirmed transactions.",
    features: ["Seller storefront", "Blockchain receipts", "Instant payouts", "Order & dispute management"],
  },
  {
    icon: "🛍️",
    role: "buyer",
    title: "Buyer",
    subtitle: "Marketplace Access",
    desc: "Browse verified financial products, services, and tools. Every purchase is protected by CresoX's blockchain escrow.",
    features: ["Verified listings only", "Buyer protection escrow", "Dispute resolution", "Purchase history & receipts"],
  },
];

function Solutions() {
  return (
    <section className="solutions section section--gray" id="solutions">
      <div className="container">
        <div className="section-header">
          <div className="tag">Financial Solutions</div>
          <h2 className="h2">One platform. Every financial journey.</h2>
          <p className="lead">
            Choose the experience that fits you. You can hold multiple roles and switch anytime.
          </p>
        </div>

        <div className="solutions__grid">
          {SOLUTIONS.map(s => (
            <div className="solutions__card" key={s.role}>
              <div className="solutions__card-header">
                <div className="solutions__icon">{s.icon}</div>
                <div>
                  <div className="solutions__title">{s.title}</div>
                  <div className="solutions__subtitle">{s.subtitle}</div>
                </div>
              </div>
              <p className="solutions__desc">{s.desc}</p>
              <ul className="solutions__features">
                {s.features.map(f => (
                  <li key={f}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                to={`/register?role=${s.role}`}
                className="solutions__cta"
              >
                Get started as {s.title}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                </svg>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Solutions;
