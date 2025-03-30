"use client";

import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaFacebookF, FaInstagram, FaTwitter, FaLinkedinIn, FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  const footerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };
  
  return (
    <footer className="bg-secondary-900 text-white pt-16 pb-8">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={footerVariants}
        >
          {/* Coluna 1 - Sobre */}
          <motion.div variants={itemVariants}>
            <h3 className="text-xl font-bold mb-4 border-b border-primary-500 pb-2 inline-block">Sobre Nós</h3>
            <div className="mb-4">
              <Link href="/" className="text-2xl font-bold text-white hover:text-primary-400 transition-colors duration-300">
                Dr. Sávio Carmo
              </Link>
            </div>
            <p className="text-gray-300 mb-4">
              Dedicado à excelência em saúde e bem-estar, oferecendo atendimento humanizado e tratamentos personalizados para cada paciente.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-white hover:text-primary-400 transition-colors duration-300">
                <FaFacebookF />
              </a>
              <a href="#" className="text-white hover:text-primary-400 transition-colors duration-300">
                <FaInstagram />
              </a>
              <a href="#" className="text-white hover:text-primary-400 transition-colors duration-300">
                <FaTwitter />
              </a>
              <a href="#" className="text-white hover:text-primary-400 transition-colors duration-300">
                <FaLinkedinIn />
              </a>
            </div>
          </motion.div>
          
          {/* Coluna 2 - Links Rápidos */}
          <motion.div variants={itemVariants}>
            <h3 className="text-xl font-bold mb-4 border-b border-primary-500 pb-2 inline-block">Links Rápidos</h3>
            <ul className="space-y-2">
              {['Início', 'Sobre', 'Serviços', 'Depoimentos', 'Contato', 'Blog', 'Política de Privacidade'].map((item) => (
                <li key={item}>
                  <Link 
                    href={`/${item === 'Início' ? '' : item.toLowerCase()}`}
                    className="text-gray-300 hover:text-primary-400 transition-colors duration-300 flex items-center"
                  >
                    <svg className="w-3 h-3 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
          
          {/* Coluna 3 - Serviços */}
          <motion.div variants={itemVariants}>
            <h3 className="text-xl font-bold mb-4 border-b border-primary-500 pb-2 inline-block">Nossos Serviços</h3>
            <ul className="space-y-2">
              {['Cardiologia', 'Neurologia', 'Clínica Geral', 'Check-up Completo', 'Telemedicina', 'Acompanhamento'].map((item) => (
                <li key={item}>
                  <Link 
                    href={`/servicos#${item.toLowerCase()}`}
                    className="text-gray-300 hover:text-primary-400 transition-colors duration-300 flex items-center"
                  >
                    <svg className="w-3 h-3 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
          
          {/* Coluna 4 - Contato */}
          <motion.div variants={itemVariants}>
            <h3 className="text-xl font-bold mb-4 border-b border-primary-500 pb-2 inline-block">Contato</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <FaMapMarkerAlt className="text-primary-500 mt-1 mr-3" />
                <span className="text-gray-300">
                  Av. Paulista, 1000 - Bela Vista<br />
                  São Paulo - SP, 01310-100
                </span>
              </li>
              <li className="flex items-center">
                <FaPhoneAlt className="text-primary-500 mr-3" />
                <span className="text-gray-300">(11) 3456-7890</span>
              </li>
              <li className="flex items-center">
                <FaEnvelope className="text-primary-500 mr-3" />
                <a href="mailto:contato@drsaviocarmo.com.br" className="text-gray-300 hover:text-primary-400 transition-colors duration-300">
                  contato@drsaviocarmo.com.br
                </a>
              </li>
            </ul>
          </motion.div>
        </motion.div>
        
        <div className="border-t border-gray-700 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm mb-4 md:mb-0">
              &copy; {currentYear} Dr. Sávio Carmo. Todos os direitos reservados.
            </p>
            <div className="flex space-x-6">
              <Link href="/termos" className="text-gray-400 hover:text-primary-400 text-sm transition-colors duration-300">
                Termos de Uso
              </Link>
              <Link href="/privacidade" className="text-gray-400 hover:text-primary-400 text-sm transition-colors duration-300">
                Política de Privacidade
              </Link>
              <Link href="/cookies" className="text-gray-400 hover:text-primary-400 text-sm transition-colors duration-300">
                Política de Cookies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
