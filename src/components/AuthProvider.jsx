"use client";

import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '../lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';

// Criar contexto de autenticação
const AuthContext = createContext(null);

// Hook personalizado para usar o contexto de autenticação
export const useAuth = () => useContext(AuthContext);

// Provedor de autenticação
export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const router = useRouter();

  // Verificar o estado de autenticação quando o componente é montado
  useEffect(() => {
    // Usar o listener de autenticação do Firebase
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setIsAuthenticated(true);
        // Ainda mantemos o localStorage para compatibilidade com o middleware
        localStorage.setItem('isAuthenticated', 'true');
        document.cookie = "isAuthenticated=true; path=/; max-age=86400"; // expira em 1 dia
      } else {
        setUser(null);
        setIsAuthenticated(false);
        localStorage.removeItem('isAuthenticated');
        document.cookie = "isAuthenticated=false; path=/; max-age=0";
      }
      setIsLoading(false);
    });

    // Limpar o listener quando o componente for desmontado
    return () => unsubscribe();
  }, []);

  // Função para fazer login
  const login = () => {
    // O login real é feito pela função loginWithEmailAndPassword
    // Aqui apenas atualizamos o estado local
    setIsAuthenticated(true);
    localStorage.setItem('isAuthenticated', 'true');
    document.cookie = "isAuthenticated=true; path=/; max-age=86400"; // expira em 1 dia
  };

  // Função para fazer logout
  const logout = () => {
    // O logout real é feito pela função logout em auth.js
    // Aqui apenas atualizamos o estado local
    setIsAuthenticated(false);
    localStorage.removeItem('isAuthenticated');
    document.cookie = "isAuthenticated=false; path=/; max-age=0"; // expirar imediatamente
    router.push('/'); // Redireciona para a página principal em vez de /login
  };

  // Valor do contexto
  const value = {
    isAuthenticated,
    isLoading,
    user,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Componente para proteger rotas que exigem autenticação
export function RequireAuth({ children, fallback }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  if (!isAuthenticated) {
    return fallback || null;
  }

  return children;
}
