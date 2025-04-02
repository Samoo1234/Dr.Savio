"use client";

import { initializeApp, getApps } from 'firebase/app';
import { 
  getFirestore, 
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

// Remover a chamada para enableIndexedDbPersistence que está causando o erro
// A persistência já está configurada acima com persistentLocalCache

// Inicializar outros serviços do Firebase
const auth = getAuth(firebaseApp);
const storage = getStorage(firebaseApp);

export { db, auth, storage, firebaseApp };
