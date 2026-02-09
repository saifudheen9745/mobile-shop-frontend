"use client";

import React, { useState } from "react";
import { Search, Plus, Eye, Edit2, Trash2, Tag } from "lucide-react";
import { useCreateCategory, useDeleteCategory, useFetchCategories, useUpdateCategory } from "@/features/category/hooks";
import { SideDrawer } from "@/app/components/side-dialog/side-drawer";
import { DrawerOverlayContainer } from "@/app/components/drawer-overlay-container/drawer-overlay-container";
import { ICategory } from "@/app/types/category.types";
import { useQueryClient } from "@tanstack/react-query";

const CategoryDashboard = () => {
  const { data: categories } = useFetchCategories();
  const { mutate: createCategory } = useCreateCategory();
  const { mutate: deleteCategory } = useDeleteCategory();
  const { mutate: updateCategory } = useUpdateCategory();
  const queryClient = useQueryClient();

  const [searchTerm, setSearchTerm] = useState("");
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "", description: "" });
  const [editMode, setEditMode] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<ICategory | null>(null);

  const filteredCategories = categories?.filter(
    (cat) =>
      cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cat._id.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const deleteCategoryFn = (categoryId: string) => {
    console.log("Deleting category with ID:", categoryId);
    deleteCategory(categoryId,{
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ["categories"] });
        setOpen(false);
      }
    });
  }

  const editCategoryFn = (category:ICategory) => {
    console.log("Editing category with ID:", category._id);
    setEditMode(true);
    setSelectedCategory(category);
    setFormData({ name: category.name, description: category.description });
    setOpen(true);
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    if(editMode) {
      console.log("Updating category with data:", formData);
      updateCategory({ categoryId: selectedCategory!._id, payload: formData },{
        onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["categories"] });
        setFormData({ name: "", description: "" });
        setOpen(false);
      }
      });
      return;
    }

    createCategory(formData,{
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["categories"] });
        setFormData({ name: "", description: "" });
        setOpen(false);
      }
    })
    

    console.log("Creating category with data:", formData);
  };

  return (
    <DrawerOverlayContainer>
      {(container) => (
        <div className="flex flex-col h-full bg-[#F8FAFC] p-8">

          {/* HEADER */}
          <div className="flex justify-between items-end mb-8">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
                Categories
              </h1>
              <p className="text-slate-500 mt-1">
                Organize your inventory by groupings and classifications.
              </p>
            </div>

            <button
              onClick={() => {setOpen(true); setEditMode(false); setFormData({ name: "", description: "" });}}
              className="flex items-center gap-2 bg-[#0F172A] text-white px-5 py-2.5 rounded-xl hover:bg-slate-800 transition-all shadow-lg shadow-slate-200 font-medium active:scale-95"
            >
              <Plus size={18} />
              New Category
            </button>
          </div>

          {/* SEARCH */}
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 mb-6 flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input
                type="text"
                placeholder="Search by category name or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all"
              />
            </div>
            <div className="h-10 w-[1px] bg-slate-200 mx-2" />
            <p className="text-sm text-slate-500 font-medium whitespace-nowrap">
              {filteredCategories?.length || 0} Categories Total
            </p>
          </div>

          {/* TABLE + DRAWER AREA */}
          <div className="flex-1 relative overflow-hidden bg-white rounded-2xl shadow-sm border border-slate-100 flex flex-col">

            {/* TABLE */}
            <div className="overflow-auto custom-scrollbar flex-1">
              <table className="w-full text-left border-collapse">
                <thead className="sticky top-0 bg-white  border-b border-slate-100">
                  <tr>
                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider w-16 text-center">#</th>
                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">ID</th>
                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Description</th>
                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filteredCategories?.map((category, index) => (
                    <tr key={category._id} className="hover:bg-slate-50/80 transition-colors group">
                      <td className="px-6 py-4 text-center">
                        <span className="text-sm font-medium text-slate-400">{index + 1}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-mono text-[12px] font-semibold text-cyan-600 bg-cyan-50 px-2 py-1 rounded tracking-tighter">
                          {category._id}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-900 font-semibold">
                        <div className="flex items-center gap-3">
                          <Tag size={16} className="text-slate-400" />
                          {category.name}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600 line-clamp-1">
                        {category.description || "—"}
                      </td>
                      <td className="px-6 py-4 text-right space-x-2">
                        <button className="p-2 text-slate-400 hover:text-cyan-600"><Eye size={18} /></button>
                        <button onClick={() => editCategoryFn(category)} className="p-2 text-slate-400 hover:text-amber-600"><Edit2 size={18} /></button>
                        <button onClick={() => deleteCategoryFn(category._id)} className="p-2 text-slate-400 hover:text-red-600"><Trash2 size={18} /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* DRAWER */}
            <SideDrawer
              open={open}
              onOpenChange={(val) => {
                setOpen(val);
                if (!val) setFormData({ name: "", description: "" });
              }}
              title="Create New Category"
              container={container}
              overlay={true}
              closeFn={(val:boolean) => setOpen(val)}
            >
              <form onSubmit={handleSubmit} className="flex flex-col h-full justify-between">
                <div className="flex-1 space-y-6">
                  <p className="text-sm text-slate-500">
                    {editMode ? "Edit the category details below." : "Add a new category to group your products."}
                  </p>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Category Name</label>
                    <input
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Description</label>
                    <textarea
                      rows={5}
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl resize-none"
                    />
                  </div>
                </div>

                <div className="shrink-0 border-t pt-5 flex gap-3 bg-white">
                  <button type="submit" className="flex-1 bg-[#0F172A] text-white py-3 rounded-xl">
                    {editMode ? "Update Category" : "Create Category"}
                  </button>
                  <button type="button" onClick={() => setOpen(false)} className="px-6 py-3 bg-slate-100 text-slate-600 rounded-xl">
                    Cancel
                  </button>
                </div>
              </form>
            </SideDrawer>

          </div>

        </div>
      )}
    </DrawerOverlayContainer>
  );
};

export default CategoryDashboard;
