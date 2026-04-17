import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
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

import LoadingScreen from './components/LoadingScreen';

function App() {
  const { config, loading } = useConfig();
  const location = useLocation();

  React.useEffect(() => {
    if (loading || !config) return;

    try {
      if (config.faviconUrl) {
        const link = document.querySelector("link[rel~='icon']") || document.createElement('link');
        link.type = 'image/x-icon';
        link.rel = 'icon';
        link.href = config.faviconUrl;
        document.getElementsByTagName('head')[0].appendChild(link);
      }

      if (config.metaDescription) {
        const meta = document.querySelector('meta[name="description"]') || document.createElement('meta');
        meta.name = "description";
        meta.content = config.metaDescription;
        document.getElementsByTagName('head')[0].appendChild(meta);
      }

      // SNS Open Graph Tags
      if (config) {
        const ogTags = [
          { property: 'og:title', content: 'T&PLE KOREA - 프리미엄 크루즈' },
          { property: 'og:description', content: config.metaDescription },
          { property: 'og:image', content: config.ogImageUrl },
          { property: 'og:url', content: window.location.href },
          { property: 'og:type', content: 'website' }
        ];

        ogTags.forEach(tag => {
          let meta = document.querySelector(`meta[property="${tag.property}"]`);
          if (!meta) {
            meta = document.createElement('meta');
            meta.setAttribute('property', tag.property);
            document.getElementsByTagName('head')[0].appendChild(meta);
          }
          meta.content = tag.content;
        });

        // KakaoTalk/Twitter specific
        let twitterImg = document.querySelector('meta[name="twitter:image"]');
        if (!twitterImg) {
          twitterImg = document.createElement('meta');
          twitterImg.name = "twitter:image";
          document.getElementsByTagName('head')[0].appendChild(twitterImg);
        }
        twitterImg.content = config.ogImageUrl;
      }

      // Apply theme class to body (Excluding Admin pages)
      const isAdmin = location.pathname.startsWith('/admin');
      
      if (config.theme && !isAdmin) {
        // Remove existing theme classes and apply the new one
        const classes = document.body.className.split(' ').filter(c => !c.startsWith('theme-'));
        document.body.className = [...classes, `theme-${config.theme}`].join(' ').trim();
      } else {
        // On admin pages or when no theme is set, remove all theme classes
        const classes = document.body.className.split(' ').filter(c => !c.startsWith('theme-'));
        document.body.className = classes.join(' ').trim();
      }
    } catch (e) { console.error(e); }
  }, [config, loading, location.pathname]);

  return (
    <AnimatePresence mode="wait">
      {loading ? (
        <LoadingScreen key="loading" />
      ) : (
        <motion.div 
          key="content"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <ScrollToTop />
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/admin/*" element={<Admin />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/reviews" element={<Reviews />} />
          </Routes>
          <Footer />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default App;
