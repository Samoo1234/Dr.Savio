// Script para criar a coleção 'services' no Firestore
import { db } from '../lib/firebase';
import { collection, doc, setDoc } from 'firebase/firestore';

/**
 * Cria a coleção 'services' no Firestore com um documento de estrutura
 */
export const createServicesCollection = async () => {
  try {
    // Referência para a coleção
    const collectionRef = collection(db, 'services');
    
    // Criar um documento temporário com ID 'structure'
    await setDoc(doc(collectionRef, 'structure'), {
      _info: 'Esta coleção foi criada automaticamente',
      _createdAt: new Date(),
      _collectionType: 'services'
    });
    
    console.log('Coleção services criada com sucesso!');
    return true;
  } catch (error) {
    console.error('Erro ao criar coleção services:', error);
    return false;
  }
};

export default createServicesCollection;
