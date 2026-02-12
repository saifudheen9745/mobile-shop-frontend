"use client";

import { useLogout } from '@/features/auth/hooks';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { LogOut, LayoutDashboard, Smartphone, Receipt, BarChart3 } from 'lucide-react';

function Sidebar() {
  const mutation = useLogout();
  const router = useRouter();
  const pathname = usePathname();

  const sidebarItems = [
    { id: 1, name: 'Dashboard', link: '/dashboard', icon: <LayoutDashboard size={18} /> },
    { id: 2, name: 'Sales', link: '/dashboard/sales', icon: <Receipt size={18} />},
    { id: 3, name: 'Services', link: '/dashboard/services', icon: <Receipt size={18} />},
    { id: 4, name: 'Stock', link: '/dashboard/products', icon: <Smartphone size={18} /> },
    { id: 5, name: 'Categories', link: '/dashboard/categories', icon: <BarChart3 size={18} /> },
    { id: 6, name: 'Sales History', link: '/dashboard/sales-history', icon: <Receipt size={18} /> },
    { id: 7, name: "Vendors", link: "/dashboard/vendor-management", icon: <Receipt size={18} />},
    { id: 8, name: "Employees", link: "/dashboard/employee-management", icon: <Receipt size={18} />},
    { id: 9, name: "Expense", link: "/dashboard/expense-management", icon: <Receipt size={18} />}
    // { id: 6, name: 'Reports', link: '/dashboard/reports', icon: <BarChart3 size={18} /> },
  ];

  const handleLogout = () => {
    mutation.mutate(undefined, {
      onSuccess: () => router.replace('/login')
    });
  }

  return (
    <div className='h-screen w-64 bg-[#0F172A] flex flex-col shadow-2xl border-r border-white/5'>
      <div className='p-8'>
        <h1 className='text-white text-2xl font-bold tracking-tight'>
          Mobile<span className='text-cyan-400'>Shop</span>
        </h1>
      </div>

      <nav className='flex-1 px-4 space-y-1.5'>
        {sidebarItems.map(item => {
          const isActive = pathname === item.link;
          return (
            <Link 
              key={item.id}
              href={item.link}
              className={`relative flex items-center gap-3 px-4 py-3 rounded-xl overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] group
                ${isActive 
                  ? 'bg-white/10 text-white' 
                  : 'text-slate-400 hover:bg-white/[0.03] hover:text-slate-200'
                }`}
            >
              {/* Active Indicator - Animated Slide/Fade */}
              <div className={`absolute left-0 w-1 bg-cyan-400 transition-all duration-500 ease-out
                ${isActive ? 'h-6 opacity-100' : 'h-0 opacity-0'}`} 
              />
              
              <span className={`transition-colors duration-300 ${isActive ? 'text-cyan-400' : 'text-slate-500 group-hover:text-slate-300'}`}>
                {item.icon}
              </span>
              <span className="font-medium text-sm tracking-wide">
                {item.name}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Logout - Aligned and Smoothed */}
      <div className='p-4 mt-auto border-t border-white/5'>
        <button 
          onClick={handleLogout} 
          className='w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all duration-300 ease-in-out group'
        >
          <LogOut size={18} className="group-hover:-translate-x-1 transition-transform duration-300" />
          <span className='font-medium text-sm'>Logout</span>
        </button>
      </div>
    </div>
  )
}

export default Sidebar;