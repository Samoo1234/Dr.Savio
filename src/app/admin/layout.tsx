"use client";

import { ReactNode, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminHeader from '../../components/admin/AdminHeader';

export default function AdminLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Verificar se o usuário está autenticado
    const checkAuth = () => {
      try {
        const auth = localStorage.getItem('isAuthenticated');
        const cookies = document.cookie.split(';');
        const authCookie = cookies.find(c => c.trim().startsWith('isAuthenticated='));
        
        console.log('Auth localStorage:', auth);
        console.log('Auth cookie:', authCookie);
        
        if (auth !== 'true' || !authCookie) {
          // Redirecionar para a página de login se não estiver autenticado
          console.log('Redirecionando para login - não autenticado');
          router.push('/login');
        } else {
          console.log('Usuário autenticado');
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Erro ao verificar autenticação:', error);
        router.push('/login');
      } finally {
        setIsLoading(false);
      }
    };
    
    // Pequeno atraso para garantir que o localStorage esteja disponível
    setTimeout(checkAuth, 300);
  }, [router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Não renderiza nada enquanto redireciona
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminHeader />
      <div className="flex">
        <AdminSidebar />
        <main className="flex-1 p-6 md:p-8 ml-0 md:ml-64 pt-32">
          {children}
        </main>
      </div>
    </div>
  );
}
