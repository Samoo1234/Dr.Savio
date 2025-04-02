"use client";

import { useState, useEffect } from 'react';
import { getCollection, queryDocuments } from '../lib/firestore';
import { db } from '../lib/firebase';
import { collection, getDocs, query, limit as firestoreLimit, onSnapshot } from 'firebase/firestore';

// Cache local para armazenar resultados e reduzir consultas ao Firestore
const cache = {
  collections: {},
  timestamp: {}
};

// Tempo de expiração do cache em milissegundos (5 minutos)
const CACHE_EXPIRATION = 5 * 60 * 1000;

// Função para verificar se uma coleção existe
const checkCollectionExists = async (collectionName) => {
  try {
    // Verificar se temos no cache primeiro
    if (cache.collections[collectionName] && 
        Date.now() - cache.timestamp[collectionName] < CACHE_EXPIRATION) {
      return true;
    }
    
    const q = query(collection(db, collectionName), firestoreLimit(1));
    const snapshot = await getDocs(q);
    const exists = !snapshot.empty;
    
    // Atualizar cache
    if (exists) {
      cache.collections[collectionName] = true;
      cache.timestamp[collectionName] = Date.now();
    }
    
    return exists;
  } catch (error) {
    console.error(`Erro ao verificar coleção ${collectionName}:`, error);
    return false;
  }
};

// Hook personalizado para buscar dados do Firebase com cache
export function useFirebaseCollection(collectionName, options = {}) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [collectionExists, setCollectionExists] = useState(true);
  
  // Usar um intervalo de atualização mais longo para economizar cota
  const refreshInterval = options.refreshInterval || 300000; // 5 minutos por padrão

  useEffect(() => {
    let unsubscribe = null;
    let intervalId = null;
    
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Verificar se a coleção existe
        const exists = await checkCollectionExists(collectionName);
        setCollectionExists(exists);
        
        if (!exists) {
          console.log(`Coleção ${collectionName} não existe ou está vazia. Retornando array vazio.`);
          setData([]);
          setError(null);
          setLoading(false);
          return;
        }
        
        // Verificar se temos dados em cache válidos
        if (cache.collections[collectionName] && 
            cache.collections[collectionName].data &&
            Date.now() - cache.collections[collectionName].timestamp < CACHE_EXPIRATION) {
          console.log(`Usando dados em cache para ${collectionName}`);
          setData(cache.collections[collectionName].data);
          setLoading(false);
          return;
        }
        
        // Se não tiver cache ou estiver expirado, buscar dados
        let result;
        
        if (options.query) {
          result = await queryDocuments(
            collectionName, 
            options.query.conditions, 
            options.query.sortBy, 
            options.query.limit
          );
        } else {
          result = await getCollection(collectionName);
        }
        
        // Atualizar cache
        if (!cache.collections[collectionName]) {
          cache.collections[collectionName] = {};
        }
        cache.collections[collectionName].data = result;
        cache.collections[collectionName].timestamp = Date.now();
        
        setData(result);
        setError(null);
      } catch (err) {
        console.error(`Erro ao buscar dados da coleção ${collectionName}:`, err);
        setError(err.message);
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    // Buscar dados inicialmente
    fetchData();
    
    // Configurar intervalo de atualização se necessário
    // Usar um intervalo mais longo para economizar cota
    if (refreshInterval && collectionExists) {
      intervalId = setInterval(fetchData, refreshInterval);
    }
    
    return () => {
      if (unsubscribe) unsubscribe();
      if (intervalId) clearInterval(intervalId);
    };
  }, [collectionName, options.query]);

  return { data, loading, error, collectionExists };
}

// Hook para buscar mensagens
export function useMessages(limit = 5) {
  return useFirebaseCollection('messages', {
    query: {
      sortBy: { field: 'createdAt', direction: 'desc' },
      limit
    },
    refreshInterval: 300000 // Atualiza a cada 5 minutos para economizar cota
  });
}

// Hook para buscar consultas
export function useAppointments(limit = 5) {
  return useFirebaseCollection('appointments', {
    query: {
      conditions: [
        { field: 'date', operator: '>=', value: new Date() }
      ],
      sortBy: { field: 'date', direction: 'asc' },
      limit
    },
    refreshInterval: 300000 // Atualiza a cada 5 minutos para economizar cota
  });
}

// Hook para buscar estatísticas
export function useStats() {
  const [stats, setStats] = useState([
    { title: 'Visitantes', value: '0', icon: 'FaEye', change: '0%', color: 'bg-blue-500' },
    { title: 'Consultas', value: '0', icon: 'FaCalendarAlt', change: '0%', color: 'bg-green-500' },
    { title: 'Mensagens', value: '0', icon: 'FaComments', change: '0%', color: 'bg-yellow-500' },
    { title: 'Pacientes', value: '0', icon: 'FaUsers', change: '0%', color: 'bg-purple-500' },
  ]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Chave de cache para estatísticas
  const STATS_CACHE_KEY = 'stats_data';

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Verificar se temos dados em cache válidos
        const cachedStats = localStorage.getItem(STATS_CACHE_KEY);
        if (cachedStats) {
          const { data, timestamp } = JSON.parse(cachedStats);
          // Se o cache for válido (menos de 5 minutos), use-o
          if (Date.now() - timestamp < CACHE_EXPIRATION) {
            setStats(data);
            setLoading(false);
            return;
          }
        }
        
        setLoading(true);
        
        // Verificar se as coleções existem
        const visitorsExists = await checkCollectionExists('visitors');
        const appointmentsExists = await checkCollectionExists('appointments');
        const messagesExists = await checkCollectionExists('messages');
        const patientsExists = await checkCollectionExists('patients');
        
        // Se nenhuma coleção existir, não tente buscar dados
        if (!visitorsExists && !appointmentsExists && !messagesExists && !patientsExists) {
          console.log('Nenhuma coleção existe. Mantendo valores padrão.');
          setLoading(false);
          return;
        }
        
        // Buscar dados apenas das coleções que existem
        const visitors = visitorsExists ? await getCollection('visitors') : [];
        const appointments = appointmentsExists ? await getCollection('appointments') : [];
        const messages = messagesExists ? await getCollection('messages') : [];
        const patients = patientsExists ? await getCollection('patients') : [];
        
        // Atualizar estatísticas
        const newStats = [
          { title: 'Visitantes', value: visitors.length.toString(), icon: 'FaEye', change: '+12%', color: 'bg-blue-500' },
          { title: 'Consultas', value: appointments.length.toString(), icon: 'FaCalendarAlt', change: '+8%', color: 'bg-green-500' },
          { title: 'Mensagens', value: messages.length.toString(), icon: 'FaComments', change: '+5%', color: 'bg-yellow-500' },
          { title: 'Pacientes', value: patients.length.toString(), icon: 'FaUsers', change: '+15%', color: 'bg-purple-500' },
        ];
        
        // Salvar no cache
        localStorage.setItem(STATS_CACHE_KEY, JSON.stringify({
          data: newStats,
          timestamp: Date.now()
        }));
        
        setStats(newStats);
        setError(null);
      } catch (err) {
        console.error('Erro ao buscar estatísticas:', err);
        setError(err.message);
        // Manter os valores padrão em caso de erro
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
    
    // Atualizar estatísticas a cada 10 minutos para economizar cota
    const intervalId = setInterval(fetchStats, 600000);
    
    return () => clearInterval(intervalId);
  }, []);

  return { stats, loading, error };
}
