import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="modern-footer animate-fadeInUp">
      <div className="footer-content">
        <div className="footer-brand animate-fadeInLeft animate-delay-1">
          <div className="footer-logo">
            <img src="/crlogo.jpg" alt="XCoinpay logo" />
            <span>XCoinpay</span>
          </div>
          <p className="footer-tagline animate-fadeInUp animate-delay-2">
            Redefining crypto utility with instant, secure, and low-fee blockchain withdrawals.
          </p>
        </div>
        
        <div className="footer-links animate-fadeInUp animate-delay-3">
          <div className="footer-section animate-fadeInLeft animate-delay-4">
            <h4>Quick Links</h4>
            <ul>
              <li><Link to="/" className="hover-lift">Home</Link></li>
              <li><Link to="/about" className="hover-lift">About</Link></li>
              <li><Link to="/tokenomics" className="hover-lift">Tokenomics</Link></li>
              <li><Link to="/ico" className="hover-lift">ICO</Link></li>
            </ul>
          </div>
          
          <div className="footer-section animate-fadeInRight animate-delay-5">
            <h4>Connect</h4>
            <ul>
              <li><a href="mailto:support@xcoinpay.org" className="hover-lift">support@xcoinpay.org</a></li>
              <li><a href="#" className="hover-lift">xcoinpay.org</a></li>
              <li><Link to="/signin" className="hover-lift">Sign In</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="footer-social animate-fadeInUp animate-delay-6">
          <h4>Follow Us</h4>
          <div className="social-icons">
            <a href="https://www.instagram.com/care.xcoinpay?igsh=NDdvaWpvYXBmemdu" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="social-icon">
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <rect width="18" height="18" x="3" y="3" rx="5" fill="none" strokeWidth="2.2"/>
                <circle cx="12" cy="12" r="4" strokeWidth="2.2"/>
                <circle cx="17" cy="7" r="1.5" fill="currentColor"/>
              </svg>
            </a>
            <a href="https://www.facebook.com/share/1FtaPf1KKx/" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="social-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.675 0h-21.35C.595 0 0 .592 0 1.326v21.348C0 23.408.595 24 1.325 24h11.495v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.797.143v3.24l-1.918.001c-1.504 0-1.797.715-1.797 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116C23.406 24 24 23.408 24 22.674V1.326C24 .592 23.406 0 22.675 0"/>
              </svg>
            </a>
            <a href="https://x.com/xcoinpay84980?t=r66cV411JOKjjwbwfZdw9Q&s=09" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="social-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M24 4.557a9.83 9.83 0 0 1-2.828.775 4.932 4.932 0 0 0 2.165-2.724c-.951.564-2.005.974-3.127 1.195a4.916 4.916 0 0 0-8.38 4.482C7.691 8.095 4.066 6.13 1.64 3.161c-.542.929-.856 2.01-.857 3.17 0 2.188 1.115 4.117 2.823 5.254a4.904 4.904 0 0 1-2.229-.616c-.054 2.281 1.581 4.415 3.949 4.89a4.936 4.936 0 0 1-2.224.084c.627 1.956 2.444 3.377 4.6 3.417A9.867 9.867 0 0 1 0 21.543a13.94 13.94 0 0 0 7.548 2.209c9.058 0 14.009-7.513 14.009-14.009 0-.213-.005-.425-.014-.636A10.012 10.012 0 0 0 24 4.557z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
      
      <div className="footer-bottom">
        <div className="footer-bottom-content">
          <p>&copy; 2024 XCoinpay. All rights reserved.</p>
          <div className="footer-bottom-links">
            <Link to="/privacy-policy">Privacy Policy</Link>
            <Link to="/terms-of-service">Terms of Service</Link>
            <Link to="/cookie-policy">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
