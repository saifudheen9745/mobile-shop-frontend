"use client";

import React, { useState } from "react";
import { Plus, Trash2, Search, ReceiptIndianRupee, Edit2 } from "lucide-react";
import {
  useFetchExpenses,
  useCreateExpense,
  useDeleteExpense,
} from "@/features/expense/hooks";
import { useFetchEmployees } from "@/features/employee/hooks";
import { useFetchVendors } from "@/features/vendor/hooks";
import { SideDrawer } from "@/app/components/side-dialog/side-drawer";
import { DrawerOverlayContainer } from "@/app/components/drawer-overlay-container/drawer-overlay-container";
import { useQueryClient } from "@tanstack/react-query";
import {
  ExpenseCategory,
  IExpense,
  PaymentMode,
} from "@/app/types/expense.types";
import { updateExpense } from "@/features/expense/api";

const ExpenseManagement = () => {
  const { data: expenses } = useFetchExpenses();
  const { data: employees } = useFetchEmployees();
  const { data: vendors } = useFetchVendors();

  const { mutate: createExpense } = useCreateExpense();
  const { mutate: deleteExpense } = useDeleteExpense();
  const queryClient = useQueryClient();

  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState<IExpense | null>(null);

  const getLocalDateTime = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, 16);
  };

  const toInputDateTime = (date: string | Date) => {
  const d = new Date(date);
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 16);
};

  const [formData, setFormData] = useState({
    amount: "",
    category: "MISCELLANEOUS",
    expenseDateTime: getLocalDateTime(),
    paymentMode: "CASH",

    employeeId: "",
    vendorId: "",

    description: "",
    paidTo: "",
    referenceId: "",

    month: "",
    notes: "",
  });

  const filteredExpenses = expenses?.filter(
    (e) =>
      e.category.toLowerCase().includes(search.toLowerCase()) ||
      e.description?.toLowerCase().includes(search.toLowerCase()),
  );

  const deleteExpenseFn = (expenseId: string) => {
    deleteExpense(expenseId, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["expenses"] });
      },
    });
  };

  const editExpenseFn = (expense: any) => {
    setEditMode(true);
    setSelectedExpense(expense);
    setFormData({
      ...expense,
      amount: (expense.amount as number).toString(),
      expenseDateTime: toInputDateTime(expense.expenseDateTime),
    });
    setOpen(true);
  };

  const resetForm = () => {
    setFormData({
      amount: "",
      category: "MISCELLANEOUS",
      expenseDateTime: getLocalDateTime(),
      paymentMode: "CASH",
      employeeId: "",
      vendorId: "",
      description: "",
      paidTo: "",
      referenceId: "",
      month: "",
      notes: "",
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      ...formData,
      category: formData.category as ExpenseCategory,
      paymentMode: formData.paymentMode as PaymentMode,
      amount: Number(formData.amount),
      expenseDateTime: new Date(formData.expenseDateTime).toISOString(),
      employeeId: formData.employeeId || undefined,
      vendorId: formData.vendorId || undefined,
      month: formData.month || undefined,
    };

    if (editMode && selectedExpense?._id) {
      updateExpense(selectedExpense._id as string, payload).then(() => {
        queryClient.invalidateQueries({ queryKey: ["expenses"] });
        setOpen(false);
        resetForm();
      });
      return;
    }

    createExpense(payload as any, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["expenses"] });
        setOpen(false);
        resetForm();
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
                Expense Management
              </h1>
              <p className="text-slate-500 mt-1">
                Track shop expenses and cash flow
              </p>
            </div>

            <button
              onClick={() => {
                resetForm();
                setEditMode(false);
                setOpen(true);
              }}
              className="flex items-center gap-2 bg-[#0F172A] text-white px-5 py-2.5 rounded-xl"
            >
              <Plus size={18} />
              Add Expense
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
              {filteredExpenses?.length || 0} Vendors Total
            </p>
          </div>

          {/* TABLE */}
          <div className="flex-1 bg-white rounded-2xl shadow-sm border border-slate-100  overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead className="sticky top-0 bg-white border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider w-16 text-center">
                    #
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-50">
                {filteredExpenses?.map((expense, index) => (
                  <tr
                    key={expense._id}
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
                        {expense._id}
                      </span>
                    </td>

                    {/* Category */}
                    <td className="px-6 py-4 text-sm text-slate-600 ">
                      {expense.category}
                    </td>

                    {/* Description */}
                    <td className="px-6 py-4 text-sm text-slate-600 ">
                      {expense.description || "—"}
                    </td>

                    {/* Amount */}
                    <td className="px-6 py-4 text-sm text-slate-600 ">
                      ₹{expense.amount}
                    </td>

                    {/* Date */}
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {new Date(expense.expenseDateTime).toLocaleString()}
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 text-right space-x-2">
                      <button
                        onClick={() => editExpenseFn(expense)}
                        className="p-2 text-slate-400 hover:text-amber-600"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => deleteExpenseFn(expense._id as string)}
                        className="p-2 text-slate-400 hover:text-red-600"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* DRAWER */}
          <SideDrawer
            open={open}
            onOpenChange={setOpen}
            title={editMode ? "Edit Expense" : "Add Expense"}
            container={container}
            overlay
            closeFn={setOpen}
          >
            <form
              onSubmit={handleSubmit}
              className="flex flex-col h-full justify-between space-y-6 max-w-xl"
            >
              <div className="flex-1 overflow-y-auto pr-2 space-y-5 pt-2">
                {/* Category */}
                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-700">
                    Expense Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    className="w-full px-4 py-2.5 bg-slate-50 border rounded-xl"
                  >
                    <option value="SALARY">Salary</option>
                    <option value="RENT">Rent</option>
                    <option value="UTILITY">Utility</option>
                    <option value="REFRESHMENT">Refreshment</option>
                    <option value="TRANSPORT">Transport</option>
                    <option value="MAINTENANCE">Maintenance</option>
                    <option value="MISCELLANEOUS">Miscellaneous</option>
                  </select>
                </div>

                {/* Amount */}
                <div className="flex items-center gap-2">
                  <div className="space-y-1 w-full">
                    <label className="text-sm font-medium text-slate-700">
                      Expense By
                    </label>
                    <select
                      required
                      value={formData.employeeId}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          employeeId: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2.5 bg-slate-50 border rounded-xl"
                    >
                      <option value="">Select employee</option>
                      {employees?.map((emp) => (
                        <option key={emp._id} value={emp._id}>
                          {emp.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1 w-full">
                    <label className="text-sm font-medium text-slate-700">
                      Amount
                    </label>
                    <input
                      required
                      type="number"
                      value={formData.amount}
                      onChange={(e) =>
                        setFormData({ ...formData, amount: e.target.value })
                      }
                      className="w-full px-4 py-2 bg-slate-50 border rounded-xl"
                      placeholder="₹"
                    />
                  </div>
                </div>

                {/* Date & Payment */}
                <div className="flex gap-3">
                  <div className="space-y-1 flex-1">
                    <label className="text-sm font-medium text-slate-700">
                      Date & Time
                    </label>
                    <input
                      type="datetime-local"
                      value={formData.expenseDateTime}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          expenseDateTime: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 bg-slate-50 border rounded-xl"
                    />
                  </div>

                  <div className="space-y-1 flex-1">
                    <label className="text-sm font-medium text-slate-700">
                      Payment Mode
                    </label>
                    <select
                      value={formData.paymentMode}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          paymentMode: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2.5 bg-slate-50 border rounded-xl"
                    >
                      <option value="CASH">Cash</option>
                      <option value="UPI">UPI</option>
                      <option value="CARD">Card</option>
                      <option value="BANK_TRANSFER">Bank Transfer</option>
                    </select>
                  </div>
                </div>

                {/* Salary → Employee */}
                {formData.category === "SALARY" && (
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-slate-700">
                      Employee
                    </label>
                    <select
                      required
                      value={formData.employeeId}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          employeeId: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2.5 bg-slate-50 border rounded-xl"
                    >
                      <option value="">Select employee</option>
                      {employees?.map((emp) => (
                        <option key={emp._id} value={emp._id}>
                          {emp.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Rent / Utility → Vendor */}
                {/* {["RENT", "UTILITY", "MAINTENANCE"].includes(
                  formData.category,
                ) && (
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-slate-700">
                      Vendor
                    </label>
                    <select
                      value={formData.vendorId}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          vendorId: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2.5 bg-slate-50 border rounded-xl"
                    >
                      <option value="">Select vendor</option>
                      {vendors?.map((v) => (
                        <option key={v._id} value={v._id}>
                          {v.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )} */}

                {/* Description */}
                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-700">
                    Description
                  </label>
                  <textarea
                    rows={3}
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        description: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2.5 bg-slate-50 border rounded-xl resize-none"
                  />
                </div>

                {/* Reference & Notes */}
                <div className="space-y-3">
                  <input
                    placeholder="Reference ID / Bill No"
                    value={formData.referenceId}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        referenceId: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2.5 bg-slate-50 border rounded-xl"
                  />

                  <textarea
                    rows={2}
                    placeholder="Notes"
                    value={formData.notes}
                    onChange={(e) =>
                      setFormData({ ...formData, notes: e.target.value })
                    }
                    className="w-full px-4 py-2.5 bg-slate-50 border rounded-xl resize-none"
                  />
                </div>
              </div>

              {/* FOOTER */}
              <div className="border-t pt-5 flex gap-3">
                <button
                  type="submit"
                  className="flex-1 bg-[#0F172A] text-white py-3 rounded-xl"
                >
                  {editMode ? "Edit Expense" : "Save Expense"}
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

export default ExpenseManagement;
