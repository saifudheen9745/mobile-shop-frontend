import React from 'react'
import Sidebar from '../components/sidebar/sidebar';
import Navbar from '../components/navbar/navbar';

export default function Dashboardlayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex bg-[#0F172A] h-screen ">
      <Sidebar />

      <div className="flex flex-col flex-1 p-2">
        {/* <Navbar /> */}

        <main className="p-4 flex-1 bg-gray-200 overflow-auto rounded-md">
          {children}
        </main>
      </div>
    </div>
  );
}
