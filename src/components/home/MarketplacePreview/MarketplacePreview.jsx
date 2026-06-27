import { Search, ShieldCheck } from "lucide-react";
import "./MarketplacePreview.css";

const PRODUCTS = [
  {
    name: "Premium Analytics Suite",
    seller: "FinTechPro",
    price: "₹2,500",
    verified: true,
  },
  {
    name: "Investment Portfolio API",
    seller: "CodeFinance",
    price: "₹4,000",
    verified: true,
  },
  {
    name: "Business Credit Report",
    seller: "CreditPulse",
    price: "₹999",
    verified: true,
  },
  {
    name: "Tax Compliance Tool",
    seller: "TaxPilot",
    price: "₹3,200",
    verified: false,
  },
];

function MarketplacePreview() {
  return (
    <section className="mp-preview" id="marketplace">
      <div className="mp-preview__container">
        <div className="mp-preview__header">
          <h2 className="mp-preview__title">Marketplace</h2>
          <p className="mp-preview__subtitle">
            Browse verified products and services from trusted sellers across the CresoX ecosystem.
          </p>
        </div>

        <div className="mp-preview__panel">
          <div className="mp-preview__search">
            <Search size={18} strokeWidth={1.75} className="mp-preview__search-icon" />
            <input
              type="search"
              className="mp-preview__search-input"
              placeholder="Search products, services, or sellers…"
              readOnly
              aria-label="Search marketplace"
            />
          </div>

          <div className="mp-preview__table-head">
            <span>Product</span>
            <span>Seller</span>
            <span>Price</span>
            <span></span>
          </div>

          <ul className="mp-preview__list">
            {PRODUCTS.map((item) => (
              <li className="mp-preview__row" key={item.name}>
                <div className="mp-preview__product">
                  <span className="mp-preview__product-name">{item.name}</span>
                  {item.verified && (
                    <span className="mp-preview__verified">
                      <ShieldCheck size={11} strokeWidth={2} />
                      Verified
                    </span>
                  )}
                </div>
                <span className="mp-preview__seller">{item.seller}</span>
                <span className="mp-preview__price">{item.price}</span>
                <button type="button" className="btn btn-primary btn-sm mp-preview__buy">
                  Buy
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

export default MarketplacePreview;
