"use client";

import { useEffect } from 'react';

// Componente para remover atributos indesejados que causam problemas de hidratação
export default function AttributeRemover() {
  useEffect(() => {
    // Remove o atributo cz-shortcut-listen do body
    if (typeof document !== 'undefined') {
      document.body.removeAttribute('cz-shortcut-listen');
    }
  }, []);

  // Este componente não renderiza nada visível
  return null;
}
