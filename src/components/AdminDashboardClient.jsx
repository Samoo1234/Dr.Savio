"use client";

import { FaUsers, FaCalendarAlt, FaComments, FaChartLine, FaEye, FaSync } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { collection, getDocs, query, orderBy, limit, where, getCountFromServer } from 'firebase/firestore';

// Chave para armazenar dados no localStorage
const DASHBOARD_CACHE_KEY = 'dashboard_data_cache';
// Tempo de expiração do cache (4 horas)
const CACHE_EXPIRATION = 4 * 60 * 60 * 1000;

// Componente otimizado para minimizar leituras do Firestore
const AdminDashboardClient = () => {
  const [stats, setStats] = useState([
    { title: 'Visitantes', value: '0', icon: 'FaEye', change: '+12%', color: 'bg-blue-500' },
    { title: 'Consultas', value: '0', icon: 'FaCalendarAlt', change: '+8%', color: 'bg-green-500' },
    { title: 'Mensagens', value: '0', icon: 'FaComments', change: '+5%', color: 'bg-yellow-500' },
    { title: 'Pacientes', value: '0', icon: 'FaUsers', change: '+15%', color: 'bg-purple-500' },
  ]);
  const [recentMessages, setRecentMessages] = useState([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [usedCache, setUsedCache] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [isMounted, setIsMounted] = useState(false);

  // Verificar se o componente está montado no cliente
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Função para buscar dados com economia extrema de leituras
  const fetchData = async (forceRefresh = false) => {
    try {
      setIsLoading(true);
      
      // Verificar se temos dados em cache e se não estamos forçando atualização
      if (!forceRefresh) {
        const cachedData = localStorage.getItem(DASHBOARD_CACHE_KEY);
        if (cachedData) {
          const { data, timestamp } = JSON.parse(cachedData);
          // Se o cache for válido (menos de 4 horas), use-o
          if (Date.now() - timestamp < CACHE_EXPIRATION) {
            console.log('Usando dados em cache para o dashboard');
            setStats(data.stats);
            setRecentMessages(data.messages);
            setUpcomingAppointments(data.appointments);
            setLastUpdated(new Date(timestamp).toLocaleString());
            setIsLoading(false);
            setUsedCache(true);
            return;
          }
        }
      }
      
      // Se não tiver cache ou estiver forçando atualização, buscar dados
      setUsedCache(false);
      
      // Usar Promise.all para paralelizar as consultas e reduzir o tempo de carregamento
      const [messagesData, appointmentsData, counts] = await Promise.all([
        // Buscar mensagens recentes - LIMITE REDUZIDO PARA 3
        fetchMessages(),
        
        // Buscar próximas consultas - LIMITE REDUZIDO PARA 3
        fetchAppointments(),
        
        // Buscar contagens para estatísticas usando getCountFromServer (economia extrema)
        fetchCounts()
      ]);
      
      // Atualizar mensagens
      setRecentMessages(messagesData);
      
      // Atualizar consultas
      setUpcomingAppointments(appointmentsData);
      
      // Atualizar estatísticas
      const newStats = [
        { title: 'Visitantes', value: counts[0].toString(), icon: 'FaEye', change: '+12%', color: 'bg-blue-500' },
        { title: 'Consultas', value: counts[1].toString(), icon: 'FaCalendarAlt', change: '+8%', color: 'bg-green-500' },
        { title: 'Mensagens', value: counts[2].toString(), icon: 'FaComments', change: '+5%', color: 'bg-yellow-500' },
        { title: 'Pacientes', value: counts[3].toString(), icon: 'FaUsers', change: '+15%', color: 'bg-purple-500' },
      ];
      
      setStats(newStats);
      
      const currentTimestamp = Date.now();
      setLastUpdated(new Date(currentTimestamp).toLocaleString());
      
      // Salvar no cache
      localStorage.setItem(DASHBOARD_CACHE_KEY, JSON.stringify({
        data: {
          stats: newStats,
          messages: messagesData,
          appointments: appointmentsData
        },
        timestamp: currentTimestamp
      }));
      
      setError(null);
    } catch (err) {
      console.error('Erro ao buscar dados:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Função para buscar mensagens com economia de leituras
  const fetchMessages = async () => {
    const messagesQuery = query(
      collection(db, 'messages'),
      orderBy('createdAt', 'desc'),
      limit(3) // Reduzido para economizar leituras
    );
    
    const messagesSnapshot = await getDocs(messagesQuery);
    return messagesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  };
  
  // Função para buscar consultas com economia de leituras
  const fetchAppointments = async () => {
    const appointmentsQuery = query(
      collection(db, 'appointments'),
      where('date', '>=', new Date()),
      orderBy('date', 'asc'),
      limit(3) // Reduzido para economizar leituras
    );
    
    const appointmentsSnapshot = await getDocs(appointmentsQuery);
    return appointmentsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  };
  
  // Função para buscar contagens com economia EXTREMA de leituras
  const fetchCounts = async () => {
    const collections = ['visitors', 'appointments', 'messages', 'patients'];
    
    // Usar getCountFromServer em vez de buscar documentos
    // Isso economiza DRASTICAMENTE o número de leituras
    return Promise.all(
      collections.map(async (collName) => {
        try {
          const colRef = collection(db, collName);
          const snapshot = await getCountFromServer(colRef);
          return snapshot.data().count;
        } catch (error) {
          console.error(`Erro ao contar ${collName}:`, error);
          return 0;
        }
      })
    );
  };

  // Carregar dados ao montar o componente
  useEffect(() => {
    if (isMounted) {
      fetchData();
      
      // Não configurar atualizações automáticas para economizar leituras
      // O usuário pode atualizar manualmente se necessário
    }
  }, [isMounted]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 }
    }
  };

  // Função para formatar a data
  const formatDate = (timestamp) => {
    if (!timestamp) return '';
    try {
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      return date.toLocaleDateString('pt-BR');
    } catch (error) {
      console.error('Erro ao formatar data:', error);
      return '';
    }
  };

  // Função para formatar a hora
  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    try {
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    } catch (error) {
      console.error('Erro ao formatar hora:', error);
      return '';
    }
  };

  // Renderizar um esqueleto de carregamento se estiver no servidor ou carregando
  if (!isMounted) {
    return (
      <div className="p-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-gray-600">Carregando...</p>
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
    );
  }

  // Se estiver carregando, mostrar indicador de carregamento
  if (isLoading) {
    return (
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
    );
  }

  // Se houver erro, mostrar mensagem de erro
  if (error) {
    return (
      <div className="p-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-red-600">Erro ao carregar dados: {error}</p>
        </div>
        <button 
          onClick={() => fetchData(true)}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Tentar novamente
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <div className="flex justify-between items-center">
          <p className="text-gray-600">Bem-vindo ao painel administrativo</p>
          <div className="flex items-center">
            {usedCache && (
              <span className="text-xs text-gray-500 mr-2">
                Dados em cache
              </span>
            )}
            {lastUpdated && (
              <span className="text-xs text-gray-500 mr-2">
                Última atualização: {lastUpdated}
              </span>
            )}
            <button 
              onClick={() => fetchData(true)} 
              className="text-sm bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded"
            >
              Atualizar dados
            </button>
          </div>
        </div>
      </div>

      {/* Cards de estatísticas */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {stats.map((stat, index) => {
          // Determinar qual ícone usar baseado na propriedade icon
          let IconComponent;
          switch (stat.icon) {
            case 'FaUsers':
              IconComponent = FaUsers;
              break;
            case 'FaCalendarAlt':
              IconComponent = FaCalendarAlt;
              break;
            case 'FaComments':
              IconComponent = FaComments;
              break;
            case 'FaEye':
              IconComponent = FaEye;
              break;
            default:
              IconComponent = FaChartLine;
          }

          return (
            <motion.div
              key={index}
              className={`bg-white rounded-lg shadow-md p-6 ${stat.color}`}
              variants={itemVariants}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white text-sm font-medium mb-1">{stat.title}</p>
                  <h3 className="text-white text-2xl font-bold">{stat.value}</h3>
                </div>
                <div className="p-3 bg-white bg-opacity-30 rounded-full">
                  <IconComponent className="text-white text-xl" />
                </div>
              </div>
              <div className="mt-4">
                <span className="text-white text-xs font-medium bg-white bg-opacity-30 px-2 py-1 rounded-full">
                  {stat.change}
                </span>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Mensagens recentes */}
        <motion.div
          className="bg-white rounded-lg shadow-md p-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Mensagens Recentes</h2>
            <button className="text-sm text-blue-600 hover:text-blue-800">Ver todas</button>
          </div>
          
          {recentMessages.length > 0 ? (
            <div className="space-y-4">
              {recentMessages.map((message) => (
                <motion.div key={message.id} className="border-b pb-4" variants={itemVariants}>
                  <div className="flex justify-between">
                    <h3 className="font-medium text-gray-800">{message.name}</h3>
                    <span className="text-xs text-gray-500">
                      {formatDate(message.createdAt)} {formatTime(message.createdAt)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{message.message}</p>
                </motion.div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">Nenhuma mensagem encontrada</p>
          )}
        </motion.div>

        {/* Consultas agendadas */}
        <motion.div
          className="bg-white rounded-lg shadow-md p-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Consultas Agendadas</h2>
            <button className="text-sm text-blue-600 hover:text-blue-800">Ver todas</button>
          </div>
          
          {upcomingAppointments.length > 0 ? (
            <div className="space-y-4">
              {upcomingAppointments.map((appointment) => (
                <motion.div key={appointment.id} className="border-b pb-4" variants={itemVariants}>
                  <div className="flex justify-between">
                    <h3 className="font-medium text-gray-800">{appointment.patientName}</h3>
                    <span className="text-xs text-gray-500">
                      {formatDate(appointment.date)} {formatTime(appointment.time)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{appointment.reason || 'Consulta de rotina'}</p>
                </motion.div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">Nenhuma consulta agendada</p>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default AdminDashboardClient;
