import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const get = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("siteConfig").first();
  },
});

export const updateHero = mutation({
  args: {
    title: v.string(),
    subtitle: v.string(),
    bgType: v.string(),
    bgUrl: v.string(),
    textPosition: v.string(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db.query("siteConfig").first();
    if (existing) {
      await ctx.db.patch(existing._id, { hero: args });
    } else {
      await ctx.db.insert("siteConfig", { hero: args });
    }
  },
});
