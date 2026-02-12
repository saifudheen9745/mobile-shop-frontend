"use client";

import React, { useState } from "react";
import { Plus, Edit2, Trash2, Search, User } from "lucide-react";
import {
  useFetchEmployees,
  useCreateEmployee,
  useUpdateEmployee,
  useDeleteEmployee,
} from "@/features/employee/hooks";
import { SideDrawer } from "@/app/components/side-dialog/side-drawer";
import { DrawerOverlayContainer } from "@/app/components/drawer-overlay-container/drawer-overlay-container";

import { useQueryClient } from "@tanstack/react-query";
import { IEmployee } from "@/app/types/employee.types";

const EmployeeManagement = () => {
  const { data: employees } = useFetchEmployees();
  const { mutate: createEmployee } = useCreateEmployee();
  const { mutate: updateEmployee } = useUpdateEmployee();
  const { mutate: deleteEmployee } = useDeleteEmployee();
  const queryClient = useQueryClient();

  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selected, setSelected] = useState<IEmployee | null>(null);
  const [search, setSearch] = useState("");

  const [formData, setFormData] = useState({
    employeeNumber: "",
    name: "",
    phone: "",
    role: "STAFF" as "ADMIN" | "MANAGER" | "STAFF",

    emergencyContact: {
      name: "",
      phone: "",
      relation: "",
    },

    email: "",
    address: "",
    salary: "",
    joiningDate: "",
    dateOfBirth: "",
    bloodGroup: "",
  });

  const filteredEmployees = employees?.filter(
    (e) =>
      e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.employeeNumber.toLowerCase().includes(search.toLowerCase()),
  );

  const resetForm = () => {
    setFormData({
      employeeNumber: "",
      name: "",
      phone: "",
      role: "STAFF",
      emergencyContact: { name: "", phone: "", relation: "" },
      email: "",
      address: "",
      salary: "",
      joiningDate: "",
      dateOfBirth: "",
      bloodGroup: "",
    });
  };

  const editEmployee = (emp: IEmployee) => {
    setEditMode(true);
    setSelected(emp);
    setFormData({
      employeeNumber: emp.employeeNumber,
      name: emp.name || "",
      phone: emp.phone || "",
      role: emp.role || "STAFF",
      emergencyContact: emp.emergencyContact || {
        name: "",
        phone: "",
        relation: "",
      },
      email: emp.email || "",
      address: emp.address || "",
      salary: emp.salary?.toString() || "",
      joiningDate: emp.joiningDate
        ? new Date(emp.joiningDate).toISOString().split("T")[0]
        : "",

      dateOfBirth: emp.dateOfBirth
        ? new Date(emp.dateOfBirth).toISOString().split("T")[0]
        : "",

      bloodGroup: emp.bloodGroup || "",
    });
    setOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      ...formData,
      salary: formData.salary ? Number(formData.salary) : undefined,
    };

    if (editMode && selected?._id) {
      updateEmployee(
        { employeeId: selected._id, payload },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["employees"] });
            setOpen(false);
            resetForm();
          },
        },
      );
      return;
    }

    createEmployee(payload, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["employees"] });
        setOpen(false);
        resetForm();
      },
    });
  };

    const deleteEmployeeFn = (expenseId: string) => {
    deleteEmployee(expenseId, {
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
                Employee Management
              </h1>
              <p className="text-slate-500 mt-1">
                Manage staff details and roles
              </p>
            </div>

            <button
              onClick={() => {
                setEditMode(false);
                resetForm();
                setFormData({
                  ...formData,
                  employeeNumber: `EMP-${Date.now()}`,
                });
                setOpen(true);
              }}
              className="flex items-center gap-2 bg-[#0F172A] text-white px-5 py-2.5 rounded-xl"
            >
              <Plus size={18} />
              New Employee
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
              {filteredEmployees?.length || 0} Vendors Total
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
                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Employee Id
                    </th>
                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Phone
                    </th>
                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Joined On
                    </th>
                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-50">
                  {filteredEmployees?.map((employee, index) => (
                    <tr
                      key={employee._id}
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
                          {employee.employeeNumber}
                        </span>
                      </td>

                      {/* Category */}
                      <td className="px-6 py-4 text-base text-slate-600">
                        {employee.name}
                      </td>

                      {/* Description */}
                      <td className="px-6 py-4 text-base text-slate-600 ">
                        {employee.phone}
                      </td>

                      {/* Amount */}
                      <td className="px-6 py-4 text-base text-slate-600">
                        {employee.role}
                      </td>

                      {/* Date */}
                      <td className="px-6 py-4 text-base text-slate-600">
                        {new Date(
                          employee.joiningDate as string,
                        ).toLocaleString()}
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 text-right space-x-2">
                        <button
                          onClick={() => editEmployee(employee)}
                          className="p-2 text-slate-400 hover:text-amber-600"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button onClick={() => deleteEmployeeFn(employee._id as string)} className="p-2 text-slate-400 hover:text-red-600">
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
            title={editMode ? "Edit Employee" : "Create Employee"}
            container={container}
            overlay
            closeFn={setOpen}
          >
            <form
              onSubmit={handleSubmit}
              className="flex flex-col h-full justify-between space-y-6 max-w-xl"
              
            >
              <div className="flex-1 overflow-y-auto pr-2 space-y-5 pt-2">
                {/* Basic Info */}
                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-700">
                    Employee Number
                  </label>
                  <input
                    disabled
                    required
                    value={formData.employeeNumber}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        employeeNumber: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2.5 bg-slate-50 border rounded-xl"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-700">
                    Full Name
                  </label>
                  <input
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full px-4 py-2.5 bg-slate-50 border rounded-xl"
                  />
                </div>

                <div className="flex gap-3">
                  <div className="space-y-1 flex-1">
                    <label className="text-sm font-medium text-slate-700">
                      Phone
                    </label>
                    <input
                      required
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      className="w-full px-4 py-2.5 bg-slate-50 border rounded-xl"
                    />
                  </div>

                  <div className="space-y-1 flex-1">
                    <label className="text-sm font-medium text-slate-700">
                      Role
                    </label>
                    <select
                      value={formData.role}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          role: e.target.value as any,
                        })
                      }
                      className="w-full px-4 py-2.5 bg-slate-50 border rounded-xl"
                    >
                      <option value="ADMIN">Admin</option>
                      <option value="MANAGER">Manager</option>
                      <option value="STAFF">Staff</option>
                    </select>
                  </div>
                </div>

                {/* Emergency Contact */}

                {/* Optional */}
                <div className="pt-3 border-t space-y-3">
                  <div>
                    <label className="text-sm font-medium text-slate-700">
                      Email
                    </label>
                    <input
                      placeholder="Email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="w-full px-4 py-2.5 bg-slate-50 border rounded-xl"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-slate-700">
                      Address
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Address"
                      value={formData.address}
                      onChange={(e) =>
                        setFormData({ ...formData, address: e.target.value })
                      }
                      className="w-full px-4 py-2.5 bg-slate-50 border rounded-xl resize-none"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-slate-700">
                      Salary
                    </label>
                    <input
                      type="number"
                      placeholder="Salary"
                      value={formData.salary}
                      onChange={(e) =>
                        setFormData({ ...formData, salary: e.target.value })
                      }
                      className="w-full px-4 py-2.5 bg-slate-50 border rounded-xl"
                    />
                  </div>

                  <div className="flex gap-3">
                    <div className="w-full">
                      <label className="text-sm font-medium text-slate-700">
                        Joining Date
                      </label>
                      <input
                        type="date"
                        value={formData.joiningDate}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            joiningDate: e.target.value,
                          })
                        }
                        className="w-full px-4 py-2.5 bg-slate-50 border rounded-xl"
                      />
                    </div>
                    <div className="w-full">
                      <label className="text-sm font-medium text-slate-700">
                        Date Of Birth
                      </label>
                      <input
                        type="date"
                        value={formData.dateOfBirth}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            dateOfBirth: e.target.value,
                          })
                        }
                        className="w-full px-4 py-2.5 bg-slate-50 border rounded-xl"
                      />
                    </div>
                  <div>
                    <label className="text-sm font-medium text-slate-700">
                    Blood Group
                  </label>
                      <input
                        placeholder="Blood Group"
                        value={formData.bloodGroup}
                        onChange={(e) =>
                          setFormData({ ...formData, bloodGroup: e.target.value })
                        }
                        className="w-full px-4 py-2.5 bg-slate-50 border rounded-xl"
                      />
                  </div>
                  </div>

                </div>
                <div className="pt-3 border-t">
                  <p className="text-sm font-semibold text-slate-700 mb-2">
                    Emergency Contact
                  </p>

                  <div className="space-y-3 flex gap-2">
                    <div>
                      <label className="text-sm font-medium text-slate-700">
                        Contact Name
                      </label>
                      <input
                        required
                        placeholder="Contact Name"
                        value={formData.emergencyContact.name}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            emergencyContact: {
                              ...formData.emergencyContact,
                              name: e.target.value,
                            },
                          })
                        }
                        className="w-full px-4 py-2.5 bg-slate-50 border rounded-xl"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium text-slate-700">
                        Contact Phone
                      </label>
                      <input
                        required
                        placeholder="Contact Phone"
                        value={formData.emergencyContact.phone}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            emergencyContact: {
                              ...formData.emergencyContact,
                              phone: e.target.value,
                            },
                          })
                        }
                        className="w-full px-4 py-2.5 bg-slate-50 border rounded-xl"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium text-slate-700">
                        Relation
                      </label>
                      <input
                        required
                        placeholder="Relation"
                        value={formData.emergencyContact.relation}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            emergencyContact: {
                              ...formData.emergencyContact,
                              relation: e.target.value,
                            },
                          })
                        }
                        className="w-full px-4 py-2.5 bg-slate-50 border rounded-xl"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* FOOTER */}
              <div className="border-t pt-5 flex gap-3">
                <button
                  type="submit"
                  className="flex-1 bg-[#0F172A] text-white py-3 rounded-xl"
                >
                  {editMode ? "Update Employee" : "Create Employee"}
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

export default EmployeeManagement;
