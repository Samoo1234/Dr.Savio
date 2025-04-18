"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaEnvelope, FaEnvelopeOpen, FaTrash, FaReply, FaStar, FaArchive, FaExclamationCircle, FaSync, FaArrowLeft } from 'react-icons/fa';
import DataTable from '../../../components/admin/DataTable';
import { db } from '../../../lib/firebase';
import { collection, getDocs, query, orderBy, limit, Timestamp, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { format } from 'date-fns';

// Definir interface para mensagens
interface Message {
  id: string;
  name: string;
  email: string;
  message: string;
  subject: string;
  createdAt: any; // Pode ser Timestamp ou Date
  date: string;
  read: boolean;
  starred: boolean;
  archived: boolean;
  folder: string;
  respondedAt?: any;
}

export default function MessagesPage() {
  // Estado para controlar a visualização de mensagens
  const [selectedTab, setSelectedTab] = useState('inbox');
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [isReplyModalOpen, setIsReplyModalOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Função para formatar a data do Firestore
  const formatDate = (timestamp: any): string => {
    if (!timestamp) return 'Data não disponível';
    try {
      const date = timestamp instanceof Timestamp ? 
        timestamp.toDate() : 
        (timestamp.seconds ? new Date(timestamp.seconds * 1000) : new Date(timestamp));
      return format(date, 'dd/MM/yyyy HH:mm');
    } catch (error) {
      console.error('Erro ao formatar data:', error);
      return 'Data inválida';
    }
  };

  // Buscar mensagens do Firestore
  const fetchMessages = async () => {
    try {
      setLoading(true);
      const messagesQuery = query(
        collection(db, 'messages'),
        orderBy('createdAt', 'desc'),
        limit(20) // Buscar mais mensagens para a página específica
      );
      
      const messagesSnapshot = await getDocs(messagesQuery);
      const messagesData = messagesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        date: formatDate(doc.data().createdAt),
        // Valores padrão para campos que podem não existir no Firestore
        read: doc.data().read || false,
        starred: doc.data().starred || false,
        archived: doc.data().archived || false,
        folder: doc.data().archived ? 'archive' : 'inbox',
        name: doc.data().name || '',
        email: doc.data().email || '',
        subject: doc.data().subject || 'Sem assunto',
        message: doc.data().message || '',
        createdAt: doc.data().createdAt || new Date()
      }));
      
      setMessages(messagesData as Message[]);
      setError(null);
    } catch (err) {
      console.error('Erro ao buscar mensagens:', err);
      setError('Falha ao carregar mensagens. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  // Carregar mensagens ao montar o componente
  useEffect(() => {
    fetchMessages();
  }, []);
  

  
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
      cell: (value: any, row: Message) => (
        <div className="flex items-center space-x-1">
          {!value && <FaEnvelope className="text-primary-500" title="Não lida" />}
          {row.starred && <FaStar className="text-yellow-400" title="Destacada" />}
        </div>
      )
    },
    {
      header: "Remetente",
      accessor: "name",
      cell: (value: any, row: Message) => (
        <div>
          <div className={`font-medium ${!row.read ? 'text-gray-900' : 'text-gray-700'}`}>{value}</div>
          <div className="text-xs text-gray-500">{row.email}</div>
        </div>
      )
    },
    {
      header: "Status",
      accessor: "read",
      cell: (value: any, row: Message) => (
        <div 
          id={`status-${row.id}`}
          className={`text-xs px-2 py-1 rounded-full inline-block ${value ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}
        >
          {value ? 'Lida' : 'Não lida'}
        </div>
      )
    },
    {
      header: "Assunto",
      accessor: "subject",
      cell: (value: any, row: Message) => (
        <div className="truncate max-w-xs">{value}</div>
      )
    },
    {
      header: "Mensagem",
      accessor: "message",
      cell: (value: string) => (
        <div className="max-w-md truncate text-gray-500">{value}</div>
      )
    },
    {
      header: "Data",
      accessor: "date",
      cell: (value: any) => (
        <div className="text-sm text-gray-500">{value}</div>
      )
    },
    {
      header: "Ações",
      accessor: "id",
      cell: (_: any, row: Message) => (
        <div className="flex space-x-2">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              handleToggleStar(row);
            }}
            className={`p-1.5 rounded-full ${row.starred ? 'bg-yellow-100 text-yellow-600' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
          >
            <FaStar size={14} />
          </button>
          
          <button 
            onClick={(e) => {
              e.stopPropagation();
              handleToggleArchive(row);
            }}
            className={`p-1.5 rounded-full ${row.archived ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
          >
            <FaArchive size={14} />
          </button>
          
          <button 
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteMessage(row);
            }}
            className="p-1.5 rounded-full bg-gray-100 text-gray-500 hover:bg-red-100 hover:text-red-600"
          >
            <FaTrash size={14} />
          </button>
        </div>
      )
    }
  ];
  
  // Função para visualizar uma mensagem
  const handleViewMessage = async (message: Message) => {
    setSelectedMessage(message);
    
    // Marcar como lida se ainda não estiver
    if (!message.read) {
      try {
        const messageRef = doc(db, 'messages', message.id);
        await updateDoc(messageRef, {
          read: true
        });
        
        // Atualizar o estado local
        setMessages(prevMessages => 
          prevMessages.map(m => 
            m.id === message.id ? {...m, read: true} : m
          )
        );
        
        // Exibir feedback visual temporário
        const statusElement = document.getElementById(`status-${message.id}`);
        if (statusElement) {
          statusElement.textContent = 'Marcada como lida';
          setTimeout(() => {
            if (statusElement) {
              statusElement.textContent = 'Lida';
            }
          }, 2000);
        }
        
        console.log('Mensagem marcada como lida:', message.id);
      } catch (error) {
        console.error('Erro ao marcar mensagem como lida:', error);
      }
    }
  };
  
  // Função para alternar o destaque de uma mensagem
  const handleToggleStar = async (message: any) => {
    try {
      const newStarredValue = !message.starred;
      const messageRef = doc(db, 'messages', message.id);
      await updateDoc(messageRef, {
        starred: newStarredValue
      });
      
      // Atualizar o estado local
      setMessages(prevMessages => 
        prevMessages.map(m => 
          m.id === message.id ? {...m, starred: newStarredValue} : m
        )
      );
      
      // Se a mensagem selecionada for a que está sendo modificada, atualizar também
      if (selectedMessage && selectedMessage.id === message.id) {
        setSelectedMessage({...selectedMessage, starred: newStarredValue});
      }
      
      console.log(`Mensagem ${newStarredValue ? 'destacada' : 'removida dos destaques'}:`, message.id);
    } catch (error) {
      console.error('Erro ao alternar destaque da mensagem:', error);
      setError('Falha ao atualizar mensagem. Tente novamente.');
    }
  };
  
  // Função para arquivar/desarquivar uma mensagem
  const handleToggleArchive = async (message: Message) => {
    try {
      const newArchivedValue = !message.archived;
      const messageRef = doc(db, 'messages', message.id);
      await updateDoc(messageRef, {
        archived: newArchivedValue
      });
      
      // Atualizar o estado local
      setMessages(prevMessages => 
        prevMessages.map(m => 
          m.id === message.id ? {...m, archived: newArchivedValue, folder: newArchivedValue ? 'archive' : 'inbox'} : m
        )
      );
      
      // Se a mensagem selecionada for a que está sendo modificada, atualizar também
      if (selectedMessage && selectedMessage.id === message.id) {
        setSelectedMessage({...selectedMessage, archived: newArchivedValue, folder: newArchivedValue ? 'archive' : 'inbox'});
      }
      
      console.log(`Mensagem ${newArchivedValue ? 'arquivada' : 'desarquivada'}:`, message.id);
    } catch (error) {
      console.error('Erro ao alternar arquivamento da mensagem:', error);
      setError('Falha ao atualizar mensagem. Tente novamente.');
    }
  };
  
  // Função para abrir o modal de resposta
  const handleReply = () => {
    if (selectedMessage) {
      setIsReplyModalOpen(true);
    }
  };
  
  // Função para excluir uma mensagem
  const handleDeleteMessage = async (message: Message) => {
    if (confirm('Tem certeza que deseja excluir esta mensagem? Esta ação não pode ser desfeita.')) {
      try {
        const messageRef = doc(db, 'messages', message.id);
        await deleteDoc(messageRef);
        
        // Atualizar o estado local removendo a mensagem
        setMessages(prevMessages => prevMessages.filter(m => m.id !== message.id));
        
        // Se a mensagem selecionada for a que está sendo excluída, limpar a seleção
        if (selectedMessage && selectedMessage.id === message.id) {
          setSelectedMessage(null);
        }
        
        console.log('Mensagem excluída:', message.id);
      } catch (error) {
        console.error('Erro ao excluir mensagem:', error);
        setError('Falha ao excluir mensagem. Tente novamente.');
      }
    }
  };
  
  // Função para fechar o modal de resposta
  const handleCloseReplyModal = () => {
    setIsReplyModalOpen(false);
  };
  
  // Função para enviar resposta
  const handleSendReply = async () => {
    if (!selectedMessage) return;
    
    try {
      const messageRef = doc(db, 'messages', selectedMessage.id);
      await updateDoc(messageRef, {
        respondedAt: new Date(),
        read: true
      });
      
      // Atualizar o estado local
      setMessages(prevMessages => 
        prevMessages.map(m => 
          m.id === selectedMessage.id ? {...m, respondedAt: new Date(), read: true} : m
        )
      );
      
      // Atualizar mensagem selecionada
      setSelectedMessage({...selectedMessage, respondedAt: new Date(), read: true});
      
      // Fechar o modal
      setIsReplyModalOpen(false);
      
      console.log("Resposta enviada para:", selectedMessage.email);
    } catch (error) {
      console.error('Erro ao marcar mensagem como respondida:', error);
      setError('Falha ao enviar resposta. Tente novamente.');
    }
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
                <div className="flex justify-between items-center">
                  <h2 className="font-semibold text-gray-800">
                    {selectedTab === 'inbox' && 'Caixa de Entrada'}
                    {selectedTab === 'starred' && 'Mensagens Destacadas'}
                    {selectedTab === 'archive' && 'Mensagens Arquivadas'}
                  </h2>
                  <button 
                    onClick={fetchMessages} 
                    className="flex items-center px-3 py-1.5 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors duration-300"
                    disabled={loading}
                  >
                    <FaSync className={`mr-2 ${loading ? 'animate-spin' : ''}`} /> Atualizar
                  </button>
                </div>
                
                <div className="mt-2 text-sm text-gray-600">
                  <p>Clique em uma mensagem para visualizá-la. Isso a marcará automaticamente como lida.</p>
                </div>
                
                {error && (
                  <div className="mt-3 p-3 bg-red-100 text-red-700 rounded-md flex items-center text-sm">
                    <FaExclamationCircle className="mr-2" /> {error}
                  </div>
                )}
              </div>
              
              <div className="p-6">
                {loading ? (
                  <div className="p-8 text-center">
                    <FaSync className="animate-spin mx-auto text-primary-500 text-2xl mb-4" />
                    <p className="text-gray-600">Carregando mensagens...</p>
                  </div>
                ) : (
                  <DataTable 
                    columns={columns} 
                    data={filteredMessages} 
                    emptyMessage={`Nenhuma mensagem ${
                      selectedTab === 'inbox' ? 'na caixa de entrada' : 
                      selectedTab === 'starred' ? 'destacada' : 'arquivada'
                    }.`}
                    onRowClick={handleViewMessage}
                    className="cursor-pointer hover:bg-gray-50"
                  />
                )}
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
                <div className="flex items-center">
                  <button 
                    onClick={() => setSelectedMessage(null)}
                    className="mr-2 text-gray-600 hover:text-primary-600 flex items-center"
                    title="Voltar para a lista"
                  >
                    <FaArrowLeft className="mr-1" /> <span>Voltar</span>
                  </button>
                  <h2 className="font-semibold text-gray-800">Visualizar Mensagem</h2>
                </div>
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
                        onClick={() => handleDeleteMessage(selectedMessage)}
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
