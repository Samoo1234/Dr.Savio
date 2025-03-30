import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaPlus, FaEdit, FaTrash, FaSave, FaUndo, FaEye, FaStar } from 'react-icons/fa';
import DataTable from '../../../components/admin/DataTable';

export default function TestimonialsPage() {
  // Estado para controlar o modal de edição
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState(null);
  
  // Dados fictícios para os depoimentos
  const testimonials = [
    {
      id: 1,
      name: "Ana Silva",
      role: "Paciente",
      image: "/images/testimonial-1.jpg",
      content: "O Dr. Sávio transformou minha experiência com consultas médicas. Seu atendimento humanizado e atenção aos detalhes me fizeram sentir realmente cuidada. Recomendo a todos que buscam um profissional dedicado e competente.",
      rating: 5,
      active: true,
      featured: true,
      date: "15/03/2025"
    },
    {
      id: 2,
      name: "Carlos Mendes",
      role: "Paciente",
      image: "/images/testimonial-2.jpg",
      content: "Após anos procurando um médico que realmente ouvisse minhas preocupações, encontrei o Dr. Sávio. Sua abordagem completa e explicações claras sobre meu tratamento fizeram toda a diferença na minha recuperação.",
      rating: 5,
      active: true,
      featured: true,
      date: "10/03/2025"
    },
    {
      id: 3,
      name: "Mariana Costa",
      role: "Paciente",
      image: "/images/testimonial-3.jpg",
      content: "O que mais me impressionou no Dr. Sávio foi sua capacidade de explicar condições complexas de forma simples e tranquilizadora. Seu conhecimento técnico aliado à empatia faz dele um médico excepcional.",
      rating: 5,
      active: true,
      featured: false,
      date: "05/03/2025"
    },
    {
      id: 4,
      name: "Roberto Almeida",
      role: "Paciente",
      image: "/images/testimonial-4.jpg",
      content: "Desde a primeira consulta, o Dr. Sávio demonstrou um profissionalismo e atenção que raramente encontramos hoje. Seu acompanhamento cuidadoso e disponibilidade para esclarecer dúvidas me deram muita confiança.",
      rating: 4,
      active: true,
      featured: false,
      date: "28/02/2025"
    }
  ];
  
  // Colunas para a tabela de depoimentos
  const columns = [
    {
      header: "Nome",
      accessor: "name",
      cell: (value, row) => (
        <div>
          <div className="font-medium text-gray-900">{value}</div>
          <div className="text-xs text-gray-500">{row.role}</div>
        </div>
      )
    },
    {
      header: "Depoimento",
      accessor: "content",
      cell: (value) => (
        <div className="max-w-md truncate">{value}</div>
      )
    },
    {
      header: "Avaliação",
      accessor: "rating",
      cell: (value) => (
        <div className="flex">
          {[...Array(5)].map((_, i) => (
            <FaStar 
              key={i} 
              className={i < value ? "text-yellow-400" : "text-gray-300"} 
            />
          ))}
        </div>
      )
    },
    {
      header: "Data",
      accessor: "date",
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
  const handleEdit = (testimonial) => {
    setCurrentTestimonial(testimonial);
    setIsModalOpen(true);
  };
  
  // Função para abrir o modal de criação
  const handleCreate = () => {
    setCurrentTestimonial({
      id: null,
      name: "",
      role: "Paciente",
      image: "",
      content: "",
      rating: 5,
      active: true,
      featured: false,
      date: new Date().toLocaleDateString('pt-BR')
    });
    setIsModalOpen(true);
  };
  
  // Função para fechar o modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentTestimonial(null);
  };
  
  // Função para salvar o depoimento (simulada)
  const handleSave = () => {
    // Aqui você implementaria a lógica para salvar no backend
    console.log("Salvando depoimento:", currentTestimonial);
    setIsModalOpen(false);
    setCurrentTestimonial(null);
    // Recarregar dados ou atualizar estado local
  };

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Gerenciar Depoimentos</h1>
          <p className="text-gray-600">Adicione, edite ou remova os depoimentos de pacientes</p>
        </div>
        <button 
          onClick={handleCreate}
          className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors duration-300"
        >
          <FaPlus className="mr-2" /> Adicionar Depoimento
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
            data={testimonials} 
            emptyMessage="Nenhum depoimento cadastrado ainda. Clique em 'Adicionar Depoimento' para começar."
          />
        </div>
      </motion.div>
      
      {/* Modal de Edição/Criação */}
      {isModalOpen && currentTestimonial && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div 
            className="bg-white rounded-lg shadow-xl w-full max-w-2xl"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-800">
                {currentTestimonial.id ? 'Editar Depoimento' : 'Adicionar Depoimento'}
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Ex: Ana Silva"
                      value={currentTestimonial.name}
                      onChange={(e) => setCurrentTestimonial({...currentTestimonial, name: e.target.value})}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Cargo/Função</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Ex: Paciente"
                      value={currentTestimonial.role}
                      onChange={(e) => setCurrentTestimonial({...currentTestimonial, role: e.target.value})}
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Depoimento</label>
                  <textarea
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    rows={4}
                    placeholder="Digite o depoimento do paciente..."
                    value={currentTestimonial.content}
                    onChange={(e) => setCurrentTestimonial({...currentTestimonial, content: e.target.value})}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Avaliação</label>
                  <div className="flex space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button 
                        key={star} 
                        type="button"
                        className={`text-2xl ${star <= currentTestimonial.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                        onClick={() => setCurrentTestimonial({...currentTestimonial, rating: star})}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Foto</label>
                  <div className="flex items-start space-x-4">
                    <div className="w-24 h-24 bg-gray-200 rounded-full overflow-hidden flex items-center justify-center">
                      {currentTestimonial.image ? (
                        <img src={currentTestimonial.image} alt={currentTestimonial.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-gray-400 text-xs">Sem foto</span>
                      )}
                    </div>
                    <div className="space-y-2">
                      <button 
                        type="button"
                        className="flex items-center px-3 py-1.5 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors duration-300 text-sm"
                      >
                        <FaPlus className="mr-2" /> Escolher Foto
                      </button>
                      {currentTestimonial.image && (
                        <button 
                          type="button"
                          className="flex items-center px-3 py-1.5 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors duration-300 text-sm"
                          onClick={() => setCurrentTestimonial({...currentTestimonial, image: ""})}
                        >
                          <FaTrash className="mr-2" /> Remover
                        </button>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex space-x-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="active"
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      checked={currentTestimonial.active}
                      onChange={(e) => setCurrentTestimonial({...currentTestimonial, active: e.target.checked})}
                    />
                    <label htmlFor="active" className="ml-2 text-sm text-gray-700">Ativo</label>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="featured"
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      checked={currentTestimonial.featured}
                      onChange={(e) => setCurrentTestimonial({...currentTestimonial, featured: e.target.checked})}
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
