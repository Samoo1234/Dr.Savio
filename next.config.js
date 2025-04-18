/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost'],
  },
  // Configuração para ignorar erros de tipo durante o build
  typescript: {
    // !! ATENÇÃO !!
    // Ignorar erros de TypeScript durante o build
    // Isso permite que a aplicação seja compilada mesmo com erros de tipo
    ignoreBuildErrors: true,
  },
  // Forçar o uso do SWC em vez do Babel
  swcMinify: true,
  compiler: {
    // Garantir que o SWC seja usado
    styledComponents: true,
  },
}

module.exports = nextConfig
