"use client";

import { initializeApp, getApps } from 'firebase/app';
import { 
  getFirestore, 
  enableIndexedDbPersistence, 
  CACHE_SIZE_UNLIMITED,
  initializeFirestore,
  persistentLocalCache,
  persistentSingleTabManager
} from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

// Configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAIbcw47rDwqDNrhEHMAmQ_ZGTVG35wfus",
  authDomain: "dr-savio.firebaseapp.com",
  projectId: "dr-savio",
  storageBucket: "dr-savio.firebasestorage.app",
  messagingSenderId: "71626518369",
  appId: "1:71626518369:web:fef705f2f54cb2e307df20"
};

// Inicializar Firebase com configurações otimizadas
let firebaseApp;
if (!getApps().length) {
  firebaseApp = initializeApp(firebaseConfig);
} else {
  firebaseApp = getApps()[0];
}

// Inicializar Firestore com configurações extremamente otimizadas para economizar cota
const db = initializeFirestore(firebaseApp, {
  // Usar cache local persistente com gerenciamento de uma única aba
  localCache: persistentLocalCache({
    tabManager: persistentSingleTabManager(),
    cacheSizeBytes: CACHE_SIZE_UNLIMITED
  })
});

// Tentar habilitar persistência para funcionamento offline
// Isso reduz drasticamente o número de leituras ao servidor
try {
  enableIndexedDbPersistence(db).catch((err) => {
    if (err.code === 'failed-precondition') {
      console.warn('Persistência não pôde ser ativada porque múltiplas abas estão abertas');
    } else if (err.code === 'unimplemented') {
      console.warn('O navegador atual não suporta todos os recursos necessários');
    }
  });
} catch (error) {
  console.warn('Erro ao configurar persistência:', error);
}

// Inicializar Auth e Storage
const auth = getAuth(firebaseApp);
const storage = getStorage(firebaseApp);

// Exportar instâncias
export { db, auth, storage, firebaseApp };
