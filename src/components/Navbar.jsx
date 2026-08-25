import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Ship, Menu, X, Phone, Compass, Calendar, Sparkles, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useConfig } from '../context/ConfigContext';
import BookingModal from './BookingModal';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [hideMobileNav, setHideMobileNav] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const context = useConfig();
  const config = context?.config || {};
  const isAdmin = location.pathname.startsWith('/admin');

  useEffect(() => {
    let lastScrollY = window.scrollY;
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrolled(currentScrollY > 30);

      // Hide mobile nav on scroll down, show on scroll up (mobile only)
      if (window.innerWidth < 1024) {
        if (currentScrollY > 70 && currentScrollY > lastScrollY) {
          setHideMobileNav(true);
        } else {
          setHideMobileNav(false);
        }
      } else {
        setHideMobileNav(false);
      }
      lastScrollY = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  if (isAdmin) return null;

  const scrollToSection = (id) => {
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) {
          const offset = 90;
          const bodyRect = document.body.getBoundingClientRect().top;
          const elementRect = el.getBoundingClientRect().top;
          const offsetPosition = elementRect - bodyRect - offset;
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      }, 120);
      return;
    }
    const el = document.getElementById(id);
    if (el) {
      const offset = 90;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = el.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
    setMobileMenuOpen(false);
  };

  const navLinks = [
    { label: '서비스 소개', to: '#service', type: 'scroll', sectionId: 'service' },
    { label: '추천 패키지', to: '#packages', type: 'scroll', sectionId: 'packages' },
    { label: '여행 후기', to: '/reviews', type: 'route' },
    { label: '이용안내 / FAQ', to: '#faq', type: 'scroll', sectionId: 'faq' },
  ];

  const isDark = !scrolled && location.pathname === '/';

  return (
    <>
      <header 
        className={`kensington-header ${hideMobileNav ? 'mobile-hidden' : ''}`}
        style={{ 
          position: 'fixed', 
          top: 0, 
          left: 0, 
          width: '100%', 
          zIndex: 1000,
          transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      >
        {/* Top Mini Utility Bar */}
        <div className="top-mini-bar" style={{ 
          background: isDark ? 'rgba(11, 19, 43, 0.95)' : '#0B132B', 
          backdropFilter: 'blur(8px)',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          color: '#e2e8f0', 
          fontSize: '11px', 
          padding: '6px 0',
          letterSpacing: '0.04em'
        }}>
          <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <span style={{ color: 'var(--accent-gold)', fontWeight: '700' }}>DAONNET LUXURY CRUISE</span>
              <span className="desktop-sub-header" style={{ opacity: 0.7 }}>싱가포르 · 말레이시아 · 태국 · 지중해 프리미엄 멤버십</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <a href="tel:1600-0000" style={{ color: '#fff', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '600' }}>
                <Phone size={12} color="var(--accent-gold)" /> TEL. 1600-0000
              </a>
              <Link to="/admin" target="_blank" rel="noopener noreferrer" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none', fontSize: '10px' }}>ADMIN</Link>
            </div>
          </div>
        </div>

        {/* Main Navigation Bar (Kensington Style Centered Branding) */}
        <nav style={{ 
          background: isDark ? 'rgba(11, 19, 43, 0.75)' : '#ffffff',
          backdropFilter: 'blur(12px)',
          borderBottom: isDark ? '1px solid rgba(255,255,255,0.12)' : '1px solid #e2e8f0',
          boxShadow: isDark ? 'none' : '0 4px 20px rgba(0,0,0,0.06)',
          transition: 'background-color 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease'
        }}>
          <div className="container nav-container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            
            {/* Left Brand Logo */}
            <Link to="/" onClick={() => window.scrollTo({ top: 0, left: 0, behavior: 'instant' })} style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
              <div className="nav-logo-box" style={{ 
                border: isDark ? '1px solid var(--accent-gold)' : '1px solid var(--navy-deep)', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                color: isDark ? 'var(--accent-gold)' : 'var(--navy-deep)',
                background: isDark ? 'rgba(0,0,0,0.2)' : 'transparent',
                boxShadow: isDark ? '0 0 15px rgba(212, 175, 55, 0.15)' : 'none'
              }}>
                <Ship size={20} strokeWidth={1.8} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span className="nav-logo-text" style={{ 
                  fontFamily: "'Pretendard', 'Noto Sans KR', sans-serif", 
                  fontWeight: '900', 
                  letterSpacing: '-0.02em', 
                  color: isDark ? '#ffffff' : 'var(--navy-deep)',
                  lineHeight: '1.2'
                }}>
                  {config.siteName || '다온넷크루즈'}
                </span>
                <span className="nav-logo-sub" style={{ 
                  letterSpacing: '0.2em', 
                  textTransform: 'uppercase', 
                  fontWeight: '700',
                  color: isDark ? 'var(--accent-gold)' : 'var(--accent-gold-dark)',
                  marginTop: '1px',
                  fontFamily: "'Cinzel', serif"
                }}>
                  {config.siteNameEn || 'DAONNET CRUISE'}
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <div style={{ alignItems: 'center', gap: '36px' }} className="desktop-menu">
              {navLinks.map((item, idx) => (
                item.type === 'route' ? (
                  <Link 
                    key={idx} 
                    to={item.to} 
                    className={`kensington-nav-link ${isDark ? 'theme-dark' : 'theme-light'}`}
                  >
                    {item.label}
                  </Link>
                ) : (
                  <button 
                    key={idx} 
                    onClick={() => scrollToSection(item.sectionId)} 
                    className={`kensington-nav-link ${isDark ? 'theme-dark' : 'theme-light'}`}
                    style={{ fontFamily: 'inherit' }}
                  >
                    {item.label}
                  </button>
                )
              ))}
            </div>

            {/* Right Action CTA Button */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <button 
                onClick={() => setBookingModalOpen(true)}
                className="sharp-btn-gold desktop-cta-btn"
                style={{ 
                  padding: '10px 22px', 
                  fontSize: '12px'
                }}
              >
                1:1 맞춤 견적·상담
              </button>

              {/* Mobile Menu Hamburger */}
              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                style={{ 
                  background: 'none', 
                  border: isDark ? '1px solid rgba(255,255,255,0.3)' : '1px solid #cbd5e1',
                  color: isDark ? '#ffffff' : 'var(--navy-deep)',
                  padding: '8px',
                  cursor: 'pointer',
                  borderRadius: '0px'
                }}
                className="mobile-menu-btn"
              >
                {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>

          </div>
        </nav>

        {/* Mobile Dropdown Menu (Sharp Kensington Style) */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              style={{ 
                background: '#ffffff', 
                borderBottom: '2px solid var(--navy-deep)', 
                padding: '24px 20px', 
                boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
              }}
            >
              {navLinks.map((item, idx) => (
                item.type === 'route' ? (
                  <Link 
                    key={idx} 
                    to={item.to} 
                    onClick={() => setMobileMenuOpen(false)}
                    style={{ 
                      padding: '12px 14px', 
                      fontSize: '15px', 
                      fontWeight: '700', 
                      color: 'var(--navy-deep)', 
                      textDecoration: 'none',
                      borderBottom: '1px solid #f1f5f9',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <span>{item.label}</span>
                    <ChevronRight size={16} color="var(--accent-gold-dark)" />
                  </Link>
                ) : (
                  <button 
                    key={idx} 
                    onClick={() => scrollToSection(item.sectionId)} 
                    style={{ 
                      padding: '12px 14px', 
                      fontSize: '15px', 
                      fontWeight: '700', 
                      color: 'var(--navy-deep)', 
                      textAlign: 'left',
                      background: 'none',
                      border: 'none',
                      borderBottom: '1px solid #f1f5f9',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      cursor: 'pointer',
                      fontFamily: 'inherit'
                    }}
                  >
                    <span>{item.label}</span>
                    <ChevronRight size={16} color="var(--accent-gold-dark)" />
                  </button>
                )
              ))}

              <button 
                onClick={() => { setMobileMenuOpen(false); setBookingModalOpen(true); }}
                className="sharp-btn-gold"
                style={{ width: '100%', marginTop: '8px', padding: '14px' }}
              >
                1:1 맞춤 견적·상담 신청
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Global Booking Modal */}
      <BookingModal 
        isOpen={bookingModalOpen} 
        onClose={() => setBookingModalOpen(false)} 
        productTitle="다온넷크루즈 프리미엄 크루즈 멤버십"
        accentColor="var(--accent-gold-dark)"
      />

      <style>{`
        @media (min-width: 1024px) {
          .desktop-menu { display: flex !important; }
          .mobile-menu-btn { display: none !important; }
        }
      `}</style>
    </>
  );
};

export default Navbar;
