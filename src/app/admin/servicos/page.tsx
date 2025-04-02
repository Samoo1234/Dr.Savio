"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaPlus, FaEdit, FaTrash, FaSave, FaUndo, FaEye } from 'react-icons/fa';
import DataTable from '../../../components/admin/DataTable';
import { db } from '../../../lib/firebase';
import { collection, doc, addDoc, updateDoc, deleteDoc, getDocs, query, orderBy, serverTimestamp } from 'firebase/firestore';
import { createServicesCollection } from '../../../scripts/createServicesCollection';

export default function ServicesPage() {
  // Estado para controlar o modal de edição
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentService, setCurrentService] = useState(null);
  const [services, setServices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Carregar serviços do Firebase ao montar o componente
  useEffect(() => {
    const fetchServices = async () => {
      try {
        setIsLoading(true);
        const servicesCollection = collection(db, 'services');
        const servicesQuery = query(servicesCollection, orderBy('createdAt', 'desc'));
        const snapshot = await getDocs(servicesQuery);

        const servicesData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        setServices(servicesData);
        setError(null);
      } catch (err) {
        console.error('Erro ao carregar serviços:', err);
        setError('Falha ao carregar os serviços. Por favor, tente novamente.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchServices();
  }, []);

  // Função para abrir o modal de edição
  const handleEdit = (service) => {
    setCurrentService(service);
    setIsModalOpen(true);
  };

  // Função para abrir o modal de criação
  const handleCreate = () => {
    setCurrentService({
      id: null,
      title: "",
      icon: "user-md",
      description: "",
      active: true,
      featured: false
    });
    setIsModalOpen(true);
  };

  // Função para fechar o modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentService(null);
  };

  // Função para salvar o serviço no Firebase
  const handleSave = async () => {
    try {
      // Validar campos obrigatórios
      if (!currentService || !currentService.title || !currentService.description) {
        alert('Por favor, preencha o título e a descrição do serviço.');
        return;
      }

      // Preparar dados para salvar
      const serviceData = {
        title: currentService.title,
        icon: currentService.icon,
        description: currentService.description,
        active: currentService.active,
        featured: currentService.featured,
        updatedAt: serverTimestamp()
      };

      if (currentService.id) {
        // Atualizar serviço existente
        const serviceRef = doc(db, 'services', currentService.id);
        await updateDoc(serviceRef, serviceData);

        // Atualizar estado local
        setServices(services.map(service => 
          service.id === currentService.id ? { ...service, ...serviceData } : service
        ));

        console.log('Serviço atualizado com sucesso!');
      } else {
        // Adicionar novo serviço
        serviceData.createdAt = serverTimestamp();

        try {
          // Tentar adicionar o documento
          const docRef = await addDoc(collection(db, 'services'), serviceData);

          // Adicionar ao estado local
          const newService = {
            id: docRef.id,
            ...serviceData,
            createdAt: new Date() // Representação local para exibição imediata
          };

          setServices([newService, ...services]);
          console.log('Serviço adicionado com sucesso!');
        } catch (error) {
          // Se falhar, tentar criar a coleção primeiro e depois adicionar o documento
          console.log('Tentando criar a coleção services primeiro...');
          await createServicesCollection();

          // Tentar adicionar o documento novamente
          const docRef = await addDoc(collection(db, 'services'), serviceData);

          // Adicionar ao estado local
          const newService = {
            id: docRef.id,
            ...serviceData,
            createdAt: new Date() // Representação local para exibição imediata
          };

          setServices([newService, ...services]);
          console.log('Serviço adicionado com sucesso após criar a coleção!');
        }
      }

      // Fechar modal e limpar serviço atual
      setIsModalOpen(false);
      setCurrentService(null);
    } catch (error) {
      console.error('Erro ao salvar serviço:', error);
      alert('Ocorreu um erro ao salvar o serviço. Por favor, tente novamente.');
    }
  };

  // Função para excluir um serviço
  const handleDelete = async (serviceId) => {
    if (window.confirm('Tem certeza que deseja excluir este serviço?')) {
      try {
        await deleteDoc(doc(db, 'services', serviceId));

        // Remover do estado local
        setServices(services.filter(service => service.id !== serviceId));
        console.log('Serviço excluído com sucesso!');
      } catch (error) {
        console.error('Erro ao excluir serviço:', error);
        alert('Ocorreu um erro ao excluir o serviço. Por favor, tente novamente.');
      }
    }
  };

  // Colunas para a tabela de serviços
  const columns = [
    {
      header: "Título",
      accessor: "title",
    },
    {
      header: "Ícone",
      accessor: "icon",
      cell: (value) => (
        <div className="flex items-center">
          <span className="bg-primary-100 text-primary-600 p-2 rounded-full">
            <i className={`fas fa-${value}`}></i>
          </span>
          <span className="ml-2">{value}</span>
        </div>
      )
    },
    {
      header: "Descrição",
      accessor: "description",
      cell: (value) => (
        <div className="max-w-md truncate">{value}</div>
      )
    },
    {
      header: "Status",
      accessor: "active",
      cell: (value) => (
        <span className={`px-2 py-1 rounded-full text-xs ${
          value ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {value ? 'Ativo' : 'Inativo'}
        </span>
      )
    },
    {
      header: "Destaque",
      accessor: "featured",
      cell: (value) => (
        <span className={`px-2 py-1 rounded-full text-xs ${
          value ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'
        }`}>
          {value ? 'Destacado' : 'Normal'}
        </span>
      )
    },
    {
      header: "Ações",
      accessor: "id",
      cell: (_, row) => (
        <div className="flex space-x-3">
          <button 
            className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded-md transition-colors"
            onClick={() => handleEdit(row)}
            title="Editar"
          >
            <FaEdit size={18} />
          </button>
          <button 
            className="p-2 text-green-600 hover:text-green-800 hover:bg-green-100 rounded-md transition-colors"
            title="Visualizar"
          >
            <FaEye size={18} />
          </button>
          <button 
            className="p-2 text-red-600 hover:text-red-800 hover:bg-red-100 rounded-md transition-colors"
            onClick={() => handleDelete(row.id)}
            title="Excluir"
          >
            <FaTrash size={18} />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="mt-8">
      <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Gerenciar Serviços</h1>
          <p className="text-gray-600">Adicione, edite ou remova os serviços oferecidos</p>
        </div>
        <button 
          onClick={handleCreate}
          className="flex items-center px-5 py-3 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors duration-300 shadow-md text-lg font-medium w-full sm:w-auto justify-center sm:justify-start"
        >
          <FaPlus className="mr-2" size={18} /> Adicionar Serviço
        </button>
      </div>

      <motion.div 
        className="bg-white rounded-lg shadow-md overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="p-6">
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
            </div>
          ) : error ? (
            <div className="text-center py-8 text-red-600">
              <p>{error}</p>
              <button 
                onClick={() => window.location.reload()} 
                className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-md"
              >
                Tentar novamente
              </button>
            </div>
          ) : (
            <DataTable 
              columns={columns} 
              data={services} 
              emptyMessage="Nenhum serviço cadastrado ainda. Clique em 'Adicionar Serviço' para começar."
            />
          )}
        </div>
      </motion.div>

      {/* Modal de Edição/Criação */}
      {isModalOpen && currentService && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div 
            className="bg-white rounded-lg shadow-xl w-full max-w-2xl"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-800">
                {currentService.id ? 'Editar Serviço' : 'Adicionar Serviço'}
              </h3>
              <button 
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-gray-600"
              >
                &times;
              </button>
            </div>

            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Ex: Cardiologia"
                    value={currentService.title}
                    onChange={(e) => setCurrentService({...currentService, title: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ícone</label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    value={currentService.icon}
                    onChange={(e) => setCurrentService({...currentService, icon: e.target.value})}
                  >
                    <option value="heart">Coração</option>
                    <option value="brain">Cérebro</option>
                    <option value="stethoscope">Estetoscópio</option>
                    <option value="user-md">Médico</option>
                    <option value="hospital">Hospital</option>
                    <option value="notes-medical">Prontuário</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
                  <textarea
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    rows={4}
                    placeholder="Descreva o serviço em detalhes..."
                    value={currentService.description}
                    onChange={(e) => setCurrentService({...currentService, description: e.target.value})}
                  />
                </div>

                <div className="flex space-x-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="active"
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      checked={currentService.active}
                      onChange={(e) => setCurrentService({...currentService, active: e.target.checked})}
                    />
                    <label htmlFor="active" className="ml-2 text-sm text-gray-700">Ativo</label>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="featured"
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      checked={currentService.featured}
                      onChange={(e) => setCurrentService({...currentService, featured: e.target.checked})}
                    />
                    <label htmlFor="featured" className="ml-2 text-sm text-gray-700">Destacado</label>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 px-6 py-4 flex justify-end space-x-3">
              <button
                onClick={handleCloseModal}
                className="flex items-center px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-300"
              >
                <FaUndo className="mr-2" /> Cancelar
              </button>
              <button
                onClick={handleSave}
                className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors duration-300"
              >
                <FaSave className="mr-2" /> Salvar
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
