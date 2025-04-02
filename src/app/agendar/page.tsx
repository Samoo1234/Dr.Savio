"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaCalendarAlt, FaUser, FaPhone, FaEnvelope, FaClipboardList, FaArrowLeft, FaMapMarkerAlt } from 'react-icons/fa';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';

export default function AgendarConsulta() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    patientName: '',
    phone: '',
    email: '',
    preferredDate: '',
    preferredTime: '',
    location: '', 
    reason: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    success: boolean;
    message: string;
  } | null>(null);
  
  const locations = [
    'São Paulo - SP',
    'Rio de Janeiro - RJ',
    'Belo Horizonte - MG',
    'Salvador - BA',
    'Brasília - DF',
    'Recife - PE',
    'Fortaleza - CE',
    'Porto Alegre - RS',
    'Curitiba - PR',
    'Manaus - AM'
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const appointmentData = {
        patientName: formData.patientName,
        phone: formData.phone,
        email: formData.email,
        date: new Date(formData.preferredDate), 
        time: formData.preferredTime,
        location: formData.location, 
        reason: formData.reason,
        status: 'pending', 
        createdAt: serverTimestamp() 
      };

      await addDoc(collection(db, 'appointments'), appointmentData);

      setSubmitStatus({
        success: true,
        message: 'Consulta agendada com sucesso! Entraremos em contato para confirmar.'
      });

      setFormData({
        patientName: '',
        phone: '',
        email: '',
        preferredDate: '',
        preferredTime: '',
        location: '',
        reason: ''
      });

      setTimeout(() => {
        router.push('/');
      }, 3000);
    } catch (error) {
      console.error('Erro ao agendar consulta:', error);
      setSubmitStatus({
        success: false,
        message: 'Ocorreu um erro ao agendar sua consulta. Por favor, tente novamente.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 8; hour < 18; hour++) {
      for (let minute of ['00', '30']) {
        const time = `${hour.toString().padStart(2, '0')}:${minute}`;
        slots.push(time);
      }
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

  const today = new Date().toISOString().split('T')[0];
  const maxDate = new Date();
  maxDate.setMonth(maxDate.getMonth() + 3);
  const maxDateString = maxDate.toISOString().split('T')[0];

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="container mx-auto px-4 md:px-6">
        <Link href="/" className="flex items-center text-primary-600 hover:text-primary-700 mb-6">
          <FaArrowLeft className="mr-2" /> Voltar para a página inicial
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto bg-white rounded-lg shadow-md overflow-hidden"
        >
          <div className="bg-primary-600 p-6 text-white">
            <h1 className="text-2xl md:text-3xl font-bold">Agendar Consulta</h1>
            <p className="mt-2">Preencha o formulário abaixo para agendar sua consulta</p>
          </div>

          {submitStatus && (
            <div className={`p-4 ${submitStatus.success ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
              <p className="font-medium">{submitStatus.message}</p>
              {submitStatus.success && (
                <p className="text-sm mt-1">Redirecionando para a página inicial...</p>
              )}
            </div>
          )}

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="patientName" className="block text-sm font-medium text-gray-700 mb-1">
                  Nome completo
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaUser className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="patientName"
                    name="patientName"
                    value={formData.patientName}
                    onChange={handleChange}
                    required
                    className="pl-10 block w-full rounded-md border border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 py-2"
                    placeholder="Seu nome completo"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Telefone
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaPhone className="text-gray-400" />
                  </div>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="pl-10 block w-full rounded-md border border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 py-2"
                    placeholder="(00) 00000-0000"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaEnvelope className="text-gray-400" />
                  </div>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="pl-10 block w-full rounded-md border border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 py-2"
                    placeholder="seu.email@exemplo.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                  Cidade de Atendimento
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaMapMarkerAlt className="text-gray-400" />
                  </div>
                  <select
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    required
                    className="pl-10 block w-full rounded-md border border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 py-2"
                  >
                    <option value="">Selecione uma cidade</option>
                    {locations.map((location) => (
                      <option key={location} value={location}>
                        {location}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="preferredDate" className="block text-sm font-medium text-gray-700 mb-1">
                  Data preferida
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaCalendarAlt className="text-gray-400" />
                  </div>
                  <input
                    type="date"
                    id="preferredDate"
                    name="preferredDate"
                    value={formData.preferredDate}
                    onChange={handleChange}
                    min={today}
                    max={maxDateString}
                    required
                    className="pl-10 block w-full rounded-md border border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 py-2"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="preferredTime" className="block text-sm font-medium text-gray-700 mb-1">
                  Horário preferido
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaCalendarAlt className="text-gray-400" />
                  </div>
                  <select
                    id="preferredTime"
                    name="preferredTime"
                    value={formData.preferredTime}
                    onChange={handleChange}
                    required
                    className="pl-10 block w-full rounded-md border border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 py-2"
                  >
                    <option value="">Selecione um horário</option>
                    {timeSlots.map((time) => (
                      <option key={time} value={time}>
                        {time}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="md:col-span-2">
                <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-1">
                  Motivo da consulta
                </label>
                <div className="relative">
                  <div className="absolute top-3 left-0 pl-3 pointer-events-none">
                    <FaClipboardList className="text-gray-400" />
                  </div>
                  <textarea
                    id="reason"
                    name="reason"
                    value={formData.reason}
                    onChange={handleChange}
                    rows={4}
                    className="pl-10 block w-full rounded-md border border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 py-2"
                    placeholder="Descreva brevemente o motivo da sua consulta"
                  ></textarea>
                </div>
              </div>
            </div>

            <div className="flex justify-center">
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Enviando...
                  </>
                ) : (
                  'Agendar Consulta'
                )}
              </button>
            </div>
          </form>

          <div className="bg-gray-50 p-6 border-t border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Informações importantes</h3>
            <ul className="text-sm text-gray-600 space-y-2">
              <li>• Seu agendamento será confirmado por telefone ou email.</li>
              <li>• Em caso de impossibilidade de comparecimento, favor avisar com 24h de antecedência.</li>
              <li>• Chegue com 15 minutos de antecedência para o preenchimento da ficha.</li>
              <li>• Traga seus exames anteriores, se houver.</li>
            </ul>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
