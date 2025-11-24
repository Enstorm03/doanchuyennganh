import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';

const AdminLayout = () => {
  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <AdminSidebar />
      <div className="flex flex-col">
        <main className="flex flex-1 flex-col gap-4 bg-background-light dark:bg-background-dark">
          {/* Outlet sẽ render các trang con (nested routes) */}
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;