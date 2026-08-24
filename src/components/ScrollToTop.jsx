import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
  const { pathname, hash, state } = useLocation();

  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    
    // If navigating with explicit hash (e.g. from detail page back button or nav click)
    if (hash) {
      const id = hash.replace('#', '');
      const scrollToHash = () => {
        const element = document.getElementById(id);
        if (element) {
          const offset = 100;
          const bodyRect = document.body.getBoundingClientRect().top;
          const elementRect = element.getBoundingClientRect().top;
          const elementPosition = elementRect - bodyRect;
          const offsetPosition = elementPosition - offset;
          window.scrollTo({ top: offsetPosition, behavior: 'smooth' });

          // Clean up hash from URL after scrolling so refreshing or subsequent visits remain at top (0,0)
          setTimeout(() => {
            if (window.location.hash) {
              window.history.replaceState(null, '', pathname);
            }
          }, 800);
        } else {
          window.scrollTo(0, 0);
        }
      };
      setTimeout(scrollToHash, 150);
    } else {
      // Normal page visit or direct refresh: ALWAYS scroll to top (0,0)
      window.scrollTo(0, 0);
    }
  }, [pathname, hash, state]);

  return null;
}
