import { Link } from "react-router-dom";
import { Check } from "lucide-react";
import "./Solutions.css";

const ROLES = [
  {
    tag: "Individual",
    title: "Personal finance, simplified.",
    desc: "Track investments, manage your wallet, and monitor your financial health — all in one place.",
    features: ["Portfolio tracking", "Smart wallet", "Tax insights", "Personal analytics"],
    path: "/register?role=individual",
  },
  {
    tag: "Business",
    title: "Payments & operations at scale.",
    desc: "Process B2B payments, manage team access, generate invoices, and access business credit.",
    features: ["B2B payments", "Invoice generation", "Team permissions", "Business credit"],
    path: "/register?role=business",
    highlight: true,
  },
  {
    tag: "Seller",
    title: "Sell on a verified marketplace.",
    desc: "List your products and services. Get paid instantly with blockchain-confirmed receipts.",
    features: ["Verified storefront", "Instant payouts", "Buyer protection", "Order management"],
    path: "/register?role=seller",
  },
];

function Solutions() {
  return (
    <section className="solutions" id="solutions">
      <div className="container">
        <div className="section-header">
          <span className="tag">Solutions</span>
          <h2 className="h2">One platform, every financial journey.</h2>
          <p className="lead">
            Choose the experience that fits you. You can hold multiple roles.
          </p>
        </div>

        <div className="solutions__grid">
          {ROLES.map((role) => (
            <div
              className={`solutions__card ${role.highlight ? "solutions__card--featured" : ""}`}
              key={role.tag}
            >
              <div className="solutions__card-tag">{role.tag}</div>
              <h3 className="solutions__card-title">{role.title}</h3>
              <p className="solutions__card-desc">{role.desc}</p>

              <ul className="solutions__features">
                {role.features.map((f) => (
                  <li key={f}>
                    <Check size={13} className="solutions__check" />
                    {f}
                  </li>
                ))}
              </ul>

              <Link to={role.path} className={`btn btn-sm ${role.highlight ? "btn-primary" : "btn-secondary"}`}>
                Get Started as {role.tag}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Solutions;
