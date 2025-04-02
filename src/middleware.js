import { NextResponse } from 'next/server';

export function middleware(request) {
  // Verificar se o usuário está autenticado
  const isAuthenticated = request.cookies.get('isAuthenticated')?.value === 'true';
  
  // Obter o caminho atual
  const path = request.nextUrl.pathname;
  
  // Se não estiver autenticado e estiver tentando acessar a área administrativa, redirecionar para o login
  if (!isAuthenticated && path.startsWith('/admin')) {
    console.log('Usuário não autenticado tentando acessar:', path);
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }
  
  // Se estiver autenticado e tentar acessar a página de login, redirecionar para o admin
  if (isAuthenticated && path === '/login') {
    return NextResponse.redirect(new URL('/admin', request.url));
  }
  
  return NextResponse.next();
}

// Configurar quais caminhos o middleware deve interceptar
export const config = {
  matcher: ['/admin/:path*', '/login'],
};
