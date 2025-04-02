"use client";

import { useState, useEffect } from 'react';
import { collection, query, orderBy, getDocs, addDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { FaCalendarAlt, FaMapMarkerAlt, FaSave, FaTrash } from 'react-icons/fa';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Availability {
  id: string;
  date: Date;
  location: string;
}

export default function AgendaPage() {
  const [availabilities, setAvailabilities] = useState<Availability[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [filterDate, setFilterDate] = useState('');
  const [filterLocation, setFilterLocation] = useState('');

  // Buscar disponibilidades ao carregar a página
  useEffect(() => {
    fetchAvailabilities();
  }, []);

  // Buscar disponibilidades com filtros
  useEffect(() => {
    fetchAvailabilities();
  }, [filterDate, filterLocation]);

  const fetchAvailabilities = async () => {
    try {
      setLoading(true);
      
      let availabilitiesQuery = query(
        collection(db, 'availableDates'),
        orderBy('date', 'asc')
      );
      
      const querySnapshot = await getDocs(availabilitiesQuery);
      
      let availabilitiesData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        date: doc.data().date?.toDate() // Converter Timestamp para Date
      })) as Availability[];
      
      // Aplicar filtros
      if (filterDate) {
        availabilitiesData = availabilitiesData.filter(availability => {
          if (!availability.date) return false;
          return format(availability.date, 'yyyy-MM-dd') === filterDate;
        });
      }
      
      if (filterLocation) {
        availabilitiesData = availabilitiesData.filter(availability => 
          availability.location?.toLowerCase().includes(filterLocation.toLowerCase())
        );
      }
      
      setAvailabilities(availabilitiesData);
      setError(null);
    } catch (err) {
      console.error('Erro ao buscar disponibilidades:', err);
      setError('Falha ao carregar disponibilidades. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  // Função para salvar nova disponibilidade
  const saveAvailability = async () => {
    // Validar se os campos estão preenchidos
    if (!filterDate) {
      setError('Por favor, selecione uma data.');
      return;
    }
    
    if (!filterLocation) {
      setError('Por favor, informe a cidade de atendimento.');
      return;
    }
    
    try {
      // Verificar se já existe uma disponibilidade para esta data e local
      const existingAvailability = availabilities.find(
        avail => 
          format(avail.date, 'yyyy-MM-dd') === filterDate && 
          avail.location.toLowerCase() === filterLocation.toLowerCase()
      );
      
      if (existingAvailability) {
        setError('Já existe uma disponibilidade cadastrada para esta data e local.');
        return;
      }
      
      // Adicionar nova disponibilidade ao Firestore
      await addDoc(collection(db, 'availableDates'), {
        date: new Date(filterDate),
        location: filterLocation,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      
      // Limpar os campos
      setFilterDate('');
      setFilterLocation('');
      
      // Mostrar mensagem de sucesso
      setSuccess('Disponibilidade adicionada com sucesso!');
      setTimeout(() => setSuccess(null), 3000);
      
      // Atualizar a lista
      fetchAvailabilities();
    } catch (err) {
      console.error('Erro ao salvar disponibilidade:', err);
      setError('Falha ao salvar disponibilidade. Tente novamente.');
    }
  };

  // Função para excluir disponibilidade
  const deleteAvailability = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta disponibilidade?')) {
      try {
        await deleteDoc(doc(db, 'availableDates', id));
        setSuccess('Disponibilidade excluída com sucesso!');
        setTimeout(() => setSuccess(null), 3000);
        fetchAvailabilities();
      } catch (err) {
        console.error('Erro ao excluir disponibilidade:', err);
        setError('Falha ao excluir disponibilidade. Tente novamente.');
      }
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-2">Agenda de Atendimento</h1>
      <p className="text-gray-600 mb-6">Veja onde o Dr. Sávio estará disponível para atendimento</p>
      
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}
      
      {success && (
        <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-green-700">{success}</p>
            </div>
          </div>
        </div>
      )}

      {/* Filtros e Formulário */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label htmlFor="filterDate" className="block text-sm font-medium text-gray-700 mb-1">
              Data
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaCalendarAlt className="text-gray-400" />
              </div>
              <input
                type="date"
                id="filterDate"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                className="pl-10 block w-full rounded-md border border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 py-2"
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="filterLocation" className="block text-sm font-medium text-gray-700 mb-1">
              Cidade
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaMapMarkerAlt className="text-gray-400" />
              </div>
              <input
                type="text"
                id="filterLocation"
                value={filterLocation}
                onChange={(e) => setFilterLocation(e.target.value)}
                placeholder="Digite a cidade"
                className="pl-10 block w-full rounded-md border border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 py-2"
              />
            </div>
          </div>
          
          <div className="flex items-end">
            <button
              onClick={saveAvailability}
              className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md flex items-center"
            >
              <FaSave className="mr-2" /> Salvar Disponibilidade
            </button>
          </div>
        </div>
      </div>

      {/* Lista de disponibilidades */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {loading ? (
          <div className="p-6 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-600 mb-2"></div>
            <p className="text-gray-600">Carregando disponibilidades...</p>
          </div>
        ) : availabilities.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            Nenhuma disponibilidade encontrada para os filtros selecionados.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Data
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Local de Atendimento
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {availabilities.map((availability) => (
                  <tr key={availability.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {availability.date ? format(availability.date, 'dd/MM/yyyy', { locale: ptBR }) : 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{availability.location || 'Local não especificado'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => deleteAvailability(availability.id)}
                        className="text-red-600 hover:text-red-900"
                        title="Excluir"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
