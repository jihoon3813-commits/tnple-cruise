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
    if (loading || !config) return;

    // 1. Favicon Update
    try {
      if (config.faviconUrl) {
        const link = document.querySelector("link[rel~='icon']") || document.createElement('link');
        link.type = 'image/x-icon';
        link.rel = 'icon';
        link.href = config.faviconUrl;
        document.getElementsByTagName('head')[0].appendChild(link);
      }

      // 2. Meta Description
      if (config.metaDescription) {
        let meta = document.querySelector('meta[name="description"]');
        if (!meta) {
          meta = document.createElement('meta');
          meta.name = "description";
          document.getElementsByTagName('head')[0].appendChild(meta);
        }
        meta.content = config.metaDescription;
        
        // OG Description
        let ogMeta = document.querySelector('meta[property="og:description"]');
        if (!ogMeta) {
          ogMeta = document.createElement('meta');
          ogMeta.setAttribute('property', 'og:description');
          document.getElementsByTagName('head')[0].appendChild(ogMeta);
        }
        ogMeta.content = config.metaDescription;
      }

      // 3. OG Image
      if (config.ogImageUrl) {
        let ogImg = document.querySelector('meta[property="og:image"]');
        if (!ogImg) {
          ogImg = document.createElement('meta');
          ogImg.setAttribute('property', 'og:image');
          document.getElementsByTagName('head')[0].appendChild(ogImg);
        }
        ogImg.content = config.ogImageUrl;
      }
    } catch (err) {
      console.error("SEO update error:", err);
    }
  }, [config?.faviconUrl, config?.metaDescription, config?.ogImageUrl, loading]);

  return (
    <>
      <ScrollToTop />
      {loading ? (
        <div style={{ 
          position: 'fixed', 
          inset: 0, 
          zIndex: 9999, 
          background: '#fff', 
          display: 'flex', 
          flexDirection: 'column',
          alignItems: 'center', 
          justifyContent: 'center',
          gap: '24px'
        }}>
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
        </div>
      ) : (
        <>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/admin/*" element={<Admin />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/reviews" element={<Reviews />} />
          </Routes>
          <Footer />
        </>
      )}
    </>
  );
}

export default App;
