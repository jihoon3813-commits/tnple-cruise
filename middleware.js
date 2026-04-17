// Zero-dependency Vercel Edge Middleware
export const config = {
  matcher: ['/'],
};

export default async function middleware(req) {
  const userAgent = req.headers.get('user-agent') || '';
  const isCrawler = /bot|google|facebook|kakao|naver|twitter|slack/i.test(userAgent);

  // Only intercept for SNS crawlers and search robots
  if (isCrawler) {
    try {
      // 1. Fetch site config from Convex HTTP API
      const configRes = await fetch('https://incredible-tapir-714.convex.cloud/getSiteConfig');
      if (!configRes.ok) return; // Fallback to default if API is down
      
      const siteConfig = await configRes.json();

      // 2. Fetch the actual index.html file
      const originUrl = new URL(req.url);
      const res = await fetch(new URL('/index.html', originUrl.origin));
      if (!res.ok) return;
      
      let html = await res.text();

      // 3. Replace Meta/OG tags with dynamic values
      // We use simple string replacement to avoid parsing overhead
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

      return new Response(html, {
        headers: {
          'Content-Type': 'text/html; charset=UTF-8',
          'Cache-Control': 'public, s-maxage=3600' // Cache for 1 hour for crawlers
        },
      });
    } catch (e) {
      console.error('Middleware Error:', e);
      return; // Error? Fallback to static index.html
    }
  }

  // Not a crawler? Just let it through to the standard static file routing
}
