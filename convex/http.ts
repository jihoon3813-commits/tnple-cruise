import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { api } from "./_generated/api";

const http = httpRouter();

http.route({
  path: "/getSiteConfig",
  method: "GET",
  handler: httpAction(async (ctx, request) => {
    const config = await ctx.runQuery(api.siteConfig.get);
    
    // Resolve ogImage URL if it is a storage ID
    let ogImageUrl = config?.ogImage || "";
    if (ogImageUrl.startsWith("storage:")) {
      const storageId = ogImageUrl.split("storage:")[1];
      const url = await ctx.runQuery(api.files.getUrl, { storageId });
      ogImageUrl = url || "";
    }

    // Use admin-configured ogTitle, fallback to siteName, then default
    const title = config?.ogTitle || config?.siteName || "다온넷크루즈 - 프리미엄 크루즈 여행";
    const description = config?.metaDescription || "세상의 끝까지 만끽하는 진정한 럭셔리, 다온넷크루즈 멤버십.";
    const siteName = config?.siteName || "다온넷크루즈";

    return new Response(JSON.stringify({
      title,
      description,
      siteName,
      ogImage: ogImageUrl,
    }), {
      status: 200,
      headers: { 
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "public, max-age=60",
      },
    });
  }),
});

export default http;
