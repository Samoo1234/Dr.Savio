"use client";

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { FaPlus, FaEdit, FaTrash, FaSave, FaUndo, FaEye, FaStar, FaUpload } from 'react-icons/fa';
import DataTable from '../../../components/admin/DataTable';
import { db, storage } from '../../../lib/firebase';
import { collection, doc, addDoc, updateDoc, deleteDoc, getDocs, query, orderBy, serverTimestamp, Timestamp, DocumentData, FieldValue } from 'firebase/firestore';
import { createTestimonialsCollection } from '../../../scripts/createTestimonialsCollection';
import { uploadImageToStorage } from '../../../scripts/uploadImageToStorage';

// Define interface for testimonial data
interface Testimonial {
  id: string;
  name: string;
  role: string;
  image: string;
  content: string;
  rating: number;
  active: boolean;
  featured: boolean;
  date: string;
  createdAt?: Timestamp | Date;
  updatedAt?: Timestamp | FieldValue;
}

// Interface for Firestore document data
interface TestimonialData {
  name: string;
  role: string;
  image: string;
  content: string;
  rating: number;
  active: boolean;
  featured: boolean;
  date: string;
  createdAt?: FieldValue;
  updatedAt: FieldValue;
}

// Interface for uploaded image result
interface UploadedImage {
  id: string;
  url: string;
  name: string;
  [key: string]: any;
}

