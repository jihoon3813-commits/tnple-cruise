import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

async function resolveStorageUrl(ctx: any, str: string | undefined): Promise<string | undefined> {
  if (!str) return str;
  if (typeof str === 'string' && str.startsWith("storage:")) {
    const storageId = str.replace("storage:", "");
    try {
      const url = await ctx.storage.getUrl(storageId);
      return url || str;
    } catch {
      return str;
    }
  }
  return str;
}

async function resolveProductUrls(ctx: any, product: any) {
  if (!product) return product;
  const thumbnails = await Promise.all(
    (product.thumbnails || []).map((t: string) => resolveStorageUrl(ctx, t))
  );
  const scheduleImage = await resolveStorageUrl(ctx, product.scheduleImage);
  return {
    ...product,
    rawThumbnails: product.thumbnails, // Keep original for editing
    thumbnails: thumbnails.filter(Boolean),
    scheduleImage,
  };
}

export const list = query({
  args: {},
  handler: async (ctx) => {
    const products = await ctx.db.query("products").collect();
    return await Promise.all(products.map((p) => resolveProductUrls(ctx, p)));
  },
});

export const getById = query({
  args: { id: v.id("products") },
  handler: async (ctx, args) => {
    const product = await ctx.db.get(args.id);
    return await resolveProductUrls(ctx, product);
  },
});

export const add = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    price: v.number(),
    originalPrice: v.optional(v.number()),
    thumbnails: v.array(v.string()),
    paymentType: v.string(),
    downPayment: v.optional(v.number()),
    installments: v.optional(v.number()),
    scheduleImage: v.optional(v.string()),
    schedule: v.optional(v.array(v.object({ day: v.number(), title: v.string(), content: v.string() }))),
    typography: v.optional(v.any()),
    features: v.optional(v.array(v.string())),
    badge: v.optional(v.string()),
    ship: v.optional(v.string()),
    bookingPeriod: v.optional(v.string()),
    travelPeriod: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("products", args);
  },
});

export const update = mutation({
  args: {
    id: v.id("products"),
    title: v.string(),
    description: v.string(),
    price: v.number(),
    originalPrice: v.optional(v.number()),
    thumbnails: v.array(v.string()),
    paymentType: v.string(),
    downPayment: v.optional(v.number()),
    installments: v.optional(v.number()),
    scheduleImage: v.optional(v.string()),
    schedule: v.optional(v.array(v.object({ day: v.number(), title: v.string(), content: v.string() }))),
    typography: v.optional(v.any()),
    features: v.optional(v.array(v.string())),
    badge: v.optional(v.string()),
    ship: v.optional(v.string()),
    bookingPeriod: v.optional(v.string()),
    travelPeriod: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...data } = args;
    await ctx.db.patch(id, data);
  },
});

export const remove = mutation({
  args: { id: v.id("products") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
