// Vercel Edge Middleware – dynamically injects OG meta tags for SNS crawlers
// by fetching the latest settings from Convex at request time.
export const config = {
  matcher: ['/'],
};

export default async function middleware(req) {
  const userAgent = req.headers.get('user-agent') || '';
  const isCrawler = /bot|crawl|spider|google|facebook|kakao|naver|twitter|slack|telegram|discord|linkedin|pinterest|whatsapp|facebookexternalhit|Twitterbot|kakaotalk-scrap/i.test(userAgent);

  // Only intercept for SNS crawlers and search robots
  if (!isCrawler) return;

  try {
    // 1. Fetch latest site config from Convex HTTP API (production)
    const configRes = await fetch('https://incredible-tapir-714.convex.site/getSiteConfig', {
      headers: { 'Cache-Control': 'no-cache' },
    });
    if (!configRes.ok) return; // Fallback to static index.html if API is down
    
    const siteConfig = await configRes.json();

    // 2. Fetch the original static index.html from Vercel's static output
    const originUrl = new URL(req.url);
    const res = await fetch(new URL('/_next_static_index.html', originUrl.origin).toString()).catch(() => null);
    
    // If that doesn't work, fetch index.html directly (Vercel serves it at /)
    let html;
    if (!res || !res.ok) {
      // Build the HTML dynamically instead of fetching (avoids recursion)
      html = buildOgHtml(siteConfig);
    } else {
      html = await res.text();
      html = replaceMetaTags(html, siteConfig);
    }

    return new Response(html, {
      headers: {
        'Content-Type': 'text/html; charset=UTF-8',
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
      },
    });
  } catch (e) {
    console.error('OG Middleware Error:', e);
    return; // Error? Fallback to static index.html
  }
}

function replaceMetaTags(html, config) {
  if (config.title) {
    html = html.replace(/<title>[^<]*<\/title>/, `<title>${config.title}</title>`);
    html = html.replace(/<meta property="og:title" content="[^"]*"/, `<meta property="og:title" content="${config.title}"`);
    html = html.replace(/<meta name="twitter:title" content="[^"]*"/, `<meta name="twitter:title" content="${config.title}"`);
  }
  if (config.siteName) {
    html = html.replace(/<meta property="og:site_name" content="[^"]*"/, `<meta property="og:site_name" content="${config.siteName}"`);
  }
  if (config.description) {
    html = html.replace(/<meta property="og:description" content="[^"]*"/, `<meta property="og:description" content="${config.description}"`);
    html = html.replace(/<meta name="twitter:description" content="[^"]*"/, `<meta name="twitter:description" content="${config.description}"`);
    html = html.replace(/<meta name="description" content="[^"]*"/, `<meta name="description" content="${config.description}"`);
  }
  if (config.ogImage) {
    html = html.replace(/<meta property="og:image" content="[^"]*"/, `<meta property="og:image" content="${config.ogImage}"`);
    html = html.replace(/<meta name="twitter:image" content="[^"]*"/, `<meta name="twitter:image" content="${config.ogImage}"`);
  }
  return html;
}

// Fallback: build a minimal but complete OG HTML page for crawlers
// This avoids any index.html fetch recursion issues
function buildOgHtml(config) {
  const title = config.title || '다온넷크루즈 - 프리미엄 크루즈 여행';
  const desc = config.description || '세상의 끝까지 만끽하는 진정한 럭셔리, 다온넷크루즈 멤버십.';
  const siteName = config.siteName || '다온넷크루즈';
  const image = config.ogImage || '';
  const url = 'https://daonnet-cruise.vercel.app/';

  return `<!doctype html>
<html lang="ko">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${title}</title>
    <meta name="description" content="${desc}" />
    <meta property="og:type" content="website" />
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${desc}" />
    <meta property="og:image" content="${image}" />
    <meta property="og:url" content="${url}" />
    <meta property="og:site_name" content="${siteName}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${title}" />
    <meta name="twitter:description" content="${desc}" />
    <meta name="twitter:image" content="${image}" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>`;
}
