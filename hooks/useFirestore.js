
import { addDoc, collection, doc, setDoc, updateDoc } from 'firebase/firestore';
import { useState } from 'react';
import { db } from '../service/firebase';

export function useFirestore({ collectionName, onSuccess, onError }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Função para adicionar um documento
  const addDocument = async (data, userId) => {
    setLoading(true);
    try {
      if (userId) {
        // Se um userId for passado, usar setDoc para definir o ID do documento
        const docRef = doc(db, collectionName, userId);
        await setDoc(docRef, data);
      } else {
        // Se nenhum userId for passado, usar addDoc para gerar um ID automaticamente
        await addDoc(collection(db, collectionName), data);
      }

      if (onSuccess) onSuccess();
      setLoading(false);
    } catch (err) {
      setError('Erro ao adicionar documento.');
      if (onError) onError(err);
      setLoading(false);
      throw err; // 👈 Isso permite que o erro seja capturado no componente
    }
  };

  // Função para atualizar um documento
  const updateDocument = async (id, data) => {
    setLoading(true);
    try {
      const docRef = doc(db, collectionName, id);
      await updateDoc(docRef, data);

      if (onSuccess) onSuccess();
      setLoading(false);
    } catch (err) {
      setError('Erro ao atualizar documento.');
      if (onError) onError(err);
      setLoading(false);
    }
  };

  return {
    addDocument,
    updateDocument, // Agora também retornamos a função updateDocument
    loading,
    error
  };
}