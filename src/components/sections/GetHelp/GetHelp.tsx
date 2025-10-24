import { ContactForm } from '@/components/forms/ContactForm/ContactForm';
import { FaHeadset, FaEnvelope, FaPhone } from 'react-icons/fa';
import { useLanguage } from '@/contexts/LanguageContext';
import { appConfig } from '@/config';

export const GetHelp = () => {
  const { t } = useLanguage();
  return (
    <section className="banking-section banking-gradient-section">
      <div className="banking-container">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="flex justify-center mb-4">
              <FaHeadset className="text-5xl text-banking-blue-600" />
            </div>
            <h2 className="banking-heading mb-4">{t.getHelp.title}</h2>
            <p className="banking-text max-w-2xl mx-auto">
              {t.getHelp.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Contact Info */}
            <div className="space-y-6">
              <div className="banking-card p-6">
                <h3 className="font-semibold text-xl text-banking-gray-900 mb-6">
                  {t.getHelp.contactInfo}
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-banking-blue-100 flex items-center justify-center flex-shrink-0">
                      <FaEnvelope className="text-banking-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-banking-gray-900">{t.getHelp.email}</p>
                      <p className="text-banking-gray-600 text-sm mt-1">
                        {appConfig.contactEmail}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-banking-blue-100 flex items-center justify-center flex-shrink-0">
                      <FaPhone className="text-banking-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-banking-gray-900">{t.getHelp.phone}</p>
                      <p className="text-banking-gray-600 text-sm mt-1">
                        {appConfig.contactPhone}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="banking-card p-6">
              <h3 className="font-semibold text-xl text-banking-gray-900 mb-6">
                {t.getHelp.form.title}
              </h3>
              <ContactForm />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
