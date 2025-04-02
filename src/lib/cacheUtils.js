"use client";

/**
 * Utilitários para gerenciar cache e reduzir consultas ao Firestore
 * Implementa um sistema de cache em memória e localStorage para economizar cota do Firestore
 */

// Cache em memória para armazenar resultados de consultas
const memoryCache = new Map();

/**
 * Obtém um valor do cache
 * @param {string} key - Chave do cache
 * @returns {any|null} - Valor armazenado ou null se não existir ou estiver expirado
 */
export const getFromCache = (key) => {
  // Primeiro, tentar obter do cache em memória
  if (memoryCache.has(key)) {
    const cachedItem = memoryCache.get(key);
    if (cachedItem.expiry > Date.now()) {
      return cachedItem.data;
    }
    // Se expirado, remover do cache
    memoryCache.delete(key);
  }
  
  // Se não estiver no cache em memória, tentar localStorage
  try {
    const item = localStorage.getItem(`cache_${key}`);
    if (item) {
      const parsedItem = JSON.parse(item);
      if (parsedItem.expiry > Date.now()) {
        // Adicionar ao cache em memória também
        memoryCache.set(key, {
          data: parsedItem.data,
          expiry: parsedItem.expiry
        });
        return parsedItem.data;
      } else {
        // Se expirado, remover do localStorage
        localStorage.removeItem(`cache_${key}`);
      }
    }
  } catch (error) {
    console.warn('Erro ao acessar localStorage:', error);
  }
  
  return null;
};

/**
 * Armazena um valor no cache
 * @param {string} key - Chave do cache
 * @param {any} data - Dados a serem armazenados
 * @param {number} ttlMinutes - Tempo de vida em minutos (padrão: 5 minutos)
 */
export const setInCache = (key, data, ttlMinutes = 5) => {
  const expiry = Date.now() + (ttlMinutes * 60 * 1000);
  
  // Armazenar no cache em memória
  memoryCache.set(key, { data, expiry });
  
  // Armazenar no localStorage para persistência entre recarregamentos
  try {
    localStorage.setItem(`cache_${key}`, JSON.stringify({ data, expiry }));
  } catch (error) {
    console.warn('Erro ao armazenar no localStorage:', error);
  }
};

/**
 * Remove um item do cache
 * @param {string} key - Chave do cache
 */
export const removeFromCache = (key) => {
  // Remover do cache em memória
  memoryCache.delete(key);
  
  // Remover do localStorage
  try {
    localStorage.removeItem(`cache_${key}`);
  } catch (error) {
    console.warn('Erro ao remover do localStorage:', error);
  }
};

/**
 * Limpa todo o cache
 */
export const clearCache = () => {
  // Limpar cache em memória
  memoryCache.clear();
  
  // Limpar cache no localStorage
  try {
    const keys = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key.startsWith('cache_')) {
        keys.push(key);
      }
    }
    
    keys.forEach(key => localStorage.removeItem(key));
  } catch (error) {
    console.warn('Erro ao limpar cache no localStorage:', error);
  }
};

/**
 * Função para executar uma operação com cache
 * @param {string} cacheKey - Chave para o cache
 * @param {Function} fetchFunction - Função que retorna uma Promise com os dados
 * @param {number} ttlMinutes - Tempo de vida em minutos (padrão: 5 minutos)
 * @returns {Promise<any>} - Dados do cache ou da função de busca
 */
export const withCache = async (cacheKey, fetchFunction, ttlMinutes = 5) => {
  // Verificar se os dados estão em cache
  const cachedData = getFromCache(cacheKey);
  if (cachedData !== null) {
    return { data: cachedData, fromCache: true };
  }
  
  // Se não estiver em cache, buscar os dados
  const data = await fetchFunction();
  
  // Armazenar em cache
  setInCache(cacheKey, data, ttlMinutes);
  
  return { data, fromCache: false };
};
