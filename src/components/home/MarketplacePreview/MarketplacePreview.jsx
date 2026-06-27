import { Link } from "react-router-dom";
import "./MarketplacePreview.css";

const LISTINGS = [
  { name: "Premium Analytics Suite",     seller: "FinTechPro",   category: "Analytics",   price: "₹2,500", verified: true  },
  { name: "Investment Portfolio API",     seller: "CodeFinance",  category: "Developer",   price: "₹4,000", verified: true  },
  { name: "Business Credit Score Report", seller: "CreditPulse",  category: "Compliance",  price: "₹999",   verified: true  },
  { name: "Tax Compliance Automation",    seller: "TaxPilot",     category: "Compliance",  price: "₹3,200", verified: false },
  { name: "Smart Invoice Generator",      seller: "InvoiceAI",    category: "Analytics",   price: "₹1,500", verified: true  },
];

function MarketplacePreview() {
  return (
    <section className="mp-preview" id="marketplace">
      <div className="container">
        <div className="mp-preview__head">
          <div>
            <span className="tag">Marketplace</span>
            <h2 className="h2">Verified financial products &amp; services</h2>
          </div>
          <Link to="/register" className="btn btn-secondary btn-sm">
            Browse all listings →
          </Link>
        </div>

        <div className="mp-preview__table">
          <div className="mp-preview__thead">
            <span>Product / Service</span>
            <span>Seller</span>
            <span>Category</span>
            <span>Price</span>
            <span></span>
          </div>
          {LISTINGS.map((item) => (
            <div className="mp-preview__row" key={item.name}>
              <span className="mp-preview__name">
                {item.name}
                {item.verified && (
                  <span className="mp-preview__verified-badge">Verified</span>
                )}
              </span>
              <span className="mp-preview__seller">{item.seller}</span>
              <span className="mp-preview__category">
                <span className="mp-preview__category-pill">{item.category}</span>
              </span>
              <span className="mp-preview__price">{item.price}</span>
              <span className="mp-preview__action">
                <button className="btn btn-primary btn-sm">Buy</button>
              </span>
            </div>
          ))}
        </div>

        <p className="mp-preview__footnote">
          Showing 5 of 1,240+ verified listings.{" "}
          <Link to="/register">Create an account to access the full marketplace →</Link>
        </p>
      </div>
    </section>
  );
}

export default MarketplacePreview;
