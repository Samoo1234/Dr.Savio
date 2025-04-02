"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaEnvelope, FaEnvelopeOpen, FaTrash, FaReply, FaStar, FaArchive, FaExclamationCircle } from 'react-icons/fa';
import DataTable from '../../../components/admin/DataTable';

export default function MessagesPage() {
  // Estado para controlar a visualização de mensagens
  const [selectedTab, setSelectedTab] = useState('inbox');
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [isReplyModalOpen, setIsReplyModalOpen] = useState(false);
  
  // Dados fictícios para as mensagens
  const messages = [
    {
      id: 1,
      name: "Maria Silva",
      email: "maria@email.com",
      subject: "Dúvida sobre consulta",
      message: "Olá Dr. Sávio, gostaria de saber quais são os horários disponíveis para consulta na próxima semana. Preciso agendar uma consulta de rotina. Agradeço desde já pela atenção.",
      date: "30/03/2025 14:30",
      read: false,
      starred: false,
      archived: false,
      folder: 'inbox'
    },
    {
      id: 2,
      name: "João Santos",
      email: "joao@email.com",
      subject: "Agendamento",
      message: "Prezado Dr. Sávio, gostaria de agendar uma consulta para a próxima terça-feira, se possível no período da tarde. Estou com alguns sintomas que gostaria de discutir pessoalmente. Obrigado pela atenção.",
      date: "29/03/2025 10:15",
      read: true,
      starred: true,
      archived: false,
      folder: 'inbox'
    },
    {
      id: 3,
      name: "Ana Oliveira",
      email: "ana@email.com",
      subject: "Informações sobre tratamento",
      message: "Boa tarde Dr. Sávio, estou interessada em saber mais detalhes sobre o tratamento que conversamos na última consulta. Poderia me fornecer mais informações ou algum material para leitura? Muito obrigada!",
      date: "28/03/2025 16:45",
      read: true,
      starred: false,
      archived: false,
      folder: 'inbox'
    },
    {
      id: 4,
      name: "Carlos Pereira",
      email: "carlos@email.com",
      subject: "Cancelamento",
      message: "Dr. Sávio, infelizmente preciso cancelar minha consulta agendada para amanhã às 14h devido a um imprevisto. Gostaria de reagendar para a próxima semana, se possível. Peço desculpas pelo inconveniente.",
      date: "27/03/2025 09:20",
      read: true,
      starred: false,
      archived: true,
      folder: 'archive'
    },
    {
      id: 5,
      name: "Fernanda Lima",
      email: "fernanda@email.com",
      subject: "Agradecimento",
      message: "Querido Dr. Sávio, gostaria de agradecer pelo excelente atendimento na consulta de ontem. Suas orientações foram muito claras e já estou me sentindo melhor com o tratamento recomendado. Muito obrigada pela atenção e cuidado!",
      date: "26/03/2025 18:05",
      read: true,
      starred: true,
      archived: false,
      folder: 'inbox'
    }
  ];
  
  // Filtrar mensagens com base na aba selecionada
  const filteredMessages = messages.filter(message => {
    if (selectedTab === 'inbox') return !message.archived;
    if (selectedTab === 'starred') return message.starred;
    if (selectedTab === 'archive') return message.archived;
    return true;
  });
  
  // Colunas para a tabela de mensagens
  const columns = [
    {
      header: "",
      accessor: "read",
      cell: (value, row) => (
        <div className="flex items-center space-x-1">
          {!value && <FaEnvelope className="text-primary-500" title="Não lida" />}
          {row.starred && <FaStar className="text-yellow-400" title="Destacada" />}
        </div>
      )
    },
    {
      header: "Remetente",
      accessor: "name",
      cell: (value, row) => (
        <div>
          <div className={`font-medium ${!row.read ? 'text-gray-900' : 'text-gray-700'}`}>{value}</div>
          <div className="text-xs text-gray-500">{row.email}</div>
        </div>
      )
    },
    {
      header: "Assunto",
      accessor: "subject",
      cell: (value, row) => (
        <div className={`${!row.read ? 'font-semibold' : 'font-normal'}`}>{value}</div>
      )
    },
    {
      header: "Mensagem",
      accessor: "message",
      cell: (value) => (
        <div className="max-w-md truncate text-gray-500">{value}</div>
      )
    },
    {
      header: "Data",
      accessor: "date",
      cell: (value) => (
        <div className="text-sm text-gray-500">{value}</div>
      )
    },
    {
      header: "Ações",
      accessor: "id",
      cell: (_, row) => (
        <div className="flex space-x-2">
          <button 
            onClick={() => handleViewMessage(row)}
            className="p-1 text-gray-600 hover:text-primary-600"
            title="Visualizar"
          >
            <FaEnvelopeOpen />
          </button>
          <button 
            onClick={() => handleToggleStar(row)}
            className={`p-1 ${row.starred ? 'text-yellow-400' : 'text-gray-400 hover:text-yellow-400'}`}
            title={row.starred ? "Remover destaque" : "Destacar"}
          >
            <FaStar />
          </button>
          <button 
            onClick={() => handleToggleArchive(row)}
            className="p-1 text-gray-600 hover:text-blue-600"
            title={row.archived ? "Desarquivar" : "Arquivar"}
          >
            <FaArchive />
          </button>
          <button 
            className="p-1 text-gray-600 hover:text-red-600"
            title="Excluir"
          >
            <FaTrash />
          </button>
        </div>
      )
    }
  ];
  
  // Função para visualizar uma mensagem
  const handleViewMessage = (message) => {
    setSelectedMessage(message);
    
    // Marcar como lida se ainda não estiver
    if (!message.read) {
      // Aqui você implementaria a lógica para atualizar no backend
      console.log("Marcando mensagem como lida:", message.id);
    }
  };
  
  // Função para alternar o destaque de uma mensagem
  const handleToggleStar = (message) => {
    // Aqui você implementaria a lógica para atualizar no backend
    console.log("Alternando destaque da mensagem:", message.id);
  };
  
  // Função para arquivar/desarquivar uma mensagem
  const handleToggleArchive = (message) => {
    // Aqui você implementaria a lógica para atualizar no backend
    console.log("Alternando arquivamento da mensagem:", message.id);
  };
  
  // Função para abrir o modal de resposta
  const handleReply = () => {
    setIsReplyModalOpen(true);
  };
  
  // Função para fechar o modal de resposta
  const handleCloseReplyModal = () => {
    setIsReplyModalOpen(false);
  };
  
  // Função para enviar resposta (simulada)
  const handleSendReply = () => {
    // Aqui você implementaria a lógica para enviar a resposta
    console.log("Enviando resposta para:", selectedMessage?.email);
    setIsReplyModalOpen(false);
    // Atualizar estado ou recarregar dados
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Mensagens</h1>
        <p className="text-gray-600">Gerencie as mensagens recebidas através do formulário de contato</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar com pastas */}
        <div className="lg:col-span-1">
          <motion.div 
            className="bg-white rounded-lg shadow-md overflow-hidden"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="p-4 border-b border-gray-200">
              <h2 className="font-semibold text-gray-800">Pastas</h2>
            </div>
            <div className="p-2">
              <ul className="space-y-1">
                <li>
                  <button
                    onClick={() => setSelectedTab('inbox')}
                    className={`w-full flex items-center px-3 py-2 rounded-md transition-colors duration-200 ${
                      selectedTab === 'inbox' 
                        ? 'bg-primary-50 text-primary-600' 
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <FaEnvelope className={`mr-2 ${selectedTab === 'inbox' ? 'text-primary-500' : 'text-gray-400'}`} />
                    <span>Caixa de Entrada</span>
                    <span className="ml-auto bg-primary-100 text-primary-600 text-xs rounded-full px-2 py-0.5">
                      {messages.filter(m => !m.archived).length}
                    </span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setSelectedTab('starred')}
                    className={`w-full flex items-center px-3 py-2 rounded-md transition-colors duration-200 ${
                      selectedTab === 'starred' 
                        ? 'bg-primary-50 text-primary-600' 
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <FaStar className={`mr-2 ${selectedTab === 'starred' ? 'text-primary-500' : 'text-gray-400'}`} />
                    <span>Destacadas</span>
                    <span className="ml-auto bg-primary-100 text-primary-600 text-xs rounded-full px-2 py-0.5">
                      {messages.filter(m => m.starred).length}
                    </span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setSelectedTab('archive')}
                    className={`w-full flex items-center px-3 py-2 rounded-md transition-colors duration-200 ${
                      selectedTab === 'archive' 
                        ? 'bg-primary-50 text-primary-600' 
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <FaArchive className={`mr-2 ${selectedTab === 'archive' ? 'text-primary-500' : 'text-gray-400'}`} />
                    <span>Arquivadas</span>
                    <span className="ml-auto bg-primary-100 text-primary-600 text-xs rounded-full px-2 py-0.5">
                      {messages.filter(m => m.archived).length}
                    </span>
                  </button>
                </li>
              </ul>
            </div>
            
            <div className="p-4 border-t border-gray-200 mt-4">
              <div className="bg-yellow-50 p-3 rounded-md">
                <div className="flex items-start">
                  <FaExclamationCircle className="text-yellow-500 mt-0.5 mr-2" />
                  <div>
                    <h3 className="text-sm font-medium text-yellow-800">Atenção</h3>
                    <p className="text-xs text-yellow-700 mt-1">
                      Mensagens não respondidas em até 48h serão destacadas automaticamente.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Conteúdo principal */}
        <div className="lg:col-span-3">
          {!selectedMessage ? (
            <motion.div 
              className="bg-white rounded-lg shadow-md overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="p-4 border-b border-gray-200">
                <h2 className="font-semibold text-gray-800">
                  {selectedTab === 'inbox' && 'Caixa de Entrada'}
                  {selectedTab === 'starred' && 'Mensagens Destacadas'}
                  {selectedTab === 'archive' && 'Mensagens Arquivadas'}
                </h2>
              </div>
              <div className="p-6">
                <DataTable 
                  columns={columns} 
                  data={filteredMessages} 
                  emptyMessage={`Nenhuma mensagem ${
                    selectedTab === 'inbox' ? 'na caixa de entrada' : 
                    selectedTab === 'starred' ? 'destacada' : 'arquivada'
                  }.`}
                />
              </div>
            </motion.div>
          ) : (
            <motion.div 
              className="bg-white rounded-lg shadow-md overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                <h2 className="font-semibold text-gray-800">Visualizar Mensagem</h2>
                <button 
                  onClick={() => setSelectedMessage(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  &times;
                </button>
              </div>
              <div className="p-6">
                <div className="mb-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800">{selectedMessage.subject}</h3>
                      <p className="text-gray-600">
                        De: <span className="font-medium">{selectedMessage.name}</span> &lt;{selectedMessage.email}&gt;
                      </p>
                      <p className="text-sm text-gray-500">{selectedMessage.date}</p>
                    </div>
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => handleToggleStar(selectedMessage)}
                        className={`p-2 rounded-full ${
                          selectedMessage.starred 
                            ? 'text-yellow-400 hover:bg-yellow-50' 
                            : 'text-gray-400 hover:text-yellow-400 hover:bg-gray-100'
                        }`}
                        title={selectedMessage.starred ? "Remover destaque" : "Destacar"}
                      >
                        <FaStar />
                      </button>
                      <button 
                        onClick={() => handleToggleArchive(selectedMessage)}
                        className={`p-2 rounded-full text-gray-600 hover:text-blue-600 hover:bg-gray-100`}
                        title={selectedMessage.archived ? "Desarquivar" : "Arquivar"}
                      >
                        <FaArchive />
                      </button>
                      <button 
                        className="p-2 rounded-full text-gray-600 hover:text-red-600 hover:bg-gray-100"
                        title="Excluir"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                  
                  <div className="border-t border-gray-200 pt-4 mt-4">
                    <div className="prose max-w-none">
                      <p className="text-gray-800 whitespace-pre-line">{selectedMessage.message}</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <button
                    onClick={handleReply}
                    className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors duration-300"
                  >
                    <FaReply className="mr-2" /> Responder
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
      
      {/* Modal de Resposta */}
      {isReplyModalOpen && selectedMessage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div 
            className="bg-white rounded-lg shadow-xl w-full max-w-2xl"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-800">
                Responder: {selectedMessage.subject}
              </h3>
              <button 
                onClick={handleCloseReplyModal}
                className="text-gray-400 hover:text-gray-600"
              >
                &times;
              </button>
            </div>
            
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Para</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    value={`${selectedMessage.name} <${selectedMessage.email}>`}
                    readOnly
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Assunto</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    value={`Re: ${selectedMessage.subject}`}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mensagem</label>
                  <textarea
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    rows={10}
                    defaultValue={`\n\n\n------------------\nEm ${selectedMessage.date}, ${selectedMessage.name} escreveu:\n\n${selectedMessage.message}`}
                  />
                </div>
              </div>
            </div>
            
            <div className="border-t border-gray-200 px-6 py-4 flex justify-end space-x-3">
              <button
                onClick={handleCloseReplyModal}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-300"
              >
                Cancelar
              </button>
              <button
                onClick={handleSendReply}
                className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors duration-300"
              >
                <FaReply className="mr-2" /> Enviar Resposta
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
