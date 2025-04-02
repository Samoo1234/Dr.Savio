"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaSave, FaUndo, FaImage, FaEdit, FaTrash, FaPlus } from 'react-icons/fa';

export default function ContentEditPage() {
  // Estado para controlar as abas
  const [activeTab, setActiveTab] = useState('hero');

  // Componente de edição de texto
  const TextEditor = ({ label, defaultValue, placeholder, multiline = false }) => (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      {multiline ? (
        <textarea
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          rows={4}
          placeholder={placeholder}
          defaultValue={defaultValue}
        />
      ) : (
        <input
          type="text"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          placeholder={placeholder}
          defaultValue={defaultValue}
        />
      )}
    </div>
  );

  // Componente de imagem
  const ImageEditor = ({ label, imageUrl }) => (
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      <div className="flex items-start space-x-4">
        <div className="relative w-32 h-32 border border-gray-300 rounded-md overflow-hidden bg-gray-100">
          {imageUrl ? (
            <img src={imageUrl} alt={label} className="w-full h-full object-cover" />
          ) : (
            <div className="flex items-center justify-center w-full h-full text-gray-400">
              <FaImage size={24} />
            </div>
          )}
        </div>
        <div className="flex-1">
          <div className="flex flex-col space-y-2">
            <button
              type="button"
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <FaImage className="mr-2" /> Escolher Imagem
            </button>
            {imageUrl && (
              <button
                type="button"
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                <FaTrash className="mr-2" /> Remover
              </button>
            )}
          </div>
          <p className="mt-2 text-sm text-gray-500">
            Recomendado: JPG, PNG. Máximo 2MB.
          </p>
        </div>
      </div>
    </div>
  );

  // Componente de serviço
  const ServiceItem = ({ service, index }) => (
    <div className="bg-white p-4 rounded-lg shadow-sm mb-4 border border-gray-200">
      <div className="flex justify-between items-center mb-3">
        <h4 className="font-medium text-gray-800">Serviço #{index + 1}</h4>
        <div className="flex space-x-2">
          <button
            className="text-gray-400 hover:text-gray-600"
            title="Editar"
          >
            <FaEdit />
          </button>
          <button
            className="text-red-400 hover:text-red-600"
            title="Excluir"
          >
            <FaTrash />
          </button>
        </div>
      </div>
      <TextEditor 
        label="Título do Serviço" 
        defaultValue={service.title} 
        placeholder="Ex: Cardiologia" 
      />
      <TextEditor 
        label="Descrição" 
        defaultValue={service.description} 
        placeholder="Breve descrição do serviço..." 
        multiline 
      />
    </div>
  );

  // Componente de depoimento
  const TestimonialItem = ({ testimonial, index }) => (
    <div className="bg-white p-4 rounded-lg shadow-sm mb-4 border border-gray-200">
      <div className="flex justify-between items-center mb-3">
        <h4 className="font-medium text-gray-800">Depoimento #{index + 1}</h4>
        <div className="flex space-x-2">
          <button
            className="text-gray-400 hover:text-gray-600"
            title="Editar"
          >
            <FaEdit />
          </button>
          <button
            className="text-red-400 hover:text-red-600"
            title="Excluir"
          >
            <FaTrash />
          </button>
        </div>
      </div>
      <TextEditor label="Nome" defaultValue={testimonial.name} placeholder="Ex: João Silva" />
      <TextEditor label="Cargo/Descrição" defaultValue={testimonial.role} placeholder="Ex: Paciente" />
      <TextEditor label="Depoimento" defaultValue={testimonial.content} placeholder="O que a pessoa disse..." multiline />
      <div className="mt-2 mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Avaliação</label>
        <div className="flex space-x-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button 
              key={star} 
              className={`text-xl ${star <= testimonial.rating ? 'text-yellow-400' : 'text-gray-300'}`}
            >
              ★
            </button>
          ))}
        </div>
      </div>
      <ImageEditor label="Foto do Paciente" imageUrl={testimonial.image} />
    </div>
  );

  // Dados fictícios para os serviços
  const services = [
    {
      title: "Cardiologia",
      icon: "heart",
      description: "Diagnóstico e tratamento de doenças cardiovasculares com tecnologia de ponta e abordagem humanizada."
    },
    {
      title: "Clínica Geral",
      icon: "user-md",
      description: "Atendimento médico abrangente para todas as idades, com foco na prevenção e promoção da saúde integral."
    }
  ];

  // Dados fictícios para os depoimentos
  const testimonials = [
    {
      name: "Ana Silva",
      role: "Paciente",
      content: "Excelente atendimento! O Dr. Sávio é muito atencioso e explica tudo com clareza. Recomendo a todos.",
      image: "/images/testimonials/person1.jpg",
      rating: 5
    },
    {
      name: "Carlos Oliveira",
      role: "Paciente",
      content: "Profissional extremamente competente. Resolveu meu problema de saúde que já durava anos.",
      image: "/images/testimonials/person2.jpg",
      rating: 5
    }
  ];

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Gerenciar Conteúdo</h1>
        <div className="flex space-x-3">
          <button
            type="button"
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            <FaUndo className="mr-2" /> Descartar Alterações
          </button>
          <button
            type="button"
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
          >
            <FaSave className="mr-2" /> Salvar Alterações
          </button>
        </div>
      </div>
      
      {/* Tabs de navegação */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('hero')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'hero'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Banner Principal
          </button>
          <button
            onClick={() => setActiveTab('about')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'about'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Sobre
          </button>
          <button
            onClick={() => setActiveTab('services')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'services'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Serviços
          </button>
          <button
            onClick={() => setActiveTab('testimonials')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'testimonials'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Depoimentos
          </button>
          <button
            onClick={() => setActiveTab('contact')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'contact'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Contato
          </button>
        </nav>
      </div>
      
      {/* Conteúdo das abas */}
      <div className="bg-gray-50 p-6 rounded-lg">
        {/* Banner Principal */}
        {activeTab === 'hero' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Banner Principal</h2>
            <p className="text-gray-600 mb-6">
              Edite o conteúdo que aparece no topo da página inicial.
            </p>
            
            <div className="space-y-6">
              <TextEditor 
                label="Título Principal" 
                defaultValue="Dr. Sávio Cardoso" 
                placeholder="Ex: Dr. Sávio Cardoso" 
              />
              <TextEditor 
                label="Subtítulo" 
                defaultValue="Cardiologista e Clínico Geral" 
                placeholder="Ex: Cardiologista e Clínico Geral" 
              />
              <TextEditor 
                label="Descrição" 
                defaultValue="Atendimento humanizado e de excelência para cuidar da sua saúde cardiovascular." 
                placeholder="Breve descrição..." 
                multiline 
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <TextEditor 
                  label="Texto do Botão Principal" 
                  defaultValue="Agendar Consulta" 
                  placeholder="Ex: Agendar Consulta" 
                />
                <TextEditor 
                  label="Texto do Botão Secundário" 
                  defaultValue="Saiba Mais" 
                  placeholder="Ex: Saiba Mais" 
                />
              </div>
              <ImageEditor label="Imagem de Fundo" imageUrl="/images/hero-bg.jpg" />
            </div>
          </motion.div>
        )}
        
        {/* Sobre */}
        {activeTab === 'about' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Sobre</h2>
            <p className="text-gray-600 mb-6">
              Edite as informações sobre você e sua prática médica.
            </p>
            
            <div className="space-y-6">
              <TextEditor 
                label="Título da Seção" 
                defaultValue="Sobre Dr. Sávio" 
                placeholder="Ex: Sobre Dr. Sávio" 
              />
              <TextEditor 
                label="Subtítulo" 
                defaultValue="Conheça mais sobre minha trajetória e compromisso com a saúde e bem-estar dos meus pacientes" 
                placeholder="Breve descrição da seção..." 
              />
              <ImageEditor label="Foto do Dr. Sávio" imageUrl="/images/doctor.jpg" />
              <TextEditor 
                label="Título do Conteúdo" 
                defaultValue="Excelência e humanização em saúde" 
                placeholder="Ex: Minha Trajetória" 
              />
              <TextEditor 
                label="Conteúdo Principal" 
                defaultValue="Com mais de 15 anos de experiência, sou especialista em Cardiologia e Clínica Geral, formado pela renomada Universidade Federal de Medicina, com residência no Hospital das Clínicas e diversos cursos de especialização no Brasil e exterior.

Meu compromisso é oferecer um atendimento que alia excelência técnica com humanização, tratando cada paciente de forma individualizada e integral. Acredito que a medicina vai além do tratamento de doenças – envolve cuidar de pessoas, compreender suas necessidades e construir uma relação de confiança.

Mantenho-me constantemente atualizado com as mais recentes pesquisas e avanços na área médica, participando de congressos nacionais e internacionais, para oferecer sempre o melhor e mais moderno tratamento aos meus pacientes." 
                placeholder="Descreva sua formação, experiência e filosofia de trabalho..." 
                multiline 
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium text-gray-800 mb-3">Formação Acadêmica</h3>
                  <TextEditor 
                    label="Formação" 
                    defaultValue="• Graduação em Medicina - Universidade Federal de Medicina
• Residência em Clínica Médica - Hospital das Clínicas
• Especialização em Cardiologia - Instituto do Coração
• Fellow em Cardiologia Intervencionista - Harvard Medical School" 
                    placeholder="Liste sua formação acadêmica..." 
                    multiline 
                  />
                </div>
                <div>
                  <h3 className="font-medium text-gray-800 mb-3">Experiência Profissional</h3>
                  <TextEditor 
                    label="Experiência" 
                    defaultValue="• Cardiologista Sênior - Hospital São Lucas (2015-Atual)
• Coordenador da Unidade Coronariana - Hospital Central (2012-2015)
• Médico Assistente - Pronto Socorro Cardíaco (2010-2012)
• Pesquisador Associado - Instituto de Pesquisas Cardiovasculares (2008-2010)" 
                    placeholder="Liste sua experiência profissional..." 
                    multiline 
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}
        
        {/* Serviços */}
        {activeTab === 'services' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Serviços</h2>
            <p className="text-gray-600 mb-6">
              Gerencie os serviços que você oferece.
            </p>
            
            <div className="mb-6">
              <TextEditor 
                label="Título da Seção" 
                defaultValue="Serviços Oferecidos" 
                placeholder="Ex: Serviços Oferecidos" 
              />
              <TextEditor 
                label="Descrição da Seção" 
                defaultValue="Conheça os serviços médicos que ofereço com excelência e dedicação para cuidar da sua saúde" 
                placeholder="Breve descrição da seção de serviços..." 
              />
              
              <div className="mt-6 space-y-4">
                {services.map((service, index) => (
                  <ServiceItem key={index} service={service} index={index} />
                ))}
              </div>
            </div>
            
            <div className="flex justify-center mt-6">
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
              >
                <FaPlus className="mr-2" /> Adicionar Novo Serviço
              </button>
            </div>
          </motion.div>
        )}
        
        {/* Depoimentos */}
        {activeTab === 'testimonials' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Depoimentos</h2>
            <p className="text-gray-600 mb-6">
              Gerencie os depoimentos de seus pacientes.
            </p>
            
            <div className="mb-6">
              <TextEditor 
                label="Título da Seção" 
                defaultValue="O que meus pacientes dizem" 
                placeholder="Ex: Depoimentos" 
              />
              <TextEditor 
                label="Descrição da Seção" 
                defaultValue="Veja o que meus pacientes têm a dizer sobre meu atendimento e cuidados médicos" 
                placeholder="Breve descrição da seção de depoimentos..." 
              />
              
              <div className="mt-6 space-y-4">
                {testimonials.map((testimonial, index) => (
                  <TestimonialItem key={index} testimonial={testimonial} index={index} />
                ))}
              </div>
            </div>
            
            <div className="flex justify-center mt-6">
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
              >
                <FaPlus className="mr-2" /> Adicionar Novo Depoimento
              </button>
            </div>
          </motion.div>
        )}
        
        {/* Contato */}
        {activeTab === 'contact' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Informações de Contato</h2>
            <p className="text-gray-600 mb-6">
              Edite suas informações de contato e localização.
            </p>
            
            <div className="space-y-6">
              <TextEditor 
                label="Título da Seção" 
                defaultValue="Entre em Contato" 
                placeholder="Ex: Entre em Contato" 
              />
              <TextEditor 
                label="Descrição da Seção" 
                defaultValue="Estou disponível para atendê-lo. Entre em contato para agendar sua consulta ou esclarecer dúvidas" 
                placeholder="Breve descrição da seção de contato..." 
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium text-gray-800 mb-3">Informações de Contato</h3>
                  <TextEditor 
                    label="Telefone" 
                    defaultValue="(11) 3456-7890" 
                    placeholder="Ex: (11) 3456-7890" 
                  />
                  <TextEditor 
                    label="WhatsApp" 
                    defaultValue="(11) 98765-4321" 
                    placeholder="Ex: (11) 98765-4321" 
                  />
                  <TextEditor 
                    label="Email" 
                    defaultValue="contato@drsavio.com.br" 
                    placeholder="Ex: contato@drsavio.com.br" 
                  />
                </div>
                <div>
                  <h3 className="font-medium text-gray-800 mb-3">Endereço do Consultório</h3>
                  <TextEditor 
                    label="Endereço" 
                    defaultValue="Av. Paulista, 1000, Conjunto 101" 
                    placeholder="Ex: Av. Paulista, 1000" 
                  />
                  <TextEditor 
                    label="Bairro" 
                    defaultValue="Bela Vista" 
                    placeholder="Ex: Bela Vista" 
                  />
                  <TextEditor 
                    label="Cidade/UF" 
                    defaultValue="São Paulo - SP" 
                    placeholder="Ex: São Paulo - SP" 
                  />
                  <TextEditor 
                    label="CEP" 
                    defaultValue="01310-100" 
                    placeholder="Ex: 01310-100" 
                  />
                </div>
              </div>
              
              <div>
                <h3 className="font-medium text-gray-800 mb-3">Horário de Atendimento</h3>
                <TextEditor 
                  label="Horários" 
                  defaultValue="Segunda a Sexta: 8h às 18h
Sábados: 8h às 12h" 
                  placeholder="Liste seus horários de atendimento..." 
                  multiline 
                />
              </div>
              
              <div>
                <h3 className="font-medium text-gray-800 mb-3">Redes Sociais</h3>
                <TextEditor 
                  label="Instagram" 
                  defaultValue="@drsaviocardoso" 
                  placeholder="Ex: @drsaviocardoso" 
                />
                <TextEditor 
                  label="Facebook" 
                  defaultValue="facebook.com/drsaviocardoso" 
                  placeholder="Ex: facebook.com/drsaviocardoso" 
                />
                <TextEditor 
                  label="LinkedIn" 
                  defaultValue="linkedin.com/in/drsaviocardoso" 
                  placeholder="Ex: linkedin.com/in/drsaviocardoso" 
                />
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
