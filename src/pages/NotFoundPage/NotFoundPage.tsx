import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { FaHome, FaExclamationTriangle } from 'react-icons/fa';
import { useLanguage } from '@/contexts/LanguageContext';

export const NotFoundPage = () => {
  const { t } = useLanguage();
  return (
    <div className="min-h-screen banking-gradient-section flex items-center justify-center">
      <div className="banking-container">
        <div className="banking-card max-w-2xl mx-auto text-center py-16 px-8">
          <div className="flex justify-center mb-6">
            <div className="w-24 h-24 rounded-full bg-banking-blue-100 flex items-center justify-center">
              <FaExclamationTriangle className="text-banking-blue-600 text-5xl" />
            </div>
          </div>
          
          <h1 className="text-8xl font-bold text-banking-blue-600 mb-4">404</h1>
          
          <h2 className="banking-subheading mb-4">{t.notFound.title}</h2>
          
          <p className="banking-text mb-8 max-w-md mx-auto">
            {t.notFound.message}
          </p>
          
          <Link to="/">
            <Button
              size="lg"
              className="bg-banking-blue-600 hover:bg-banking-blue-700 text-white shadow-banking-md"
            >
              <FaHome className="mr-2" />
              {t.notFound.backHome}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
