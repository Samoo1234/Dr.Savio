"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FaBars, FaBell, FaUser, FaSignOutAlt, FaCog } from 'react-icons/fa';
import { useAuth } from '../../components/AuthProvider';

const AdminHeader = () => {
  const router = useRouter();
  const auth = useAuth();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const toggleProfileMenu = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen);
    if (isNotificationsOpen) setIsNotificationsOpen(false);
  };

  const toggleNotifications = () => {
    setIsNotificationsOpen(!isNotificationsOpen);
    if (isProfileMenuOpen) setIsProfileMenuOpen(false);
  };

  const handleLogout = () => {
    // Verificar se auth não é null antes de chamar logout
    if (auth) {
      auth.logout();
    } else {
      // Fallback caso o contexto de autenticação não esteja disponível
      localStorage.removeItem('isAuthenticated');
      document.cookie = "isAuthenticated=false; path=/; max-age=0";
      router.push('/');
    }
  };

  return (
    <header className="bg-white shadow-md fixed top-0 left-0 right-0 z-30">
      <div className="px-4 py-3 flex items-center justify-between">
        <div className="flex items-center">
          <button 
            className="md:hidden text-gray-600 hover:text-primary-600 mr-4 focus:outline-none"
            aria-label="Toggle sidebar"
          >
            <FaBars className="text-xl" />
          </button>
          <Link href="/admin" className="flex items-center">
            <span className="text-xl font-bold text-primary-600">Dr. Sávio Carmo</span>
            <span className="ml-2 text-sm text-gray-500">| Admin</span>
          </Link>
        </div>

        <div className="flex items-center space-x-4">
          {/* Botão de notificações */}
          <div className="relative">
            <button 
              className="text-gray-600 hover:text-primary-600 focus:outline-none"
              onClick={toggleNotifications}
              aria-label="Notificações"
            >
              <FaBell className="text-xl" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                3
              </span>
            </button>

            {/* Menu de notificações */}
            {isNotificationsOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg py-1 z-10 border border-gray-200">
                <div className="px-4 py-2 border-b border-gray-200">
                  <h3 className="text-sm font-semibold text-gray-700">Notificações</h3>
                </div>
                <div className="max-h-60 overflow-y-auto">
                  {[1, 2, 3].map((item) => (
                    <a 
                      key={item}
                      href="#" 
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 border-b border-gray-100"
                    >
                      <p className="font-medium">Nova mensagem de contato</p>
                      <p className="text-xs text-gray-500">Há 2 horas atrás</p>
                    </a>
                  ))}
                </div>
                <a 
                  href="#" 
                  className="block text-center px-4 py-2 text-sm text-primary-600 hover:bg-gray-100 border-t border-gray-200"
                >
                  Ver todas as notificações
                </a>
              </div>
            )}
          </div>

          {/* Perfil do usuário */}
          <div className="relative">
            <button 
              className="flex items-center text-gray-600 hover:text-primary-600 focus:outline-none"
              onClick={toggleProfileMenu}
              aria-label="Menu do usuário"
            >
              <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 mr-2">
                <FaUser className="text-sm" />
              </div>
              <span className="hidden md:block text-sm font-medium">Admin</span>
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Menu do perfil */}
            {isProfileMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 border border-gray-200">
                <Link 
                  href="/admin/perfil" 
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <FaUser className="mr-2 text-gray-500" />
                  Meu Perfil
                </Link>
                <Link 
                  href="/admin/configuracoes" 
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <FaCog className="mr-2 text-gray-500" />
                  Configurações
                </Link>
                <div className="border-t border-gray-100"></div>
                <button 
                  onClick={handleLogout}
                  className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full text-left"
                >
                  <FaSignOutAlt className="mr-2" />
                  Sair
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
