import { FaUsers, FaCalendarAlt, FaComments, FaChartLine, FaEye } from 'react-icons/fa';
import { motion } from 'framer-motion';

export default function AdminDashboard() {
  // Dados fictícios para o dashboard
  const stats = [
    { title: 'Visitantes', value: '1,248', icon: <FaEye />, change: '+12%', color: 'bg-blue-500' },
    { title: 'Consultas', value: '64', icon: <FaCalendarAlt />, change: '+8%', color: 'bg-green-500' },
    { title: 'Mensagens', value: '23', icon: <FaComments />, change: '+5%', color: 'bg-yellow-500' },
    { title: 'Pacientes', value: '156', icon: <FaUsers />, change: '+15%', color: 'bg-purple-500' },
  ];

  const recentMessages = [
    { id: 1, name: 'Maria Silva', email: 'maria@email.com', subject: 'Dúvida sobre consulta', date: '30/03/2025', status: 'Não lida' },
    { id: 2, name: 'João Santos', email: 'joao@email.com', subject: 'Agendamento', date: '29/03/2025', status: 'Lida' },
    { id: 3, name: 'Ana Oliveira', email: 'ana@email.com', subject: 'Informações sobre tratamento', date: '28/03/2025', status: 'Respondida' },
    { id: 4, name: 'Carlos Pereira', email: 'carlos@email.com', subject: 'Cancelamento', date: '27/03/2025', status: 'Lida' },
  ];

  const upcomingAppointments = [
    { id: 1, patient: 'Roberto Almeida', date: '31/03/2025', time: '09:00', type: 'Consulta Inicial' },
    { id: 2, patient: 'Fernanda Lima', date: '31/03/2025', time: '11:30', type: 'Retorno' },
    { id: 3, patient: 'Pedro Souza', date: '01/04/2025', time: '14:00', type: 'Exame' },
    { id: 4, patient: 'Juliana Costa', date: '01/04/2025', time: '16:30', type: 'Consulta Inicial' },
  ];

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

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-600">Bem-vindo ao painel administrativo, Dr. Sávio.</p>
      </div>

      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {stats.map((stat, index) => (
          <motion.div 
            key={index} 
            className="bg-white rounded-lg shadow-md p-6"
            variants={itemVariants}
          >
            <div className="flex items-center">
              <div className={`${stat.color} p-3 rounded-full text-white mr-4`}>
                {stat.icon}
              </div>
              <div>
                <h3 className="text-gray-500 text-sm font-medium">{stat.title}</h3>
                <div className="flex items-center">
                  <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                  <span className="text-green-500 text-sm ml-2">{stat.change}</span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div 
          className="bg-white rounded-lg shadow-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800">Mensagens Recentes</h2>
          </div>
          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assunto</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {recentMessages.map((message) => (
                    <tr key={message.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{message.name}</div>
                        <div className="text-xs text-gray-500">{message.email}</div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800">{message.subject}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{message.date}</td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          message.status === 'Não lida' 
                            ? 'bg-red-100 text-red-800' 
                            : message.status === 'Respondida' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-blue-100 text-blue-800'
                        }`}>
                          {message.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4 text-right">
              <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                Ver todas as mensagens →
              </button>
            </div>
          </div>
        </motion.div>

        <motion.div 
          className="bg-white rounded-lg shadow-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800">Próximas Consultas</h2>
          </div>
          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Paciente</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Horário</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {upcomingAppointments.map((appointment) => (
                    <tr key={appointment.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{appointment.patient}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{appointment.date}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{appointment.time}</td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          appointment.type === 'Consulta Inicial' 
                            ? 'bg-blue-100 text-blue-800' 
                            : appointment.type === 'Retorno' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-purple-100 text-purple-800'
                        }`}>
                          {appointment.type}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4 text-right">
              <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                Ver agenda completa →
              </button>
            </div>
          </div>
        </motion.div>
      </div>

      <motion.div 
        className="mt-8 bg-white rounded-lg shadow-md p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-800">Estatísticas de Visitantes</h2>
          <select className="bg-white border border-gray-300 text-gray-700 py-1 px-3 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500">
            <option>Últimos 7 dias</option>
            <option>Últimos 30 dias</option>
            <option>Últimos 3 meses</option>
          </select>
        </div>
        <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <FaChartLine className="text-4xl text-gray-400 mx-auto mb-2" />
            <p className="text-gray-500">Gráfico de estatísticas será exibido aqui</p>
          </div>
        </div>
      </motion.div>

      <motion.div 
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Ações Rápidas</h3>
          <div className="space-y-3">
            <button className="w-full bg-primary-600 hover:bg-primary-700 text-white py-2 px-4 rounded-md transition-colors duration-300">
              Adicionar Novo Serviço
            </button>
            <button className="w-full bg-secondary-600 hover:bg-secondary-700 text-white py-2 px-4 rounded-md transition-colors duration-300">
              Atualizar Conteúdo
            </button>
            <button className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md transition-colors duration-300">
              Gerenciar Agenda
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Tarefas Pendentes</h3>
          <div className="space-y-3">
            <div className="flex items-center">
              <input type="checkbox" className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded" />
              <label className="ml-2 text-sm text-gray-700">Atualizar informações de serviços</label>
            </div>
            <div className="flex items-center">
              <input type="checkbox" className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded" />
              <label className="ml-2 text-sm text-gray-700">Responder mensagens pendentes</label>
            </div>
            <div className="flex items-center">
              <input type="checkbox" className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded" />
              <label className="ml-2 text-sm text-gray-700">Adicionar novos depoimentos</label>
            </div>
            <div className="flex items-center">
              <input type="checkbox" className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded" />
              <label className="ml-2 text-sm text-gray-700">Atualizar fotos da galeria</label>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Atividade Recente</h3>
          <div className="space-y-4">
            <div className="flex">
              <div className="flex-shrink-0 h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-500">
                <FaUsers className="text-xs" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-gray-700">Novo paciente cadastrado</p>
                <p className="text-xs text-gray-500">Há 2 horas</p>
              </div>
            </div>
            <div className="flex">
              <div className="flex-shrink-0 h-8 w-8 rounded-full bg-green-100 flex items-center justify-center text-green-500">
                <FaCalendarAlt className="text-xs" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-gray-700">Consulta agendada</p>
                <p className="text-xs text-gray-500">Há 5 horas</p>
              </div>
            </div>
            <div className="flex">
              <div className="flex-shrink-0 h-8 w-8 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-500">
                <FaComments className="text-xs" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-gray-700">Nova mensagem recebida</p>
                <p className="text-xs text-gray-500">Há 1 dia</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
