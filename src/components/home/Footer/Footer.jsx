import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import "./Footer.css";

const LINKS = {
  Platform:  ["Wallet", "Marketplace", "Blockchain", "Analytics", "Pricing"],
  Company:   ["About Us", "Blog", "Careers", "Press Kit"],
  Legal:     ["Privacy Policy", "Terms of Service", "Cookie Policy"],
  Support:   ["Help Centre", "Contact Us", "Status", "API Docs"],
};

function Footer() {
  return (
    <footer className="footer" id="contact">
      {/* CTA band */}
      <div className="footer__cta">
        <div className="container footer__cta-inner">
          <div>
            <div className="footer__cta-eyebrow">Get started today</div>
            <h2 className="footer__cta-title">Ready to build your financial future?</h2>
            <p className="footer__cta-sub">
              Join 12,480+ businesses and individuals on CresoX. Free to start.
            </p>
          </div>
          <div className="footer__cta-actions">
            <Link to="/register" className="btn btn-white btn-lg">
              Create Free Account
            </Link>
            <Link to="/dashboard" className="btn-outline-white">
              View Demo <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </div>

      {/* Dark footer */}
      <div className="footer__main">
        <div className="container footer__grid">
          {/* Brand */}
          <div className="footer__brand">
            <div className="footer__brand-logo">
              <span style={{ color: "#4FA3FF" }}>Creso</span>
              <span style={{ color: "#FF5A5A" }}>X</span>
            </div>
            <div className="footer__brand-tagline">Fintech Private Limited</div>
            <p className="footer__brand-desc">
              Building a secure financial ecosystem powered by blockchain technology.
            </p>
            <div className="footer__brand-badges">
              <span className="footer__badge">🔒 SOC2 Compliant</span>
              <span className="footer__badge">⚡ AES-256 Encrypted</span>
              <span className="footer__badge">🇮🇳 RBI Compliant</span>
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(LINKS).map(([heading, items]) => (
            <div className="footer__col" key={heading}>
              <div className="footer__col-heading">{heading}</div>
              {items.map((item) => (
                <a key={item} href="#" className="footer__col-link">
                  {item}
                </a>
              ))}
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="container footer__bottom">
          <span>© 2024 CresoX Fintech Private Limited. All rights reserved. CIN: U74999MH2024PTC123456</span>
          <div className="footer__bottom-right">
            <div className="footer__bottom-links">
              <a href="#" className="footer__bottom-link">Privacy</a>
              <a href="#" className="footer__bottom-link">Terms</a>
              <a href="#" className="footer__bottom-link">Cookies</a>
            </div>
            <span className="footer__live-badge">
              <span className="dot-live" />
              All systems operational
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
