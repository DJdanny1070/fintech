import {
  Coins,
  ShoppingBag,
  Layers,
  Lightbulb,
  BarChart2,
} from "lucide-react";
import "./Services.css";

const FINTECH_PRODUCTS = [
  {
    icon: Coins,
    title: "Tokenization of Real-World Assets",
    desc: "Convert physical assets into secure digital tokens, enabling fractional ownership and improved investment accessibility.",
  },
  {
    icon: ShoppingBag,
    title: "Private Token Trading Marketplace",
    desc: "A secure marketplace that facilitates trading of tokenized assets among eligible investors.",
  },
  {
    icon: Layers,
    title: "Tokenization of Other Assets",
    desc: "Customized tokenization solutions for various eligible asset classes beyond traditional investments.",
  },
];

const ADVISORY_SERVICES = [
  {
    icon: Lightbulb,
    title: "Consultancy",
    desc: "Strategic guidance on fintech adoption, tokenization, digital asset structuring, and investment models.",
  },
  {
    icon: BarChart2,
    title: "Financial Simulations",
    desc: "Data-driven financial modeling and investment simulations to support informed business and investment decisions.",
  },
];

function Services() {
  return (
    <section className="services" id="services">
      <div className="services__container">
        {/* Section Header */}
        <div className="services__header">
          <span className="services__eyebrow">Our Services</span>
          <h2 className="services__title">
            Comprehensive Fintech Solutions
          </h2>
          <p className="services__subtitle">
            From real-world asset tokenization to strategic advisory — we
            deliver end-to-end solutions that unlock new investment potential.
          </p>
        </div>

        {/* ── Fintech Products ─────────────────────────────────── */}
        <div className="services__group">
          <h3 className="services__group-label">Fintech Products</h3>
          <div className="services__grid services__grid--3">
            {FINTECH_PRODUCTS.map(({ icon: Icon, title, desc }) => (
              <article className="services__card" key={title}>
                <div className="services__icon services__icon--product">
                  <Icon size={22} strokeWidth={1.75} />
                </div>
                <h4 className="services__card-title">{title}</h4>
                <p className="services__card-desc">{desc}</p>
              </article>
            ))}
          </div>
        </div>

        {/* ── Advisory Services ────────────────────────────────── */}
        <div className="services__group">
          <h3 className="services__group-label">Advisory Services</h3>
          <div className="services__grid services__grid--2">
            {ADVISORY_SERVICES.map(({ icon: Icon, title, desc }) => (
              <article className="services__card services__card--advisory" key={title}>
                <div className="services__icon services__icon--advisory">
                  <Icon size={22} strokeWidth={1.75} />
                </div>
                <h4 className="services__card-title">{title}</h4>
                <p className="services__card-desc">{desc}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Services;
