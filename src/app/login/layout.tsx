export const metadata = {
  title: 'Login | Dr. Sávio Carmo',
  description: 'Área de acesso administrativo do site do Dr. Sávio Carmo',
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      {children}
    </div>
  );
}
