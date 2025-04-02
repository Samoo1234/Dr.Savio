// Script para criar a coleção 'testimonials' no Firestore
import { db } from '../lib/firebase';
import { collection, doc, setDoc } from 'firebase/firestore';

/**
 * Cria a coleção 'testimonials' no Firestore com um documento de estrutura
 */
export const createTestimonialsCollection = async () => {
  try {
    // Referência para a coleção
    const collectionRef = collection(db, 'testimonials');
    
    // Criar um documento temporário com ID 'structure'
    await setDoc(doc(collectionRef, 'structure'), {
      _info: 'Esta coleção foi criada automaticamente',
      _createdAt: new Date(),
      _collectionType: 'testimonials'
    });
    
    console.log('Coleção testimonials criada com sucesso!');
    return true;
  } catch (error) {
    console.error('Erro ao criar coleção testimonials:', error);
    return false;
  }
};

export default createTestimonialsCollection;
