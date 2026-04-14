import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";

const http = httpRouter();

http.route({
  path: "/api/storage",
  method: "GET",
  handler: httpAction(async (ctx, request) => {
    const { searchParams } = new URL(request.url);
    const storageId = searchParams.get("id");
    if (!storageId) {
      return new Response("Missing id parameter", { status: 400 });
    }

    try {
      const blob = await ctx.storage.get(storageId);
      if (!blob) {
        return new Response("File not found", { status: 404 });
      }

      return new Response(blob, {
        status: 200,
        headers: {
          "Content-Type": blob.type || "image/jpeg",
          "Cache-Control": "public, max-age=31536000, immutable",
        },
      });
    } catch (e) {
      return new Response("Error fetching file", { status: 500 });
    }
  }),
});

export default http;
