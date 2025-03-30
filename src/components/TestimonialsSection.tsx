"use client";

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { FaQuoteLeft, FaStar } from 'react-icons/fa';

const TestimonialsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const [activeIndex, setActiveIndex] = useState(0);

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
    },
    {
      name: "Mariana Costa",
      role: "Paciente",
      image: "/images/testimonial-3.jpg",
      content: "O que mais me impressionou no Dr. Sávio foi sua capacidade de explicar condições complexas de forma simples e tranquilizadora. Seu conhecimento técnico aliado à empatia faz dele um médico excepcional.",
      rating: 5
    },
    {
      name: "Roberto Almeida",
      role: "Paciente",
      image: "/images/testimonial-4.jpg",
      content: "Desde a primeira consulta, o Dr. Sávio demonstrou um profissionalismo e atenção que raramente encontramos hoje. Seu acompanhamento cuidadoso e disponibilidade para esclarecer dúvidas me deram muita confiança.",
      rating: 5
    }
  ];

  const nextTestimonial = () => {
    setActiveIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setActiveIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length);
  };

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
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5 }
    }
  };

  return (
    <section id="depoimentos" className="py-20 bg-primary-50" ref={ref}>
      <div className="container mx-auto px-4 md:px-6">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="section-title">O Que Dizem Nossos Pacientes</h2>
          <p className="section-subtitle">
            Conheça as experiências de quem já recebeu os cuidados do Dr. Sávio Carmo
          </p>
        </motion.div>

        <motion.div
          className="relative max-w-4xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          <div className="overflow-hidden">
            <motion.div 
              className="flex transition-all duration-500 ease-in-out"
              style={{ transform: `translateX(-${activeIndex * 100}%)` }}
            >
              {testimonials.map((testimonial, index) => (
                <div 
                  key={index} 
                  className="min-w-full px-4"
                >
                  <motion.div 
                    className="bg-white p-8 md:p-10 rounded-lg shadow-lg"
                    variants={itemVariants}
                  >
                    <FaQuoteLeft className="text-4xl text-primary-200 mb-6" />
                    <p className="text-lg md:text-xl text-secondary-700 mb-8 italic">
                      "{testimonial.content}"
                    </p>
                    <div className="flex items-center">
                      <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200 mr-4 flex items-center justify-center">
                        <span className="text-gray-400 text-xs">Foto</span>
                        {/* Replace with actual image when available */}
                        {/* <img 
                          src={testimonial.image} 
                          alt={testimonial.name} 
                          className="w-full h-full object-cover"
                        /> */}
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-secondary-800">{testimonial.name}</h4>
                        <p className="text-secondary-600">{testimonial.role}</p>
                        <div className="flex mt-1">
                          {[...Array(testimonial.rating)].map((_, i) => (
                            <FaStar key={i} className="text-yellow-400 mr-1" />
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              ))}
            </motion.div>
          </div>

          <button 
            onClick={prevTestimonial}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 md:-translate-x-6 bg-white p-3 rounded-full shadow-lg text-primary-600 hover:text-primary-700 focus:outline-none z-10"
            aria-label="Depoimento anterior"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <button 
            onClick={nextTestimonial}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 md:translate-x-6 bg-white p-3 rounded-full shadow-lg text-primary-600 hover:text-primary-700 focus:outline-none z-10"
            aria-label="Próximo depoimento"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </motion.div>

        <div className="flex justify-center mt-8">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`w-3 h-3 mx-1 rounded-full focus:outline-none transition-all duration-300 ${
                activeIndex === index ? 'bg-primary-600 w-6' : 'bg-primary-300'
              }`}
              aria-label={`Ir para depoimento ${index + 1}`}
            />
          ))}
        </div>

        <motion.div 
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <button className="btn-primary">Ver Mais Depoimentos</button>
        </motion.div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
