"use client";

import { useState } from "react";
import { Search, Printer, Eye } from "lucide-react";

import { DrawerOverlayContainer } from "@/app/components/drawer-overlay-container/drawer-overlay-container";


import { useDownloadPurchaseBill, useFetchPurchases } from "@/features/purchase/hooks";
import { IPurchase } from "@/app/types/purchase.types";

const SalesHistory = () => {

  const { data: fetchPurchases } = useFetchPurchases();
  const {mutate: downloadPurchaseBill} = useDownloadPurchaseBill();


  const [searchTerm, setSearchTerm] = useState("");


  const filteredPurchases = fetchPurchases?.filter(
    (p: IPurchase) =>
      p.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.createdAt.toLowerCase().includes(searchTerm.toLowerCase()),
  );


  return (
    <DrawerOverlayContainer>
      {(container) => (
        <div className="flex flex-col h-full bg-[#F8FAFC] p-8">
          {/* HEADER */}
          <div className="flex justify-between items-end mb-8">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
                Sales History
              </h1>
              <p className="text-slate-500 mt-1">
                Sales made. History preserved.
              </p>
            </div>
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
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <p className="text-sm text-slate-500 whitespace-nowrap">
              {filteredPurchases?.length || 0} Products Total
            </p>
          </div>

          {/* TABLE */}
          <div className="flex-1 bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden relative z-0 flex flex-col">
            <div className="overflow-x-auto overflow-y-auto flex-1 custom-scrollbar">
              <table className="w-full text-left border-separate border-spacing-0">
                <thead className="sticky top-0 bg-white/80 backdrop-blur-md z-[5] text-center border-b border-slate-100">
                  <tr>
                    <th className="px-6 py-5 text-[12px] font-bold uppercase tracking-widest text-slate-400 w-12 text-center">
                      #
                    </th>
                    <th className="px-6 py-5 text-[12px] font-bold uppercase tracking-widest text-slate-400">
                      Invoice
                    </th>
                    <th className="px-6 py-5 text-[12px] font-bold uppercase tracking-widest text-slate-400">
                      User
                    </th>
                    <th className="px-6 py-5 text-[12px] font-bold uppercase tracking-widest text-slate-400">
                      Phone
                    </th>
                    <th className="px-6 py-5 text-[12px] font-bold uppercase tracking-widest text-slate-400">
                      PaymentMethod
                    </th>
                    <th className="px-6 py-5 text-[12px] font-bold uppercase tracking-widest text-slate-400 text-center">
                      Status
                    </th>
                    <th className="px-6 py-5 text-[12px] font-bold uppercase tracking-widest text-slate-400">
                      GrandTotal
                    </th>
                    <th className="px-6 py-5 text-[12px] font-bold uppercase tracking-widest text-slate-400 ">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 text-center">
                  {filteredPurchases?.map((p: IPurchase, i: number) => (
                    <tr
                      key={p._id}
                      className="group text-center hover:bg-slate-50/50 transition-all duration-200"
                    >
                      <td className="px-6 py-4 text-center">
                        <span className="text-xs font-medium text-slate-400">
                          {i + 1}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-mono text-[14px] font-semibold text-cyan-600 bg-cyan-50 px-2 py-1 rounded tracking-tighter">
                            {p.invoiceNumber}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-medium text-slate-600 px-2 py-1 rounded-md">
                          {p.user}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="text-sm font-medium text-slate-600 bg-slate-100/50 px-2 py-1 rounded-md">
                          {p.phone}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600 font-medium text-center">
                        {p.paymentMethod}
                      </td>
                      <td
                        className={`px-6 py-4 text-sm text-slate-600 font-medium text-center`}
                      >
                        <span
                          className={`font-mono text-[14px] font-semibold px-2 py-1 rounded tracking-tighter ${p.status === "COMPLETED" && "text-green-600 bg-green-50"}`}
                        >
                          {p.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="text-sm font-bold text-slate-800 tracking-tight ">
                          ₹{Number(p.grandTotal).toLocaleString("en-IN")}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-end items-center gap-1 ">
                          <button onClick={() => downloadPurchaseBill(p._id)} className="p-2 text-slate-400 hover:text-cyan-600">
                            <Eye size={18} />
                          </button>
                          <button className="p-2 text-slate-400 hover:text-amber-600">
                            <Printer size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </DrawerOverlayContainer>
  );
};

export default SalesHistory;
