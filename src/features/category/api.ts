// Category Apis

import { api } from "@/lib/api";

export function fetchCategories() {
    return api("/categories", {
        method: "GET"
    });
}

export function createCategory(payload: { name: string; description: string }) {
    return api("/categories", {
        method: "POST",
        body: JSON.stringify(payload),
    });
}

export function updateCategory(categoryId: string, payload: { name?: string; description?: string }) {
    return api(`/categories/${categoryId}`, {
        method: "PATCH",
        body: JSON.stringify(payload),
    });
}

export function deleteCategory(categoryId: string) {
    return api(`/categories/${categoryId}`, {
        method: "DELETE",
    });
}