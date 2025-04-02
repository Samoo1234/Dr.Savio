import { collection, doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';

const AVAILABILITY_COLLECTION = 'availability';
const CACHE_EXPIRATION = 4 * 60 * 60 * 1000; // 4 horas em milissegundos

// Interface para o cache
interface CacheItem {
  data: any;
  timestamp: number;
}

// Função para verificar se o cache é válido
const isCacheValid = (cacheKey: string): boolean => {
  const cachedData = localStorage.getItem(cacheKey);
  if (!cachedData) return false;
  
  try {
    const { timestamp } = JSON.parse(cachedData) as CacheItem;
    return Date.now() - timestamp < CACHE_EXPIRATION;
  } catch (error) {
    return false;
  }
};

// Função para obter dados do cache
const getFromCache = (cacheKey: string): any => {
  const cachedData = localStorage.getItem(cacheKey);
  if (!cachedData) return null;
  
  try {
    const { data } = JSON.parse(cachedData) as CacheItem;
    return data;
  } catch (error) {
    return null;
  }
};

// Função para salvar dados no cache
const saveToCache = (cacheKey: string, data: any): void => {
  const cacheItem: CacheItem = {
    data,
    timestamp: Date.now()
  };
  localStorage.setItem(cacheKey, JSON.stringify(cacheItem));
};

// Função para obter datas disponíveis
export const getAvailableDates = async (): Promise<string[]> => {
  const cacheKey = 'availableDates_cache';
  
  // Verificar cache primeiro
  if (isCacheValid(cacheKey)) {
    const cachedDates = getFromCache(cacheKey);
    if (cachedDates) return cachedDates;
  }
  
  try {
    const docRef = doc(db, AVAILABILITY_COLLECTION, 'dates');
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const dates = docSnap.data().dates || [];
      saveToCache(cacheKey, dates);
      return dates;
    } else {
      // Se o documento não existir, criar um vazio
      await setDoc(docRef, { 
        dates: [],
        updatedAt: serverTimestamp()
      });
      saveToCache(cacheKey, []);
      return [];
    }
  } catch (error) {
    console.error('Erro ao obter datas disponíveis:', error);
    // Em caso de erro, tentar usar o cache mesmo que expirado
    const cachedDates = getFromCache(cacheKey);
    return cachedDates || [];
  }
};

// Função para salvar datas disponíveis
export const saveAvailableDates = async (dates: string[]): Promise<boolean> => {
  try {
    const docRef = doc(db, AVAILABILITY_COLLECTION, 'dates');
    await setDoc(docRef, {
      dates,
      updatedAt: serverTimestamp()
    });
    
    // Atualizar o cache
    saveToCache('availableDates_cache', dates);
    return true;
  } catch (error) {
    console.error('Erro ao salvar datas disponíveis:', error);
    return false;
  }
};

// Função para obter cidades disponíveis
export const getAvailableCities = async (): Promise<string[]> => {
  const cacheKey = 'availableCities_cache';
  
  // Verificar cache primeiro
  if (isCacheValid(cacheKey)) {
    const cachedCities = getFromCache(cacheKey);
    if (cachedCities) return cachedCities;
  }
  
  try {
    const docRef = doc(db, AVAILABILITY_COLLECTION, 'cities');
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const cities = docSnap.data().cities || [];
      saveToCache(cacheKey, cities);
      return cities;
    } else {
      // Se o documento não existir, criar um vazio
      await setDoc(docRef, { 
        cities: [],
        updatedAt: serverTimestamp()
      });
      saveToCache(cacheKey, []);
      return [];
    }
  } catch (error) {
    console.error('Erro ao obter cidades disponíveis:', error);
    // Em caso de erro, tentar usar o cache mesmo que expirado
    const cachedCities = getFromCache(cacheKey);
    return cachedCities || [];
  }
};

// Função para salvar cidades disponíveis
export const saveAvailableCities = async (cities: string[]): Promise<boolean> => {
  try {
    const docRef = doc(db, AVAILABILITY_COLLECTION, 'cities');
    await setDoc(docRef, {
      cities,
      updatedAt: serverTimestamp()
    });
    
    // Atualizar o cache
    saveToCache('availableCities_cache', cities);
    return true;
  } catch (error) {
    console.error('Erro ao salvar cidades disponíveis:', error);
    return false;
  }
};

// Função para adicionar uma cidade (se não existir)
export const addCity = async (city: string): Promise<boolean> => {
  try {
    const cities = await getAvailableCities();
    if (!cities.includes(city)) {
      cities.push(city);
      return await saveAvailableCities(cities);
    }
    return true;
  } catch (error) {
    console.error('Erro ao adicionar cidade:', error);
    return false;
  }
};

// Função para remover uma cidade
export const removeCity = async (city: string): Promise<boolean> => {
  try {
    let cities = await getAvailableCities();
    cities = cities.filter(c => c !== city);
    return await saveAvailableCities(cities);
  } catch (error) {
    console.error('Erro ao remover cidade:', error);
    return false;
  }
};

// Função para adicionar uma data (se não existir)
export const addDate = async (date: string): Promise<boolean> => {
  try {
    const dates = await getAvailableDates();
    if (!dates.includes(date)) {
      dates.push(date);
      return await saveAvailableDates(dates);
    }
    return true;
  } catch (error) {
    console.error('Erro ao adicionar data:', error);
    return false;
  }
};

// Função para remover uma data
export const removeDate = async (date: string): Promise<boolean> => {
  try {
    let dates = await getAvailableDates();
    dates = dates.filter(d => d !== date);
    return await saveAvailableDates(dates);
  } catch (error) {
    console.error('Erro ao remover data:', error);
    return false;
  }
};
