// Script para criar as coleções necessárias no Firestore
import { db } from '../lib/firebase';
import { collection, doc, setDoc } from 'firebase/firestore';

/**
 * Cria as coleções necessárias no Firestore sem adicionar documentos
 * Isso garante que as coleções existam com a estrutura correta
 */
export const createFirestoreCollections = async () => {
  try {
    console.log('Iniciando criação das coleções no Firestore...');
    
    // Lista de coleções a serem criadas
    const collections = [
      'visitors',     // Visitantes do site
      'appointments', // Consultas agendadas
      'messages',     // Mensagens de contato
      'patients'      // Pacientes cadastrados
    ];
    
    // Criar cada coleção com um documento temporário
    // Isso é necessário porque o Firestore só cria coleções quando há pelo menos um documento
    for (const collectionName of collections) {
      console.log(`Criando coleção: ${collectionName}`);
      
      // Referência para a coleção
      const collectionRef = collection(db, collectionName);
      
      // Criar um documento temporário com ID 'structure'
      // Este documento serve apenas para garantir que a coleção exista
      await setDoc(doc(collectionRef, 'structure'), {
        _info: 'Esta coleção foi criada automaticamente',
        _createdAt: new Date(),
        _collectionType: collectionName
      });
      
      console.log(`Coleção ${collectionName} criada com sucesso!`);
    }
    
    console.log('Todas as coleções foram criadas com sucesso!');
    return true;
  } catch (error) {
    console.error('Erro ao criar coleções:', error);
    return false;
  }
};

// Estrutura esperada para cada coleção:

/*
visitors: {
  id: string,
  timestamp: Date,
  referrer: string (opcional),
  page: string (opcional),
  userAgent: string (opcional)
}

appointments: {
  id: string,
  patientName: string,
  patientEmail: string (opcional),
  patientPhone: string (opcional),
  date: Date,
  time: string,
  reason: string (opcional),
  status: string (agendada, confirmada, cancelada, concluída),
  notes: string (opcional)
}

messages: {
  id: string,
  name: string,
  email: string,
  phone: string (opcional),
  subject: string (opcional),
  message: string,
  createdAt: Date,
  status: string (opcional - lida, não lida, respondida)
}

patients: {
  id: string,
  name: string,
  email: string (opcional),
  phone: string (opcional),
  birthDate: Date (opcional),
  gender: string (opcional),
  address: {
    street: string (opcional),
    city: string (opcional),
    state: string (opcional),
    zipCode: string (opcional)
  } (opcional),
  medicalHistory: string (opcional),
  createdAt: Date
}
*/

export default createFirestoreCollections;
