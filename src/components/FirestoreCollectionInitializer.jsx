"use client";

import { useState } from 'react';
import { createFirestoreCollections } from '../scripts/createFirestoreCollections';

/**
 * Componente para inicializar as coleções do Firestore
 * Pode ser adicionado temporariamente à página de administração
 */
const FirestoreCollectionInitializer = () => {
  const [isCreating, setIsCreating] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleCreateCollections = async () => {
    try {
      setIsCreating(true);
      setResult(null);
      setError(null);
      
      const success = await createFirestoreCollections();
      
      if (success) {
        setResult('Coleções criadas com sucesso! Você pode adicionar seus próprios dados de teste agora.');
      } else {
        setError('Ocorreu um erro ao criar as coleções. Verifique o console para mais detalhes.');
      }
    } catch (err) {
      console.error('Erro ao criar coleções:', err);
      setError(`Erro: ${err.message}`);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Inicializar Coleções do Firestore</h2>
      <p className="text-gray-600 mb-4">
        Este componente criará as coleções necessárias no Firestore para o funcionamento do dashboard.
        Nenhum dado será adicionado, apenas a estrutura das coleções será criada.
      </p>
      
      <button
        onClick={handleCreateCollections}
        disabled={isCreating}
        className={`px-4 py-2 rounded ${
          isCreating 
            ? 'bg-gray-400 cursor-not-allowed' 
            : 'bg-blue-500 hover:bg-blue-600 text-white'
        }`}
      >
        {isCreating ? 'Criando coleções...' : 'Criar Coleções'}
      </button>
      
      {result && (
        <div className="mt-4 p-3 bg-green-100 text-green-700 rounded">
          {result}
        </div>
      )}
      
      {error && (
        <div className="mt-4 p-3 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}
      
      <div className="mt-4 text-sm text-gray-500">
        <h3 className="font-medium">Coleções que serão criadas:</h3>
        <ul className="list-disc pl-5 mt-2">
          <li>visitors - Para registrar visitantes do site</li>
          <li>appointments - Para armazenar consultas agendadas</li>
          <li>messages - Para mensagens de contato</li>
          <li>patients - Para cadastro de pacientes</li>
        </ul>
      </div>
    </div>
  );
};

export default FirestoreCollectionInitializer;
