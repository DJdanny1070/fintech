import {
  Wallet,
  ShoppingBag,
  Building2,
  Link2,
  Code2,
  BarChart3,
} from "lucide-react";
import "./Services.css";

const SERVICES = [
  {
    icon: Wallet,
    title: "Digital Wallet",
    desc: "Hold, send, and receive funds with real-time balance updates and multi-account support.",
  },
  {
    icon: ShoppingBag,
    title: "Marketplace",
    desc: "Browse verified listings, compare sellers, and complete purchases with instant settlement.",
  },
  {
    icon: Building2,
    title: "Business Banking",
    desc: "Team permissions, invoicing, vendor payments, and consolidated business account controls.",
  },
  {
    icon: Link2,
    title: "Blockchain Verification",
    desc: "Every transaction receives an on-chain hash proof — auditable without exposing private data.",
  },
  {
    icon: Code2,
    title: "Developer APIs",
    desc: "REST endpoints, webhooks, and sandbox environments to embed CresoX into your product.",
  },
  {
    icon: BarChart3,
    title: "Analytics",
    desc: "Track cash flow, marketplace activity, and portfolio performance with exportable reports.",
  },
];

function Services() {
  return (
    <section className="services" id="developers">
      <div className="services__container">
        <div className="services__header">
          <h2 className="services__title">Everything you need in one platform</h2>
          <p className="services__subtitle">
            Six core services that power the CresoX financial ecosystem for individuals,
            businesses, and developers.
          </p>
        </div>

        <div className="services__grid">
          {SERVICES.map(({ icon: Icon, title, desc }) => (
            <article className="services__card" key={title}>
              <div className="services__icon">
                <Icon size={20} strokeWidth={1.75} />
              </div>
              <h3 className="services__card-title">{title}</h3>
              <p className="services__card-desc">{desc}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Services;
