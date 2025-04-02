// Script para fazer upload de imagens para o Firebase Storage
import { storage, db } from '../lib/firebase';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';

/**
 * Faz upload de uma imagem para o Firebase Storage e registra os metadados no Firestore
 * @param {File} file - O arquivo de imagem a ser enviado
 * @param {string} folder - A pasta onde a imagem será armazenada (hero, about, services, testimonials)
 * @param {string} customName - Nome personalizado para o arquivo (opcional)
 * @param {Function} progressCallback - Callback para atualizar o progresso do upload
 * @returns {Promise<Object>} - Objeto com informações da imagem enviada
 */
export const uploadImageToStorage = async (file, folder, customName = null, progressCallback = null) => {
  try {
    // Validar o tipo de arquivo
    if (!file.type.match('image.*')) {
      throw new Error('O arquivo selecionado não é uma imagem válida.');
    }
    
    // Validar o tamanho do arquivo (máximo 2MB)
    if (file.size > 2 * 1024 * 1024) {
      throw new Error('O tamanho máximo permitido é 2MB.');
    }
    
    // Gerar um nome único para o arquivo
    const fileName = customName || `${uuidv4()}_${file.name}`;
    
    // Criar referência para o arquivo no Storage
    const storageRef = ref(storage, `images/${folder}/${fileName}`);
    
    // Iniciar o upload
    const uploadTask = uploadBytesResumable(storageRef, file);
    
    // Retornar uma promessa que resolve quando o upload for concluído
    return new Promise((resolve, reject) => {
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          // Calcular e reportar o progresso
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          if (progressCallback) {
            progressCallback(progress);
          }
        },
        (error) => {
          // Tratar erros durante o upload
          console.error('Erro no upload:', error);
          reject(error);
        },
        async () => {
          // Upload concluído com sucesso
          try {
            // Obter a URL de download
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            
            // Calcular dimensões da imagem
            const dimensions = await getImageDimensions(file);
            
            // Criar registro no Firestore
            const imageData = {
              name: fileName,
              originalName: file.name,
              folder,
              size: formatFileSize(file.size),
              sizeBytes: file.size,
              dimensions: `${dimensions.width}x${dimensions.height}`,
              width: dimensions.width,
              height: dimensions.height,
              type: file.type,
              url: downloadURL,
              createdAt: serverTimestamp(),
              updatedAt: serverTimestamp()
            };
            
            // Adicionar à coleção 'images' no Firestore
            const docRef = await addDoc(collection(db, 'images'), imageData);
            
            // Resolver com os dados da imagem e o ID do documento
            resolve({
              id: docRef.id,
              ...imageData,
              createdAt: new Date() // Representação local
            });
          } catch (error) {
            console.error('Erro ao processar imagem após upload:', error);
            reject(error);
          }
        }
      );
    });
  } catch (error) {
    console.error('Erro ao iniciar upload:', error);
    throw error;
  }
};

/**
 * Obtém as dimensões de uma imagem
 * @param {File} file - O arquivo de imagem
 * @returns {Promise<{width: number, height: number}>} - Dimensões da imagem
 */
const getImageDimensions = (file) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      resolve({
        width: img.width,
        height: img.height
      });
    };
    img.src = URL.createObjectURL(file);
  });
};

/**
 * Formata o tamanho do arquivo para exibição
 * @param {number} bytes - Tamanho em bytes
 * @returns {string} - Tamanho formatado (ex: "1.5 MB")
 */
const formatFileSize = (bytes) => {
  if (bytes < 1024) {
    return bytes + ' B';
  } else if (bytes < 1024 * 1024) {
    return (bytes / 1024).toFixed(1) + ' KB';
  } else {
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  }
};

export default uploadImageToStorage;
