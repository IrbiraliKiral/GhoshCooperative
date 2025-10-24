import { Link } from 'react-router-dom';
import { FaArrowRight, FaShieldAlt } from 'react-icons/fa';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

export const Hero = () => {
  const { t } = useLanguage();
  return (
    <section className="banking-gradient-hero text-white">
      <div className="banking-container banking-section">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex justify-center mb-6 animate-in fade-in duration-700">
            <FaShieldAlt className="text-6xl" />
          </div>
          <h1 className="banking-heading text-white mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {t.hero.title}
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-banking-blue-100 leading-relaxed animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150">
            {t.hero.subtitle}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
            <Link to="/learn-more">
              <Button 
                size="lg" 
                className="bg-white text-banking-blue-600 hover:bg-banking-blue-50 shadow-banking-lg"
              >
                {t.hero.learnMore}
                <FaArrowRight className="ml-2" />
              </Button>
            </Link>
            <Link to="/members">
              <Button 
                size="lg" 
                className="bg-white border-2 border-white text-banking-blue-600 hover:bg-banking-blue-50 shadow-banking-lg"
              >
                {t.hero.viewMembers}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
