import { useState } from "react";
import "./MarketplacePreview.css";

const LISTINGS = [
  { seller:"FinTechPro",   rating:4.9, reviews:312, category:"Analytics",     title:"Premium Analytics Suite",      price:"₹2,500",  verified:true,  badge:"Top Rated" },
  { seller:"CodeFinance",  rating:4.7, reviews:187, category:"Developer Tool", title:"Investment Portfolio API",      price:"₹4,000",  verified:true,  badge:"Trending" },
  { seller:"CreditPulse",  rating:4.8, reviews:529, category:"Report",        title:"Business Credit Score Report",  price:"₹999",    verified:true,  badge:"New" },
  { seller:"BlockDev",     rating:4.6, reviews:94,  category:"Blockchain",    title:"Crypto Wallet Integration",     price:"₹6,500",  verified:true,  badge:null },
  { seller:"TaxPilot",     rating:4.5, reviews:221, category:"Compliance",    title:"Tax Compliance Automation",     price:"₹3,200",  verified:true,  badge:"Best Seller" },
  { seller:"InvoiceAI",    rating:4.7, reviews:398, category:"Analytics",     title:"Smart Invoice Generator",       price:"₹1,500",  verified:true,  badge:"AI-Powered" },
];

function Stars({ rating }) {
  return (
    <span className="mp-stars">
      {"★".repeat(Math.round(rating))}
      <span className="mp-stars-num">{rating}</span>
    </span>
  );
}

function MarketplacePreview() {
  const [hovered, setHovered] = useState(null);

  return (
    <section className="mp-preview section section--white" id="marketplace">
      <div className="container">
        <div className="mp-preview__header">
          <div>
            <div className="tag">Marketplace</div>
            <h2 className="h2">Verified financial products &amp; services</h2>
            <p className="lead" style={{marginTop:"var(--sp-3)"}}>
              Buy and sell from 1,200+ verified providers.
              Every listing is blockchain-authenticated before going live.
            </p>
          </div>
          <a href="/dashboard/marketplace" className="btn btn-secondary">
            Browse all listings →
          </a>
        </div>

        {/* Table */}
        <div className="mp-preview__table">
          <div className="mp-preview__thead">
            <span>Product</span>
            <span>Seller</span>
            <span>Category</span>
            <span>Rating</span>
            <span>Price</span>
            <span></span>
          </div>
          {LISTINGS.map((item, i) => (
            <div
              className={`mp-preview__row ${hovered === i ? "mp-preview__row--hover" : ""}`}
              key={item.title}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
            >
              <span className="mp-preview__title">
                {item.title}
                {item.badge && (
                  <span className="badge badge-blue" style={{marginLeft:8,fontSize:10}}>{item.badge}</span>
                )}
              </span>
              <span className="mp-preview__seller">
                <div className="mp-preview__seller-av">{item.seller[0]}</div>
                {item.seller}
                {item.verified && (
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--blue)" strokeWidth="2.5" strokeLinecap="round">
                    <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/>
                    <polyline points="22 4 12 14.01 9 11.01"/>
                  </svg>
                )}
              </span>
              <span>
                <span className="badge badge-gray">{item.category}</span>
              </span>
              <span>
                <Stars rating={item.rating}/>
                <span className="mp-preview__reviews">({item.reviews})</span>
              </span>
              <span className="mp-preview__price">{item.price}</span>
              <span>
                <button className="btn btn-primary btn-sm">Buy Now</button>
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default MarketplacePreview;
