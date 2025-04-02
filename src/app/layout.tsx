import '../styles/globals.css';
import { Inter, Merriweather } from 'next/font/google';
import { Metadata } from 'next';
import dynamic from 'next/dynamic';

// Importar o AttributeRemover com SSR desativado para evitar problemas de hidratação
const AttributeRemover = dynamic(
  () => import('../components/AttributeRemover'),
  { ssr: false }
);

// Importar o AuthProvider com SSR desativado para evitar problemas de hidratação
const AuthProviderClient = dynamic(
  () => import('../components/AuthProviderClient'),
  { ssr: false }
);

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const merriweather = Merriweather({
  weight: ['300', '400', '700', '900'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-merriweather',
});

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
    <html lang="pt-BR" className={`${inter.variable} ${merriweather.variable}`}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>
        <AttributeRemover />
        <AuthProviderClient>
          {children}
        </AuthProviderClient>
      </body>
    </html>
  );
}
