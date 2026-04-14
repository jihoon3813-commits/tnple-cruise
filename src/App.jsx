import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Admin from './pages/Admin';
import ProductDetail from './pages/ProductDetail';
import Reviews from './pages/Reviews';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';

import { useConfig } from './context/ConfigContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Ship } from 'lucide-react';

function App() {
  const { config, loading } = useConfig();

  React.useEffect(() => {
    // 1. Favicon Update
    if (config.faviconUrl) {
      const link = document.querySelector("link[rel~='icon']") || document.createElement('link');
      link.type = 'image/x-icon';
      link.rel = 'icon';
      link.href = config.faviconUrl;
      document.getElementsByTagName('head')[0].appendChild(link);
    }

    // 2. Meta Description
    if (config.metaDescription) {
      const meta = document.querySelector('meta[name="description"]') || document.createElement('meta');
      meta.name = "description";
      meta.content = config.metaDescription;
      document.getElementsByTagName('head')[0].appendChild(meta);
      
      // OG Description
      const ogMeta = document.querySelector('meta[property="og:description"]') || document.createElement('meta');
      ogMeta.setAttribute('property', 'og:description');
      ogMeta.content = config.metaDescription;
      document.getElementsByTagName('head')[0].appendChild(ogMeta);
    }

    // 3. OG Image
    if (config.ogImageUrl) {
      const ogImg = document.querySelector('meta[property="og:image"]') || document.createElement('meta');
      ogImg.setAttribute('property', 'og:image');
      ogImg.content = config.ogImageUrl;
      document.getElementsByTagName('head')[0].appendChild(ogImg);
    }
  }, [config.faviconUrl, config.metaDescription, config.ogImageUrl]);

  return (
    <>
      <AnimatePresence>
        {loading && (
          <motion.div 
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            style={{ 
              position: 'fixed', 
              inset: 0, 
              zIndex: 9999, 
              background: '#fff', 
              display: 'flex', 
              flexDirection: 'column',
              alignItems: 'center', 
              justifyContent: 'center',
              gap: '24px'
            }}
          >
            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
              style={{ color: 'var(--primary)' }}
            >
              <Ship size={48} />
            </motion.div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '14px', fontWeight: '700' }}>
               <Loader2 className="animate-spin" size={16} />
               OLIGO CRUISE
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <ScrollToTop />
      <Navbar />
      <div style={{ opacity: loading ? 0 : 1, transition: 'opacity 0.3s' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/admin/*" element={<Admin />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/reviews" element={<Reviews />} />
        </Routes>
      </div>
      <Footer />
    </>
  );
}

export default App;
