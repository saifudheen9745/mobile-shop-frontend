import type { CategoryPayload } from "./categories.types.js";
import Category from "./categories.model.js";


export const categoryService = {
  getAll: async () => {
    return await Category.find().sort({ name: 1 });
  },

  create: async (data: CategoryPayload) => {
    if (!data.name || !data.name.trim()) {
      throw new Error("Category name is required");
    }

    const name = data.name.trim();

    const exists = await Category.findOne({ name });
    if (exists) throw new Error("Category already exists");

    const category = new Category({
      name,
      description: data.description ?? undefined,
    });

    await category.save();
    return category;
  },

  update: async (id: string, data: CategoryPayload) => {
    const category = await Category.findById(id);
    if (!category) throw new Error("Category not found");

    // ---- PATCH FOR NAME ----
    if (typeof data.name !== "undefined" && data.name !== null) {
      const trimmedName = data.name.trim();

      if (trimmedName.length > 0 && trimmedName !== category.name) {
        const duplicate = await Category.findOne({ name: trimmedName });
        if (duplicate) throw new Error("Category name already taken");
        category.name = trimmedName;
      }
    }

    // ---- PATCH FOR DESCRIPTION ----
    if (
      typeof data.description !== "undefined" &&
      data.description !== null
    ) {
      const trimmedDesc = data.description.trim();

      if (trimmedDesc.length > 0) {
        category.description = trimmedDesc;
      }
    }

    await category.save();
    return category;
  },

  remove: async (id: string) => {
    const category = await Category.findByIdAndDelete(id);
    if (!category) throw new Error("Category not found");
    return category;
  },
};
