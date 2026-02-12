"use client";

import React, { useState } from "react";
import { Plus, Edit2, Trash2, Store, Search, EyeIcon } from "lucide-react";
import {
  useFetchVendors,
  useCreateVendor,
  useUpdateVendor,
  useDeleteVendor,
} from "@/features/vendor/hooks";
import { SideDrawer } from "@/app/components/side-dialog/side-drawer";
import { DrawerOverlayContainer } from "@/app/components/drawer-overlay-container/drawer-overlay-container";

import { useQueryClient } from "@tanstack/react-query";
import { IVendor } from "@/app/types/vendor.types";

const VendorManagement = () => {
  const { data: vendors } = useFetchVendors();
  const { mutate: createVendor } = useCreateVendor();
  const { mutate: updateVendor } = useUpdateVendor();
  const { mutate: deleteVendor } = useDeleteVendor();
  const queryClient = useQueryClient();

  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selected, setSelected] = useState<IVendor | null>(null);
  const [search, setSearch] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
  });



const filteredVendor = vendors?.filter(
  (v) =>
    v.name?.toLowerCase().includes(search.toLowerCase()) ||
    v.phone?.includes(search)
);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editMode && selected?._id) {
      updateVendor(
        { vendorId: selected._id, payload: formData },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["vendors"] });
            setOpen(false);
          },
        }
      );
      return;
    }

    createVendor(formData, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["vendors"] });
        setOpen(false);
      },
    });
  };

  const editVendorFn = (vendor:IVendor) => {
    setEditMode(true);
    setFormData({
      ...formData,
      address:vendor.address,
      name:vendor.name,
      phone:vendor.phone
    })
    setSelected(vendor);
    setOpen(true);
  }

    const deleteVendorFn = (expenseId: string) => {
    deleteVendor(expenseId, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["expenses"] });
      },
    });
  };

  return (
    <DrawerOverlayContainer>
      {(container) => (
        <div className="flex flex-col h-full bg-[#F8FAFC] p-8">

          {/* HEADER */}
          <div className="flex justify-between items-end mb-8">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">
                Vendor Management
              </h1>
              <p className="text-slate-500 mt-1">
                Manage vendors and suppliers
              </p>
            </div>

            <button
              onClick={() => {
                setEditMode(false);
                setFormData({ name: "", phone: "", address: "" });
                setOpen(true);
              }}
              className="flex items-center gap-2 bg-[#0F172A] text-white px-5 py-2.5 rounded-xl"
            >
              <Plus size={18} />
              New Vendor
            </button>
          </div>

          {/* SEARCH */}
          <div className="bg-white p-4 rounded-2xl shadow-sm  flex gap-4 items-center mb-6">
                      <div className="relative flex-1">
                        <Search
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                          size={20}
                        />
                        <input
                          placeholder="Search by name, model, or ID..."
                          className="w-full pl-10 pr-4 py-2.5 bg-slate-50 rounded-xl"
                          value={search}
                          onChange={(e) => setSearch(e.target.value)}
                        />
                      </div>
          
                      <p className="text-sm text-slate-500 whitespace-nowrap">
                        {filteredVendor?.length || 0} Vendors Total
                      </p>
                    </div>

          {/* TABLE */}
                    <div className="flex-1 bg-white rounded-2xl shadow-sm border border-slate-100  overflow-hidden">
                      <div className="flex-1 bg-white  overflow-hidden">
                        <table className="w-full text-left border-collapse">
                          <thead className="sticky top-0 bg-white border-b border-slate-100">
                            <tr>
                              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider w-16 text-center">
                                #
                              </th>
                              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider w-16 text-center">
                                id
                              </th>
                              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                Name
                              </th>
                              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                Phone
                              </th>
                              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                Address
                              </th>
                              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">
                                Actions
                              </th>
                              
                            </tr>
                          </thead>
          
                          <tbody className="divide-y divide-slate-50">
                            {filteredVendor?.map((vendor, index) => (
                              <tr
                                key={vendor._id}
                                className="hover:bg-slate-50/80 transition-colors group"
                              >
                                {/* Index */}
                                <td className="px-6 py-4 text-center">
                                  <span className="text-sm font-medium text-slate-400">
                                    {index + 1}
                                  </span>
                                </td>
          
                                {/* ID */}
                                <td className="px-6 py-4">
                                  <span className="font-mono text-[12px] font-semibold text-cyan-600 bg-cyan-50 px-2 py-1 rounded tracking-tighter">
                                    {vendor._id}
                                  </span>
                                </td>
          
                                {/* Category */}
                                <td className="px-6 py-4 text-base text-slate-600">
                                  {vendor.name}
                                </td>
          
                                {/* Description */}
                                <td className="px-6 py-4 text-base text-slate-600 ">
                                  {vendor.phone}
                                </td>
          
                                {/* Amount */}
                                <td className="px-6 py-4 text-base text-slate-600">
                                  {vendor.address}
                                </td>
          
                                
          
                                {/* Actions */}
                                <td className="px-6 py-4 text-right space-x-2">
                                  <button
                                    
                                    className="p-2 text-slate-400 hover:text-yellow-600"
                                  >
                                    <EyeIcon size={18} />
                                  </button>
                                  <button
                                    onClick={() => editVendorFn(vendor)}
                                    className="p-2 text-slate-400 hover:text-blue-600"
                                  >
                                    <Edit2 size={18} />
                                  </button>
                                  <button onClick={() => deleteVendor(vendor._id as string)} className="p-2 text-slate-400 hover:text-red-600">
                                    <Trash2 size={18} />
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

          {/* DRAWER */}
          <SideDrawer
            open={open}
            onOpenChange={setOpen}
            title={editMode ? "Edit Vendor" : "Create Vendor"}
            container={container}
            overlay
            closeFn={setOpen}
          >
            <form
              onSubmit={handleSubmit}
              className="flex flex-col h-full justify-between space-y-6 max-w-xl"
            >
              <div className="flex-1 overflow-y-auto pr-2 space-y-5 pt-2">

                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-700">
                    Vendor Name
                  </label>
                  <input
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border rounded-xl"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-700">
                    Phone Number
                  </label>
                  <input
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border rounded-xl"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-700">
                    Address
                  </label>
                  <textarea
                    rows={4}
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border rounded-xl resize-none"
                  />
                </div>
              </div>

              <div className="border-t pt-5 flex gap-3">
                <button
                  type="submit"
                  className="flex-1 bg-[#0F172A] text-white py-3 rounded-xl"
                >
                  {editMode ? "Update Vendor" : "Create Vendor"}
                </button>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="px-6 py-3 bg-slate-100 text-slate-600 rounded-xl"
                >
                  Cancel
                </button>
              </div>
            </form>
          </SideDrawer>

        </div>
      )}
    </DrawerOverlayContainer>
  );
};

export default VendorManagement;
