"use client";

import dynamic from 'next/dynamic';

// Importa o AdminDashboardClient com SSR desativado
// Isso evita completamente problemas de hidratação
const AdminDashboardClient = dynamic(
  () => import('./AdminDashboardClient'),
  { ssr: false }
);

export default function SafeAdminDashboard() {
  return <AdminDashboardClient />;
}
