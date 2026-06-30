import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  ChevronDown,
  Menu,
  X,
  Wallet,
  Building2,
  Code2,
  Store,
  Link2,
} from "lucide-react";
import "./Navbar.css";
import cresoxLogo from "../../../assets/cresox-logo.png";

const NAV_LINKS = [
  { label: "Marketplace", href: "#marketplace" },
  { label: "Blockchain", href: "#blockchain" },
  { label: "Developers", href: "/register?role=developer" },
  { label: "Company", href: "#company" },
  { label: "Contact", href: "#contact" },
];

const SOLUTIONS_ITEMS = [
  {
    title: "Digital Wallet",
    desc: "Personal accounts, transfers, and balance management.",
    icon: Wallet,
    path: "/register?role=individual",
  },
  {
    title: "Business Banking",
    desc: "Team permissions, invoicing, and B2B payments.",
    icon: Building2,
    path: "/register?role=business",
  },
  {
    title: "Marketplace",
    desc: "Buy and sell verified products within the ecosystem.",
    icon: Store,
    path: "/register?role=individual",
  },
  {
    title: "Developer APIs",
    desc: "REST endpoints, webhooks, and sandbox access.",
    icon: Code2,
    path: "/register?role=developer",
  },
  {
    title: "Blockchain Verification",
    desc: "Hash-only storage with on-chain proof of integrity.",
    icon: Link2,
    path: "/register?role=developer",
  },
];

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [solutionsOpen, setSolutionsOpen] = useState(false);
  const [mobileSolutionsOpen, setMobileSolutionsOpen] = useState(false);
  const solutionsRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!location.key) return;
    const cleanupId = setTimeout(() => {
      setMobileOpen(false);
      setSolutionsOpen(false);
      setMobileSolutionsOpen(false);
    }, 0);
    return () => clearTimeout(cleanupId);
  }, [location.key]);

  useEffect(() => {
    if (!solutionsOpen) return;

    const handleClickOutside = (event) => {
      if (solutionsRef.current && !solutionsRef.current.contains(event.target)) {
        setSolutionsOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") setSolutionsOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [solutionsOpen]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <header className={`navbar ${scrolled ? "navbar--scrolled" : ""}`}>
      <div className="navbar__inner">
        <Link to="/" className="navbar__logo" aria-label="CresoX Fintech Private Limited">
          <img
            src={cresoxLogo}
            alt="CresoX Fintech Private Limited"
            className="navbar__logo-img"
          />
        </Link>

        <nav className="navbar__nav" aria-label="Main navigation">
          <div
            className="navbar__dropdown-wrap"
            ref={solutionsRef}
            onMouseEnter={() => setSolutionsOpen(true)}
            onMouseLeave={() => setSolutionsOpen(false)}
          >
            <button
              type="button"
              className={`navbar__link navbar__link--trigger ${solutionsOpen ? "navbar__link--active" : ""}`}
              aria-expanded={solutionsOpen}
              aria-haspopup="true"
              onClick={() => setSolutionsOpen((prev) => !prev)}
            >
              Solutions
              <ChevronDown
                size={14}
                className={`navbar__chevron ${solutionsOpen ? "navbar__chevron--open" : ""}`}
                aria-hidden="true"
              />
            </button>

            <div
              className={`navbar__dropdown ${solutionsOpen ? "navbar__dropdown--open" : ""}`}
              role="menu"
              aria-label="Solutions"
            >
              {SOLUTIONS_ITEMS.map((item) => (
                <Link
                  key={item.title}
                  to={item.path}
                  className="navbar__dropdown-link"
                  role="menuitem"
                  onClick={() => setSolutionsOpen(false)}
                >
                  <span className="navbar__dropdown-icon">
                    <item.icon size={18} strokeWidth={1.75} />
                  </span>
                  <span className="navbar__dropdown-text">
                    <span className="navbar__dropdown-title">{item.title}</span>
                    <span className="navbar__dropdown-desc">{item.desc}</span>
                  </span>
                </Link>
              ))}
            </div>
          </div>

          {NAV_LINKS.map((link) => (
            <a key={link.label} href={link.href} className="navbar__link">
              {link.label}
            </a>
          ))}
        </nav>

        <div className="navbar__actions">
          <Link to="/login" className="navbar__login">
            Login
          </Link>
          <Link to="/register" className="btn btn-primary btn-sm navbar__cta">
            Get Started
          </Link>
        </div>

        <button
          type="button"
          className="navbar__toggle"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen((prev) => !prev)}
        >
          {mobileOpen ? <X size={22} strokeWidth={1.75} /> : <Menu size={22} strokeWidth={1.75} />}
        </button>
      </div>

      <div className={`navbar__mobile ${mobileOpen ? "navbar__mobile--open" : ""}`} aria-hidden={!mobileOpen}>
        <div className="navbar__mobile-inner">
          <div className="navbar__mobile-group">
            <button
              type="button"
              className="navbar__mobile-trigger"
              aria-expanded={mobileSolutionsOpen}
              onClick={() => setMobileSolutionsOpen((prev) => !prev)}
            >
              Solutions
              <ChevronDown
                size={16}
                className={`navbar__chevron ${mobileSolutionsOpen ? "navbar__chevron--open" : ""}`}
              />
            </button>
            {mobileSolutionsOpen && (
              <div className="navbar__mobile-submenu">
                {SOLUTIONS_ITEMS.map((item) => (
                  <Link
                    key={item.title}
                    to={item.path}
                    className="navbar__mobile-sublink"
                    onClick={() => setMobileOpen(false)}
                  >
                    <item.icon size={16} strokeWidth={1.75} />
                    {item.title}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="navbar__mobile-link"
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </a>
          ))}

          <div className="navbar__mobile-actions">
            <Link to="/login" className="btn btn-secondary w-full navbar__mobile-btn" onClick={() => setMobileOpen(false)}>
              Login
            </Link>
            <Link to="/register" className="btn btn-primary w-full navbar__mobile-btn" onClick={() => setMobileOpen(false)}>
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
