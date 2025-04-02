"use client";

import { useState } from 'react';
import { initializeFirestore } from '../scripts/initializeFirestore';

export default function FirestoreInitializer() {
  const [isInitializing, setIsInitializing] = useState(false);
  const [result, setResult] = useState(null);

  const handleInitialize = async () => {
    setIsInitializing(true);
    setResult(null);
    
    try {
      const initResult = await initializeFirestore();
      setResult({
        success: initResult.success,
        message: initResult.success 
          ? 'Firestore inicializado com sucesso!' 
          : `Erro ao inicializar Firestore: ${initResult.error}`
      });
    } catch (error) {
      setResult({
        success: false,
        message: `Erro inesperado: ${error.message}`
      });
    } finally {
      setIsInitializing(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-white rounded-lg shadow-lg p-4 max-w-sm">
        <h3 className="text-lg font-semibold mb-2">Inicializar Firestore</h3>
        <p className="text-sm text-gray-600 mb-4">
          Inicialize o banco de dados Firestore com dados de exemplo para testar a aplicação.
        </p>
        
        {result && (
          <div className={`p-3 mb-3 rounded-md ${result.success ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {result.message}
          </div>
        )}
        
        <button
          onClick={handleInitialize}
          disabled={isInitializing}
          className="w-full py-2 px-4 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isInitializing ? 'Inicializando...' : 'Inicializar Firestore'}
        </button>
      </div>
    </div>
  );
}
