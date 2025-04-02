"use client";

import { useEffect, useState } from 'react';

// Componente que renderiza seu conteúdo apenas no lado do cliente
// Solução para problemas de hidratação do Next.js
export default function ClientOnly({ children, fallback = null }) {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    // Definimos como montado apenas após o efeito ser executado no cliente
    setHasMounted(true);
  }, []);

  // Durante a renderização do servidor ou primeira renderização no cliente,
  // retornamos o fallback ou null para evitar problemas de hidratação
  if (!hasMounted) {
    return fallback;
  }

  // Quando o componente estiver montado no cliente, renderizamos o conteúdo
  return <>{children}</>;
}
