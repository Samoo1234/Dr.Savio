"use client";

import { motion } from 'framer-motion';
import Link from 'next/link';

const HeroSection = () => {
  return (
    <section id="início" className="hero-section min-h-screen flex items-center justify-center text-white relative">
      <div className="absolute inset-0 bg-gradient-to-r from-primary-900/80 to-secondary-900/80"></div>
      <div className="container mx-auto px-4 md:px-6 py-20 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-serif mb-6">
              Dr. Sávio Carmo
            </h1>
            <h2 className="text-2xl md:text-3xl font-light mb-8">
              Excelência e dedicação em cuidados de saúde
            </h2>
            <p className="text-lg md:text-xl mb-10 max-w-2xl mx-auto">
              Comprometido com o seu bem-estar e saúde, oferecendo atendimento humanizado 
              e tratamentos personalizados para cada paciente.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <Link href="/agendar" className="btn-primary text-lg py-3 px-8">
                  Agendar Consulta
                </Link>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <Link href="#sobre" className="btn-secondary text-lg py-3 px-8 bg-transparent text-white border-white hover:bg-white/10">
                  Saiba Mais
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Animated scroll indicator */}
      <motion.div 
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 1.5 }}
      >
        <Link href="#sobre" className="flex flex-col items-center">
          <span className="text-sm mb-2">Rolar para baixo</span>
          <svg 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              d="M12 5L12 19M12 19L19 12M12 19L5 12" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </svg>
        </Link>
      </motion.div>
    </section>
  );
};

export default HeroSection;
