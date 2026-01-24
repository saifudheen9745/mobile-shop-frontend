"use client";

import React from 'react';
import { 
  TrendingUp, 
  Calendar, 
  BarChart3, 
  DollarSign, 
  Smartphone,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

// Mock data for sales trend
const salesData = [
  { name: 'Mon', sales: 42000 },
  { name: 'Tue', sales: 38000 },
  { name: 'Wed', sales: 52000 },
  { name: 'Thu', sales: 48000 },
  { name: 'Fri', sales: 71000 },
  { name: 'Sat', sales: 85000 },
  { name: 'Sun', sales: 62000 },
];

const Dashboard = () => {
  return (
    <div className="flex flex-col h-full bg-[#F8FAFC] p-8 overflow-y-auto custom-scrollbar">
      {/* Header */}
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Overview</h1>
          <p className="text-slate-500 mt-1">MobileShop performance and sales distribution.</p>
        </div>
        <div className="text-right">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Current Date</p>
          <p className="text-sm font-semibold text-slate-700">Saturday, Jan 24, 2026</p>
        </div>
      </div>

      {/* Main Sales Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          title="Today's Sales" 
          value="₹62,450" 
          percentage="+18%" 
          isUp={true} 
          icon={<DollarSign size={20} className="text-cyan-500" />} 
        />
        <StatCard 
          title="This Week" 
          value="₹3,98,200" 
          percentage="+5.2%" 
          isUp={true} 
          icon={<Calendar size={20} className="text-purple-500" />} 
        />
        <StatCard 
          title="This Month" 
          value="₹12,45,000" 
          percentage="-2.1%" 
          isUp={false} 
          icon={<BarChart3 size={20} className="text-blue-500" />} 
        />
        <StatCard 
          title="Total Revenue" 
          value="₹84,50,000" 
          percentage="+10.4%" 
          isUp={true} 
          icon={<TrendingUp size={20} className="text-emerald-500" />} 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
        {/* Sales Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-slate-800">Weekly Revenue Trend</h3>
            <select className="text-xs font-semibold bg-slate-50 border-none rounded-lg px-3 py-2 text-slate-500 outline-none">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
            </select>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salesData}>
                <defs>
                  <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#22d3ee" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip 
                  cursor={{ stroke: '#22d3ee', strokeWidth: 2 }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}
                />
                <Area type="monotone" dataKey="sales" stroke="#0891b2" strokeWidth={3} fillOpacity={1} fill="url(#chartGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        
      </div>
    </div>
  );
};

// Sub-components
const StatCard = ({ title, value, percentage, isUp, icon }:any) => (
  <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
    <div className="flex justify-between items-start mb-4">
      <div className="p-2.5 bg-slate-50 rounded-xl">{icon}</div>
      <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-lg ${isUp ? 'text-emerald-600 bg-emerald-50' : 'text-red-600 bg-red-50'}`}>
        {isUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
        {percentage}
      </div>
    </div>
    <p className="text-slate-500 text-sm font-medium">{title}</p>
    <h2 className="text-2xl font-bold text-slate-900 mt-1">{value}</h2>
  </div>
);

const PerformanceItem = ({ label, name, stats, trend, isPositive }:any) => (
  <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter mb-3">{label}</p>
    <div className="flex items-center gap-4">
      <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center">
        <Smartphone className="text-slate-400" size={24} />
      </div>
      <div className="flex-1">
        <h4 className="font-bold text-slate-800 leading-tight">{name}</h4>
        <div className="flex justify-between items-center mt-1">
          <p className="text-xs text-slate-500">{stats}</p>
          <span className={`text-[10px] font-bold ${isPositive ? 'text-emerald-500' : 'text-red-500'}`}>
            {trend}
          </span>
        </div>
      </div>
    </div>
  </div>
);

export default Dashboard;