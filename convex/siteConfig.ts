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
    style: v.optional(v.string()),
    title: v.string(),
    subtitle: v.optional(v.string()),
    aboveTitle: v.optional(v.string()),
    belowTitle: v.optional(v.string()),
    bgType: v.string(),
    bgUrl: v.string(),
    bgOpacity: v.optional(v.number()),
    paddingX: v.optional(v.number()),
    textPosition: v.string(),
    verticalAlign: v.optional(v.string()),
    typography: v.optional(v.any()),
    buttons: v.optional(v.array(v.any())),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db.query("siteConfig").first();
    if (existing) {
      // Preserve existing branding when patching hero
      await ctx.db.patch(existing._id, { 
        hero: { 
          ...existing.hero, 
          ...args 
        } 
      });
    } else {
      await ctx.db.insert("siteConfig", { hero: args });
    }
  },
});

export const updateTheme = mutation({
  args: { theme: v.string() },
  handler: async (ctx, args) => {
    const existing = await ctx.db.query("siteConfig").first();
    if (existing) {
      await ctx.db.patch(existing._id, { theme: args.theme });
    }
  },
});

export const updateProductBranding = mutation({
  args: {
    title: v.optional(v.string()),
    titleColor: v.optional(v.string()),
    bgColor: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db.query("siteConfig").first();
    if (existing) {
      await ctx.db.patch(existing._id, { 
        hero: { 
          ...existing.hero, 
          productListBranding: args 
        } 
      });
    }
  },
});

export const updateReviewBranding = mutation({
  args: {
    show: v.optional(v.boolean()),
    title: v.optional(v.string()),
    titleColor: v.optional(v.string()),
    bgColor: v.optional(v.string()),
    layout: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db.query("siteConfig").first();
    if (existing) {
      await ctx.db.patch(existing._id, { 
        hero: { 
          ...existing.hero, 
          reviewSectionBranding: args 
        } 
      });
    }
  },
});