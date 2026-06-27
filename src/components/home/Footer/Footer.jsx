import { Link } from "react-router-dom";
import "./Footer.css";

const LINKS = {
  Platform:  ["Overview", "Marketplace", "Wallet", "Blockchain", "Analytics", "Pricing"],
  Company:   ["About Us", "Careers", "Press Kit", "Blog", "Partners"],
  Legal:     ["Privacy Policy", "Terms of Service", "Cookie Policy", "Compliance"],
  Support:   ["Help Centre", "Contact Us", "Status Page", "API Docs"],
};

function Footer() {
  return (
    <footer className="footer">
      {/* CTA Band */}
      <div className="footer__cta-band">
        <div className="container">
          <div className="footer__cta-inner">
            <div>
              <h2 className="h2 text-white">Ready to get started?</h2>
              <p style={{color:"var(--text-white-70)",marginTop:"var(--sp-2)",fontSize:16}}>
                Join 12,480+ businesses and individuals already using CresoX.
              </p>
            </div>
            <div style={{display:"flex",gap:"var(--sp-3)",flexShrink:0}}>
              <Link to="/register" className="btn btn-white btn-lg">Create Free Account</Link>
              <Link to="/login" className="btn btn-lg" style={{color:"var(--text-white-70)",border:"1.5px solid rgba(255,255,255,0.25)"}}>
                Log In
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="footer__main">
        <div className="container">
          <div className="footer__grid">
            {/* Brand */}
            <div className="footer__brand">
              <div className="footer__logo">
                <div className="footer__logo-wordmark">
                  <span style={{color:"#4FA3FF"}}>Creso</span>
                  <span style={{color:"#FF5A5A"}}>X</span>
                </div>
                <div className="footer__logo-tag">FINTECH PRIVATE LIMITED</div>
              </div>
              <p className="footer__brand-desc">
                The complete financial ecosystem for the digital age.
                Blockchain-powered. AI-enhanced. Built for everyone.
              </p>
              <div className="footer__socials">
                {["𝕏","LinkedIn","GitHub","YouTube"].map(s => (
                  <a key={s} href="#" className="footer__social">{s}</a>
                ))}
              </div>
            </div>

            {/* Links */}
            {Object.entries(LINKS).map(([heading, items]) => (
              <div className="footer__col" key={heading}>
                <div className="footer__col-heading">{heading}</div>
                {items.map(item => (
                  <a key={item} href="#" className="footer__link">{item}</a>
                ))}
              </div>
            ))}
          </div>

          <div className="footer__bottom">
            <div className="footer__bottom-left">
              © 2024 CresoX Fintech Private Limited. All rights reserved.
            </div>
            <div className="footer__bottom-right">
              <span className="badge" style={{background:"rgba(255,255,255,0.08)",color:"rgba(255,255,255,0.5)",fontSize:11}}>
                <span className="dot-live" style={{background:"#16A34A"}}></span>
                All systems operational
              </span>
              <span style={{color:"rgba(255,255,255,0.3)",fontSize:13}}>·</span>
              <a href="#" style={{fontSize:13,color:"rgba(255,255,255,0.4)"}}>Privacy</a>
              <a href="#" style={{fontSize:13,color:"rgba(255,255,255,0.4)"}}>Terms</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
