// Vercel Edge Middleware for dynamic OG tags
import { next } from '@vercel/edge';

export const config = {
  matcher: ['/'],
};

export default async function middleware(req) {
  const userAgent = req.headers.get('user-agent') || '';
  const isCrawler = /bot|google|facebook|kakao|naver|twitter|slack/i.test(userAgent);

  // Only run for crawlers on the home page to avoid overhead
  if (isCrawler) {
    try {
      // 1. Fetch latest site config from our new Convex HTTP API
      const configRes = await fetch('https://incredible-tapir-714.convex.cloud/getSiteConfig');
      if (!configRes.ok) return next();
      
      const siteConfig = await configRes.json();

      // 2. Fetch the original index.html
      const originRes = await fetch(new URL('/index.html', req.url));
      if (!originRes.ok) return next();
      
      let html = await originRes.text();

      // 3. Robustly replace OG tags and meta tags
      html = html.replace(
        /<meta property="og:title" content="[^"]*"/, 
        `<meta property="og:title" content="${siteConfig.title}"`
      );
      html = html.replace(
        /<meta property="og:description" content="[^"]*"/, 
        `<meta property="og:description" content="${siteConfig.description}"`
      );
      html = html.replace(
        /<meta property="og:image" content="[^"]*"/, 
        `<meta property="og:image" content="${siteConfig.ogImage}"`
      );
      html = html.replace(
        /<meta name="twitter:image" content="[^"]*"/, 
        `<meta name="twitter:image" content="${siteConfig.ogImage}"`
      );
      html = html.replace(
        /<meta name="description" content="[^"]*"/, 
        `<meta name="description" content="${siteConfig.description}"`
      );

      // Return the modified HTML to the crawler
      return new Response(html, {
        headers: { 'content-type': 'text/html; charset=UTF-8' },
      });
    } catch (e) {
      console.error('Middleware target error:', e);
      return next();
    }
  }

  return next();
}
