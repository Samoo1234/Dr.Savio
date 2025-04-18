import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';

// Usamos diretamente o db importado do arquivo firebase.js

/**
 * Salva uma nova mensagem de contato no Firestore.
 * @param {Object} data - Dados do formulário de contato
 * @param {string} data.name
 * @param {string} data.email
 * @param {string} data.phone
 * @param {string} data.subject
 * @param {string} data.message
 * @returns {Promise<string>} - ID do documento criado
 */
export async function saveContactMessage(data) {
  const docRef = await addDoc(collection(db, 'messages'), {
    ...data,
    createdAt: Timestamp.now(),
    status: 'new', // para controle futuro (ex: "respondido", "em andamento")
  });
  return docRef.id;
}
