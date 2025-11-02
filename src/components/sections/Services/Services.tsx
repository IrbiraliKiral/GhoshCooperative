import { services } from '@/constants/data/servicesData';
import { ServiceCard } from '@/components/cards/ServiceCard/ServiceCard';
import { useLanguage } from '@/contexts/LanguageContext';
import { FaBriefcase } from 'react-icons/fa';

export const Services = () => {
  const { t } = useLanguage();
  return (
    <section className="relative banking-section bg-gradient-to-b from-banking-gray-50 to-white">
      {/* Decorative top border */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-banking-blue-600 via-banking-blue-500 to-banking-blue-600"></div>
      
      <div className="banking-container">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 mb-4 bg-banking-blue-50 rounded-full px-4 py-2 border border-banking-blue-200">
            <FaBriefcase className="text-banking-blue-600 text-sm" />
            <span className="text-sm font-semibold text-banking-blue-700">Our Services</span>
          </div>
          <h2 className="banking-heading mb-4 text-4xl md:text-5xl">{t.services.title}</h2>
          <p className="banking-text max-w-3xl mx-auto text-lg">
            {t.services.subtitle}
          </p>
        </div>
        
        <div className="banking-grid">
          {services.map((service, index) => (
            <div key={index} className="animate-in fade-in" style={{ 
              animationDelay: `${index * 100}ms`,
              animationFillMode: 'both'
            }}>
              <ServiceCard service={service} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
