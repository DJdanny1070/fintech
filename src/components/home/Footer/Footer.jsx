import { Link } from "react-router-dom";
import "./Footer.css";
import cresoxLogo from "../../../assets/cresox-logo.png";

const FOOTER_LINKS = {
  Company: [
    { label: "About Us", href: "#company" },
    { label: "Careers", href: null },
    { label: "Press", href: null },
    { label: "Contact", href: "#contact" },
  ],
  Solutions: [
    { label: "Digital Wallet", href: "/register?role=individual" },
    { label: "Marketplace", href: "#marketplace" },
    { label: "Business Banking", href: "/register?role=business" },
    { label: "Developer APIs", href: "/register?role=developer" },
  ],
  Resources: [
    { label: "Documentation", href: null },
    { label: "API Reference", href: null },
    { label: "Help Centre", href: "#contact" },
    { label: "Status", href: null },
  ],
  Legal: [
    { label: "Privacy Policy", href: null },
    { label: "Terms of Service", href: null },
    { label: "Cookie Policy", href: null },
    { label: "Compliance", href: null },
  ],
};

const SOCIAL = [
  {
    label: "LinkedIn",
    href: null,
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-12h4v2" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="2" y="9" width="4" height="12" stroke="currentColor" strokeWidth="1.75" />
        <circle cx="4" cy="4" r="2" stroke="currentColor" strokeWidth="1.75" />
      </svg>
    ),
  },
  {
    label: "Twitter",
    href: null,
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M4 4l16 16M20 4L4 20" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    label: "GitHub",
    href: null,
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M9 19c-4 1.5-4-2.5-6-3m12 5v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 18 4.77 5.07 5.07 0 0 0 17.91 1S16.73.65 13 2.48a13.38 13.38 0 0 0-7 0C2.27.65 1.09 1 1.09 1A5.07 5.07 0 0 0 1 4.77 5.44 5.44 0 0 0 3.5 8.55c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
];

function Footer() {
  return (
    <footer className="footer" id="contact">
      <div className="footer__container">
        <div className="footer__top">
          <div className="footer__brand">
            <Link to="/" className="footer__logo">
              <img
                src={cresoxLogo}
                alt="CresoX Fintech Private Limited"
                className="footer__logo-img"
              />
            </Link>
            <p className="footer__desc">
              A complete financial ecosystem for wallets, marketplace trading,
              blockchain verification, and developer integrations.
            </p>
            <div className="footer__social">
              {SOCIAL.map(({ label, icon, href }) => (
                href ? (
                  <a
                    key={label}
                    href={href}
                    className="footer__social-link"
                    aria-label={label}
                  >
                    {icon}
                  </a>
                ) : (
                  <span
                    key={label}
                    className="footer__social-link footer__social-link--disabled"
                    aria-hidden="true"
                  >
                    {icon}
                  </span>
                )
              ))}
            </div>
          </div>

          {Object.entries(FOOTER_LINKS).map(([heading, links]) => (
            <div className="footer__col" key={heading}>
              <h3 className="footer__col-title">{heading}</h3>
              <ul className="footer__col-list">
                {links.map((link) => (
                  <li key={link.label}>
                    {link.href ? (
                      <a href={link.href} className="footer__col-link">
                        {link.label}
                      </a>
                    ) : (
                      <span
                        className="footer__col-link footer__col-link--disabled"
                        aria-disabled="true"
                      >
                        {link.label}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="footer__bottom">
          <p className="footer__copy">
            © {new Date().getFullYear()} CresoX Fintech Private Limited. All rights reserved.
          </p>
          <p className="footer__meta">CIN: U74999MH2024PTC123456 · Mumbai, India</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
