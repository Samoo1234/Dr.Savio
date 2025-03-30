import { ReactNode } from 'react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminHeader from '../../components/admin/AdminHeader';

export const metadata = {
  title: 'Painel Administrativo | Dr. Sávio Carmo',
  description: 'Painel administrativo para gerenciar o site do Dr. Sávio Carmo',
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-100">
      <AdminHeader />
      <div className="flex">
        <AdminSidebar />
        <main className="flex-1 p-6 md:p-8 ml-0 md:ml-64 pt-20">
          {children}
        </main>
      </div>
    </div>
  );
}
