import '../styles/globals.css';
import { Metadata } from 'next';
import dynamic from 'next/dynamic';
import React from 'react';

// Importar componentes com SSR desativado
const AttributeRemover = dynamic(() => import('../components/AttributeRemover'), { ssr: false });
const AuthProviderClient = dynamic(() => import('../components/AuthProviderClient'), { ssr: false });
const ToasterClient = dynamic(() => import('../components/ToasterClient'), { ssr: false });

export const metadata: Metadata = {
  title: 'Dr. Sávio Carmo - Especialista em Saúde',
  description: 'Site profissional do Dr. Sávio Carmo, especialista dedicado à excelência em saúde e bem-estar.',
  keywords: ['médico', 'saúde', 'Dr. Sávio Carmo', 'especialista', 'consulta'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Merriweather:wght@300;400;700;900&display=swap" rel="stylesheet" />
      </head>
      <body>
        <AttributeRemover />
        <AuthProviderClient>
          {children}
        </AuthProviderClient>
        <ToasterClient />
      </body>
    </html>
  );
}
