"use client";

import React from 'react';
import dynamic from 'next/dynamic';

// Importar o SafeAdminDashboard com SSR desativado
const SafeAdminDashboard = dynamic(
  () => import('../../components/SafeAdminDashboard'),
  { 
    ssr: false,
    loading: () => (
      <div className="p-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-gray-600">Carregando dados...</p>
        </div>
        <div className="animate-pulse">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-md p-6 h-32"></div>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg shadow-md p-6 h-96"></div>
            <div className="bg-white rounded-lg shadow-md p-6 h-96"></div>
          </div>
        </div>
      </div>
    )
  }
);

export default function AdminDashboard() {
  return <SafeAdminDashboard />;
}
