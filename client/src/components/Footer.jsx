import React from 'react';
import { Link } from 'react-router-dom';
import { Globe } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="simple-footer">
      <div className="container">
        {/* Main Row: Brand & Minimal Navigation */}
        <div className="simple-footer-content">
          <div className="simple-footer-brand">
            <Link to="/" className="simple-footer-logo">
              <span className="brand-dot" />
              StayEase
            </Link>
            <p className="simple-footer-tagline">
              Boutique stays &amp; curated hospitality.
            </p>
          </div>

          <nav className="simple-footer-nav" aria-label="Footer Navigation">
            <Link to="/hotels">Explore Stays</Link>
            <Link to="/about">About</Link>
            <Link to="/contact">Support</Link>
            <Link to="/#privacy">Privacy</Link>
            <Link to="/#terms">Terms</Link>
          </nav>
        </div>

        {/* Sub Row: Copyright & Localization */}
        <div className="simple-footer-bottom">
          <p className="simple-footer-legal">
            &copy; {new Date().getFullYear()} StayEase, Inc. All rights reserved.
          </p>

          <div className="simple-footer-controls">
            <button
              type="button"
              className="simple-footer-btn"
              aria-label="Select language: English (India)"
            >
              <Globe size={14} aria-hidden="true" />
              <span>English (IN)</span>
            </button>
            <button
              type="button"
              className="simple-footer-btn"
              aria-label="Select currency: Indian Rupee"
            >
              <span>₹ INR</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
