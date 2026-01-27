import type { ProductPayload } from "./product.types.js";
import Product from "./product.model.js";

export const productService = {

  getAll: async () => {
    return await Product.find().sort({ name: 1 });
  },

  create: async (data: ProductPayload) => {

    console.log("Creating product with data:", data);
    // --- Required fields ---
    if (!data.name || !data.name.trim()) {
      throw new Error("Product name is required");
    }

    if (!data.model || !data.model.trim()) {
      throw new Error("Product model is required");
    }

    if (!data.company || !data.company.trim()) {
      throw new Error("Product company is required");
    }

    if (!data.category || !data.category.trim()) {
      throw new Error("Product category is required");
    }

    if (typeof data.actualPrice !== "number" || data.actualPrice <= 0) {
      throw new Error("Actual price must be a positive number");
    }

    if (typeof data.sellingPrice !== "number" || data.sellingPrice <= 0) {
      throw new Error("Selling price must be a positive number");
    }

    // --- Optional domain rule ---
    if (data.sellingPrice < data.actualPrice) {
      throw new Error("Selling price cannot be lower than actual price");
    }

    const product = new Product({
      name: data.name.trim(),
      model: data.model.trim(),
      category: data.category.trim(),
        company: data.company.trim(),
        isUsedProduct: data.isUsedProduct ?? false,
      actualPrice: data.actualPrice,
      sellingPrice: data.sellingPrice,
      attributes: data.attributes ?? {},
    });

    await product.save();
    return product;
  },

  update: async (id: string, data: ProductPayload) => {
    const product = await Product.findById(id) as any;
    if (!product) throw new Error("Product not found");

    // --- PATCH: name ---
    if (typeof data.name !== "undefined" && data.name !== null) {
      const trimmed = data.name.trim();
      if (trimmed.length === 0) throw new Error("Product name cannot be empty");
      product.name = trimmed;
    }

    // --- PATCH: model ---
    if (typeof data.model !== "undefined" && data.model !== null) {
      const trimmed = data.model.trim();
      if (trimmed.length === 0) throw new Error("Product model cannot be empty");
      product.model = trimmed;
    }

    // --- PATCH: company ---
    if (typeof data.company !== "undefined" && data.company !== null) {
      const trimmed = data.company.trim();
      if (trimmed.length === 0) throw new Error("Product company cannot be empty");
      product.company = trimmed;
    }

    // --- PATCH: category ---
    if (typeof data.category !== "undefined" && data.category !== null) {
      const trimmed = data.category.trim();
      if (trimmed.length === 0) throw new Error("Product category cannot be empty");
      product.category = trimmed;
    }

    // --- PATCH: actualPrice ---
    if (typeof data.actualPrice !== "undefined") {
      if (data.actualPrice <= 0) throw new Error("Actual price must be positive");
      product.actualPrice = data.actualPrice;
    }

    // --- PATCH: sellingPrice ---
    if (typeof data.sellingPrice !== "undefined") {
      if (data.sellingPrice <= 0) throw new Error("Selling price must be positive");
      if (product.actualPrice && data.sellingPrice < product.actualPrice) {
        throw new Error("Selling price cannot be lower than actual price");
      }
      product.sellingPrice = data.sellingPrice;
    }
    // --- PATCH: isUsedProduct ---
    if (typeof data.isUsedProduct !== "undefined") {
      product.isUsedProduct = data.isUsedProduct;
    }

    if(typeof data.description !== "undefined") {
      product.description = data.description;
    }

    // --- PATCH: attributes (dynamic) ---
    if (typeof data.attributes !== "undefined") {
      if (typeof data.attributes !== "object") {
        throw new Error("Attributes must be an object");
      }
      product.attributes = data.attributes;
    }


    await product.save();
    return product;
  },

  remove: async (id: string) => {
    const product = await Product.findByIdAndDelete(id);
    if (!product) throw new Error("Product not found");
    return product;
  },
};
