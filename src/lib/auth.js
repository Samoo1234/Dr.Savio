"use client";

import { 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  sendPasswordResetEmail
} from 'firebase/auth';
import { auth } from './firebase';

// Função para fazer login com email e senha
export const loginWithEmailAndPassword = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { user: userCredential.user, error: null };
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    
    // Traduzir mensagens de erro do Firebase para português
    let errorMessage = 'Ocorreu um erro durante o login. Tente novamente.';
    
    switch (error.code) {
      case 'auth/invalid-email':
        errorMessage = 'Endereço de email inválido.';
        break;
      case 'auth/user-disabled':
        errorMessage = 'Esta conta foi desativada.';
        break;
      case 'auth/user-not-found':
        errorMessage = 'Usuário não encontrado.';
        break;
      case 'auth/wrong-password':
        errorMessage = 'Senha incorreta.';
        break;
      case 'auth/invalid-credential':
        errorMessage = 'Usuário ou senha inválidos.';
        break;
      case 'auth/too-many-requests':
        errorMessage = 'Muitas tentativas de login. Tente novamente mais tarde.';
        break;
    }
    
    return { user: null, error: errorMessage };
  }
};

// Função para fazer logout
export const logout = async () => {
  try {
    await signOut(auth);
    return { success: true, error: null };
  } catch (error) {
    console.error('Erro ao fazer logout:', error);
    return { success: false, error: error.message };
  }
};

// Função para enviar email de redefinição de senha
export const resetPassword = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    return { success: true, error: null };
  } catch (error) {
    console.error('Erro ao enviar email de redefinição de senha:', error);
    
    let errorMessage = 'Ocorreu um erro ao enviar o email. Tente novamente.';
    
    switch (error.code) {
      case 'auth/invalid-email':
        errorMessage = 'Endereço de email inválido.';
        break;
      case 'auth/user-not-found':
        errorMessage = 'Não existe usuário com este email.';
        break;
      case 'auth/too-many-requests':
        errorMessage = 'Muitas solicitações. Tente novamente mais tarde.';
        break;
    }
    
    return { success: false, error: errorMessage };
  }
};

// Hook para observar o estado de autenticação
export const subscribeToAuthChanges = (callback) => {
  return onAuthStateChanged(auth, (user) => {
    callback(user);
  });
};

// Função para verificar se o usuário está autenticado
export const isUserAuthenticated = () => {
  return auth.currentUser !== null;
};

// Função para obter o usuário atual
export const getCurrentUser = () => {
  return auth.currentUser;
};
