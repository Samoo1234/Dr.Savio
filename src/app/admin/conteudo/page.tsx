"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaSave, FaUndo, FaImage, FaEdit, FaTrash } from 'react-icons/fa';

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

  // Componente de upload de imagem
  const ImageUploader = ({ label, imageUrl }) => (
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      <div className="flex items-start space-x-4">
        <div className="w-40 h-40 bg-gray-200 rounded-lg overflow-hidden flex items-center justify-center">
          {imageUrl ? (
            <img src={imageUrl} alt={label} className="w-full h-full object-cover" />
          ) : (
            <span className="text-gray-400 text-sm">Sem imagem</span>
          )}
        </div>
        <div className="space-y-2">
          <button className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors duration-300">
            <FaImage className="mr-2" /> Escolher Imagem
          </button>
          {imageUrl && (
            <button className="flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors duration-300">
              <FaTrash className="mr-2" /> Remover
            </button>
          )}
          <p className="text-xs text-gray-500 mt-2">
            Formatos suportados: JPG, PNG. Tamanho máximo: 2MB
          </p>
        </div>
      </div>
    </div>
  );

  // Componente de edição de serviço
  const ServiceEditor = ({ service, index }) => (
    <div className="bg-white p-4 rounded-lg shadow-sm mb-4 border border-gray-200">
      <div className="flex justify-between items-center mb-3">
        <h4 className="font-medium text-gray-800">Serviço #{index + 1}</h4>
        <button className="text-red-500 hover:text-red-700">
          <FaTrash />
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TextEditor label="Título" defaultValue={service.title} placeholder="Ex: Cardiologia" />
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Ícone</label>
          <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500">
            <option value="heart">Coração</option>
            <option value="brain">Cérebro</option>
            <option value="stethoscope">Estetoscópio</option>
            <option value="user-md">Médico</option>
            <option value="hospital">Hospital</option>
            <option value="notes-medical">Prontuário</option>
          </select>
        </div>
      </div>
      <TextEditor 
        label="Descrição" 
        defaultValue={service.description} 
        placeholder="Descreva o serviço em detalhes..." 
        multiline={true} 
      />
    </div>
  );

  // Componente de edição de depoimento
  const TestimonialEditor = ({ testimonial, index }) => (
    <div className="bg-white p-4 rounded-lg shadow-sm mb-4 border border-gray-200">
      <div className="flex justify-between items-center mb-3">
        <h4 className="font-medium text-gray-800">Depoimento #{index + 1}</h4>
        <button className="text-red-500 hover:text-red-700">
          <FaTrash />
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TextEditor label="Nome" defaultValue={testimonial.name} placeholder="Ex: Maria Silva" />
        <TextEditor label="Cargo/Função" defaultValue={testimonial.role} placeholder="Ex: Paciente" />
      </div>
      <TextEditor 
        label="Depoimento" 
        defaultValue={testimonial.content} 
        placeholder="Digite o depoimento do paciente..." 
        multiline={true} 
      />
      <div className="flex items-center mb-4">
        <label className="block text-sm font-medium text-gray-700 mr-4">Avaliação:</label>
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
      <ImageUploader label="Foto do Paciente" imageUrl={testimonial.image} />
    </div>
  );

  // Dados fictícios para os serviços
  const services = [
    {
      title: "Cardiologia",
      icon: "heart",
      description: "Avaliação e tratamento completo para saúde cardiovascular, incluindo exames preventivos e acompanhamento personalizado."
    },
    {
      title: "Neurologia",
      icon: "brain",
      description: "Diagnóstico e tratamento de condições neurológicas com abordagem moderna e humanizada para melhorar sua qualidade de vida."
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
      image: "/images/testimonial-1.jpg",
      content: "O Dr. Sávio transformou minha experiência com consultas médicas. Seu atendimento humanizado e atenção aos detalhes me fizeram sentir realmente cuidada. Recomendo a todos que buscam um profissional dedicado e competente.",
      rating: 5
    },
    {
      name: "Carlos Mendes",
      role: "Paciente",
      image: "/images/testimonial-2.jpg",
      content: "Após anos procurando um médico que realmente ouvisse minhas preocupações, encontrei o Dr. Sávio. Sua abordagem completa e explicações claras sobre meu tratamento fizeram toda a diferença na minha recuperação.",
      rating: 5
    }
  ];

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Editar Conteúdo</h1>
          <p className="text-gray-600">Personalize o conteúdo da sua landing page</p>
        </div>
        <div className="flex space-x-3">
          <button className="flex items-center px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors duration-300">
            <FaUndo className="mr-2" /> Cancelar
          </button>
          <button className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors duration-300">
            <FaSave className="mr-2" /> Salvar Alterações
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            {[
              { id: 'hero', label: 'Hero' },
              { id: 'sobre', label: 'Sobre' },
              { id: 'servicos', label: 'Serviços' },
              { id: 'depoimentos', label: 'Depoimentos' },
              { id: 'contato', label: 'Contato' },
              { id: 'footer', label: 'Rodapé' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-6 text-sm font-medium border-b-2 ${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* Seção Hero */}
          {activeTab === 'hero' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Seção Principal (Hero)</h2>
              <TextEditor 
                label="Título Principal" 
                defaultValue="Dr. Sávio Carmo" 
                placeholder="Ex: Dr. Sávio Carmo" 
              />
              <TextEditor 
                label="Subtítulo" 
                defaultValue="Excelência e dedicação em cuidados de saúde" 
                placeholder="Ex: Especialista em..." 
              />
              <TextEditor 
                label="Descrição" 
                defaultValue="Comprometido com o seu bem-estar e saúde, oferecendo atendimento humanizado e tratamentos personalizados para cada paciente." 
                placeholder="Breve descrição sobre o Dr. Sávio..." 
                multiline={true} 
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
              <ImageUploader label="Imagem de Fundo" imageUrl="/images/hero-bg.jpg" />
            </motion.div>
          )}

          {/* Seção Sobre */}
          {activeTab === 'sobre' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Seção Sobre</h2>
              <TextEditor 
                label="Título da Seção" 
                defaultValue="Sobre Dr. Sávio Carmo" 
                placeholder="Ex: Sobre Dr. Sávio Carmo" 
              />
              <TextEditor 
                label="Subtítulo da Seção" 
                defaultValue="Conheça mais sobre minha trajetória e compromisso com a saúde e bem-estar dos meus pacientes" 
                placeholder="Breve descrição da seção..." 
              />
              <ImageUploader label="Foto do Dr. Sávio" imageUrl="/images/doctor.jpg" />
              <TextEditor 
                label="Título do Conteúdo" 
                defaultValue="Excelência e humanização em saúde" 
                placeholder="Ex: Minha História" 
              />
              <TextEditor 
                label="Biografia" 
                defaultValue="Graduado pela Universidade Federal com especialização em diversas áreas da saúde, o Dr. Sávio Carmo tem dedicado sua carreira a oferecer o melhor atendimento médico com foco na saúde integral e bem-estar dos seus pacientes. Com mais de 15 anos de experiência clínica, Dr. Sávio combina conhecimento técnico avançado com uma abordagem humanizada, tratando cada paciente de forma individualizada e considerando todos os aspectos que influenciam sua saúde." 
                placeholder="Biografia detalhada do Dr. Sávio..." 
                multiline={true} 
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <TextEditor 
                  label="Texto do Botão 1" 
                  defaultValue="Currículo Completo" 
                  placeholder="Ex: Currículo Completo" 
                />
                <TextEditor 
                  label="Texto do Botão 2" 
                  defaultValue="Especialidades" 
                  placeholder="Ex: Especialidades" 
                />
              </div>
            </motion.div>
          )}

          {/* Seção Serviços */}
          {activeTab === 'servicos' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-800">Seção Serviços</h2>
                <button className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors duration-300">
                  <FaEdit className="mr-2" /> Adicionar Serviço
                </button>
              </div>
              <TextEditor 
                label="Título da Seção" 
                defaultValue="Serviços Especializados" 
                placeholder="Ex: Nossos Serviços" 
              />
              <TextEditor 
                label="Subtítulo da Seção" 
                defaultValue="Oferecemos uma ampla gama de serviços médicos com foco na sua saúde e bem-estar" 
                placeholder="Breve descrição da seção..." 
              />
              
              <div className="mt-6 space-y-4">
                {services.map((service, index) => (
                  <ServiceEditor key={index} service={service} index={index} />
                ))}
              </div>
            </motion.div>
          )}

          {/* Seção Depoimentos */}
          {activeTab === 'depoimentos' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-800">Seção Depoimentos</h2>
                <button className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors duration-300">
                  <FaEdit className="mr-2" /> Adicionar Depoimento
                </button>
              </div>
              <TextEditor 
                label="Título da Seção" 
                defaultValue="O Que Dizem Nossos Pacientes" 
                placeholder="Ex: Depoimentos" 
              />
              <TextEditor 
                label="Subtítulo da Seção" 
                defaultValue="Conheça as experiências de quem já recebeu os cuidados do Dr. Sávio Carmo" 
                placeholder="Breve descrição da seção..." 
              />
              
              <div className="mt-6 space-y-4">
                {testimonials.map((testimonial, index) => (
                  <TestimonialEditor key={index} testimonial={testimonial} index={index} />
                ))}
              </div>
            </motion.div>
          )}

          {/* Seção Contato */}
          {activeTab === 'contato' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Seção Contato</h2>
              <TextEditor 
                label="Título da Seção" 
                defaultValue="Entre em Contato" 
                placeholder="Ex: Contato" 
              />
              <TextEditor 
                label="Subtítulo da Seção" 
                defaultValue="Estamos prontos para atender você e responder todas as suas dúvidas" 
                placeholder="Breve descrição da seção..." 
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div>
                  <h3 className="text-md font-medium text-gray-800 mb-3">Informações de Contato</h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Telefones</h4>
                      <TextEditor 
                        label="Telefone 1" 
                        defaultValue="(11) 3456-7890" 
                        placeholder="Ex: (11) 1234-5678" 
                      />
                      <TextEditor 
                        label="Telefone 2" 
                        defaultValue="(11) 98765-4321" 
                        placeholder="Ex: (11) 98765-4321" 
                      />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">E-mails</h4>
                      <TextEditor 
                        label="E-mail 1" 
                        defaultValue="contato@drsaviocarmo.com.br" 
                        placeholder="Ex: contato@exemplo.com" 
                      />
                      <TextEditor 
                        label="E-mail 2" 
                        defaultValue="atendimento@drsaviocarmo.com.br" 
                        placeholder="Ex: atendimento@exemplo.com" 
                      />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Endereço</h4>
                      <TextEditor 
                        label="Linha 1" 
                        defaultValue="Av. Paulista, 1000 - Bela Vista" 
                        placeholder="Ex: Rua, número - Bairro" 
                      />
                      <TextEditor 
                        label="Linha 2" 
                        defaultValue="São Paulo - SP, 01310-100" 
                        placeholder="Ex: Cidade - Estado, CEP" 
                      />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Horário de Funcionamento</h4>
                      <TextEditor 
                        label="Dias de semana" 
                        defaultValue="Segunda a Sexta: 8h às 18h" 
                        placeholder="Ex: Segunda a Sexta: 8h às 18h" 
                      />
                      <TextEditor 
                        label="Fim de semana" 
                        defaultValue="Sábado: 8h às 12h" 
                        placeholder="Ex: Sábado: 8h às 12h" 
                      />
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-md font-medium text-gray-800 mb-3">Mapa e Configurações do Formulário</h3>
                  <TextEditor 
                    label="Embed do Google Maps" 
                    defaultValue="" 
                    placeholder="Cole aqui o código de incorporação do Google Maps" 
                    multiline={true} 
                  />
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Configurações do Formulário</h4>
                    <TextEditor 
                      label="E-mail para receber mensagens" 
                      defaultValue="contato@drsaviocarmo.com.br" 
                      placeholder="Ex: contato@exemplo.com" 
                    />
                    <div className="flex items-center mt-2">
                      <input type="checkbox" id="captcha" className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded" defaultChecked />
                      <label htmlFor="captcha" className="ml-2 text-sm text-gray-700">Ativar proteção contra spam (CAPTCHA)</label>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Seção Rodapé */}
          {activeTab === 'footer' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Rodapé</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-md font-medium text-gray-800 mb-3">Informações Gerais</h3>
                  <TextEditor 
                    label="Texto Sobre" 
                    defaultValue="Dedicado à excelência em saúde e bem-estar, oferecendo atendimento humanizado e tratamentos personalizados para cada paciente." 
                    placeholder="Breve descrição sobre o Dr. Sávio..." 
                    multiline={true} 
                  />
                </div>
                
                <div>
                  <h3 className="text-md font-medium text-gray-800 mb-3">Redes Sociais</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <TextEditor 
                      label="Facebook" 
                      defaultValue="https://facebook.com/drsaviocarmo" 
                      placeholder="URL do Facebook" 
                    />
                    <TextEditor 
                      label="Instagram" 
                      defaultValue="https://instagram.com/drsaviocarmo" 
                      placeholder="URL do Instagram" 
                    />
                    <TextEditor 
                      label="Twitter" 
                      defaultValue="https://twitter.com/drsaviocarmo" 
                      placeholder="URL do Twitter" 
                    />
                    <TextEditor 
                      label="LinkedIn" 
                      defaultValue="https://linkedin.com/in/drsaviocarmo" 
                      placeholder="URL do LinkedIn" 
                    />
                  </div>
                </div>
              </div>
              
              <div className="mt-6">
                <h3 className="text-md font-medium text-gray-800 mb-3">Informações Legais</h3>
                <TextEditor 
                  label="Texto de Copyright" 
                  defaultValue=" 2025 Dr. Sávio Carmo. Todos os direitos reservados." 
                  placeholder="Ex: 2025 Nome. Todos os direitos reservados." 
                />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  <TextEditor 
                    label="Link Termos de Uso" 
                    defaultValue="/termos" 
                    placeholder="URL dos Termos de Uso" 
                  />
                  <TextEditor 
                    label="Link Política de Privacidade" 
                    defaultValue="/privacidade" 
                    placeholder="URL da Política de Privacidade" 
                  />
                  <TextEditor 
                    label="Link Política de Cookies" 
                    defaultValue="/cookies" 
                    placeholder="URL da Política de Cookies" 
                  />
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
