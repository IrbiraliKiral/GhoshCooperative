import { Link } from 'react-router-dom';
import { FaEnvelope, FaPhone } from 'react-icons/fa';
import { appConfig } from '@/config';
import { useLanguage } from '@/contexts/LanguageContext';

export const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { t } = useLanguage();

  return (
    <footer className="bg-banking-gray-900 text-white">
      <div className="banking-container py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About Section */}
          <div>
            <h3 className="font-display font-bold text-xl mb-4">
              {t.footer.about}
            </h3>
            <p className="text-banking-gray-400 mb-4 leading-relaxed">
              {t.footer.aboutText}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-lg mb-4">{t.footer.quickLinks}</h4>
            <ul className="space-y-2">
              <li>
                <Link 
                  to="/" 
                  className="text-banking-gray-400 hover:text-white transition-colors inline-block"
                >
                  {t.footer.home}
                </Link>
              </li>
              <li>
                <Link 
                  to="/members" 
                  className="text-banking-gray-400 hover:text-white transition-colors inline-block"
                >
                  {t.footer.members}
                </Link>
              </li>
              <li>
                <Link 
                  to="/learn-more" 
                  className="text-banking-gray-400 hover:text-white transition-colors inline-block"
                >
                  {t.footer.learnMore}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Section */}
          <div>
            <h4 className="font-semibold text-lg mb-4">{t.footer.contact}</h4>
            <div className="space-y-3 text-banking-gray-400">
              <div className="flex items-center gap-3">
                <FaEnvelope className="text-banking-blue-400 flex-shrink-0" />
                <a 
                  href={`mailto:${appConfig.contactEmail}`}
                  className="hover:text-white transition-colors"
                >
                  {appConfig.contactEmail}
                </a>
              </div>
              <div className="flex items-center gap-3">
                <FaPhone className="text-banking-blue-400 flex-shrink-0" />
                <a 
                  href={`tel:${appConfig.contactPhone}`}
                  className="hover:text-white transition-colors"
                >
                  {appConfig.contactPhone}
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-banking-gray-800 mt-8 pt-8 text-center text-banking-gray-400">
          <p>{t.footer.copyright.replace('2024', currentYear.toString())}</p>
        </div>
      </div>
    </footer>
  );
};
