import { useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import "./Navbar.css";

const NAV_LINKS = [
  { label: "Solutions",    href: "/#solutions" },
  { label: "Marketplace",  href: "/#marketplace" },
  { label: "Blockchain",   href: "/#blockchain" },
  { label: "Company",      href: "#" },
];

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`navbar ${scrolled ? "navbar--scrolled" : ""}`}>
      <div className="navbar__inner container">
        {/* Logo */}
        <Link to="/" className="navbar__logo">
          <div className="navbar__logo-box">
            <div className="navbar__logo-arc"></div>
            <div className="navbar__logo-wordmark">
              <span className="navbar__logo-creso">Creso</span>
              <span className="navbar__logo-x">X</span>
            </div>
            <div className="navbar__logo-tag">FINTECH PRIVATE LIMITED</div>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="navbar__nav">
          {NAV_LINKS.map(link => (
            <a key={link.label} href={link.href} className="navbar__link">
              {link.label}
            </a>
          ))}
        </nav>

        {/* Actions */}
        <div className="navbar__actions">
          <Link to="/login" className="navbar__login">Log In</Link>
          <Link to="/register" className="btn btn-primary btn-sm">Get Started</Link>
        </div>

        {/* Mobile menu toggle */}
        <button
          className="navbar__hamburger"
          onClick={() => setMenuOpen(o => !o)}
          aria-label="Toggle menu"
        >
          <span></span><span></span><span></span>
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="navbar__mobile-menu">
          {NAV_LINKS.map(link => (
            <a key={link.label} href={link.href} className="navbar__mobile-link"
              onClick={() => setMenuOpen(false)}>
              {link.label}
            </a>
          ))}
          <div className="navbar__mobile-actions">
            <Link to="/login" className="btn btn-secondary w-full" style={{justifyContent:"center"}}
              onClick={() => setMenuOpen(false)}>
              Log In
            </Link>
            <Link to="/register" className="btn btn-primary w-full" style={{justifyContent:"center"}}
              onClick={() => setMenuOpen(false)}>
              Get Started
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;