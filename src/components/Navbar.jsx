import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Ship, Menu, X, ArrowUpRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (isAdmin) return null;

  return (
    <nav className={`nav ${scrolled ? 'scrolled' : ''}`}>
      <Link to="/" className="nav-logo" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ width: '40px', height: '40px', background: 'var(--gold-gradient)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Ship size={24} color="#000" />
        </div>
        <span style={{ fontWeight: '900', letterSpacing: '-0.02em', fontSize: '24px' }}>OLIGO</span>
      </Link>

      <div className="nav-links">
        {['홈', '멤버십', '크루즈', '여행후기'].map((text, idx) => (
          <Link 
            key={text} 
            to={text === '홈' ? '/' : text === '여행후기' ? '/reviews' : `/#${text}`} 
            className="nav-link"
          >
            {text}
          </Link>
        ))}
        <div style={{ width: '1px', height: '24px', background: 'rgba(255,255,255,0.1)', marginLeft: '10px' }}></div>
        <Link to="/admin" className="luxury-btn" style={{ padding: '8px 24px', fontSize: '11px', borderRadius: '100px' }}>
           ADMIN <ArrowUpRight size={14} style={{ marginLeft: '4px' }} />
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
