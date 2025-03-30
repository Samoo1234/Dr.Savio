"use client";

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { FaHeartbeat, FaBrain, FaUserMd, FaStethoscope, FaHospital, FaNotesMedical } from 'react-icons/fa';

const ServicesSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  const services = [
    {
      icon: <FaHeartbeat className="text-4xl text-primary-500" />,
      title: "Cardiologia",
      description: "Avaliação e tratamento completo para saúde cardiovascular, incluindo exames preventivos e acompanhamento personalizado."
    },
    {
      icon: <FaBrain className="text-4xl text-primary-500" />,
      title: "Neurologia",
      description: "Diagnóstico e tratamento de condições neurológicas com abordagem moderna e humanizada para melhorar sua qualidade de vida."
    },
    {
      icon: <FaUserMd className="text-4xl text-primary-500" />,
      title: "Clínica Geral",
      description: "Atendimento médico abrangente para todas as idades, com foco na prevenção e promoção da saúde integral."
    },
    {
      icon: <FaStethoscope className="text-4xl text-primary-500" />,
      title: "Check-up Completo",
      description: "Avaliação detalhada do seu estado de saúde com exames completos e orientações personalizadas para prevenção."
    },
    {
      icon: <FaHospital className="text-4xl text-primary-500" />,
      title: "Telemedicina",
      description: "Consultas online com a mesma qualidade do atendimento presencial, proporcionando comodidade e acessibilidade."
    },
    {
      icon: <FaNotesMedical className="text-4xl text-primary-500" />,
      title: "Acompanhamento",
      description: "Monitoramento contínuo da sua saúde com planos de tratamento ajustados às suas necessidades específicas."
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <section id="serviços" className="py-20 bg-gray-50" ref={ref}>
      <div className="container mx-auto px-4 md:px-6">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="section-title">Serviços Especializados</h2>
          <p className="section-subtitle">
            Oferecemos uma ampla gama de serviços médicos com foco na sua saúde e bem-estar
          </p>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {services.map((service, index) => (
            <motion.div 
              key={index} 
              className="bg-white p-8 rounded-lg shadow-lg card-hover"
              variants={itemVariants}
            >
              <div className="mb-4">{service.icon}</div>
              <h3 className="text-xl font-bold text-secondary-800 mb-3">{service.title}</h3>
              <p className="text-secondary-600 mb-4">{service.description}</p>
              <button className="text-primary-600 font-medium hover:text-primary-700 transition-colors duration-300 flex items-center">
                Saiba mais
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </motion.div>
          ))}
        </motion.div>

        <motion.div 
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <p className="text-lg text-secondary-700 mb-6">
            Não encontrou o serviço que procura? Entre em contato para mais informações.
          </p>
          <button className="btn-primary">Ver Todos os Serviços</button>
        </motion.div>
      </div>
    </section>
  );
};

export default ServicesSection;
