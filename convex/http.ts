import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { api } from "./_generated/api";

const http = httpRouter();

http.route({
  path: "/getSiteConfig",
  method: "GET",
  handler: httpAction(async (ctx, request) => {
    const config = await ctx.runQuery(api.siteConfig.get);
    
    // Resolve logo/ogImage URLs if they are storage IDs
    let ogImageUrl = config?.ogImage || "";
    if (ogImageUrl.startsWith("storage:")) {
      const storageId = ogImageUrl.split("storage:")[1];
      const url = await ctx.runQuery(api.files.getUrl, { storageId });
      ogImageUrl = url || "";
    }

    return new Response(JSON.stringify({
      title: "T&PLE KOREA",
      description: config?.metaDescription || "T&PLE KOREA 크루즈 - 프리미엄 크루즈 멤버십 서비스",
      ogImage: ogImageUrl
    }), {
      status: 200,
      headers: { 
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*" 
      },
    });
  }),
});

export default http;
