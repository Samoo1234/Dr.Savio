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
  serverTimestamp 
} from 'firebase/firestore';
import { db } from './firebase';

// Função para obter todos os documentos de uma coleção
export const getCollection = async (collectionName) => {
  try {
    const collectionRef = collection(db, collectionName);
    const snapshot = await getDocs(collectionRef);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error(`Erro ao buscar coleção ${collectionName}:`, error);
    // Retornar array vazio em vez de lançar erro
    return [];
  }
};

// Função para obter um documento específico
export const getDocument = async (collectionName, docId) => {
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
    // Retornar null em vez de lançar erro
    return null;
  }
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

// Função para consultar documentos com filtros
export const queryDocuments = async (collectionName, conditions = [], sortBy = null, limitCount = null) => {
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
    // Retornar array vazio em vez de lançar erro
    return [];
  }
};
