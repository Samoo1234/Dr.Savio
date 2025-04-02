"use client";

import { AuthProvider } from './AuthProvider';

// Este componente é apenas um wrapper para o AuthProvider
// que garante que ele seja carregado apenas no cliente
export default function AuthProviderClient({ children }) {
  return <AuthProvider>{children}</AuthProvider>;
}
