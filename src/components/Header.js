import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Header = () => {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [isAccountDropdownOpen, setIsAccountDropdownOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) {
      setUser(storedUser);
    }

    const handleScroll = () => {
      const header = document.getElementById('mainHeader');
      if (header) {
        const headerHeight = header.offsetHeight;
        if (window.scrollY > headerHeight) {
          header.classList.add('scrolled');
        } else {
          header.classList.remove('scrolled');
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileNav = () => {
    setIsMobileNavOpen(!isMobileNavOpen);
    document.body.style.overflow = isMobileNavOpen ? '' : 'hidden';
  };

  const closeMobileNav = () => {
    setIsMobileNavOpen(false);
    document.body.style.overflow = '';
  };

  const toggleAccountDropdown = () => {
    setIsAccountDropdownOpen(!isAccountDropdownOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
    setIsAccountDropdownOpen(false);
    navigate('/login');
  };

  return (
    <header id="mainHeader">
      <div className="nav-container">
        <Link to="/" className="logo">
          CraftMarket
        </Link>

        <div className="header-search">
          <input
            type="search"
            className="search-input"
            placeholder="Search for artisan goods..."
            aria-label="Search for artisan goods"
          />
          <button className="search-button" aria-label="Search">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </button>
        </div>

        <button
          className="menu-toggle"
          id="menuToggle"
          aria-label="Toggle menu"
          aria-expanded={isMobileNavOpen}
          aria-controls="mobileNav"
          onClick={toggleMobileNav}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>

        <nav className="desktop-nav" aria-label="Main navigation">
          <ul>
            <li>
              <Link to="/" className={window.location.pathname === '/' ? 'active' : ''}>
                Home
              </Link>
            </li>
            <li>
              <Link to="/explore" className={window.location.pathname === '/explore' ? 'active' : ''}>
                Explore
              </Link>
            </li>
            <li>
              <Link to="/about" className={window.location.pathname === '/about' ? 'active' : ''}>
                About
              </Link>
            </li>
            <li>
              <Link to="/reviews" className={window.location.pathname === '/reviews' ? 'active' : ''}>
                Reviews
              </Link>
            </li>
            <li>
              <Link to="/cart" aria-label="Shopping Cart">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <circle cx="9" cy="21" r="1"></circle>
                  <circle cx="20" cy="21" r="1"></circle>
                  <path d="M1 1h4l2.4 12.8a2 2 0 0 0 2 1.7h9.6a2 2 0 0 0 2-1.7L23 6H6"></path>
                </svg>
                Cart
              </Link>
            </li>
            <li id="auth-nav-item">
              {user ? (
                <div className="account-container">
                  <button
                    className="account-btn"
                    onClick={toggleAccountDropdown}
                    aria-label="Account options"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                    {user.name}
                  </button>
                  <div className={`account-dropdown ${isAccountDropdownOpen ? 'active' : ''}`}>
                    {user.role === 'buyer' && (
                      <Link to="/dashboard/customer" onClick={() => setIsAccountDropdownOpen(false)}>
                        Dashboard
                      </Link>
                    )}
                    {user.role === 'seller' && (
                      <Link to="/seller-dashboard" onClick={() => setIsAccountDropdownOpen(false)}>
                        Seller Dashboard
                      </Link>
                    )}
                    {user.role === 'admin' && (
                      <Link to="/admin" onClick={() => setIsAccountDropdownOpen(false)}>
                        Admin Dashboard
                      </Link>
                    )}
                    <button onClick={handleLogout}>Logout</button>
                  </div>
                </div>
              ) : (
                <Link to="/login" id="login-link" aria-label="Login or Account">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                  Login
                </Link>
              )}
            </li>
          </ul>
        </nav>
      </div>

      <div className={`mobile-nav ${isMobileNavOpen ? 'active' : ''}`} id="mobileNav" aria-hidden={!isMobileNavOpen}>
        <button
          className="close-menu-btn"
          id="closeMenuBtn"
          aria-label="Close menu"
          onClick={closeMobileNav}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
        <nav aria-label="Mobile navigation">
          <ul>
            <li>
              <Link to="/" className="mobile-nav-link" onClick={closeMobileNav}>
                Home
              </Link>
            </li>
            <li>
              <Link to="/explore" className="mobile-nav-link" onClick={closeMobileNav}>
                Explore
              </Link>
            </li>
            <li>
              <Link to="/about" className="mobile-nav-link" onClick={closeMobileNav}>
                About
              </Link>
            </li>
            <li>
              <Link to="/reviews" className="mobile-nav-link" onClick={closeMobileNav}>
                Reviews
              </Link>
            </li>
            <li>
              <Link to="/cart" className="mobile-nav-link" onClick={closeMobileNav}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <circle cx="9" cy="21" r="1"></circle>
                  <circle cx="20" cy="21" r="1"></circle>
                  <path d="M1 1h4l2.4 12.8a2 2 0 0 0 2 1.7h9.6a2 2 0 0 0 2-1.7L23 6H6"></path>
                </svg>
                Cart
              </Link>
            </li>
            <li>
              {user ? (
                <>
                  {user.role === 'buyer' && (
                    <Link to="/dashboard/customer" className="mobile-nav-link" onClick={closeMobileNav}>
                      Dashboard
                    </Link>
                  )}
                  {user.role === 'seller' && (
                    <Link to="/seller-dashboard" className="mobile-nav-link" onClick={closeMobileNav}>
                      Seller Dashboard
                    </Link>
                  )}
                  {user.role === 'admin' && (
                    <Link to="/admin" className="mobile-nav-link" onClick={closeMobileNav}>
                      Admin Dashboard
                    </Link>
                  )}
                  <Link to="#" className="mobile-nav-link" onClick={() => { handleLogout(); closeMobileNav(); }}>
                    Logout
                  </Link>
                </>
              ) : (
                <Link to="/login" className="mobile-nav-link" onClick={closeMobileNav}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                  Login
                </Link>
              )}
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;