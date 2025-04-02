"use client";

import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit, 
  serverTimestamp,
  writeBatch,
  setDoc
} from 'firebase/firestore';
import { db } from './firebase';
import { getFromCache, setInCache, withCache } from './cacheUtils';

// Cache TTL em minutos para diferentes tipos de dados
const CACHE_TTL = {
  DEFAULT: 5,        // 5 minutos para dados gerais
  STATIC: 240,       // 4 horas para dados que raramente mudam
  STATISTICS: 10,    // 10 minutos para estatísticas
  AVAILABILITY: 60   // 1 hora para disponibilidade
};

// Verifica se uma coleção existe (com cache)
export const checkCollectionExists = async (collectionName) => {
  const cacheKey = `collection_exists_${collectionName}`;
  
  // Verificar cache primeiro
  const cachedResult = getFromCache(cacheKey);
  if (cachedResult !== null) {
    return cachedResult;
  }
  
  try {
    const collectionRef = collection(db, collectionName);
    const snapshot = await getDocs(query(collectionRef, limit(1)));
    const exists = !snapshot.empty;
    
    // Armazenar em cache por 1 hora (raramente muda)
    setInCache(cacheKey, exists, 60);
    
    return exists;
  } catch (error) {
    console.error(`Erro ao verificar existência da coleção ${collectionName}:`, error);
    return false;
  }
};

// Função para obter todos os documentos de uma coleção (com cache)
export const getCollection = async (collectionName, cacheTtl = CACHE_TTL.DEFAULT) => {
  const cacheKey = `collection_${collectionName}`;
  
  return withCache(cacheKey, async () => {
    try {
      const collectionRef = collection(db, collectionName);
      const snapshot = await getDocs(collectionRef);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error(`Erro ao buscar coleção ${collectionName}:`, error);
      return [];
    }
  }, cacheTtl);
};

// Função para obter um documento específico (com cache)
export const getDocument = async (collectionName, docId, cacheTtl = CACHE_TTL.DEFAULT) => {
  const cacheKey = `document_${collectionName}_${docId}`;
  
  return withCache(cacheKey, async () => {
    try {
      const docRef = doc(db, collectionName, docId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data()
        };
      } else {
        return null;
      }
    } catch (error) {
      console.error(`Erro ao buscar documento ${docId} da coleção ${collectionName}:`, error);
      return null;
    }
  }, cacheTtl);
};

// Função para adicionar um novo documento
export const addDocument = async (collectionName, data) => {
  try {
    const collectionRef = collection(db, collectionName);
    const docRef = await addDoc(collectionRef, {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return docRef.id;
  } catch (error) {
    console.error(`Erro ao adicionar documento à coleção ${collectionName}:`, error);
    throw error;
  }
};

// Função para atualizar um documento
export const updateDocument = async (collectionName, docId, data) => {
  try {
    const docRef = doc(db, collectionName, docId);
    await updateDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp()
    });
    return true;
  } catch (error) {
    console.error(`Erro ao atualizar documento ${docId} da coleção ${collectionName}:`, error);
    throw error;
  }
};

// Função para excluir um documento
export const deleteDocument = async (collectionName, docId) => {
  try {
    const docRef = doc(db, collectionName, docId);
    await deleteDoc(docRef);
    return true;
  } catch (error) {
    console.error(`Erro ao excluir documento ${docId} da coleção ${collectionName}:`, error);
    throw error;
  }
};

// Função para consultar documentos com filtros (com cache)
export const queryDocuments = async (collectionName, conditions = [], sortBy = null, limitCount = null, cacheTtl = CACHE_TTL.DEFAULT) => {
  // Criar uma chave de cache baseada nos parâmetros da consulta
  const cacheKey = `query_${collectionName}_${JSON.stringify(conditions)}_${JSON.stringify(sortBy)}_${limitCount}`;
  
  return withCache(cacheKey, async () => {
    try {
      let collectionRef = collection(db, collectionName);
      let queryConstraints = [];
      
      // Adiciona condições de filtro
      if (conditions.length > 0) {
        conditions.forEach(condition => {
          queryConstraints.push(where(condition.field, condition.operator, condition.value));
        });
      }
      
      // Adiciona ordenação
      if (sortBy) {
        queryConstraints.push(orderBy(sortBy.field, sortBy.direction || 'asc'));
      }
      
      // Adiciona limite
      if (limitCount) {
        queryConstraints.push(limit(limitCount));
      }
      
      const q = query(collectionRef, ...queryConstraints);
      const snapshot = await getDocs(q);
      
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error(`Erro ao consultar coleção ${collectionName}:`, error);
      return [];
    }
  }, cacheTtl);
};

// Função para criar ou atualizar um documento com ID específico
export const setDocument = async (collectionName, docId, data) => {
  try {
    const docRef = doc(db, collectionName, docId);
    await setDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp()
    }, { merge: true });
    return true;
  } catch (error) {
    console.error(`Erro ao criar/atualizar documento ${docId} na coleção ${collectionName}:`, error);
    throw error;
  }
};

// Função para realizar múltiplas operações em lote (economiza leituras/escritas)
export const batchUpdate = async (operations) => {
  try {
    const batch = writeBatch(db);
    
    operations.forEach(op => {
      const docRef = doc(db, op.collection, op.docId);
      
      switch (op.type) {
        case 'set':
          batch.set(docRef, {
            ...op.data,
            updatedAt: serverTimestamp()
          }, { merge: op.merge !== false });
          break;
        case 'update':
          batch.update(docRef, {
            ...op.data,
            updatedAt: serverTimestamp()
          });
          break;
        case 'delete':
          batch.delete(docRef);
          break;
        default:
          console.warn(`Tipo de operação desconhecido: ${op.type}`);
      }
    });
    
    await batch.commit();
    return true;
  } catch (error) {
    console.error('Erro ao executar operações em lote:', error);
    throw error;
  }
};
