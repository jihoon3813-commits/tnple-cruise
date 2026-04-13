import React, { useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useConfig } from '../context/ConfigContext';
import { ArrowRight, Star, MousePointer2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const Home = () => {
  const { config } = useConfig();
  const { hero, sections, products } = config;

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, [sections]);

  const getPositionClass = (pos) => {
    if (pos === 'left') return 'justify-start text-left';
    if (pos === 'right') return 'justify-end text-right';
    return 'justify-center text-center';
  };

  return (
    <div className="home-modern">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-bg" style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
          {hero.bgType === 'video' ? (
            <video autoPlay loop muted playsInline style={{ width: '100%', height: '100%', objectFit: 'cover' }}>
              <source src={hero.bgUrl} type="video/mp4" />
            </video>
          ) : (
            <img src={hero.bgUrl} alt="Hero" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          )}
          <div className="hero-overlay"></div>
        </div>

        <div className={`container flex ${getPositionClass(hero.textPosition)}`} style={{ position: 'relative', zIndex: 2, padding: '0 60px', width: '100%' }}>
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className="hero-content-modern"
          >
            <span className="hero-subtitle">{hero.subtitle}</span>
            <h1 className="hero-title">{hero.title.split('\n').map((line, i) => (
              <React.Fragment key={i}>{line}<br /></React.Fragment>
            ))}</h1>
            <div style={{ display: 'flex', gap: '20px', justifyContent: hero.textPosition === 'center' ? 'center' : 'flex-start' }}>
              <button className="luxury-btn">멤버십 가입하기 <ArrowRight size={18} /></button>
              <button className="luxury-btn outline">여정 탐색</button>
            </div>
          </motion.div>
        </div>

        <div style={{ 
          position: 'absolute', bottom: '40px', left: '50%', transform: 'translateX(-50%)', 
          zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', 
          opacity: 0.5 
        }}>
          <div style={{ width: '1px', height: '60px', background: 'var(--gold-primary)' }}></div>
          <span style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.3em' }}>Scroll Down</span>
        </div>
      </section>

      {/* Dynamic Sections */}
      {sections.map((section, index) => (
        <section key={section.id} className="padding-y reveal" style={{ padding: '160px 0', position: 'relative' }}>
          <div className="container" style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 60px' }}>
            <div className={`flex items-center gap-20`} 
                 style={{ 
                   display: 'flex', 
                   flexDirection: section.layout === 'text-right' ? 'row-reverse' : 'row', 
                   alignItems: 'center', 
                   gap: '120px' 
                 }}>
              <div className="flex-1" style={{ position: 'relative' }}>
                <motion.div 
                  initial={{ scale: 0.95, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 1 }}
                  viewport={{ once: true }}
                >
                  <img src={section.image} alt={section.title} style={{ width: '100%', borderRadius: '12px', boxShadow: 'var(--shadow-lg)' }} />
                  <div style={{ 
                    position: 'absolute', top: '-20px', left: section.layout === 'text-right' ? 'auto' : '-20px', 
                    right: section.layout === 'text-right' ? '-20px' : 'auto', 
                    width: '150px', height: '150px', border: '1px solid var(--gold-primary)', 
                    opacity: 0.3, zIndex: -1 
                  }}></div>
                </motion.div>
              </div>
              <div className="flex-1">
                <span className="section-tag">Exclusive Experience</span>
                <h2 className="section-title-modern" style={{ marginBottom: '32px' }}>{section.title}</h2>
                <p style={{ fontSize: '20px', color: 'var(--text-gray)', marginBottom: '48px', fontWeight: '300', lineHeight: '1.8' }}>
                  {section.content}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px', cursor: 'pointer', transition: '0.3s' }} className="hover-gold">
                  <span style={{ fontWeight: '600', letterSpacing: '0.1em', textTransform: 'uppercase', fontSize: '13px' }}>자세히 보기</span>
                  <div style={{ width: '40px', height: '1px', background: 'var(--gold-primary)' }}></div>
                </div>
              </div>
            </div>
          </div>
        </section>
      ))}

      {/* Products Section */}
      <section id="products" style={{ padding: '160px 0', background: '#050A18' }}>
        <div className="container" style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 60px' }}>
          <div className="section-header">
            <span className="section-tag">Limited Voyages</span>
            <h2 className="section-title-modern">최고의 항해 리스트</h2>
          </div>
          
          <div className="product-grid">
            {products.map(product => (
              <Link key={product.id} to={`/product/${product.id}`}>
                <motion.div 
                  className="product-card-modern"
                  whileHover={{ y: -15 }}
                >
                  <div className="product-img-wrapper">
                    <img src={product.thumbnails[0]} alt={product.title} />
                  </div>
                  <div className="product-info">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                      <span style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--gold-primary)', letterSpacing: '0.2em' }}>14 Days Voyage</span>
                      <div style={{ display: 'flex', color: 'var(--gold-primary)' }}>
                        {[...Array(5)].map((_, i) => <Star key={i} size={12} fill="currentColor" />)}
                      </div>
                    </div>
                    <h3 style={{ fontSize: '28px', marginBottom: '10px', fontWeight: '700' }}>{product.title}</h3>
                    <p style={{ color: 'var(--text-gray)', fontSize: '14px', marginBottom: '30px', fontWeight: '300' }}>{product.description}</p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '20px' }}>
                        <span style={{ fontSize: '22px', fontWeight: '800' }} className="text-gradient">{product.price.toLocaleString()} KRW</span>
                        <div className="glass-light" style={{ padding: '10px', borderRadius: '50%' }}>
                          <ArrowRight size={18} />
                        </div>
                    </div>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
