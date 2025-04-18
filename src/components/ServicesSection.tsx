"use client";

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { FaHeartbeat, FaBrain, FaUserMd, FaStethoscope, FaHospital, FaNotesMedical } from 'react-icons/fa';
import { db } from '../lib/firebase';
import { collection, getDocs, query, doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { createServicesCollection } from '../scripts/createServicesCollection';

// Tipo para os serviços do Firestore
interface Service {
  id: string;
  title: string;
  icon: string;
  description: string;
  active: boolean;
  featured: boolean;
}

const ServicesSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Função para buscar serviços do Firestore
  useEffect(() => {
    const fetchServices = async () => {
      try {
        setIsLoading(true);
        
        // Verificar primeiro se a coleção existe
        const structureDocRef = doc(db, 'services', 'structure');
        const structureDocSnap = await getDoc(structureDocRef);
        
        if (!structureDocSnap.exists()) {
          console.log('A coleção services não foi inicializada. Inicializando...');
          
          try {
            // Inicializar a coleção services
            await createServicesCollection();
            
            // Adicionar um serviço de exemplo se não existir nenhum
            const servicesRef = collection(db, 'services');
            await setDoc(doc(servicesRef, 'example-service'), {
              title: 'Oftalmologista',
              icon: 'user-md',
              description: 'Cirurgião de olhos',
              active: true,
              featured: false,
              createdAt: serverTimestamp(),
              updatedAt: serverTimestamp()
            });
            
            console.log('Coleção services inicializada com sucesso!');
          } catch (initError) {
            console.error('Erro ao inicializar a coleção services:', initError);
            throw new Error('Falha ao inicializar a coleção services');
          }
        }
        
        // Buscar todos os documentos da coleção services
        const servicesRef = collection(db, 'services');
        const snapshot = await getDocs(servicesRef);
        
        // Filtrar o documento de estrutura e converter para o formato Service
        const servicesData = snapshot.docs
          .filter(doc => doc.id !== 'structure')
          .map(doc => ({
            id: doc.id,
            title: doc.data().title || '',
            icon: doc.data().icon || 'user-md',
            description: doc.data().description || '',
            active: doc.data().active !== false, // Default para true se não especificado
            featured: doc.data().featured || false
          })) as Service[];
        
        console.log('Serviços carregados:', servicesData.length);
        
        // Filtrar apenas serviços ativos
        const activeServices = servicesData.filter(service => service.active === true);
        console.log('Serviços ativos:', activeServices.length);
        
        // Usar apenas serviços ativos
        setServices(activeServices);
        
        // Salvar no cache
        localStorage.setItem('services_cache', JSON.stringify({
          data: activeServices,
          timestamp: Date.now()
        }));
        
        setError(null);
      } catch (err) {
        console.error('Erro ao carregar serviços:', err);
        setError('Falha ao carregar os serviços.');
        
        console.error('Erro ao carregar serviços:', err);
        
        // Usar dados de fallback em caso de erro
        const fallbackServices = [
          {
            id: 'fallback-1',
            title: "Cardiologia",
            icon: "heart",
            description: "Avaliação e tratamento completo para saúde cardiovascular, incluindo exames preventivos e acompanhamento personalizado.",
            active: true,
            featured: false
          },
          {
            id: 'fallback-2',
            title: "Neurologia",
            icon: "brain",
            description: "Diagnóstico e tratamento de condições neurológicas com abordagem moderna e humanizada para melhorar sua qualidade de vida.",
            active: true,
            featured: false
          },
          {
            id: 'fallback-3',
            title: "Clínica Geral",
            icon: "user-md",
            description: "Atendimento médico abrangente para todas as idades, com foco na prevenção e promoção da saúde integral.",
            active: true,
            featured: false
          },
          {
            id: 'fallback-4',
            title: "Check-up Completo",
            icon: "stethoscope",
            description: "Avaliação detalhada do seu estado de saúde com exames completos e orientações personalizadas para prevenção.",
            active: true,
            featured: false
          },
          {
            id: 'fallback-5',
            title: "Telemedicina",
            icon: "hospital",
            description: "Consultas online com a mesma qualidade do atendimento presencial, proporcionando comodidade e acessibilidade.",
            active: true,
            featured: false
          },
          {
            id: 'fallback-6',
            title: "Acompanhamento",
            icon: "notes-medical",
            description: "Monitoramento contínuo da sua saúde com planos de tratamento ajustados às suas necessidades específicas.",
            active: true,
            featured: false
          }
        ];
        
        setServices(fallbackServices);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchServices();
  }, []);
  
  // Função para obter o ícone correto com base no nome
  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case 'heart':
        return <FaHeartbeat className="text-4xl text-primary-500" />;
      case 'brain':
        return <FaBrain className="text-4xl text-primary-500" />;
      case 'user-md':
        return <FaUserMd className="text-4xl text-primary-500" />;
      case 'stethoscope':
        return <FaStethoscope className="text-4xl text-primary-500" />;
      case 'hospital':
        return <FaHospital className="text-4xl text-primary-500" />;
      case 'notes-medical':
        return <FaNotesMedical className="text-4xl text-primary-500" />;
      default:
        return <FaUserMd className="text-4xl text-primary-500" />;
    }
  };

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
          {isLoading ? (
            // Mostrar esqueletos de carregamento
            [...Array(6)].map((_, index) => (
              <motion.div 
                key={index} 
                className="bg-white p-8 rounded-lg shadow-lg animate-pulse"
                variants={itemVariants}
              >
                <div className="mb-4 bg-gray-200 h-16 w-16 rounded-full"></div>
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-4/6 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              </motion.div>
            ))
          ) : error ? (
            <div className="col-span-3 text-center py-8">
              <p className="text-red-500">{error}</p>
            </div>
          ) : services.length === 0 ? (
            <div className="col-span-3 text-center py-8">
              <p>Nenhum serviço disponível no momento.</p>
            </div>
          ) : (
            services.map((service, index) => (
              <motion.div 
                key={service.id} 
                className="bg-white p-8 rounded-lg shadow-lg card-hover"
                variants={itemVariants}
              >
                <div className="mb-4">{getIconComponent(service.icon)}</div>
                <h3 className="text-xl font-bold text-secondary-800 mb-3">{service.title}</h3>
                <p className="text-secondary-600 mb-4">{service.description}</p>
              <button className="text-primary-600 font-medium hover:text-primary-700 transition-colors duration-300 flex items-center">
                Saiba mais
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </motion.div>
            ))
          )}
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
