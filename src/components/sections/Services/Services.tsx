import { services } from '@/constants/data/servicesData';
import { ServiceCard } from '@/components/cards/ServiceCard/ServiceCard';
import { useLanguage } from '@/contexts/LanguageContext';

export const Services = () => {
  const { t } = useLanguage();
  return (
    <section className="banking-section banking-gradient-section">
      <div className="banking-container">
        <div className="text-center mb-12">
          <h2 className="banking-heading mb-4">{t.services.title}</h2>
          <p className="banking-text max-w-2xl mx-auto">
            {t.services.subtitle}
          </p>
        </div>
        
        <div className="banking-grid">
          {services.map((service, index) => (
            <ServiceCard key={index} service={service} />
          ))}
        </div>
      </div>
    </section>
  );
};
