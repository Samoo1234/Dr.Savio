import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  FaTachometerAlt, 
  FaEdit, 
  FaUsers, 
  FaCalendarAlt, 
  FaComments, 
  FaImages, 
  FaCog, 
  FaChartLine,
  FaFileAlt
} from 'react-icons/fa';

const AdminSidebar = () => {
  const pathname = usePathname();

  const menuItems = [
    { 
      title: 'Dashboard', 
      icon: <FaTachometerAlt />, 
      path: '/admin' 
    },
    { 
      title: 'Editar Conteúdo', 
      icon: <FaEdit />, 
      path: '/admin/conteudo' 
    },
    { 
      title: 'Gerenciar Serviços', 
      icon: <FaFileAlt />, 
      path: '/admin/servicos' 
    },
    { 
      title: 'Galeria de Imagens', 
      icon: <FaImages />, 
      path: '/admin/imagens' 
    },
    { 
      title: 'Depoimentos', 
      icon: <FaComments />, 
      path: '/admin/depoimentos' 
    },
    { 
      title: 'Agenda', 
      icon: <FaCalendarAlt />, 
      path: '/admin/agenda' 
    },
    { 
      title: 'Mensagens', 
      icon: <FaComments />, 
      path: '/admin/mensagens' 
    },
    { 
      title: 'Usuários', 
      icon: <FaUsers />, 
      path: '/admin/usuarios' 
    },
    { 
      title: 'Estatísticas', 
      icon: <FaChartLine />, 
      path: '/admin/estatisticas' 
    },
    { 
      title: 'Configurações', 
      icon: <FaCog />, 
      path: '/admin/configuracoes' 
    },
  ];

  const isActive = (path: string) => {
    if (path === '/admin') {
      return pathname === '/admin';
    }
    return pathname?.startsWith(path);
  };

  return (
    <aside className="fixed left-0 top-0 pt-20 w-64 h-full bg-secondary-800 text-white shadow-lg z-20 transform transition-transform duration-300 md:translate-x-0 -translate-x-full">
      <div className="h-full overflow-y-auto pb-20">
        <nav className="mt-5 px-2">
          <div className="space-y-1">
            {menuItems.map((item, index) => (
              <Link
                key={index}
                href={item.path}
                className={`
                  group flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors duration-200
                  ${isActive(item.path) 
                    ? 'bg-primary-600 text-white' 
                    : 'text-gray-300 hover:bg-secondary-700 hover:text-white'}
                `}
              >
                <span className="mr-3 text-lg">{item.icon}</span>
                {item.title}
                {item.title === 'Mensagens' && (
                  <span className="ml-auto bg-red-500 text-white text-xs rounded-full px-2 py-1">
                    5
                  </span>
                )}
              </Link>
            ))}
          </div>
        </nav>

        <div className="px-4 mt-8">
          <div className="pt-4 border-t border-secondary-700">
            <div className="bg-secondary-700 rounded-lg p-4">
              <h4 className="text-sm font-medium text-white mb-2">Precisa de ajuda?</h4>
              <p className="text-xs text-gray-400 mb-3">
                Acesse nossa documentação para obter ajuda sobre como gerenciar seu site.
              </p>
              <a 
                href="#" 
                className="text-xs font-medium text-primary-400 hover:text-primary-300 transition-colors duration-200"
              >
                Ver documentação →
              </a>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default AdminSidebar;
