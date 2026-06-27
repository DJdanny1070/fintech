import "./Services.css";

const SERVICES = [
  {
    icon: "💳",
    title: "Smart Wallet",
    desc: "Multi-currency wallet, instant transfers, and real-time balance visibility for all accounts.",
    tag: "Core",
  },
  {
    icon: "🏪",
    title: "Verified Marketplace",
    desc: "Buy and sell services and digital products from regulated providers with blockchain-backed trust.",
    tag: "Marketplace",
  },
  {
    icon: "📊",
    title: "Analytics",
    desc: "Track performance, monitor payments, and review cash flow with clear, exportable reports.",
    tag: "Insights",
  },
  {
    icon: "⛓",
    title: "Blockchain Verification",
    desc: "Immutable audits for every settlement, order, and ledger record — built for transparency.",
    tag: "Security",
  },
  {
    icon: "🔒",
    title: "Compliance Hub",
    desc: "Manage KYC, invoicing, settlements, and audit logs from one secure control center.",
    tag: "Compliance",
  },
];

function Services() {
  return (
    <section className="financial-services" id="solutions">
      <div className="container">
        <div className="services-header">
          <span className="tag">Financial Services</span>
          <h2 className="h2">A complete suite for modern finance teams.</h2>
          <p className="lead">
            CresoX brings payments, marketplace trading, reporting, verification, and compliance together in one professional platform.
          </p>
        </div>

        <div className="services-grid">
          {SERVICES.map((service) => (
            <article className="service-card" key={service.title}>
              <div className="service-card__top">
                <div className="service-card__icon">{service.icon}</div>
                <span className="badge badge-gray service-card__tag">{service.tag}</span>
              </div>
              <h3 className="service-card__title">{service.title}</h3>
              <p className="service-card__desc">{service.desc}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Services;
