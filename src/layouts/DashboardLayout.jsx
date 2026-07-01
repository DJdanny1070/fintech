import { useEffect, useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useToast } from "../components/common/ToastProvider";
import { getProducts } from "../services/productService";
import { searchSellers } from "../services/profileService";
import "./DashboardLayout.css";

const NAV = [
  { path: "/dashboard",            label: "Overview",    icon: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
      <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
    </svg>
  )},
  { path: "/dashboard/marketplace", label: "Marketplace", icon: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/>
      <path d="M16 10a4 4 0 01-8 0"/>
    </svg>
  )},
  { path: "/dashboard/wallet",      label: "Wallet",      icon: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="5" width="20" height="14" rx="2"/><path d="M16 12h.01"/>
    </svg>
  )},
  { path: "/dashboard/blockchain",  label: "Blockchain",  icon: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
    </svg>
  )},
  { path: "/dashboard/analytics",   label: "Analytics",   icon: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/>
      <line x1="6" y1="20" x2="6" y2="14"/>
    </svg>
  )},
  { path: "/dashboard/orders",      label: "Orders",      icon: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
      <polyline points="7 10 12 15 17 10"/>
      <line x1="12" y1="15" x2="12" y2="3"/>
    </svg>
  )},
];

function DashboardLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState({ products: [], sellers: [] });
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const navigate = useNavigate();
  const { profile, logout } = useAuth();
  const toast = useToast();

  const displayName = profile?.full_name || "User";
  const avatarLetter = displayName.charAt(0).toUpperCase();
  const displayRole = profile?.role
    ? profile.role.charAt(0).toUpperCase() + profile.role.slice(1)
    : "Member";

  useEffect(() => {
    const trimmed = searchQuery.trim();

    if (!trimmed) {
      setSearchResults({ products: [], sellers: [] });
      setIsSearching(false);
      setHasSearched(false);
      return;
    }

    const timeoutId = window.setTimeout(async () => {
      setIsSearching(true);
      setHasSearched(true);

      try {
        const [products, sellers] = await Promise.all([
          getProducts({ search: trimmed }),
          searchSellers(trimmed, { limit: 5 }),
        ]);

        setSearchResults({
          products: (products || []).slice(0, 5),
          sellers: (sellers || []).slice(0, 5),
        });
      } catch (err) {
        console.error("Global search failed:", err.message);
        setSearchResults({ products: [], sellers: [] });
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => window.clearTimeout(timeoutId);
  }, [searchQuery]);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logout successful");
      navigate("/login");
    } catch (err) {
      console.error("Logout failed:", err.message);
      toast.error("Logout failed");
    }
  };

  return (
    <div className={`db-layout ${collapsed ? "db-layout--collapsed" : ""}`}>
      {/* Sidebar */}
      <aside className="db-sidebar">
        <div className="db-sidebar__top">
          {/* Logo */}
          <div className="db-sidebar__logo" onClick={() => navigate("/")}>
            <div className="db-sidebar__logo-box">
              <span className="db-logo-creso">Creso</span>
              <span className="db-logo-x">X</span>
            </div>
            {!collapsed && <span className="db-sidebar__logo-sub">Platform</span>}
          </div>

          <button
            className="db-sidebar__collapse"
            onClick={() => setCollapsed(c => !c)}
            title={collapsed ? "Expand" : "Collapse"}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              {collapsed
                ? <><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></>
                : <><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></>
              }
            </svg>
          </button>
        </div>

        {!collapsed && <div className="db-sidebar__section-label">Main Menu</div>}

        <nav className="db-sidebar__nav">
          {NAV.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/dashboard"}
              className={({ isActive }) =>
                `db-nav-item ${isActive ? "db-nav-item--active" : ""}`
              }
              title={collapsed ? item.label : undefined}
            >
              <span className="db-nav-item__icon">{item.icon}</span>
              {!collapsed && <span className="db-nav-item__label">{item.label}</span>}
            </NavLink>
          ))}
        </nav>

        <div className="db-sidebar__bottom">
          {!collapsed && (
            <div className="db-sidebar__user">
              <div className="db-sidebar__avatar">{profile?.avatar_url ? (
                <img src={profile.avatar_url} alt={displayName} />
              ) : avatarLetter}</div>
              <div className="db-sidebar__user-info">
                <div className="db-sidebar__user-name">{displayName}</div>
                <div className="db-sidebar__user-role">{displayRole}</div>
              </div>
            </div>
          )}
          <button
            className="db-nav-item"
            onClick={handleLogout}
            title={collapsed ? "Log Out" : undefined}
            style={{ width: "100%", background: "none", border: "none", cursor: "pointer", textAlign: "left" }}
          >
            <span className="db-nav-item__icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/>
                <line x1="21" y1="12" x2="9" y2="12"/>
              </svg>
            </span>
            {!collapsed && <span className="db-nav-item__label">Log Out</span>}
          </button>
        </div>
      </aside>

      {/* Main area */}
      <div className="db-main">
        {/* Topbar */}
        <header className="db-topbar">
          <div className="db-topbar__left">
            <div className="db-topbar__search-wrap">
              <div className="db-topbar__search">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
                <input
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Search products or sellers..."
                />
              </div>

              {hasSearched && (
                <div className="db-topbar__search-panel" role="dialog" aria-label="Search results">
                  {isSearching ? (
                    <div className="db-topbar__search-state">Searching…</div>
                  ) : (
                    <>
                      {searchResults.products.length === 0 && searchResults.sellers.length === 0 ? (
                        <div className="db-topbar__search-state">No matches found for “{searchQuery.trim()}”.</div>
                      ) : (
                        <>
                          {searchResults.products.length > 0 && (
                            <div className="db-topbar__search-section">
                              <div className="db-topbar__search-title">Products</div>
                              {searchResults.products.map((product) => (
                                <button
                                  key={product.id}
                                  type="button"
                                  className="db-topbar__search-item"
                                  onClick={() => navigate(`/marketplace/product/${product.id}`)}
                                >
                                  <span>{product.title}</span>
                                  <small>{product.category || "Product"}</small>
                                </button>
                              ))}
                            </div>
                          )}

                          {searchResults.sellers.length > 0 && (
                            <div className="db-topbar__search-section">
                              <div className="db-topbar__search-title">Sellers</div>
                              {searchResults.sellers.map((seller) => (
                                <div key={seller.id} className="db-topbar__search-item db-topbar__search-item--static">
                                  <span>{seller.full_name || seller.company_name || seller.email}</span>
                                  <small>{seller.company_name || seller.role || "Seller"}</small>
                                </div>
                              ))}
                            </div>
                          )}
                        </>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
          <div className="db-topbar__right">
            <span className="badge badge-green"><span className="dot-live"></span> All systems operational</span>
            <button className="db-topbar__icon-btn" title="Notifications">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/>
              </svg>
            </button>
            <div className="db-topbar__avatar">{profile?.avatar_url ? (
              <img src={profile.avatar_url} alt={displayName} />
            ) : avatarLetter}</div>
          </div>
        </header>

        {/* Page content */}
        <main className="db-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;
