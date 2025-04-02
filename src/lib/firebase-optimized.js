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

// Configuração do Firebase - substitua com suas novas credenciais
const firebaseConfig = {
  apiKey: "SUBSTITUA_COM_SUA_NOVA_API_KEY",
  authDomain: "SUBSTITUA.firebaseapp.com",
  projectId: "SUBSTITUA",
  storageBucket: "SUBSTITUA.appspot.com",
  messagingSenderId: "SUBSTITUA",
  appId: "SUBSTITUA"
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

// Inicializar Auth
const auth = getAuth(firebaseApp);
const storage = getStorage(firebaseApp);

// Exportar instâncias
export { db, auth, storage, firebaseApp };
