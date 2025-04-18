import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
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
import { db } from '../../lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

const AdminSidebar = () => {
  const pathname = usePathname();
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  
  // Buscar o número de mensagens não lidas
  useEffect(() => {
    const fetchUnreadMessages = async () => {
      try {
        // Verificar se temos dados em cache
        const cachedData = localStorage.getItem('unread_messages_count');
        if (cachedData) {
          const { count, timestamp } = JSON.parse(cachedData);
          // Se o cache for válido (menos de 5 minutos), use-o
          if (Date.now() - timestamp < 5 * 60 * 1000) {
            setUnreadCount(count);
            setLoading(false);
            return;
          }
        }
        
        // Se não tiver cache ou estiver expirado, buscar do Firestore
        const messagesQuery = query(
          collection(db, 'messages'),
          where('read', '==', false)
        );
        
        const querySnapshot = await getDocs(messagesQuery);
        const count = querySnapshot.size;
        
        // Atualizar o estado
        setUnreadCount(count);
        
        // Salvar no cache
        localStorage.setItem('unread_messages_count', JSON.stringify({
          count,
          timestamp: Date.now()
        }));
      } catch (error) {
        console.error('Erro ao buscar mensagens não lidas:', error);
        // Em caso de erro, não mostrar nenhum indicador
        setUnreadCount(0);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUnreadMessages();
    
    // Atualizar a cada 5 minutos
    const interval = setInterval(fetchUnreadMessages, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

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
                {item.title === 'Mensagens' && unreadCount > 0 && (
                  <span className="ml-auto bg-red-500 text-white text-xs rounded-full px-2 py-1">
                    {unreadCount}
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
