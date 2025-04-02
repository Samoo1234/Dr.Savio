"use client";

import { useEffect, useState, ReactNode } from 'react';

interface ClientOnlyProps {
  children: ReactNode;
  fallback?: ReactNode;
}

// Componente que renderiza seu conteúdo apenas no lado do cliente
export default function ClientOnly({ children, fallback = null }: ClientOnlyProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // No primeiro render no servidor, não renderiza nada ou renderiza o fallback
  if (!isClient) {
    return fallback;
  }

  return children;
}
