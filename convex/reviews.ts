import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("reviews").collect();
  },
});

export const add = mutation({
  args: {
    author: v.optional(v.string()), // Use author instead of user for better schema alignment
    user: v.optional(v.string()), // Fallback
    productTitle: v.optional(v.string()),
    rating: v.number(),
    content: v.string(),
    images: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("reviews", args);
  },
});

export const remove = mutation({
  args: { id: v.id("reviews") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

export const update = mutation({
  args: {
    id: v.id("reviews"),
    author: v.optional(v.string()),
    productTitle: v.optional(v.string()),
    rating: v.number(),
    content: v.string(),
    images: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const { id, ...rest } = args;
    await ctx.db.patch(id, rest);
  },
});
