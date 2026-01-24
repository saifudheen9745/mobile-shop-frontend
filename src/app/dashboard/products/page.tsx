"use client";

import React, { useState } from 'react';
import { Search, Plus, Eye, Edit2, Trash2, Smartphone } from 'lucide-react';

// Mock data for the mobile shop
const MOCK_PRODUCTS = [
  { id: '1', name: 'iPhone 15 Pro Max', brand: 'Apple', price: '₹1,59,900', stock: 12, category: 'Smartphone' },
  { id: '2', name: 'Galaxy S24 Ultra', brand: 'Samsung', price: '₹1,29,999', stock: 8, category: 'Smartphone' },
  { id: '3', name: 'Pixel 8 Pro', brand: 'Google', price: '₹1,06,999', stock: 5, category: 'Smartphone' },
  { id: '4', name: 'OnePlus 12', brand: 'OnePlus', price: '₹64,999', stock: 15, category: 'Smartphone' },
  { id: '5', name: 'AirPods Pro 2', brand: 'Apple', price: '₹24,900', stock: 25, category: 'Accessories' },
  { id: '6', name: 'Watch Series 9', brand: 'Apple', price: '₹41,900', stock: 10, category: 'Wearables' },
  { id: '7', name: 'Xiaomi 14', brand: 'Xiaomi', price: '₹69,999', stock: 7, category: 'Smartphone' },
    { id: '1', name: 'iPhone 15 Pro Max', brand: 'Apple', price: '₹1,59,900', stock: 12, category: 'Smartphone' },
  { id: '2', name: 'Galaxy S24 Ultra', brand: 'Samsung', price: '₹1,29,999', stock: 8, category: 'Smartphone' },
  { id: '3', name: 'Pixel 8 Pro', brand: 'Google', price: '₹1,06,999', stock: 5, category: 'Smartphone' },
  { id: '4', name: 'OnePlus 12', brand: 'OnePlus', price: '₹64,999', stock: 15, category: 'Smartphone' },
  { id: '5', name: 'AirPods Pro 2', brand: 'Apple', price: '₹24,900', stock: 25, category: 'Accessories' },
  { id: '6', name: 'Watch Series 9', brand: 'Apple', price: '₹41,900', stock: 10, category: 'Wearables' },
  { id: '7', name: 'Xiaomi 14', brand: 'Xiaomi', price: '₹69,999', stock: 7, category: 'Smartphone' },
];

const ProductDashboard = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProducts = MOCK_PRODUCTS.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.brand.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full bg-[#F8FAFC] p-8">
      {/* Header Section */}
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Products</h1>
          <p className="text-slate-500 mt-1">Manage your mobile inventory and stock levels.</p>
        </div>
        
        <button className="flex items-center gap-2 bg-[#0F172A] text-white px-5 py-2.5 rounded-xl hover:bg-slate-800 transition-all shadow-lg shadow-slate-200 font-medium">
          <Plus size={18} />
          Add Product
        </button>
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 mb-6 flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input 
            type="text" 
            placeholder="Search by model or brand..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all"
          />
        </div>
        <div className="h-10 w-[1px] bg-slate-200 mx-2" />
        <p className="text-sm text-slate-500 font-medium whitespace-nowrap">
          Showing {filteredProducts.length} items
        </p>
      </div>

      {/* Scrollable Table Container */}
      <div className="flex-1 bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex flex-col">
        <div className="overflow-x-auto overflow-y-auto flex-1 custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 bg-white z-10 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Product Info</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Price</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Stock</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-slate-50/80 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-500 group-hover:bg-white group-hover:shadow-sm transition-all">
                        <Smartphone size={20} />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">{product.name}</p>
                        <p className="text-xs text-slate-500">{product.brand}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 bg-slate-100 text-slate-600 rounded-md text-xs font-medium">
                      {product.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-medium text-slate-700">{product.price}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${product.stock < 10 ? 'bg-amber-500' : 'bg-emerald-500'}`} />
                      <span className="text-slate-700 font-medium">{product.stock} units</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-end items-center gap-2">
                      <button className="p-2 text-slate-400 hover:text-cyan-600 hover:bg-cyan-50 rounded-lg transition-all" title="View Detail">
                        <Eye size={18} />
                      </button>
                      <button className="p-2 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all" title="Edit">
                        <Edit2 size={18} />
                      </button>
                      <button className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all" title="Delete">
                        <Trash2 size={18} />
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
  );
};

export default ProductDashboard;