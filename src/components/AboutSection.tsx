"use client";

import Image from 'next/image';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { FaUserMd, FaGraduationCap, FaHospital, FaAward } from 'react-icons/fa';

const AboutSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  const achievements = [
    { 
      icon: <FaUserMd className="text-4xl text-primary-500" />,
      title: "Experiência",
      description: "+15 anos dedicados à medicina de excelência"
    },
    { 
      icon: <FaGraduationCap className="text-4xl text-primary-500" />,
      title: "Formação",
      description: "Especialização nas melhores instituições do país"
    },
    { 
      icon: <FaHospital className="text-4xl text-primary-500" />,
      title: "Atendimentos",
      description: "Mais de 10.000 pacientes atendidos"
    },
    { 
      icon: <FaAward className="text-4xl text-primary-500" />,
      title: "Reconhecimento",
      description: "Premiado por excelência em atendimento"
    }
  ];

  return (
    <section id="sobre" className="py-20 bg-white" ref={ref}>
      <div className="container mx-auto px-4 md:px-6">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="section-title">Sobre Dr. Sávio Carmo</h2>
          <p className="section-subtitle">
            Conheça mais sobre minha trajetória e compromisso com a saúde e bem-estar dos meus pacientes
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="rounded-lg overflow-hidden shadow-xl">
              <div className="aspect-w-4 aspect-h-5 relative">
                <Image 
                  src="/images/pessoal.png" 
                  alt="Dr. Sávio Carmo" 
                  width={500}
                  height={600}
                  className="object-cover w-full h-full rounded-lg"
                />
              </div>
            </div>
            <div className="absolute -bottom-6 -right-6 w-40 h-40 bg-primary-100 rounded-lg -z-10"></div>
            <div className="absolute -top-6 -left-6 w-40 h-40 bg-secondary-100 rounded-lg -z-10"></div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h3 className="text-2xl font-bold text-secondary-800 mb-4">Excelência e humanização em saúde</h3>
            <p className="text-secondary-600 mb-6">
              Graduado pela Universidade Federal com especialização em diversas áreas da saúde, 
              o Dr. Sávio Carmo tem dedicado sua carreira a oferecer o melhor atendimento médico 
              com foco na saúde integral e bem-estar dos seus pacientes.
            </p>
            <p className="text-secondary-600 mb-6">
              Com mais de 15 anos de experiência clínica, Dr. Sávio combina conhecimento técnico 
              avançado com uma abordagem humanizada, tratando cada paciente de forma individualizada 
              e considerando todos os aspectos que influenciam sua saúde.
            </p>
            <p className="text-secondary-600 mb-8">
              Constantemente atualizado com as mais recentes pesquisas e tecnologias na área médica, 
              Dr. Sávio está comprometido em oferecer tratamentos eficazes e baseados em evidências 
              científicas, sempre priorizando a segurança e o conforto do paciente.
            </p>
            <div className="flex space-x-4">
              <button className="btn-primary">Currículo Completo</button>
              <button className="btn-secondary">Especialidades</button>
            </div>
          </motion.div>
        </div>

        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-20"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {achievements.map((item, index) => (
            <motion.div 
              key={index} 
              className="bg-white p-6 rounded-lg shadow-lg text-center card-hover"
              variants={itemVariants}
            >
              <div className="mb-4 flex justify-center">{item.icon}</div>
              <h3 className="text-xl font-bold text-secondary-800 mb-2">{item.title}</h3>
              <p className="text-secondary-600">{item.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default AboutSection;
