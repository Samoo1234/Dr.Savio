"use client";

import { db } from '../lib/firebase';
import { collection, addDoc, getDocs, query, limit } from 'firebase/firestore';

// Função para verificar se uma coleção já tem documentos
const collectionHasDocuments = async (collectionName) => {
  try {
    const q = query(collection(db, collectionName), limit(1));
    const snapshot = await getDocs(q);
    return !snapshot.empty;
  } catch (error) {
    console.error(`Erro ao verificar coleção ${collectionName}:`, error);
    return false;
  }
};

// Função para inicializar uma coleção com dados de exemplo
const initializeCollection = async (collectionName, data) => {
  try {
    // Verifica se a coleção já tem documentos
    const hasDocuments = await collectionHasDocuments(collectionName);
    
    if (hasDocuments) {
      console.log(`Coleção ${collectionName} já possui documentos. Pulando inicialização.`);
      return;
    }
    
    // Adiciona os documentos de exemplo
    console.log(`Inicializando coleção ${collectionName} com ${data.length} documentos...`);
    
    for (const item of data) {
      await addDoc(collection(db, collectionName), {
        ...item,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }
    
    console.log(`Coleção ${collectionName} inicializada com sucesso!`);
  } catch (error) {
    console.error(`Erro ao inicializar coleção ${collectionName}:`, error);
  }
};

// Dados de exemplo para cada coleção
const exampleData = {
  appointments: [
    {
      patientName: 'Roberto Almeida',
      date: new Date('2025-04-15T09:00:00'),
      type: 'initial',
      notes: 'Primeira consulta',
      status: 'scheduled'
    },
    {
      patientName: 'Fernanda Lima',
      date: new Date('2025-04-15T11:30:00'),
      type: 'followup',
      notes: 'Retorno de exames',
      status: 'scheduled'
    },
    {
      patientName: 'Pedro Souza',
      date: new Date('2025-04-16T14:00:00'),
      type: 'exam',
      notes: 'Exame de rotina',
      status: 'scheduled'
    },
    {
      patientName: 'Juliana Costa',
      date: new Date('2025-04-16T16:30:00'),
      type: 'initial',
      notes: 'Primeira consulta',
      status: 'scheduled'
    }
  ],
  
  messages: [
    {
      name: 'Maria Silva',
      email: 'maria@email.com',
      subject: 'Dúvida sobre consulta',
      message: 'Olá, gostaria de saber mais informações sobre as consultas.',
      status: 'unread'
    },
    {
      name: 'João Santos',
      email: 'joao@email.com',
      subject: 'Agendamento',
      message: 'Preciso agendar uma consulta para a próxima semana.',
      status: 'read'
    },
    {
      name: 'Ana Oliveira',
      email: 'ana@email.com',
      subject: 'Informações sobre tratamento',
      message: 'Gostaria de mais informações sobre o tratamento oferecido.',
      status: 'replied'
    },
    {
      name: 'Carlos Pereira',
      email: 'carlos@email.com',
      subject: 'Cancelamento',
      message: 'Preciso cancelar minha consulta agendada para amanhã.',
      status: 'read'
    }
  ],
  
  patients: [
    {
      name: 'Roberto Almeida',
      email: 'roberto@email.com',
      phone: '(11) 98765-4321',
      birthDate: new Date('1980-05-15'),
      address: 'Rua das Flores, 123 - São Paulo/SP',
      notes: 'Paciente com histórico de hipertensão'
    },
    {
      name: 'Fernanda Lima',
      email: 'fernanda@email.com',
      phone: '(11) 91234-5678',
      birthDate: new Date('1992-08-22'),
      address: 'Av. Paulista, 1000 - São Paulo/SP',
      notes: 'Primeira consulta em 10/03/2025'
    },
    {
      name: 'Pedro Souza',
      email: 'pedro@email.com',
      phone: '(11) 92345-6789',
      birthDate: new Date('1975-12-10'),
      address: 'Rua Augusta, 500 - São Paulo/SP',
      notes: 'Alérgico a penicilina'
    },
    {
      name: 'Juliana Costa',
      email: 'juliana@email.com',
      phone: '(11) 93456-7890',
      birthDate: new Date('1988-03-25'),
      address: 'Rua Oscar Freire, 200 - São Paulo/SP',
      notes: 'Paciente nova'
    }
  ],
  
  visitors: [
    { date: new Date('2025-04-01'), count: 45 },
    { date: new Date('2025-04-02'), count: 52 },
    { date: new Date('2025-04-03'), count: 48 },
    { date: new Date('2025-04-04'), count: 60 },
    { date: new Date('2025-04-05'), count: 55 },
    { date: new Date('2025-04-06'), count: 40 },
    { date: new Date('2025-04-07'), count: 65 }
  ]
};

// Função principal para inicializar todas as coleções
export const initializeFirestore = async () => {
  console.log('Iniciando inicialização do Firestore...');
  
  try {
    // Inicializa cada coleção
    for (const [collectionName, data] of Object.entries(exampleData)) {
      await initializeCollection(collectionName, data);
    }
    
    console.log('Inicialização do Firestore concluída com sucesso!');
    return { success: true };
  } catch (error) {
    console.error('Erro durante a inicialização do Firestore:', error);
    return { success: false, error };
  }
};

// Exporta os dados de exemplo para uso em outros lugares
export const sampleData = exampleData;
