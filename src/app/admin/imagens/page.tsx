import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaPlus, FaTrash, FaEdit, FaEye, FaFolder, FaImage } from 'react-icons/fa';

export default function ImagesGalleryPage() {
  // Estado para controlar a visualização e upload de imagens
  const [selectedFolder, setSelectedFolder] = useState('all');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' ou 'list'
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isImageViewerOpen, setIsImageViewerOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  
  // Dados fictícios para as pastas
  const folders = [
    { id: 'all', name: 'Todas as Imagens', count: 18 },
    { id: 'hero', name: 'Seção Hero', count: 3 },
    { id: 'about', name: 'Seção Sobre', count: 4 },
    { id: 'services', name: 'Seção Serviços', count: 6 },
    { id: 'testimonials', name: 'Depoimentos', count: 5 }
  ];
  
  // Dados fictícios para as imagens
  const images = [
    { id: 1, name: 'hero-bg.jpg', folder: 'hero', size: '1.2 MB', dimensions: '1920x1080', date: '30/03/2025', url: '/images/hero-bg.jpg' },
    { id: 2, name: 'doctor.jpg', folder: 'about', size: '850 KB', dimensions: '800x1200', date: '30/03/2025', url: '/images/doctor.jpg' },
    { id: 3, name: 'service-1.jpg', folder: 'services', size: '720 KB', dimensions: '600x400', date: '30/03/2025', url: '/images/service-1.jpg' },
    { id: 4, name: 'service-2.jpg', folder: 'services', size: '680 KB', dimensions: '600x400', date: '30/03/2025', url: '/images/service-2.jpg' },
    { id: 5, name: 'testimonial-1.jpg', folder: 'testimonials', size: '450 KB', dimensions: '400x400', date: '30/03/2025', url: '/images/testimonial-1.jpg' },
    { id: 6, name: 'testimonial-2.jpg', folder: 'testimonials', size: '430 KB', dimensions: '400x400', date: '30/03/2025', url: '/images/testimonial-2.jpg' },
  ];
  
  // Filtrar imagens com base na pasta selecionada
  const filteredImages = selectedFolder === 'all' 
    ? images 
    : images.filter(image => image.folder === selectedFolder);
  
  // Função para abrir o visualizador de imagem
  const openImageViewer = (image) => {
    setSelectedImage(image);
    setIsImageViewerOpen(true);
  };
  
  // Função para fechar o visualizador de imagem
  const closeImageViewer = () => {
    setIsImageViewerOpen(false);
    setSelectedImage(null);
  };
  
  // Função para abrir o modal de upload
  const openUploadModal = () => {
    setIsUploadModalOpen(true);
  };
  
  // Função para fechar o modal de upload
  const closeUploadModal = () => {
    setIsUploadModalOpen(false);
  };

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Galeria de Imagens</h1>
          <p className="text-gray-600">Gerencie as imagens utilizadas no site</p>
        </div>
        <button 
          onClick={openUploadModal}
          className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors duration-300"
        >
          <FaPlus className="mr-2" /> Fazer Upload
        </button>
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
                {folders.map(folder => (
                  <li key={folder.id}>
                    <button
                      onClick={() => setSelectedFolder(folder.id)}
                      className={`w-full flex items-center px-3 py-2 rounded-md transition-colors duration-200 ${
                        selectedFolder === folder.id 
                          ? 'bg-primary-50 text-primary-600' 
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <FaFolder className={`mr-2 ${selectedFolder === folder.id ? 'text-primary-500' : 'text-gray-400'}`} />
                      <span>{folder.name}</span>
                      <span className="ml-auto bg-gray-200 text-gray-700 text-xs rounded-full px-2 py-0.5">
                        {folder.count}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>

        {/* Conteúdo principal */}
        <div className="lg:col-span-3">
          <motion.div 
            className="bg-white rounded-lg shadow-md overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="font-semibold text-gray-800">
                {folders.find(f => f.id === selectedFolder)?.name || 'Todas as Imagens'}
              </h2>
              <div className="flex space-x-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md ${viewMode === 'grid' ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
                  title="Visualização em grade"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md ${viewMode === 'list' ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
                  title="Visualização em lista"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="p-6">
              {filteredImages.length === 0 ? (
                <div className="text-center py-12">
                  <FaImage className="mx-auto text-gray-300 text-5xl mb-4" />
                  <p className="text-gray-500">Nenhuma imagem encontrada nesta pasta.</p>
                  <button 
                    onClick={openUploadModal}
                    className="mt-4 inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors duration-300"
                  >
                    <FaPlus className="mr-2" /> Fazer Upload
                  </button>
                </div>
              ) : viewMode === 'grid' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {filteredImages.map(image => (
                    <motion.div 
                      key={image.id}
                      className="group relative rounded-lg overflow-hidden shadow-sm border border-gray-200"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="aspect-w-3 aspect-h-2 bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-400 text-xs">Imagem</span>
                        {/* Aqui seria exibida a imagem real */}
                        {/* <img src={image.url} alt={image.name} className="w-full h-full object-cover" /> */}
                      </div>
                      <div className="p-3">
                        <h3 className="text-sm font-medium text-gray-800 truncate">{image.name}</h3>
                        <p className="text-xs text-gray-500">{image.dimensions} • {image.size}</p>
                      </div>
                      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <div className="flex space-x-2">
                          <button 
                            onClick={() => openImageViewer(image)}
                            className="p-2 bg-white rounded-full text-gray-700 hover:text-primary-600"
                            title="Visualizar"
                          >
                            <FaEye />
                          </button>
                          <button 
                            className="p-2 bg-white rounded-full text-gray-700 hover:text-blue-600"
                            title="Editar"
                          >
                            <FaEdit />
                          </button>
                          <button 
                            className="p-2 bg-white rounded-full text-gray-700 hover:text-red-600"
                            title="Excluir"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pasta</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dimensões</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tamanho</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {filteredImages.map(image => (
                        <tr key={image.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="w-10 h-10 bg-gray-200 rounded flex items-center justify-center mr-3">
                                <FaImage className="text-gray-400" />
                                {/* <img src={image.url} alt={image.name} className="w-full h-full object-cover rounded" /> */}
                              </div>
                              <span className="text-sm font-medium text-gray-900">{image.name}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                            {folders.find(f => f.id === image.folder)?.name || image.folder}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{image.dimensions}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{image.size}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{image.date}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                            <div className="flex space-x-2">
                              <button 
                                onClick={() => openImageViewer(image)}
                                className="p-1 text-gray-600 hover:text-primary-600"
                                title="Visualizar"
                              >
                                <FaEye />
                              </button>
                              <button 
                                className="p-1 text-gray-600 hover:text-blue-600"
                                title="Editar"
                              >
                                <FaEdit />
                              </button>
                              <button 
                                className="p-1 text-gray-600 hover:text-red-600"
                                title="Excluir"
                              >
                                <FaTrash />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Modal de Upload de Imagem */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div 
            className="bg-white rounded-lg shadow-xl w-full max-w-md"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-800">Upload de Imagem</h3>
              <button 
                onClick={closeUploadModal}
                className="text-gray-400 hover:text-gray-600"
              >
                &times;
              </button>
            </div>
            
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Pasta</label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    {folders.filter(f => f.id !== 'all').map(folder => (
                      <option key={folder.id} value={folder.id}>{folder.name}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Imagem</label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                    <div className="space-y-1 text-center">
                      <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                        <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <div className="flex text-sm text-gray-600">
                        <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-primary-600 hover:text-primary-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500">
                          <span>Selecionar arquivo</span>
                          <input id="file-upload" name="file-upload" type="file" className="sr-only" />
                        </label>
                        <p className="pl-1">ou arraste e solte</p>
                      </div>
                      <p className="text-xs text-gray-500">
                        PNG, JPG, GIF até 2MB
                      </p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nome da Imagem (opcional)</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Ex: banner-principal.jpg"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Deixe em branco para usar o nome original do arquivo
                  </p>
                </div>
              </div>
            </div>
            
            <div className="border-t border-gray-200 px-6 py-4 flex justify-end">
              <button
                onClick={closeUploadModal}
                className="mr-3 px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-300"
              >
                Cancelar
              </button>
              <button
                className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors duration-300"
              >
                Fazer Upload
              </button>
            </div>
          </motion.div>
        </div>
      )}
      
      {/* Visualizador de Imagem */}
      {isImageViewerOpen && selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="max-w-4xl w-full p-4">
            <div className="bg-white rounded-lg shadow-xl overflow-hidden">
              <div className="border-b border-gray-200 px-6 py-4 flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-800">{selectedImage.name}</h3>
                <button 
                  onClick={closeImageViewer}
                  className="text-gray-400 hover:text-gray-600"
                >
                  &times;
                </button>
              </div>
              
              <div className="p-6">
                <div className="bg-gray-200 rounded-lg flex items-center justify-center" style={{ height: '400px' }}>
                  <span className="text-gray-400">Imagem</span>
                  {/* <img src={selectedImage.url} alt={selectedImage.name} className="max-h-full max-w-full object-contain" /> */}
                </div>
                
                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-700">Informações</h4>
                    <dl className="mt-2 text-sm">
                      <div className="flex justify-between py-1">
                        <dt className="text-gray-500">Dimensões:</dt>
                        <dd className="text-gray-900">{selectedImage.dimensions}</dd>
                      </div>
                      <div className="flex justify-between py-1">
                        <dt className="text-gray-500">Tamanho:</dt>
                        <dd className="text-gray-900">{selectedImage.size}</dd>
                      </div>
                      <div className="flex justify-between py-1">
                        <dt className="text-gray-500">Data:</dt>
                        <dd className="text-gray-900">{selectedImage.date}</dd>
                      </div>
                      <div className="flex justify-between py-1">
                        <dt className="text-gray-500">Pasta:</dt>
                        <dd className="text-gray-900">{folders.find(f => f.id === selectedImage.folder)?.name || selectedImage.folder}</dd>
                      </div>
                    </dl>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-700">URL da Imagem</h4>
                    <div className="mt-2">
                      <input
                        type="text"
                        value={selectedImage.url}
                        readOnly
                        className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md text-sm"
                      />
                    </div>
                    <div className="mt-4 flex space-x-2">
                      <button className="flex items-center px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-300 text-sm">
                        <FaEdit className="mr-1" /> Editar
                      </button>
                      <button className="flex items-center px-3 py-1.5 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors duration-300 text-sm">
                        <FaTrash className="mr-1" /> Excluir
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