export default function TestimonialsPage() {
  // Estado para controlar o modal de edição
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState<Testimonial | null>(null);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Estados para upload de imagem
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Carregar depoimentos do Firebase ao montar o componente
  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        setIsLoading(true);
        const testimonialsCollection = collection(db, 'testimonials');
        const testimonialsQuery = query(testimonialsCollection, orderBy('createdAt', 'desc'));
        const snapshot = await getDocs(testimonialsQuery);
        
        const testimonialsData: Testimonial[] = snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            name: data.name || '',
            role: data.role || 'Paciente',
            image: data.image || '',
            content: data.content || '',
            rating: data.rating || 5,
            active: data.active !== undefined ? data.active : true,
            featured: data.featured || false,
            date: data.date || (data.createdAt ? new Date(data.createdAt.toDate()).toLocaleDateString('pt-BR') : new Date().toLocaleDateString('pt-BR')),
            createdAt: data.createdAt,
            updatedAt: data.updatedAt
          };
        });
        
        setTestimonials(testimonialsData);
        setError(null);
      } catch (err: any) {
        console.error('Erro ao carregar depoimentos:', err);
        setError('Falha ao carregar os depoimentos. Por favor, tente novamente.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchTestimonials();
  }, []);
  
  // Função para abrir o modal de edição
  const handleEdit = (testimonial: Testimonial) => {
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
  
  // Função para salvar o depoimento no Firebase
  const handleSave = async () => {
    try {
      // Validar campos obrigatórios
      if (!currentTestimonial || !currentTestimonial.name || !currentTestimonial.content) {
        alert('Por favor, preencha o nome e o conteúdo do depoimento.');
        return;
      }
      
      // Preparar dados para salvar
      const testimonialData: TestimonialData = {
        name: currentTestimonial.name,
        role: currentTestimonial.role || 'Paciente',
        image: currentTestimonial.image || '',
        content: currentTestimonial.content,
        rating: currentTestimonial.rating || 5,
        active: currentTestimonial.active,
        featured: currentTestimonial.featured,
        date: currentTestimonial.date,
        updatedAt: serverTimestamp()
      };
      
      if (currentTestimonial.id) {
        // Atualizar depoimento existente
        const testimonialRef = doc(db, 'testimonials', currentTestimonial.id);
        await updateDoc(testimonialRef, testimonialData as any);
        
        // Atualizar estado local
        setTestimonials(testimonials.map(testimonial => 
          testimonial.id === currentTestimonial.id ? { 
            ...testimonial, 
            ...testimonialData, 
            id: currentTestimonial.id,
            updatedAt: new Date() // Representação local
          } : testimonial
        ));
        
        console.log('Depoimento atualizado com sucesso!');
      } else {
        // Adicionar novo depoimento
        const newData = {
          ...testimonialData,
          createdAt: serverTimestamp()
        };
        
        try {
          // Tentar adicionar o documento
          const docRef = await addDoc(collection(db, 'testimonials'), newData as any);
          
          // Adicionar ao estado local
          const newTestimonial: Testimonial = {
            ...testimonialData,
            id: docRef.id,
            createdAt: new Date(), // Representação local para exibição imediata
            updatedAt: new Date()
          };
          
          setTestimonials([newTestimonial, ...testimonials]);
          console.log('Depoimento adicionado com sucesso!');
        } catch (error: any) {
          // Se falhar, tentar criar a coleção primeiro e depois adicionar o documento
          console.log('Tentando criar a coleção testimonials primeiro...');
          await createTestimonialsCollection();
          
          // Tentar adicionar o documento novamente
          const docRef = await addDoc(collection(db, 'testimonials'), newData as any);
          
          // Adicionar ao estado local
          const newTestimonial: Testimonial = {
            ...testimonialData,
            id: docRef.id,
            createdAt: new Date(), // Representação local para exibição imediata
            updatedAt: new Date()
          };
          
          setTestimonials([newTestimonial, ...testimonials]);
          console.log('Depoimento adicionado com sucesso após criar a coleção!');
        }
      }
      
      // Fechar modal e limpar depoimento atual
      setIsModalOpen(false);
      setCurrentTestimonial(null);
    } catch (error: any) {
      console.error('Erro ao salvar depoimento:', error);
      alert('Ocorreu um erro ao salvar o depoimento. Por favor, tente novamente.');
    }
  };
  
  // Função para excluir um depoimento
  const handleDelete = async (testimonialId: string) => {
    if (window.confirm('Tem certeza que deseja excluir este depoimento?')) {
      try {
        await deleteDoc(doc(db, 'testimonials', testimonialId));
        
        // Remover do estado local
        setTestimonials(testimonials.filter(testimonial => testimonial.id !== testimonialId));
        console.log('Depoimento excluído com sucesso!');
      } catch (error: any) {
        console.error('Erro ao excluir depoimento:', error);
        alert('Ocorreu um erro ao excluir o depoimento. Por favor, tente novamente.');
      }
    }
  };
  
  // Função para selecionar arquivo
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadFile(file);
      setUploadError(null);
    }
  };
  
  // Função para fazer upload da imagem
  const handleImageUpload = async () => {
    if (!uploadFile) {
      setUploadError('Por favor, selecione uma imagem para upload.');
      return;
    }
    
    try {
      setIsUploading(true);
      setUploadProgress(0);
      setUploadError(null);
      
      // Fazer upload da imagem para a pasta testimonials
      const uploadedImage = await uploadImageToStorage(
        uploadFile,
        'testimonials',
        undefined, // usar nome automático
        (progress: number) => setUploadProgress(progress)
      ) as UploadedImage;
      
      // Atualizar o testimonial com a URL da imagem
      if (currentTestimonial) {
        setCurrentTestimonial({
          ...currentTestimonial,
          image: uploadedImage.url
        });
      }
      
      // Resetar estados
      setUploadFile(null);
      setUploadProgress(0);
      setIsUploading(false);
      
      // Se o fileInputRef existir, limpar o valor
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      
    } catch (error: any) {
      console.error('Erro no upload:', error);
      setUploadError(error.message || 'Ocorreu um erro durante o upload. Por favor, tente novamente.');
      setIsUploading(false);
    }
  };
  
  // Função para acionar o input de arquivo
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  // Colunas para a tabela de depoimentos
  const columns = [
    {
      header: "Nome",
      accessor: "name",
    },
    {
      header: "Depoimento",
      accessor: "content",
      cell: (value: string) => (
        <div className="max-w-md truncate">{value}</div>
      )
    },
    {
      header: "Avaliação",
      accessor: "rating",
      cell: (value: number) => (
        <div className="flex text-yellow-500">
          {[...Array(5)].map((_, i) => (
            <span key={i}>
              {i < value ? <FaStar /> : <FaStar className="text-gray-300" />}
            </span>
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
      cell: (value: boolean) => (
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
      cell: (_, row: Testimonial) => (
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
          <h1 className="text-2xl font-bold text-gray-800">Gerenciar Depoimentos</h1>
          <p className="text-gray-600">Adicione, edite ou remova os depoimentos de pacientes</p>
        </div>
        <button 
          onClick={handleCreate}
          className="flex items-center px-5 py-3 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors duration-300 shadow-md text-lg font-medium w-full sm:w-auto justify-center sm:justify-start"
        >
          <FaPlus className="mr-2" size={18} /> Adicionar Depoimento
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
              data={testimonials} 
              emptyMessage="Nenhum depoimento cadastrado ainda. Clique em 'Adicionar Depoimento' para começar."
            />
          )}
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
                      <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        accept="image/*"
                        onChange={handleFileSelect}
                      />
                      <button 
                        type="button"
                        className="flex items-center px-3 py-1.5 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors duration-300 text-sm"
                        onClick={triggerFileInput}
                      >
                        <FaPlus className="mr-2" /> Escolher Foto
                      </button>
                      {uploadFile && !isUploading && (
                        <button 
                          type="button"
                          className="flex items-center px-3 py-1.5 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors duration-300 text-sm"
                          onClick={handleImageUpload}
                        >
                          <FaUpload className="mr-2" /> Fazer Upload
                        </button>
                      )}
                      {isUploading && (
                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-500">Enviando...</span>
                            <span className="text-xs text-gray-500">{Math.round(uploadProgress)}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-primary-600 h-2 rounded-full" 
                              style={{ width: `${uploadProgress}%` }}
                            ></div>
                          </div>
                        </div>
                      )}
                      {uploadError && (
                        <p className="text-xs text-red-500">{uploadError}</p>
                      )}
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
