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

export function extractProductDate(product: any): string {
  if (product.startDate && typeof product.startDate === 'string' && product.startDate.trim() !== '') {
    return product.startDate.trim();
  }
  const candidates = [product.title, product.travelPeriod, product.bookingPeriod];
  for (const text of candidates) {
    if (!text || typeof text !== 'string') continue;
    // YYYY.MM.DD or YY.MM.DD (e.g. 26.09.02, 2026.09.02, 26-09-02, 2026년 9월 2일)
    const matchFull = text.match(/(?:20)?(\d{2})[.\-/년\s]+(\d{1,2})[.\-/월\s]+(\d{1,2})/);
    if (matchFull) {
      const year = parseInt(matchFull[1], 10) < 50 ? 2000 + parseInt(matchFull[1], 10) : 1900 + parseInt(matchFull[1], 10);
      const month = String(parseInt(matchFull[2], 10)).padStart(2, '0');
      const day = String(parseInt(matchFull[3], 10)).padStart(2, '0');
      return `${year}-${month}-${day}`;
    }
    // YYYY.MM or YY.MM (e.g. 2026.09, 26.09, 2026년 9월)
    const matchMonth = text.match(/(?:20)?(\d{2})[.\-/년\s]+(\d{1,2})/);
    if (matchMonth) {
      const year = parseInt(matchMonth[1], 10) < 50 ? 2000 + parseInt(matchMonth[1], 10) : 1900 + parseInt(matchMonth[1], 10);
      const month = String(parseInt(matchMonth[2], 10)).padStart(2, '0');
      return `${year}-${month}-01`;
    }
  }
  return "9999-99-99";
}

async function resolveProductUrls(ctx: any, product: any) {
  if (!product) return product;
  const thumbnails = await Promise.all(
    (product.thumbnails || []).map((t: string) => resolveStorageUrl(ctx, t))
  );
  const scheduleImage = await resolveStorageUrl(ctx, product.scheduleImage);
  const extractedDate = extractProductDate(product);
  return {
    ...product,
    rawThumbnails: product.thumbnails, // Keep original for editing
    thumbnails: thumbnails.filter(Boolean),
    scheduleImage,
    extractedDate: extractedDate !== "9999-99-99" ? extractedDate : undefined,
  };
}

export const list = query({
  args: {},
  handler: async (ctx) => {
    const products = await ctx.db.query("products").collect();
    products.sort((a, b) => {
      if (a.order !== undefined && b.order !== undefined && a.order !== b.order) {
        return a.order - b.order;
      }
      const dateA = extractProductDate(a);
      const dateB = extractProductDate(b);
      if (dateA !== dateB) {
        return dateA.localeCompare(dateB);
      }
      return (a._creationTime || 0) - (b._creationTime || 0);
    });
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
    startDate: v.optional(v.string()),
    order: v.optional(v.number()),
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
    startDate: v.optional(v.string()),
    order: v.optional(v.number()),
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
