import React from 'react';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar />
      <div className="flex flex-col min-h-screen">
        <Topbar />
        <main className="flex-1 ml-64 pt-16 p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
