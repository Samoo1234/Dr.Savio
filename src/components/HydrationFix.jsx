"use client";

import { useEffect, useState } from 'react';

// Componente para resolver problemas de hidratação do Next.js
// Renderiza o conteúdo apenas no lado do cliente
export default function HydrationFix({ children }) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null; // Não renderiza nada durante a renderização do servidor
  }

  return <>{children}</>;
}
