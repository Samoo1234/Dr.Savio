import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaPlus, FaEdit, FaTrash, FaSave, FaUndo, FaEye } from 'react-icons/fa';
import DataTable from '../../../components/admin/DataTable';

export default function ServicesPage() {
  // Estado para controlar o modal de edição
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentService, setCurrentService] = useState(null);
  
  // Dados fictícios para os serviços
  const services = [
    {
      id: 1,
      title: "Cardiologia",
      icon: "heart",
      description: "Avaliação e tratamento completo para saúde cardiovascular, incluindo exames preventivos e acompanhamento personalizado.",
      active: true,
      featured: true
    },
    {
      id: 2,
      title: "Neurologia",
      icon: "brain",
      description: "Diagnóstico e tratamento de condições neurológicas com abordagem moderna e humanizada para melhorar sua qualidade de vida.",
      active: true,
      featured: false
    },
    {
      id: 3,
      title: "Clínica Geral",
      icon: "user-md",
      description: "Atendimento médico abrangente para todas as idades, com foco na prevenção e promoção da saúde integral.",
      active: true,
      featured: true
    },
    {
      id: 4,
      title: "Check-up Completo",
      icon: "stethoscope",
      description: "Avaliação detalhada do seu estado de saúde com exames completos e orientações personalizadas para prevenção.",
      active: true,
      featured: false
    },
    {
      id: 5,
      title: "Telemedicina",
      icon: "hospital",
      description: "Consultas online com a mesma qualidade do atendimento presencial, proporcionando comodidade e acessibilidade.",
      active: true,
      featured: false
    },
    {
      id: 6,
      title: "Acompanhamento",
      icon: "notes-medical",
      description: "Monitoramento contínuo da sua saúde com planos de tratamento ajustados às suas necessidades específicas.",
      active: false,
      featured: false
    }
  ];
  
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
        <div className="flex space-x-2">
          <button 
            className="p-1 text-blue-600 hover:text-blue-800"
            onClick={() => handleEdit(row)}
            title="Editar"
          >
            <FaEdit />
          </button>
          <button 
            className="p-1 text-green-600 hover:text-green-800"
            title="Visualizar"
          >
            <FaEye />
          </button>
          <button 
            className="p-1 text-red-600 hover:text-red-800"
            title="Excluir"
          >
            <FaTrash />
          </button>
        </div>
      )
    }
  ];
  
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
  
  // Função para salvar o serviço (simulada)
  const handleSave = () => {
    // Aqui você implementaria a lógica para salvar no backend
    console.log("Salvando serviço:", currentService);
    setIsModalOpen(false);
    setCurrentService(null);
    // Recarregar dados ou atualizar estado local
  };

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Gerenciar Serviços</h1>
          <p className="text-gray-600">Adicione, edite ou remova os serviços oferecidos</p>
        </div>
        <button 
          onClick={handleCreate}
          className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors duration-300"
        >
          <FaPlus className="mr-2" /> Adicionar Serviço
        </button>
      </div>

      <motion.div 
        className="bg-white rounded-lg shadow-md overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="p-6">
          <DataTable 
            columns={columns} 
            data={services} 
            emptyMessage="Nenhum serviço cadastrado ainda. Clique em 'Adicionar Serviço' para começar."
          />
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
